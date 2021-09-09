import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  ChangeDetectorRef,
} from "@angular/core";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
  DataStateChangeEvent,
  GridComponent,
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
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import * as moment from "moment";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Observable } from "rxjs";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import {
  UploadOrders,
  IncompleteOrderNote,
  OrderReleaseDetails,
  ReleaseObj,
  OrderUploadtoDVDetails,
  OrderReviewDetails,
  ReviewObj,
  SendToBiotechModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { DatePipe } from "@angular/common";
import { Group, exportPDF } from "@progress/kendo-drawing";
import { FormBuilder } from "@angular/forms";
declare var $: any;
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { IncompleteOrderActionComponent } from "../../Order Action/incomplete-order-action/incomplete-order-action.component";
import { saveAs } from "@progress/kendo-file-saver";
// import * as JSZip from "jszip";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-order-assistance-workqueue",
  templateUrl: "./order-assistance-workqueue.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./order-assistance-workqueue.component.css"],
})
export class OrderAssistanceWorkqueueComponent implements OnInit, OnDestroy {
  countObj: {
    total: number;
    success: number;
    error: number;
    skipped: number;
  } = {
    total: 0,
    success: 0,
    error: 0,
    skipped: 0,
  };
  public OrderStatusSort: SortDescriptor[] = [
    {
      field: "status",
      dir: "asc",
    },
  ];
  accessionInProgress: string = "Upload in progress";
  vwSendToBT: boolean = false;
  vwUploadToDocsvault: boolean = false;
  vwUpdateMissingInfo: boolean = false;
  vwDownloadBtn: boolean = false;
  vwDownloadAndSendToBiotech: boolean = false;
  vwAllowMultiple: boolean = false;
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  clsAuthLogs: AuthLogs;
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  private totalRecords = 0;
  private subscription = new SubSink();
  showAssignOrder = false;
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;
  totalElements: number = 0;
  private Workqueuegroupid: string = "";
  private CallingPage: string = "WorkQueue";
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
  // public mode = "multiple";
  public selectableSettings: SelectableSettings;

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
  lstFilter: InventoryInputModel = new InventoryInputModel();
  private clsUtility: Utility;
  public sFilters: any;
  public OrderSort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];
  vwExportButton = false;
  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;
  exportFilename: string = "IncompleteEncounters";
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  loader: boolean = false;
  isMultiple: boolean = false;
  allowable: string = "multiple";
  isPercentLoader: boolean = false;
  percentage: number = 0;
  mode: string = "single";
  uploadOrderStatus: any[] = [];
  OrderStatusGridView: GridDataResult;
  public InputStatusMessage: string;
  public ConfirmationForProcess: string = "";
  confirmationTitle: string = "";
  pageChangeEvent: PageChangeEvent;
  vwIncompleteSendToPracticeBtn: boolean = false;
  vwAddComment = false;
  statusReportTitle: string = "Encounter Status Report";

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private http: HttpClient,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private cds: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings("multiple");
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    // this.lstFilter.orderyear= 2019;
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
    this.hideColumn("orderqueuegroupid");
  }
  public setSelectableSettings(mode: SelectableMode): void {
    this.mode = mode;
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
  orderdetails: any = null;
  todaydate: string;
  datepipe = new DatePipe("en-US");
  selectedpracticeid: string = "0";
  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          // this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
      })
    );
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
          this.vwSendToBT = data.viewSendToBT;
          this.vwUploadToDocsvault = data.viewUploadToDocsvault;
          this.vwUpdateMissingInfo = data.viewUpdateMissingInfo;
          this.vwAllowMultiple = data.viewAllowMultiple;
          this.vwDownloadBtn = data.viewDownloadOnIncomplete;
          this.vwDownloadAndSendToBiotech = data.viewDownloadAndSendToBiotech;
          this.vwIncompleteSendToPracticeBtn =
            data.viewIncompleteSendToPracticeBtn;
          this.vwAddComment = data.viewAddComment;
        }
      })
    );
    this.subscription.add(
      this.dataService.IncompleteDone.subscribe((data) => {
        if (data) {
          // this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
        if (
          this.NoteModalComponent != null ||
          this.NoteModalComponent != undefined
        ) {
          this.NoteModalComponent.ResetComponents();
        }
      })
    );
    this.subscription.add(
      this.dataService.sendToBiotechJson.subscribe(
        (data: SendToBiotechModel) => {
          if (data) {
            this.importFromDocsVault(true, data);
          }
        }
      )
    );
    // this.subscription.add(
    //   this.dataService.orderAssignmentDone.subscribe(data => {
    //     if (data) {
    //       this.OrderSelected = [];
    //       if (
    //         this.OrderAssignmentComponent != null ||
    //         this.OrderAssignmentComponent != undefined
    //       ) {
    //         this.OrderAssignmentComponent.ResetComponents();
    //       }

    //       this.RetriveMasterData(this.pagesize, this.OrderSkip);
    //     } else {
    //       if (
    //         this.OrderAssignmentComponent != null ||
    //         this.OrderAssignmentComponent != undefined
    //       ) {
    //         this.OrderAssignmentComponent.ResetComponents();
    //       }
    //     }
    //   })
    // );
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

    this.route.params.subscribe((params) => {
      // console.log(params);
      this.selectedpracticeid = params["clientid"];
      this.dataService.SummarySelectedPracticeid.next(this.selectedpracticeid);
      if (
        this.selectedpracticeid != "0" &&
        this.dataService.SummarySelectedPractice.value == "0"
      ) {
        this.NavigateBackToIncompleteSummary();
      }
    });

    // if (this.dataService.SummarySelectedPractice.value == "") {
    //   return;
    // }
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
      // this.OrderItems = queue;
      // this.OrderloadItems();
    } else {
      this.totalElements = 0;
      this.OrderGridView = null;
      this.OrderItems = [];
      this.loadingOrder = false;
      this.loadingOrderGrid = false;
    }
    this.filterApplied = this.dataService.isOrderAssistanceFilterApplied; //change
  }

  // RetriveMasterData() {
  //   console.log(this.OrderSkip);

  //   this.OrderGridView = null;
  // RetriveMasterData(recordCount: any, pageindex: any) {
  //   try {
  //     this.OrderGridView = null;
  //     this.loadingOrder = true;
  //     this.loadingOrderGrid = true;
  //     this.subscription.add(
  //       this.coreService.RetriveOrderQueue(3, recordCount, pageindex).subscribe(
  //         queue => {
  //           if (queue != null) {
  //             this.OrderGridData = queue;
  //             if (this.OrderGridData["content"] != null) {
  //               this.OrderItems = this.OrderGridData["content"];
  //               this.OrderloadItems();
  //             } else {
  //               this.OrderGridView = null;
  //             }
  //             this.loadingOrder = false;
  //             this.loadingOrderGrid = false;
  //           }
  //         },
  //         err => {
  //           this.loadingOrderGrid = false;
  //         }
  //       )
  //     );
  //   } catch (error) {}
  // }

  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.OrderGridView = null;
      this.loadingOrderGrid = true;
      // console.log("in retrivemasted daa");
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "OrderAssistanceWorkqueue",
            0, //login user id
            this.page,
            this.pagesize,
            3 //status of order
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
    // $("#viewdetailsModal").modal('show');
    // this.ViewOrderDetailsComponent.CallingPage = "WorkQueue";
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = 3;
    this.ViewOrderDetailsComponent.showDocumentList = true;
    // this.ViewOrderDetailsComponent.fetchOrderDetails();
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.dataService.IncompleteDone.next(false);
    this.dataService.sendToBiotechJson.next(null);
    this.dataService.doRefreshGrid.next(false);
    this.dataService.orderAssignmentDone.next(false);
    this.dataService.SummarySelectedPractice.next("0");
    this.dataService.SummarySelectedPracticeid.next("");
    this.subscription.unsubscribe();
  }

  onSendToPracticeClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter for send to practice");
      return;
    } else {
      this.statusReportTitle = "Send To Practice Encounter Status Report";
      $("#assignOrderModal").modal("show");
      this.writeLog("Send to practice is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.IncompleteInventory;
      this.OrderAssignmentComponent.title = "Send To Practice";
      this.OrderAssignmentComponent.orderAssignmentStatus = 16; //practice assigned status
      // console.log(this.OrderSelected);
      this.OrderAssignmentComponent.setworkqueueassignment();
    }
  }

  OrderSortChange(sort: SortDescriptor[]): void {
    if (this.OrderItems != null) {
      this.OrderSort = sort;
      this.OrderloadItems();
    }
  }
  OrderStatusSortChange(sort: SortDescriptor[]): void {
    this.OrderStatusSort = sort;
    this.OrderStatusloadItems();
  }
  OrderloadItems() {
    try {
      if (this.OrderGridData != null) {
        this.OrderGridView = {
          data: orderBy(this.OrderItems, this.OrderSort),
          total: this.OrderGridData["totalelements"],
        };
        this.totalElements = this.OrderGridData["totalelements"];
        if (this.OrderSelected.length === 1) {
          var selecedencounter = this.OrderItems.find(
            (x) =>
              x.orderqueuegroupid == this.OrderSelected[0].orderqueuegroupid
          );
          this.OrderSelected = [];
          if (selecedencounter) this.OrderSelected.push(selecedencounter);
        } else {
          this.OrderSelected = [];
        }
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
        this.ConfirmationForProcess = "paginationchange";
        this.InputStatusMessage =
          "Selection will be discarded. Do you want to continue?";
        this.pageChangeEvent = event;
        $("#confirmationModal").modal("show");
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
  public allData = (): Observable<any> => {
    try {
      let lstFilter = this.dataService.SelectedFilter;
      if (this.totalElements != 0) {
        return this.filterService.exportData(
          lstFilter,
          0,
          this.totalElements,
          "orderassistanceworkqueue"
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
      screen: "IncompleteOrders",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
  }
  SendToBiotech() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select encounter to send to biotech");
        return;
      } else {
        this.statusReportTitle = "Send To Biotech Encounter Status Report";
        this.writeLog("Send to biotech is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.OrderAssistanceWorkqueue
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Send To Biotech");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(true);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.NoteModalComponent.isSendToBiotech = true;
        this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
        this.NoteModalComponent.isUpdateMissingInfo = false;
        this.NoteModalComponent.isDownloadAndSendToBT = false;
        this.NoteModalComponent.getOrderSubStatusAndNotes("8");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
  }

  selectedFiles: File;
  @ViewChild("IncompleteOrderAction", { static: true })
  private IncompleteOrderAction: IncompleteOrderActionComponent;

  // IncompleteOrder: any = [
  //   {
  //     status: false,
  //     serialno: 0,
  //     title: "HELP!! MISSING INFO...",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 1,
  //     title:
  //       "Dear Physician: Please provide the following MISSING information for billing purposes*",
  //     description: ""
  //   },
  //   {
  //     status: true,
  //     serialno: 2,
  //     title: "Misc. Info",
  //     description: ""
  //   },
  //   {
  //     status: true,
  //     serialno: 3,
  //     title: "No Dx given on requisition",
  //     description: ""
  //   },
  //   {
  //     status: true,
  //     serialno: 4,
  //     title: "Medicare patients: Need Medicare payable Dx for",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 4.1,
  //     title: "Lab Test",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 4.2,
  //     title: "Diagnosis Code",
  //     description: ""
  //   },
  //   {
  //     status: true,
  //     serialno: 5,
  //     title: "Additional Dx Need for all other Insurance",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 5.1,
  //     title: "Lab Test",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 5.2,
  //     title: "Diagnosis Code",
  //     description: ""
  //   },
  //   {
  //     status: true,
  //     serialno: 6,
  //     title:
  //       "Doctors: Please read and checkbox if appropriate ***No Dx given. BILL AS IS",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 7,
  //     title: "",
  //     description: ""
  //   },
  //   {
  //     status: false,
  //     serialno: 8,
  //     title: "",
  //     description: ""
  //   }
  // ];

  // public incompleteorderdata: {};
  // public incompleteorderview: GridDataResult;
  // public IncompleteOrderSort: SortDescriptor[] = [
  //   {
  //     field: "serialno",
  //     dir: "asc"
  //   }
  // ];
  // IncompleteOrderloadItems() {
  //   try {
  //     if (this.IncompleteOrder != null) {
  //       this.incompleteorderview = {
  //         data: orderBy(this.IncompleteOrder, this.IncompleteOrderSort),
  //         total: this.IncompleteOrder.length
  //       };
  //       // this.exportToExcelData = this.OrderGridView.data;
  //       // this.totalElements = this.OrderGridData["totalelements"];
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  public async exportToPDF() {
    try {
      // if (IsUpload === false) {
      //   $("#confirmationModal").modal("hide");
      //   return;
      // }
      // // this.loader = true;
      // $("#confirmationModal").modal("hide");
      this.percentage = 0;
      this.cds.detectChanges();
      // this.isPercentLoader = true;
      class UploadStatus {
        accessionNo: string;
        status: number;
        description: string;
      }
      this.uploadOrderStatus = new Array<UploadStatus>();
      this.countObj = {
        total: 0,
        success: 0,
        error: 0,
        skipped: 0,
      };
      // var unsuccessful = "";
      // let ordersToBeUpdate = [];
      var percentIncrease = 100 / this.OrderSelected.length;
      if (percentIncrease == 100) {
        if (
          this.OrderSelected[0].incompleteorderinfo == null ||
          this.OrderSelected[0].incompleteorderinfo == ""
        ) {
          this.clsUtility.showWarning("Incomplete information not available");
          return;
        }
        this.loader = true;
      } else {
        this.isPercentLoader = true;
        this.cds.detectChanges();
      }
      for (const order of this.OrderSelected) {
        // this.IncompleteOrderAction.IncompleteOrderInfo =
        //   order.incompleteorderinfo;
        this.accessionInProgress = order.orderqueuegroupcode + " in progress";
        if (
          order.incompleteorderinfo == null ||
          order.incompleteorderinfo == ""
        ) {
          let objOrderStatus = new UploadStatus();
          objOrderStatus.accessionNo = order.orderqueuegroupcode;
          objOrderStatus.status = 1;
          this.countObj.skipped++;
          objOrderStatus.description = "Incomplete information not available"; // pipe operator is used for differentiate between success, error, skip to use in html.
          this.uploadOrderStatus.push(objOrderStatus);
          this.percentage = this.percentage + percentIncrease;
          this.cds.detectChanges();
          continue;
          // ordersToBeUpdate.push(order);
        } else {
          // unsuccessful += " " + order.orderqueuegroupcode;
          var uploadorder: UploadOrders = new UploadOrders();
          var selectedProvider: string;
          // for (const order of this.OrderSelected) {
          uploadorder.orderqueueid = order.orderqueuegroupid;
          uploadorder.accessionno = order.orderqueuegroupcode;
          selectedProvider = order.providername.replace(" ", "_");
          // }
          var currentdate: string = this.datePipe.transform(
            this.clsUtility.currentDateTime(),
            "MMddyyyy"
          );

          uploadorder.tokenid = "71e6c430-5ffe-4c71-9cbd-6836397da546";
          var uploadfilename: string;
          if (selectedProvider.trim() == "") {
            uploadfilename = currentdate + "_Unknown";
          } else {
            uploadfilename = currentdate + "_" + selectedProvider.trim();
          }

          uploadorder.filename = uploadfilename;
          uploadorder.extension = ".pdf";
          // console.log(uploadorder);

          var filename =
            uploadfilename + "_" + uploadorder.accessionno + "-000-Cover.pdf";
          let thisvar = this;
          this.IncompleteOrderAction.IncompleteOrderInfo =
            order.incompleteorderinfo;
          this.IncompleteOrderAction.isReadonlyCoverpage = true;
          this.IncompleteOrderAction.SetIncompleteOrderGrid();
          await this.IncompleteOrderAction.exportGrids(filename).then(
            async function (data) {
              thisvar.selectedFiles = data;
              // console.log("File in Assistance", thisvar.selectedFiles);

              var LoginUsername = null;
              let currentDateTime = thisvar.clsUtility.currentDateTime();
              var orderuploadtoDVdetails = new OrderUploadtoDVDetails();
              // for (const order of thisvar.OrderSelected) {
              var reviewObj = new ReleaseObj();
              reviewObj.orderqueuegroupid = order.orderqueuegroupid;
              reviewObj.claimreferencenumber = "";
              orderuploadtoDVdetails.reviewObj.push(reviewObj);
              // }
              // orderuploadtoDVdetails.reviewObj = InputOrderGroup;
              orderuploadtoDVdetails.assignedto = thisvar.dataService.loginGCPUserID.getValue(); //to get alphaneumeric value
              if (thisvar.dataService.loginUserName != undefined)
                LoginUsername = thisvar.dataService.loginUserName;
              orderuploadtoDVdetails.assignedtoname = LoginUsername;
              orderuploadtoDVdetails.modifiedon = currentDateTime;
              orderuploadtoDVdetails.nstatus = 9; //new change

              // thisvar.subscription.add(
              await thisvar.coreService
                .uploadDocuments(uploadorder, thisvar.selectedFiles)
                .toPromise()
                .then(
                  async function (data) {
                    console.log("uploadDocuments", data);
                    if (data == 1) {
                      await thisvar.coreService
                        .updateIncompleteOrderStatus(orderuploadtoDVdetails)
                        .toPromise()
                        .then(
                          (response) => {
                            if (response == 1) {
                              thisvar.writeLog(
                                "Encounter Document(s) uploaded to Docsvault successfully for order: " +
                                  uploadorder.accessionno,
                                "UPLOAD"
                              );
                              if (percentIncrease == 100) {
                                thisvar.clsUtility.showSuccess(
                                  "Encounter Document(s) uploaded to Docsvault successfully"
                                );
                              } else {
                                let objOrderStatus = new UploadStatus();
                                objOrderStatus.accessionNo =
                                  order.orderqueuegroupcode;
                                objOrderStatus.status = 2;
                                thisvar.countObj.success++;
                                objOrderStatus.description =
                                  "Encounter Document(s) uploaded to Docsvault";
                                thisvar.uploadOrderStatus.push(objOrderStatus);
                                thisvar.percentage =
                                  thisvar.percentage + percentIncrease;
                                thisvar.cds.detectChanges();
                              }
                            } else {
                              thisvar.writeLog(
                                "Document(s) uploaded but error while updating encounter status for encounter: " +
                                  uploadorder.accessionno,
                                "UPLOAD"
                              );
                              if (percentIncrease == 100) {
                                thisvar.clsUtility.showError(
                                  "Document(s) uploaded but error while updating encounter status"
                                );
                              } else {
                                let objOrderStatus = new UploadStatus();
                                objOrderStatus.accessionNo =
                                  order.orderqueuegroupcode;
                                objOrderStatus.status = 0;
                                thisvar.countObj.error++;
                                objOrderStatus.description =
                                  "Document(s) uploaded but error while updating encounter status";
                                thisvar.uploadOrderStatus.push(objOrderStatus);
                                thisvar.percentage =
                                  thisvar.percentage + percentIncrease;
                                thisvar.cds.detectChanges();
                              }
                            }
                            // thisvar.loader = false;
                            orderuploadtoDVdetails = null;
                            uploadorder = null;
                          },
                          (error) => {
                            thisvar.writeLog(
                              "Document(s) uploaded but error while updating encounter status for encounter: " +
                                uploadorder.accessionno,
                              "UPLOAD"
                            );
                            if (percentIncrease == 100) {
                              thisvar.clsUtility.showError(
                                "Document(s) uploaded but error while updating encounter status"
                              );
                            } else {
                              let objOrderStatus = new UploadStatus();
                              objOrderStatus.accessionNo =
                                order.orderqueuegroupcode;
                              objOrderStatus.status = 0;
                              thisvar.countObj.error++;
                              objOrderStatus.description =
                                "Document(s) uploaded but error while updating encounter status";
                              thisvar.uploadOrderStatus.push(objOrderStatus);
                              thisvar.percentage =
                                thisvar.percentage + percentIncrease;
                              thisvar.cds.detectChanges();
                            }
                            // thisvar.loader = false;
                          }
                        );
                    } else if (data == -1) {
                      thisvar.writeLog(
                        "Failed to upload encounter document(s) for encounter: " +
                          uploadorder.accessionno,
                        "UPLOAD"
                      );
                      if (percentIncrease == 100) {
                        thisvar.clsUtility.showError(
                          "Failed to upload encounter document(s)"
                        );
                      } else {
                        let objOrderStatus = new UploadStatus();
                        objOrderStatus.accessionNo = order.orderqueuegroupcode;
                        objOrderStatus.status = 0;
                        thisvar.countObj.error++;
                        objOrderStatus.description =
                          "Failed to upload encounter document(s)";
                        thisvar.uploadOrderStatus.push(objOrderStatus);
                      }
                      thisvar.percentage = thisvar.percentage + percentIncrease;
                      thisvar.cds.detectChanges();
                    } else if (data == -2) {
                      thisvar.writeLog(
                        "Failed to upload cover page for encounter: " +
                          uploadorder.accessionno,
                        "UPLOAD"
                      );
                      if (percentIncrease == 100) {
                        thisvar.clsUtility.showError(
                          "Failed to upload cover page"
                        );
                      } else {
                        let objOrderStatus = new UploadStatus();
                        objOrderStatus.accessionNo = order.orderqueuegroupcode;
                        objOrderStatus.status = 0;
                        thisvar.countObj.error++;
                        objOrderStatus.description =
                          "Failed to upload cover page";
                        thisvar.uploadOrderStatus.push(objOrderStatus);
                      }
                      thisvar.percentage = thisvar.percentage + percentIncrease;
                      thisvar.cds.detectChanges();
                    } else {
                      thisvar.writeLog(
                        "Error while uploading to docsvault for encounter: " +
                          uploadorder.accessionno,
                        "UPLOAD"
                      );
                      if (percentIncrease == 100) {
                        thisvar.clsUtility.showError(
                          uploadorder.accessionno +
                            " Error while uploading to docsvault"
                        );
                      } else {
                        let objOrderStatus = new UploadStatus();
                        objOrderStatus.accessionNo = order.orderqueuegroupcode;
                        objOrderStatus.status = 0;
                        thisvar.countObj.error++;
                        objOrderStatus.description =
                          "Error while uploading to docsvault";
                        thisvar.uploadOrderStatus.push(objOrderStatus);
                      }
                      thisvar.percentage = thisvar.percentage + percentIncrease;
                      thisvar.cds.detectChanges();
                      orderuploadtoDVdetails = null;
                      uploadorder = null;
                    }
                    // thisvar.loader = false;
                  },
                  (error) => {
                    thisvar.writeLog(
                      "Error while uploading to docsvault for encounter: " +
                        uploadorder.accessionno,
                      "UPLOAD"
                    );
                    if (percentIncrease == 100) {
                      thisvar.clsUtility.showError(
                        "Error while uploading to docsvault"
                      );
                    } else {
                      let objOrderStatus = new UploadStatus();
                      objOrderStatus.accessionNo = order.orderqueuegroupcode;
                      objOrderStatus.status = 0;
                      thisvar.countObj.error++;
                      objOrderStatus.description =
                        "Error while uploading to docsvault";
                      thisvar.uploadOrderStatus.push(objOrderStatus);
                      thisvar.percentage = thisvar.percentage + percentIncrease;
                      thisvar.cds.detectChanges();
                    }
                  }
                );
              // .subscribe(

              // )
              // );
            }
          );
        }
      }

      this.loader = false;
      this.OrderSelected = [];
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData(this.pagesize, this.OrderSkip);
      if (percentIncrease != 100) {
        setTimeout(() => {
          this.isPercentLoader = false;
          this.percentage = 0;
          this.cds.detectChanges();
          this.countObj.total = this.uploadOrderStatus.length;
          this.OrderStatusloadItems();
          $("#uploadOrderStatusModal").modal("show");
        }, 3000);
      }
    } catch (error) {
      this.loader = false;
      this.isPercentLoader = false;
      this.percentage = 0;
      this.writeLog("Error in ExportToPDF(): " + error, "UPLOAD");
      this.clsUtility.LogError(error);
    }
  }
  OrderStatusloadItems() {
    try {
      this.OrderStatusGridView = {
        data: orderBy(this.uploadOrderStatus, this.OrderStatusSort),
        total: this.uploadOrderStatus.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  UploadToDocsvault() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select encounter for upload to docsvault");
        return;
      }
      this.writeLog("Upload to docsvault is clicked.", "UPDATE");
      this.ConfirmationForProcess = "uploadtodocsvault";
      this.confirmationTitle = "Upload to Docsvault";
      this.InputStatusMessage =
        "Do you want to upload selected encounter(s) to docsvault?";
      // this.IncompleteOrderAction.IncompleteOrderInfo = this.OrderSelected[0].incompleteorderinfo;
      // if (this.IncompleteOrderAction.SetIncompleteOrderGrid() == true) {
      // $("#confirmationModal").modal("show");
      // } else {
      //   this.clsUtility.showWarning(
      //     "Incomplete information not available. \nPlease update missing information for selected order."
      //   );
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  UpdateMissingInfo() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select encounter to update missing information"
        );
        return;
      } else {
        this.writeLog("Update missing information is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.OrderAssistanceWorkqueue
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Update Missing Information");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(true);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
        this.NoteModalComponent.isUpdateMissingInfo = true;
        this.NoteModalComponent.isSendToBiotech = false;
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  allowMultiple() {
    try {
      this.OrderSelected = [];
      this.isMultiple = !this.isMultiple;
      if (this.isMultiple) {
        this.allowable = "single";
        this.setSelectableSettings("multiple");
      } else {
        this.allowable = "multiple";
        this.setSelectableSettings("single");
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  onOpenOrderHistory(item) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = false;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  DownloadAndPrintMissingInfo() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select encounter(s) to download from docsvault"
        );
        return;
      }
      this.writeLog("Download encounters is clicked.", "UPDATE");
      this.ConfirmationForProcess = "downloadfromdocsvault";
      this.confirmationTitle = "Download from Docsvault";
      this.InputStatusMessage =
        "Do you want to download selected encounter(s) from docsvault?";
      // if (this.OrderSelected.length <= 0) {
      //   this.clsUtility.showInfo("Select order to download order document");
      //   return;
      // } else {
      //   //retreive document list using accession#
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  DownloadAndSendToBiotech() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select encounter(s) to download and send to biotech"
        );
        return;
      }
      this.writeLog("Download and send to biotech is clicked.", "UPDATE");
      this.confirmationTitle = "Download & Send to Biotech";
      this.ConfirmationForProcess = "downloadandsendtobiotech";
      this.InputStatusMessage =
        "Do you want to download selected encounter(s) and mark as send to biotech?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // DownloadMissingInfoZip() {
  //   try {
  //     if (this.OrderSelected.length <= 0) {
  //       this.clsUtility.showInfo("Select encounter to download zip");
  //       return;
  //     } else {
  //       //retreive document list using accession#
  //       var documentList: any;
  //       var accessionnumber = this.OrderSelected[0].orderqueuegroupcode;
  //       this.subscription.add(
  //         this.coreService.getDownloadDocumentArray(accessionnumber).subscribe(
  //           (queuedetails) => {
  //             if (queuedetails != null) {
  //               documentList = queuedetails;
  //               let zipFile: JSZip = new JSZip();
  //               for (let index = 0; index < documentList.length; index++) {
  //                 var element =
  //                   "data:application/pdf;base64," + documentList[index].bytes;
  //                 var filename = documentList[index].filename;

  //                 zipFile.file(filename, element);
  //               }
  //               this.IncompleteOrderAction.IncompleteOrderInfo = this.OrderSelected[0].incompleteorderinfo;
  //               this.IncompleteOrderAction.isReadonlyCoverpage = true;
  //               this.IncompleteOrderAction.SetIncompleteOrderGrid();
  //               var covername = accessionnumber + "-000-Cover.pdf";
  //               this.IncompleteOrderAction.exportGrids(covername).then(
  //                 (data) => {
  //                   zipFile.file(covername, data);
  //                   zipFile
  //                     .generateAsync({ type: "blob" })
  //                     .then(function (content) {
  //                       // see FileSaver.js
  //                       saveAs(content, accessionnumber + ".zip");
  //                     });
  //                 }
  //               );
  //               console.log("End");
  //               // retriveDocumentList.next(true);
  //             }
  //           },
  //           (err) => {
  //             // this.loadingOrderGrid = false;
  //             this.clsUtility.LogError(err);
  //           }
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  async importFromDocsVault(
    isSendToBiotech: boolean = false,
    sendToBiotechJson: SendToBiotechModel = new SendToBiotechModel()
  ) {
    try {
      this.percentage = 0;
      this.cds.detectChanges();
      // this.isPercentLoader = true;
      class UploadStatus {
        accessionNo: string;
        status: number;
        description: string;
      }
      this.uploadOrderStatus = new Array<UploadStatus>();
      this.countObj = {
        total: 0,
        success: 0,
        error: 0,
        skipped: 0,
      };
      // var unsuccessful = "";
      // let ordersToBeUpdate = [];
      var isSingleSelected = false;
      if (this.OrderSelected.length == 1) {
        isSingleSelected = true;
      }
      var percentIncrease = 100 / this.OrderSelected.length;
      if (isSingleSelected) {
        this.loader = true;
      } else {
        this.isPercentLoader = true;
        this.cds.detectChanges();
      }

      for (const order of this.OrderSelected) {
        // this.IncompleteOrderAction.IncompleteOrderInfo =
        //   order.incompleteorderinfo;
        var accessionnumber = order.orderqueuegroupcode;
        this.accessionInProgress = accessionnumber + " in progress";
        var documentList: any;
        // this.subscription.add(
        //   this.coreService.getDownloadDocumentArray(accessionnumber).subscribe(
        //     queuedetails => {
        //       if (queuedetails != null) {
        //         documentList = queuedetails;

        //         for (let index = 0; index < documentList.length; index++) {
        //           var element =
        //             "data:application/pdf;base64," + documentList[index].bytes;
        //           var filename = documentList[index].filename;

        //           saveAs(element, filename);
        //         }
        //         this.IncompleteOrderAction.IncompleteOrderInfo =
        //           order.incompleteorderinfo;
        //         this.IncompleteOrderAction.SetIncompleteOrderGrid();

        //         console.log(accessionnumber);
        //         var covername = accessionnumber + "-000-Cover.pdf";
        //         this.IncompleteOrderAction.exportGrids(covername).then(data => {
        //           saveAs(data, covername);
        //         });
        //         // console.log("End");
        //         // retriveDocumentList.next(true);
        //         this.percentage = this.percentage + percentIncrease;
        //         this.cds.detectChanges();
        //       }
        //     },
        //     err => {
        //       // this.loadingOrderGrid = false;
        //       this.clsUtility.LogError(err);
        //     }
        //   )

        // );
        // var objUpdateStatus = new OrderUploadtoDVDetails();
        // // for (const order of thisvar.OrderSelected) {
        // var reviewObj = new ReleaseObj();
        // reviewObj.orderqueuegroupid = order.orderqueuegroupid;
        // reviewObj.claimreferencenumber = "";
        // objUpdateStatus.reviewObj.push(reviewObj);
        // }
        // objUpdateStatus.reviewObj = InputOrderGroup;

        var objUpdateStatus = new OrderReviewDetails();
        var reviewObj = new ReviewObj();
        reviewObj.orderqueuegroupid = order.orderqueuegroupid;
        reviewObj.claimreferencenumber = order.claimreferencenumber;
        objUpdateStatus.reviewObj.push(reviewObj);
        objUpdateStatus.assignedto = this.dataService.loginGCPUserID.getValue(); //to get alphaneumeric value
        var LoginUsername = null;
        if (this.dataService.loginUserName != undefined)
          LoginUsername = this.dataService.loginUserName;
        objUpdateStatus.assignedtoname = LoginUsername;
        objUpdateStatus.modifiedon = this.clsUtility.currentDateTime();
        ///////////////////////////////
        objUpdateStatus.nstatus = 9; //new change     //download and
        //////////////////////////////
        objUpdateStatus.ordernote = sendToBiotechJson.ordernote;
        objUpdateStatus.ordersubstatus = sendToBiotechJson.ordersubstatus;
        objUpdateStatus.ordersubstatusname =
          sendToBiotechJson.ordersubstatusname;
        let thisvar = this;
        thisvar.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
        thisvar.IncompleteOrderAction.IncompleteOrderInfo =
          order.incompleteorderinfo;
        thisvar.IncompleteOrderAction.isReadonlyCoverpage = true;

        thisvar.IncompleteOrderAction.SetIncompleteOrderGrid();
        await this.coreService
          .getDownloadDocumentArray(accessionnumber)
          .toPromise()
          .then(
            async function (queuedetails) {
              if (queuedetails != null) {
                documentList = queuedetails;

                for (let index = 0; index < documentList.length; index++) {
                  var element =
                    "data:application/pdf;base64," + documentList[index].bytes;
                  var filename = documentList[index].filename;

                  saveAs(element, filename);
                }

                // console.log(accessionnumber);
                var covername = accessionnumber + "-000-Cover.pdf";
                await thisvar.IncompleteOrderAction.exportGrids(covername).then(
                  (data) => {
                    saveAs(data, covername);
                  }
                );
                // console.log("End");
                // retriveDocumentList.next(true);
                if (isSendToBiotech) {
                  await thisvar.coreService
                    .SendToBiotech(objUpdateStatus)
                    .toPromise()
                    .then(
                      (response) => {
                        if (response == 1) {
                          if (isSingleSelected) {
                            thisvar.clsUtility.showSuccess(
                              "Encounter(s) downloaded and marked send to biotech successfully."
                            );
                          } else {
                            let orderstatus = new UploadStatus();
                            orderstatus.accessionNo = accessionnumber;
                            orderstatus.status = 2;
                            orderstatus.description =
                              "Encounter(s) downloaded and marked send to biotech successfully.";
                            thisvar.countObj.success++;
                            thisvar.uploadOrderStatus.push(orderstatus);
                            thisvar.percentage =
                              thisvar.percentage + percentIncrease;
                          }
                        } else {
                          if (isSingleSelected) {
                            thisvar.clsUtility.showError(
                              "Encounter(s) downloaded but failed while send to biotech."
                            );
                          } else {
                            let orderstatus = new UploadStatus();
                            orderstatus.accessionNo = accessionnumber;
                            orderstatus.status = 0;
                            orderstatus.description =
                              "Encounter(s) downloaded but failed while send to biotech.";
                            thisvar.countObj.success++;
                            thisvar.uploadOrderStatus.push(orderstatus);
                            thisvar.percentage =
                              thisvar.percentage + percentIncrease;
                          }
                        }
                        // thisvar.loader = false;
                        objUpdateStatus = null;
                      },
                      (error) => {
                        if (isSingleSelected) {
                          thisvar.clsUtility.showError(
                            "Encounter(s) downloaded but failed while send to biotech."
                          );
                        } else {
                          let orderstatus = new UploadStatus();
                          orderstatus.accessionNo = accessionnumber;
                          orderstatus.status = 0;
                          orderstatus.description =
                            "Encounter(s) downloaded but failed while send to biotech.";
                          thisvar.countObj.success++;
                          thisvar.uploadOrderStatus.push(orderstatus);
                          thisvar.percentage =
                            thisvar.percentage + percentIncrease;
                        }
                      }
                    );
                } else {
                  let orderstatus = new UploadStatus();
                  orderstatus.accessionNo = accessionnumber;
                  orderstatus.status = 2;
                  orderstatus.description = "Download successfully.";
                  thisvar.countObj.success++;
                  thisvar.uploadOrderStatus.push(orderstatus);
                  thisvar.percentage = thisvar.percentage + percentIncrease;
                }
                thisvar.cds.detectChanges();
              } else {
                let orderstatus = new UploadStatus();
                orderstatus.accessionNo = accessionnumber;
                orderstatus.status = 1;
                orderstatus.description = "No Data received from Docsvault.";
                thisvar.countObj.skipped++;
                thisvar.uploadOrderStatus.push(orderstatus);
                thisvar.percentage = thisvar.percentage + percentIncrease;
                thisvar.cds.detectChanges();
              }
            },
            (err) => {
              // thisvar.loadingOrderGrid = false;

              let orderstatus = new UploadStatus();
              orderstatus.accessionNo = accessionnumber;
              orderstatus.status = 0;
              orderstatus.description =
                "Error while downloading encounter document.";
              thisvar.countObj.error++;
              thisvar.uploadOrderStatus.push(orderstatus);
              thisvar.percentage = thisvar.percentage + percentIncrease;
              thisvar.cds.detectChanges();
              thisvar.clsUtility.LogError(err);
            }
          );
      }
      this.loader = false;
      this.OrderSelected = [];
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData(this.pagesize, this.OrderSkip);
      if (!isSingleSelected) {
        setTimeout(() => {
          this.isPercentLoader = false;
          this.percentage = 0;
          this.cds.detectChanges();
          this.countObj.total = this.uploadOrderStatus.length;
          this.OrderStatusloadItems();
          $("#uploadOrderStatusModal").modal("show");
        }, 3000);
      }
    } catch (error) {
      this.loader = false;
      this.isPercentLoader = false;
      this.percentage = 0;
      this.writeLog("Error in ExportToPDF(): " + error, "DOWNLOAD");
      this.clsUtility.LogError(error);
    }
  }
  OutputStatusResult(event: any) {
    try {
      // alert(event);
      // alert(JSON.stringify(dataItem));
      if (event) {
        switch (this.ConfirmationForProcess.toLowerCase()) {
          case "paginationchange":
            this.OrderSelected = [];
            this.OrderPageChange(this.pageChangeEvent);
            break;
          case "uploadtodocsvault":
            this.exportToPDF();
            break;
          case "downloadfromdocsvault":
            this.importFromDocsVault();
            break;
          case "downloadandsendtobiotech":
            this.dataService.NoteCalledFrom.next(
              enumFilterCallingpage.OrderAssistanceWorkqueue
            );
            this.dataService.NoteWorkItemCount.next(this.OrderSelected.length);
            this.dataService.NoteTitle.next("Download & Send to Biotech");
            this.dataService.ShowNoteCategory.next(false);
            this.dataService.ShowOrderStatus.next(true);
            this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
            this.NoteModalComponent.isSendToBiotech = false;
            this.NoteModalComponent.isUpdateMissingInfo = false;
            this.NoteModalComponent.isDownloadAndSendToBT = true;
            this.NoteModalComponent.getOrderSubStatusAndNotes("8");
            // this.NoteModalComponent.getOrderSubStatusAndNotes("8");
            $("#updateStatusModal").modal("show");
            // this.importFromDocsVault(true);
            break;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
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
  NavigateBackToIncompleteSummary() {
    try {
      this.router.navigate(["/IncompleteSummary"]);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  get disableViewUpdateInfo(): boolean {
    return this.OrderSelected.length > 1 ? true : false;
  }
}
