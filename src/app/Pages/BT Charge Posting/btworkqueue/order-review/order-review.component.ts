import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { SortDescriptor, orderBy, State } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import {
  Utility,
  enumFilterCallingpage,
  enumOrderAssignSource,
} from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { Navbarlinks } from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import * as moment from "moment";
import "rxjs/add/observable/empty";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthLogs } from "src/app/Model/Common/logs";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-order-review",
  templateUrl: "./order-review.component.html",
  styleUrls: ["./order-review.component.css"],
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  clsAuthLogs: AuthLogs;
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  private subscription = new SubSink();
  showAssignOrder = false;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  exportFilename: string = "PendingReview";
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  @ViewChild("OrderAssignment")
  private OrderAssignmentComponent: OrderAssignmentComponent;
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  public OrderSort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];

  // public openedView = false;
  public openedAssign = false;
  public filterApplied = false;
  public ClientDefaultValue = { id: 0, value: "All" };
  public PayerDefaultValue = { id: 0, value: "All" };
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;
  public state: State = {
    skip: 0,
    take: 300,
    filter: {
      logic: "and",
      filters: [
        // { field: "orderdate", operator: "eq", value: new Date() }
      ],
    },
  };

  public OrderSelected: any = [];
  public hiddenColumns: string[] = [];

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;
  private clsUtility: Utility;
  public sFilters: any;

  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;

  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  showmarkcompleted: boolean = false;
  totalElements: number = 0;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  vwAddComment = false;
  constructor(
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    this.hideColumn("orderqueuegroupid");
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      // mode: this.mode
    };
  }

  public selectedCallback = (args) => args.dataItem;

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;
    hiddenColumns.push(columnName);
  }
  vwUpdateEncounterStatus = false;
  vwMarkIncomplete = false;
  vwAssignReview = false;
  vwExportButton = false;
  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
    var testnavlinks: Navbarlinks;
    this.dataService.navSubject.subscribe((data) => {
      if (data != null || data != undefined) {
        testnavlinks = data;
        this.vwUpdateEncounterStatus =
          testnavlinks.viewUpdateEntrStatusOnPendingReview;
        this.vwMarkIncomplete = testnavlinks.viewMarkIncompleteOnPendingReview;
        this.vwAssignReview = testnavlinks.viewAssignReview;
        this.vwExportButton = testnavlinks.viewExportGrid;
        this.vwAddComment = testnavlinks.viewAddComment;
      }
    });

    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
      })
    );

    this.subscription.add(
      this.dataService.OrderReviewDone.subscribe((data) => {
        if (data) {
          this.OrderSelected = [];
          if (
            this.NoteModalComponent != null ||
            this.NoteModalComponent != undefined
          ) {
            this.NoteModalComponent.ResetComponents();
          }
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        } else {
          if (
            this.NoteModalComponent != null ||
            this.NoteModalComponent != undefined
          ) {
            this.NoteModalComponent.ResetComponents();
          }
        }
      })
    );

    this.subscription.add(
      this.dataService.orderReviewAssignmentDone.subscribe((data) => {
        if (data) {
          this.OrderSelected = [];
          if (
            this.OrderAssignmentComponent != null ||
            this.OrderAssignmentComponent != undefined
          ) {
            this.OrderAssignmentComponent.ResetComponents();
          }
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
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

  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      // console.log("in retrivemasted daa");
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "OrderReview",
            0, //login user id
            this.page,
            this.pagesize,
            4 //status of order
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
  onOpenViewdetails(item) {
    // $("#viewdetailsModal").modal('show');
    // this.ViewOrderDetailsComponent.CallingPage = "WorkQueue";
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    // this.ViewOrderDetailsComponent.fetchOrderDetails();
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = 4;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.dataService.OrderReviewDone.next(false);
    this.dataService.orderReviewAssignmentDone.next(false);
    this.dataService.ShowOrderStatus.next(false);
    this.dataService.doRefreshGrid.next(false);
    this.subscription.unsubscribe();
  }

  onMarkComplete() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to update status");
      return;
    } else {
      this.writeLog("Update Encounter Status is clicked.", "UPDATE");
      this.dataService.NoteCalledFrom.next(enumFilterCallingpage.OrderReview);
      this.dataService.NoteWorkItemCount.next(this.OrderSelected.length);
      this.dataService.NoteTitle.next("Encounter Review");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(true);
      this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      this.NoteModalComponent.isMarkIncomplete = false;
      this.NoteModalComponent.getOrderStatus("4");
    }
  }
  onMarkIncomplete() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to mark incomplete");
      return;
    } else {
      if (this.OrderSelected.length > 1) {
        this.clsUtility.showInfo(
          "Select only one encounter to mark incomplete"
        );
        return;
      }
      $("#noteModalReview").modal("show");
      this.writeLog("Mark Incomplete is clicked.", "UPDATE");
      this.dataService.NoteCalledFrom.next(enumFilterCallingpage.OrderReview);
      this.dataService.NoteWorkItemCount.next(0);
      this.dataService.NoteTitle.next("Mark Incomplete");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(true);
      this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
      this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      this.NoteModalComponent.isMarkIncomplete = true;
      this.NoteModalComponent.getOrderSubStatusAndNotes("3");
    }
  }
  onAssignClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to assign for review");
      return;
    } else {
      this.writeLog("Assign review is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.PendingReview;
      this.OrderAssignmentComponent.orderAssignmentStatus = 6;
      this.OrderAssignmentComponent.setworkqueueassignment();
    }
  }
  OrderPageChange(event: PageChangeEvent): void {
    try {
      if (this.OrderSelected.length == 0) {
        this.OrderGridView = null;
        this.OrderSkip = event.skip;
        this.page = event.skip / event.take;
        this.lstFilter = this.dataService.SelectedFilter;
        this.RetriveMasterData(this.pagesize, this.OrderSkip);
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
  public allData = (): Observable<any> => {
    try {
      let lstFilter = this.dataService.SelectedFilter;
      if (this.totalElements != 0) {
        return this.filterService.exportData(
          lstFilter,
          0,
          this.totalElements,
          "orderreview"
        );
      } else {
        this.clsUtility.showInfo("No records available for export");
        return Observable.empty();
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  };

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
      screen: "PendingReview",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
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
}
