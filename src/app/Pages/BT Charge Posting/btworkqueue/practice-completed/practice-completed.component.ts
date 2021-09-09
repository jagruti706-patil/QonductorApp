import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { SortDescriptor, orderBy, State } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import * as moment from "moment";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-practice-completed",
  templateUrl: "./practice-completed.component.html",
  styleUrls: ["./practice-completed.component.css"],
})
export class PracticeCompletedComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  private subscription = new SubSink();
  exportFilename: string = "PracticeCompleted";
  clsAuthLogs: AuthLogs;
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  @ViewChild("OrderAssignment", { static: true })
  private OrderAssignmentComponent: OrderAssignmentComponent;
  public sort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];
  public mode = "multiple";
  public selectableSettings: SelectableSettings;
  public state: State = {
    skip: 0,
    take: 300,
    filter: {
      logic: "and",
      filters: [],
    },
    sort: this.sort,
  };

  public OrderSort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];

  public OrderSelected: any = [];

  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  vwExportButton = false;
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  vwPracticeCompletedAssignEncounterBtn = false;
  totalElements: number = 0;
  constructor(
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    // this.lstFilter.orderyear = 2019;
    this.setSelectableSettings();
    this.clsAuthLogs = new AuthLogs(http);
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
      // mode: this.mode
    };
  }

  public selectedCallback = (args) => args.dataItem;

  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData();
        }
      })
    );
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
          this.vwPracticeCompletedAssignEncounterBtn =
            data.viewPracticeCompletedAssignEncounterBtn;
        }
      })
    );
    this.subscription.add(
      this.dataService.orderAssignmentDone.subscribe((data) => {
        if (data) {
          this.OrderSelected = [];
          if (
            this.OrderAssignmentComponent != null ||
            this.OrderAssignmentComponent != undefined
          ) {
            this.OrderAssignmentComponent.ResetComponents();
          }
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData();
        } else {
          if (
            this.OrderAssignmentComponent != null ||
            this.OrderAssignmentComponent != undefined
          ) {
            this.OrderAssignmentComponent.ResetComponents();
          }
        }
      })
    );
  }

  RetriveMasterData() {
    try {
      this.OrderGridView = null;
      this.loadingOrderGrid = true;
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "PracticeCompleted",
            0, //login user id
            this.page,
            this.pagesize,
            17 //status of order
          )
          .subscribe(
            (queue) => {
              this.loadingOrderGrid = false;
              if (queue != null) {
                this.OrderGridData = queue;
                if (this.OrderGridData["content"] != null) {
                  this.OrderItems = this.OrderGridData["content"];
                  this.OrderloadItems();
                } else {
                  this.totalElements = 0;
                  this.OrderGridView = null;
                  this.OrderItems = [];
                  // below code is for if user select all orders from last page and assign selected then user will be redirected to 1st page
                  let mod =
                    this.OrderGridData["totalelements"] %
                    this.clsUtility.pagesize;
                  if (mod == 0 && this.OrderGridData["totalelements"] !== mod) {
                    this.OrderPageChange({
                      skip: 0,
                      take: this.clsUtility.pagesize,
                    });
                  }
                }
                this.loadingOrder = false;
              }
            },
            (err) => {
              this.loadingOrderGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onOpenViewdetails(item) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    try {
      this.dataService.orderAssignmentDone.next(false);
      this.dataService.doRefreshGrid.next(false);
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OrderSortChange(sort: SortDescriptor[]): void {
    if (this.OrderItems != null) {
      this.OrderSort = sort;
      this.OrderloadItems();
    }
  }
  OrderloadItems() {
    try {
      if (this.OrderGridData != null) {
        this.OrderGridView = {
          data: orderBy(this.OrderItems, this.OrderSort),
          total: this.OrderGridData["totalelements"],
        };
        this.totalElements = this.OrderGridData["totalelements"];
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OrderPageChange(event: PageChangeEvent): void {
    this.OrderGridView = null;
    this.OrderSkip = event.skip;
    this.page = event.skip / event.take;
    try {
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    this.OrderSelected = [];
    this.loadingOrder = true;
    this.loadingOrderGrid = true;
    var Orderevent = $event;
    this.page = 0;
    this.OrderSkip = 0;
    this.pagesize = this.clsUtility.pagesize;
    // console.log(Orderevent);

    if (Orderevent != null) {
      this.OrderGridData = Orderevent; // this.OrderItems = queue.content;
      // this.totalRecords = queue.totalelements;
      // console.log(this.OrderGridData);

      if (this.OrderGridData["content"] != null) {
        // console.log(this.OrderGridData["content"]);
        this.OrderItems = this.OrderGridData["content"];
        this.OrderloadItems();
      } else {
        this.totalElements = 0;
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.loadingOrder = false;
      this.loadingOrderGrid = false;
    }
  }
  onAssignEncounterClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to assign");
      return;
    } else {
      $("#assignOrderModal").modal("show");
      this.writeLog("Assign Encounter is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.PracticeCompleted;
      this.OrderAssignmentComponent.orderAssignmentStatus = 1; //practice assigned status
      // console.log(this.OrderSelected);
      this.OrderAssignmentComponent.setworkqueueassignment();
    }
  }
  @ViewChild("AddCommentComponent", { static: true })
  private AddCommentComponent: AddCommentComponent;
  onAddCommentClicked(item) {
    try {
      this.AddCommentComponent.SelectedOrder = item;
      this.AddCommentComponent.isComment = true;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  outputCommentResult(event: boolean) {
    try {
      $("#viewAddComment").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCommentClose() {
    this.AddCommentComponent.clearCommentControls();
  }

  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor-Biotech";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: "PracticeCompleted",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
  }
}
