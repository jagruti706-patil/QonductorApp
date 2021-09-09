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
import { RcmEncounterDocumentsComponent } from "src/app/Pages/RCM Docs/rcm-encounter-documents/rcm-encounter-documents.component";
import { DocumentHistoryComponent } from "src/app/Pages/RCM Docs/document-history/document-history.component";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { OrderPatientBannerComponent } from "../../Cards/order-patient-banner/order-patient-banner.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-order-triarq-assistance",
  templateUrl: "./order-triarq-assistance.component.html",
  styleUrls: ["./order-triarq-assistance.component.css"],
})
export class OrderTriarqAssistanceComponent implements OnInit, OnDestroy {
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
  lstFilter: InventoryInputModel = new InventoryInputModel();
  exportFilename: string = "EncounterAssistance";
  private Workqueuegroupid: string = "";
  private CallingPage: string = "WorkQueue";
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
  public mode: "single";
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
  rcmconfirmation: string = "";
  inputPracticeConfirmationMsg: string = "";
  pageChangeEvent: PageChangeEvent;
  vwAddComment = false;
  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
    // this.lstFilter.orderyear= 2019;
    this.hideColumn("orderqueuegroupid");
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: "multiple",
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
  vwMarkComplete = false;
  vwMarkIncomplete = false;
  vwSendToPractice = false;
  vwAssignReview = false;
  vwExportButton = false;
  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
    //this.NoteModalComponent.ResetComponents();
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
    var testnavlinks: Navbarlinks;
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
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          testnavlinks = data;
          // console.log("testnavlinks" + JSON.stringify(testnavlinks));
          this.vwMarkComplete = testnavlinks.viewMarkCompleteOnAssistance;
          this.vwMarkIncomplete = testnavlinks.viewMarkIncompleteOnAssistance;
          this.vwSendToPractice = testnavlinks.viewSendToPractice;
          this.vwExportButton = testnavlinks.viewExportGrid;
          this.vwAddComment = testnavlinks.viewAddComment;
        }
      })
    );

    // this.subscription.add(
    //   this.dataService.navSubject.subscribe(data => {
    //     if (data != null || data != undefined) {
    //       this.vwAssignReview = data.viewAssignReview;
    //     }
    //   })
    // );

    this.subscription.add(
      this.dataService.OrderAssistanceDone.subscribe((data) => {
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

    // this.subscription.add(
    //   this.dataService.orderReviewAssignmentDone.subscribe(data => {
    //     if (data) {
    //       this.OrderSelected = [];
    //       if (
    //         this.OrderAssignmentComponent != null ||
    //         this.OrderAssignmentComponent != undefined
    //       ) {
    //         this.OrderAssignmentComponent.ResetComponents();
    //       }
    //       this.lstFilter = this.dataService.SelectedFilter;
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
  }

  // RetriveMasterData(recordCount: any, pageindex: any) {
  //   try {
  //     this.OrderGridView = null;
  //     this.loadingOrder = true;
  //     this.loadingOrderGrid = true;
  //     this.subscription.add(
  //       this.coreService.RetriveOrderQueue(4, recordCount, pageindex).subscribe(
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
            "OrderAssistance",
            0, //login user id
            this.page,
            this.pagesize,
            7 //status of order
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
    this.ViewOrderDetailsComponent.showDocumentList = true;
    this.ViewOrderDetailsComponent.status = 7;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    // this.dataService.OrderReviewDone.next(false);
    this.dataService.OrderAssistanceDone.next(false);
    this.dataService.ShowOrderStatus.next(false);
    this.dataService.doRefreshGrid.next(false);
    this.dataService.SelectedOrderQueueGroupCode.next("");
    this.dataService.SelectedMasterDocId.next(null);
    this.subscription.unsubscribe();
  }

  onMarkComplete() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to mark complete");
      return;
    } else {
      // if (this.OrderSelected.length > 1) {
      //   let ind: number = this.OrderSelected.findIndex(
      //     (ele) => ele.encountersource != "biotechorder"
      //   );
      //   if (ind !== -1) {
      //     this.clsUtility.showInfo("Select encounters of same source");
      //     return;
      //   }
      // }
      if (this.clsUtility.checkSelectedOrderType(this.OrderSelected) == false) {
        this.clsUtility.showInfo("Select encounters of same encounter type");
        return;
      }
      //can not mark complete for rcm encounter
      // if (
      //   this.OrderSelected.findIndex(
      //     (ele) => ele.encountersource.toLowerCase() == "rcm encounter"
      //   ) !== -1
      // ) {
      //   this.clsUtility.showInfo(
      //     "Status for selected encounter source can not be change"
      //   );
      //   return;
      // }
      $("#noteModalReview").modal("show");
      this.writeLog("Mark Complete is clicked.", "UPDATE");
      this.dataService.NoteCalledFrom.next(
        enumFilterCallingpage.OrderAssistance
      );
      this.dataService.NoteWorkItemCount.next(this.OrderSelected.length);
      this.dataService.NoteTitle.next("Mark Complete");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(true);
      this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      this.NoteModalComponent.isMarkIncomplete = false;
      this.NoteModalComponent.isMarkComplete = true;
      this.NoteModalComponent.getOrderSubStatusAndNotes("2");
      // this.NoteModalComponent.getOrderStatus("7");
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
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
      this.dataService.NoteCalledFrom.next(
        enumFilterCallingpage.OrderAssistance
      );
      this.dataService.NoteWorkItemCount.next(0);
      this.dataService.NoteTitle.next("Mark Incomplete");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(true);
      this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
      this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      this.NoteModalComponent.isMarkIncomplete = true;
      this.NoteModalComponent.getOrderSubStatusAndNotes("3");
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
  }
  // onAssignClick() {
  //   if (this.OrderSelected.length <= 0) {
  //     this.clsUtility.showInfo("Select order to assign for review");
  //     return;
  //   } else {
  //     this.writeLog("Assign review is clicked.", "UPDATE");
  //     this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
  //     this.OrderAssignmentComponent.orderAssignSource =
  //       enumOrderAssignSource.PendingReview;
  //     this.OrderAssignmentComponent.orderAssignmentStatus = 6;
  //     this.OrderAssignmentComponent.setworkqueueassignment();
  //   }
  // }
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
    }
  }
  // public dataStateChange(state: DataStateChangeEvent): void {

  //   this.state = state;
  //   console.log(this.state);
  //   this.OrderGridView = process(this.OrderItems, this.state);
  // }
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
  onOpenOrderHistory(item: any) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = false;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
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
  @ViewChild("RcmDocumentComponent")
  private RcmDocumentComponent: RcmEncounterDocumentsComponent;
  @ViewChild("RcmDocumentHistoryComponent")
  private RcmDocumentHistoryComponent: DocumentHistoryComponent;
  @ViewChild("kendoTabStrip")
  private kendoTabStrip: TabStripComponent;

  @ViewChild("OrderPatientBannerComponent")
  private ViewOrderPatientBannerComponent: OrderPatientBannerComponent;

  onSendToPractice() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("No encounter is selected");
      return;
    } else {
      if (this.OrderSelected.length > 1) {
        this.clsUtility.showInfo("Select only one encounter");
      } else {
        if (
          this.OrderSelected[0].encountersource &&
          this.OrderSelected[0].encountersource.toLowerCase() == "rcm encounter"
        ) {
          this.dataService.SelectedOrderInfo.next(this.OrderSelected[0]);
          this.dataService.SelectedOrderQueueGroupCode.next(
            "SendToPractice:" + this.OrderSelected[0].orderqueuegroupcode
          );
          if (this.kendoTabStrip) this.kendoTabStrip.selectTab(0); //for selecting documents tab by default
          $("#mdRCMEncounter").modal("show");
          this.writeLog("Check RCM Encounter is clicked.", "UPDATE");
        } else {
          this.clsUtility.showWarning("Select RCM encounter");
        }
      }
    }
  }
  close() {
    // if (this.orderAssignSource == 0)
    //   this.dataService.orderAssignmentDone.next(false);
    // else if (this.orderAssignSource == 5)
    //   this.dataService.orderReviewAssignmentDone.next(false);
    // else if (this.orderAssignSource == 4)
    //   this.dataService.orderReassignmentDone.next(false);
    if (
      this.ViewOrderPatientBannerComponent != null &&
      this.ViewOrderPatientBannerComponent != undefined
    )
      this.ViewOrderPatientBannerComponent.OnClose();
  }
  validateAssignOrder() {
    // try {
    //   if (
    //     this.AgentName.valid &&
    //     this.AgentName.value !== 0 &&
    //     this.GroupName.valid &&
    //     this.GroupName.value !== 0
    //   ) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } catch (error) {
    //   this.clsUtility.LogError(error);
    // }
    return true;
  }
  loadingData: boolean = false;
  GenerateWorkitemAssignment() {
    try {
      // var practicebucket: any = this.RcmDocumentHistoryComponent.documentHistoryItems.filter(
      //   (x) => x.ispracticebucket === true
      // );
      // console.log(practicebucket.map((a) => a.docid));
      // console.log(this.RcmDocumentHistoryComponent.masterdocid);

      // console.log(this.RcmDocumentHistoryComponent.accessionnumber);
      // {
      //   "lstdocids":["6bed5f02-9997-4583-b9d9-766a4c30256a","665770ca-99b7-4900-992d-a8cca1eff24c"],
      //   "masterdocid":"a5b1caa5-4d9a-4dd1-b29a-4a7eb223cd64"
      // "accessionno":"Test Doc 68"
      //   }
      this.loadingData = true;
      this.subscription.add(
        this.coreService
          .CheckPracticeBucketQuestions(
            this.OrderSelected[0].orderqueuegroupcode
          )
          .subscribe(
            (data) => {
              this.loadingData = false;
              if (data) {
                if (data == 1) {
                  //question exists
                  this.CheckPracticeMapping();
                } else if (data == 2) {
                  //no question found
                  this.inputPracticeConfirmationMsg =
                    "No question(s) added to the practice bucket. Do you want to continue ?";
                  this.rcmconfirmation = "checkpracticebucketque";
                  $("#checkPracticeConfirmationModal").modal("show");
                }
              } else {
                if (data == 0) {
                  this.clsUtility.LogError(
                    "Error while checking practice bucket questions"
                  );
                }
              }
            },
            (error) => {
              this.loadingData = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.loadingData = false;
      this.clsUtility.LogError(error);
    }
  }
  CheckPracticeMapping() {
    try {
      this.loadingData = true;
      this.subscription.add(
        this.coreService
          .CheckPracticeMapping(this.OrderSelected[0].clientid)
          .subscribe(
            (data) => {
              this.loadingData = false;
              if (data) {
                if (data == 2) {
                  this.clsUtility.showWarning(
                    "No practice mapping available for client. Please configure practice mapping group & try again."
                  );
                } else {
                  this.inputPracticeConfirmationMsg =
                    "<div class='mb-3'>Newly generated encounter will be assign to -</div><div>Group : <b>" +
                    data.groupname +
                    "</b></div><div class='mb-3'>Client &nbsp;: <b>" +
                    data.clientname +
                    "</b></div>Do you want to continue ?";
                  this.rcmconfirmation = "checkpracticemapping";
                  $("#checkPracticeConfirmationModal").modal("show");
                }
              } else {
                if (data == 0) {
                  this.clsUtility.LogError(
                    "Error while checking practice mapping"
                  );
                }
              }
            },
            (error) => {
              this.loadingData = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.loadingData = false;
      this.clsUtility.LogError(error);
    }
  }
  GeneratePracticeEncounter() {
    try {
      if (this.OrderSelected[0].orderqueuegroupcode != null) {
        let input: {
          // lstdocids: any;
          // masterdocid: string;
          accessionno: string;
          username: string;
          userid: string;
        } = {
          // lstdocids: practicebucket.map((a) => a.docid),
          // masterdocid: this.RcmDocumentHistoryComponent.masterdocid,
          accessionno: this.OrderSelected[0].orderqueuegroupcode,
          username: this.dataService.loginUserName,
          userid: this.dataService.loginGCPUserID.getValue(),
        };
        this.loadingData = true;
        this.subscription.add(
          this.coreService.GeneratePracticeEncounter(input).subscribe(
            (data) => {
              this.loadingData = false;
              if (data == 1) {
                if (this.rcmconfirmation == "checkpracticemapping") {
                  this.clsUtility.showSuccess(
                    "Practice encounter is generated and assigned to practice group"
                  );
                } else {
                  this.clsUtility.showSuccess(
                    "Encounter action saved successfully"
                  );
                }
                $("#mdRCMEncounter").modal("hide");
                this.OrderSelected = [];
                this.lstFilter = this.dataService.SelectedFilter;
                this.RetriveMasterData(this.pagesize, this.OrderSkip);
              } else if (data == 2) {
                this.clsUtility.showWarning(
                  "No document available to send to practice."
                );
              } else if (data == 0) {
                this.clsUtility.LogError(
                  "Error while generating practice encounter."
                );
              }
            },
            (error) => {
              this.loadingData = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      }
    } catch (error) {
      this.loadingData = false;
      this.clsUtility.LogError(error);
    }
  }
  OutputCheckPracticeResult(evt: boolean) {
    try {
      $("#checkPracticeConfirmationModal")
        .modal()
        .on("hidden.bs.modal", function (e) {
          $("body").addClass("modal-open");
        });
      $("#checkPracticeConfirmationModal").modal("hide");
      if (evt) {
        this.GeneratePracticeEncounter();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  get disableIncompleteButton(): boolean {
    return this.OrderSelected[0] &&
      this.OrderSelected[0].encountersource.toLowerCase() !=
        "biotech encounter" &&
      this.clsUtility.checkSelectedOrderType(this.OrderSelected) == true
      ? true
      : false;
  }
  get disableCheckRCM(): boolean {
    return this.OrderSelected[0] &&
      this.OrderSelected[0].encountersource.toLowerCase() != "rcm encounter" &&
      this.clsUtility.checkSelectedOrderType(this.OrderSelected) == true
      ? true
      : false;
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
