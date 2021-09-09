import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
  DataStateChangeEvent,
  SelectableMode,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import {
  SortDescriptor,
  orderBy,
  State,
  process,
} from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import {
  Utility,
  enumOrderAssignSource,
  enumFilterCallingpage,
} from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Router } from "@angular/router";
import { OrderHistoryComponent } from "../../order-history/order-history.component";
import * as moment from "moment";
import { Observable } from "rxjs";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-advance-search",
  templateUrl: "./advance-search.component.html",
  styleUrls: ["./advance-search.component.css"],
})
export class AdvanceSearchComponent implements OnInit, OnDestroy {
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  clsAuthLogs: AuthLogs;
  vwExportButton = false;
  exportFilename: string = "AdvanceSearch";
  public OrderGridData: any;
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  public OrderPageSize = 10;
  private totalRecords = 0;
  private subscription = new SubSink();
  showReAssignOrder = false;
  showReleaseButton = false;
  vwOsUpdateBtn = false;
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;
  loader: boolean = false;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  InputEncounterSource: string = "";
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  @ViewChild("OrderAssignment")
  private OrderAssignmentComponent: OrderAssignmentComponent;

  public sort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];
  public OrderSort: SortDescriptor[] = [
    // {
    //   field: "modifiedon",
    //   dir: "desc"
    // }
  ];
  public state: State = {
    skip: 0,
    take: 300,
    filter: {
      logic: "and",
      filters: [
        // { field: "orderdate", operator: "eq", value: new Date() }
      ],
    },
    sort: this.sort,
  };
  // public openedView = false;
  public openedAssign = false;
  public filterApplied = false;
  public ClientDefaultValue = { id: 0, value: "All" };
  public PayerDefaultValue = { id: 0, value: "All" };
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;

  public OrderSelected: any[] = [];
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
  loadingOrderGrid = false;
  totalElements: number = 0;
  disableButton: boolean = true;
  disableReleaseButton: boolean = true;
  disableUpdateButton: boolean = true;
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  vwAddComment = false;

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private router: Router,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings("multiple");
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
    this.hideColumn("orderqueuegroupid");
  }
  public setSelectableSettings(mode: SelectableMode): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: mode,
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
  ngOnInit() {
    let oninit: boolean = true;
    this.subscription.add(
      this.dataService.advanceSearchValue.subscribe((data) => {
        if (data != "") {
          this.OrderSelected = [];
          this.lstFilter =
            this.dataService.SelectedFilter == undefined
              ? new InventoryInputModel()
              : this.dataService.SelectedFilter;
          this.lstFilter.servicecode = "ENTR";
          this.lstFilter.accessionNo = this.dataService.advanceSearchValue.value;
          if (!oninit) {
            this.RetriveMasterData(this.pagesize, this.OrderSkip);
            if (document.getElementById("idfcAccessionNumber"))
              document.getElementById("idfcAccessionNumber").focus();
          }
        }
      })
    );
    oninit = false;
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;

          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
      })
    );
    this.exportFilename += moment().format("MMDDYYYY");
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
          this.vwAddComment = data.viewAddComment;
        }
      })
    );
  }

  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.OrderGridView = null;
      this.loadingOrderGrid = true;
      // console.log(JSON.stringify(this.lstFilter));
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            this.lstFilter.searchinarchive
              ? enumFilterCallingpage.ArchivedEncounters
              : "AdvanceSearchOrder",
            0, //login user id
            this.page,
            this.pagesize,
            0 //status of order
          )
          .subscribe(
            (queue) => {
              if (queue != null) {
                this.loadingOrderGrid = false;
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
                this.dataService.isarchived.next(this.OrderGridData.isarchived);
              }
            },
            (err) => {
              this.loadingOrderGrid = false;
            }
          )
      );
    } catch (error) {
      this.loadingOrderGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onOpenViewdetails(item) {
    // $("#viewdetailsModal").modal('show');
    // this.ViewOrderDetailsComponent.CallingPage = "WorkQueue";
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = true;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    if (item.nstatus == 18) {
      this.ViewOrderDetailsComponent.visibleButtons = false;
      this.ViewOrderDetailsComponent.calledFrom = "archivedencounters";
    } else {
      this.ViewOrderDetailsComponent.calledFrom = "";
      this.ViewOrderDetailsComponent.visibleButtons = true;
    }
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.dataService.orderReassignmentDone.next(false);
    this.dataService.OrderUpdateDone.next(false);
    this.dataService.doRefreshGrid.next(false);
    this.dataService.isarchived.next(false);
    this.dataService.advanceSearchValue.next("");
    this.subscription.unsubscribe();
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
        $("#statusConfirmationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    // debugger;
    // this.state = state;
    // console.log(this.state);
    // this.OrderGridView = process(this.OrderItems, this.state);
  }
  ApplyFilter($event) {
    this.OrderSelected = [];
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
      this.lstFilter = this.dataService.SelectedFilter;
      if (this.lstFilter.status[0] == 1 || this.lstFilter.status[0] == 6) {
        this.disableButton = false;
      } else {
        this.disableButton = true;
      }
      //for assigned review status
      if (this.lstFilter.status[0] == 6) {
        this.disableReleaseButton = false;
      } else {
        this.disableReleaseButton = true;
      }

      this.loadingOrderGrid = false;
      // this.OrderItems = queue;
      // this.OrderloadItems();
    }
    this.filterApplied = this.dataService.isOrderPendingOrderFilterApplied; //change
  }

  onOpenOrderHistory(item) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = false;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
    // this.router.navigate(["/OrderHistory"]);
  }
  public allData = (): Observable<any> => {
    try {
      let lstFilter = this.dataService.SelectedFilter;
      if (this.totalElements != 0) {
        return this.filterService.exportData(
          lstFilter,
          0,
          this.totalElements,
          "ordersearchorder"
        );
      } else {
        this.clsUtility.showInfo("No records available for export");
        return Observable.empty();
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  };
  onAssignClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to assign");
      return;
    } else {
      this.writeLog("Reassign encounter is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      let status = this.OrderSelected[0].nstatus;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.Reassignment;
      if (status == 1) {
        this.OrderAssignmentComponent.orderAssignmentStatus = 1;
      } else if (status == 6) {
        this.OrderAssignmentComponent.orderAssignmentStatus = 6;
      }
      this.OrderAssignmentComponent.setworkqueueassignment();
    }
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
      screen: "OrderSearch",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel clicked.", "DOWNLOAD");
  }
  onYesClick() {
    try {
      let user = this.dataService.loginUserName;
      let currentDateandTime = moment().format("MM-DD-YYYY HH:mm:ss A");
      let reviewObj: any[] = [];
      this.OrderSelected.map((ele) => {
        let obj = {
          orderqueuegroupid: ele.orderqueuegroupid,
          claimreferencenumber: "",
        };
        reviewObj.push(obj);
      });
      let data: {
        assignedto: string;
        assignedtoname: string;
        modifiedon: string;
        nstatus: number;
        ordernote: string;
        reviewObj: any;
      } = {
        assignedto: "",
        assignedtoname: "",
        modifiedon: this.clsUtility.currentDateTime(),
        nstatus: 4,
        ordernote:
          "Assigned Review Released by: " + user + " on " + currentDateandTime,
        reviewObj: reviewObj,
      };
      this.loader = true;
      this.subscription.add(
        this.coreService.releaseAssignedReview(data).subscribe(
          (res) => {
            if (res == 1) {
              this.clsUtility.showSuccess(
                "Assigned review released successfully"
              );
              this.writeLog("Assigned review released successfully.", "UPDATE");
            } else if (res == 2) {
              this.clsUtility.showInfo(
                "Encounter(s) skipped for release assigned review due to status mismatch."
              );
              this.writeLog(
                "Encounter(s) skipped for release assigned review due to status mismatch.",
                "UPDATE"
              );
            } else {
              this.clsUtility.showError(
                "Error occured while releasing assigned review"
              );
              this.writeLog(
                "Error occured while releasing assigned review.",
                "UPDATE"
              );
            }
            this.lstFilter = this.dataService.SelectedFilter;
            this.OrderSelected = [];
            this.RetriveMasterData(this.pagesize, this.OrderSkip);
            this.loader = false;
          },
          (error) => {
            this.clsUtility.showError(error);
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  onUpdateOrderStatus() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter(s) to update status");
      return;
    } else {
      this.writeLog("Update encounter status is clicked", "UPDATE");
      if (this.clsUtility.validateOrderSelected(this.OrderSelected) == true) {
        if (this.OrderSelected.length == 1) {
          this.InputEncounterSource = this.OrderSelected[0].encountersource;
          this.noteModalAssignment();
          $("#updateStatusModal").modal("show");
        } else {
          // this.InputStatusMessage =
          //   'Update order status for "New", "Assigned", "Assigned Review","Send to Biotech" ' +
          //   "&" +
          //   ' "Send to Biotech-Auto" will be skipped.\n Are you sure you want to continue?';
          if (
            this.clsUtility.checkSelectedOrderType(this.OrderSelected) == false
          ) {
            this.clsUtility.showInfo(
              "Select encounters of same encounter type"
            );
            return;
          } else {
            this.InputEncounterSource = this.OrderSelected[0].encountersource;
            this.confirmationTitle = "Update Encounter Status Confirmation";
            this.confirmationFrom = "updateorderstatus";

            if (
              this.clsUtility.validateOtherOrderSelected(this.OrderSelected)
            ) {
              if (this.InputEncounterSource.toLowerCase() === "rcm encounter") {
                this.InputStatusMessage =
                  "Following encounter status will not be updated:<br><ul class='mb-1'><li><b>New</b></li><li><b>Assigned</b></li><li><b>Practice Assigned</b></li></ul>Are you sure you want to continue?";
              } else {
                this.InputStatusMessage =
                  "Following encounter status will not be updated:<br><ul><li><b>New</b></li><li><b>Assigned</b></li><li><b>Assigned Review</b></li></ul><b>Multiple encounter will not mark as incomplete.</b><br/>Are you sure you want to continue?";
              }
              $("#statusConfirmationModal").modal("show");
            } else {
              if (this.InputEncounterSource.toLowerCase() === "rcm encounter") {
                this.noteModalAssignment();
                $("#updateStatusModal").modal("show");
              } else {
                this.InputStatusMessage =
                  "<b>Multiple encounters will not mark as incomplete.</b><br/>Are you sure you want to continue?";
                $("#statusConfirmationModal").modal("show");
              }
              // this.noteModalAssignment();
              // $("#updateStatusModal").modal("show");
            }
          }
        }
      } else {
        this.clsUtility.showInfo(
          "Selected encounter(s) status will not be updated."
        );
      }
    }
  }
  noteModalAssignment() {
    if (this.OrderSelected.length == 1) {
      this.NoteModalComponent.showTopSection = true;
      this.NoteModalComponent.getOrderStatus("-1", this.InputEncounterSource);
    } else {
      this.NoteModalComponent.showTopSection = false;
      this.NoteModalComponent.getOrderStatus("-2", this.InputEncounterSource);
    }
    this.dataService.NoteCalledFrom.next(
      enumFilterCallingpage.OrderSearchOrder
    );
    this.dataService.NoteTitle.next("Update Encounter Status");
    this.dataService.ShowNoteCategory.next(false);
    this.dataService.ShowOrderStatus.next(true);
    this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
    this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
  }
  OutputStatusResult(evt: boolean) {
    if (evt) {
      switch (this.confirmationFrom.toLowerCase()) {
        case "updateorderstatus":
          this.noteModalAssignment();
          $("#updateStatusModal").modal("show");
          break;
        case "paginationchange":
          this.OrderSelected = [];
          this.OrderPageChange(this.pageChangeEvent);
          break;
        default:
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
