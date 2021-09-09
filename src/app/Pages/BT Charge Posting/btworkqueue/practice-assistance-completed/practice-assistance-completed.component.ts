import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
  RowClassArgs,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { SortDescriptor, orderBy, State } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
import * as moment from "moment";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
declare var $: any;

@Component({
  selector: "app-practice-assistance-completed",
  templateUrl: "./practice-assistance-completed.component.html",
  styleUrls: ["./practice-assistance-completed.component.css"],
})
export class PracticeAssistanceCompletedComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  private subscription = new SubSink();
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  public checkboxOnly = true;
  public mode = "multiple";
  // public selectableSettings: SelectableSettings;
  public OrderSelected: any = [];

  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;
  public OrderSort: SortDescriptor[] = [];
  // Loading
  loadingOrderGrid = false;
  loginuserid: string = "";
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  exportFilename: string = "PracticeAssistanceCompleted";
  vwExportButton = false;
  clsAuthLogs: AuthLogs;

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private router: Router,
    private filterService: FilterService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    // this.setSelectableSettings();
    this.clsAuthLogs = new AuthLogs(http);
  }
  // public setSelectableSettings(): void {
  //   this.selectableSettings = {
  //     checkboxOnly: this.checkboxOnly,
  //     // mode: this.mode
  //   };
  // }

  // public selectedCallback = (args) => args.dataItem;

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
        }
      })
    );
  }
  RetriveMasterData() {
    try {
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "PracticeAssistanceCompleted",
            0, //login user id
            this.page,
            this.pagesize,
            0 //status of order
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
    if (item.isarchived === true) {
      this.ViewOrderDetailsComponent.visibleButtons = false;
      this.ViewOrderDetailsComponent.calledFrom = "archivedencounters";
    } else {
      this.ViewOrderDetailsComponent.calledFrom = "";
      this.ViewOrderDetailsComponent.visibleButtons = true;
    }
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataService.doRefreshGrid.next(false);
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
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OrderPageChange(event: PageChangeEvent): void {
    try {
      if (this.OrderSelected.length == 0) {
        this.OrderGridView = null;
        this.OrderSkip = event.skip;
        this.page = event.skip / event.take;
        this.lstFilter = this.dataService.SelectedFilter;
        this.RetriveMasterData();
      } else {
        this.confirmationTitle = "Confirmation";
        this.confirmationFrom = "paginationchange";
        this.InputStatusMessage =
          "Selection will be discarded. Do you want to continue?";
        this.pageChangeEvent = event;
        $("#confirmationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputStatusResult(evt: boolean) {
    if (evt) {
      switch (this.confirmationFrom.toLowerCase()) {
        case "paginationchange":
          this.OrderSelected = [];
          this.OrderPageChange(this.pageChangeEvent);
          break;
      }
    }
  }
  ApplyFilter($event) {
    this.OrderSelected = [];
    this.loadingOrderGrid = true;
    var Orderevent = $event;
    this.page = 0;
    this.OrderSkip = 0;
    this.pagesize = this.clsUtility.pagesize;

    if (Orderevent != null) {
      this.OrderGridData = Orderevent;
      if (this.OrderGridData["content"] != null) {
        this.OrderItems = this.OrderGridData["content"];
        this.OrderloadItems();
      } else {
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.loadingOrderGrid = false;
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
  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
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
      screen: "PracticeAssistanceCompleted",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
  public rowCallback(context: RowClassArgs) {
    const isarchived = context.dataItem.isarchived == true;
    return {
      archivedrecord: isarchived,
    };
  }
}
