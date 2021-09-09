import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
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
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import * as moment from "moment";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Observable } from "rxjs";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { IncompleteOrderActionComponent } from "../../Order Action/incomplete-order-action/incomplete-order-action.component";
import {
  IncompleteOrderNote,
  UploadMissingInfoModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { saveAs } from "@progress/kendo-file-saver";
import {
  CountModel,
  StatusReportModel,
} from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
declare var $: any;
@Component({
  selector: "app-docsvault-upload",
  templateUrl: "./docsvault-upload.component.html",
  styleUrls: ["./docsvault-upload.component.css"],
})
export class DocsvaultUploadComponent implements OnInit {
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  // incompleteInfoLoading: boolean = false;
  @ViewChild("IncompleteOrderAction", { static: true })
  private IncompleteOrderAction: IncompleteOrderActionComponent;
  vwShowMissingInfo: boolean = false;
  clsAuthLogs: AuthLogs;
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  private totalRecords = 0;
  private subscription = new SubSink();
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;
  totalElements: number = 0;
  private Workqueuegroupid: string = "";
  private CallingPage: string = "WorkQueue";
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
  exportFilename: string = "SubmittedIncompleteEncounters";
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  vwDownloadOnBiotechOrders: boolean = false;
  vwUpdateInfoOnBiotechOrders: boolean = false;
  vwPrintBtn: boolean = false;
  public InputStatusMessage: string;
  public ConfirmationForProcess: string = "";
  confirmationTitle: string = "";
  isPercentLoader: boolean = false;
  percentage: number = 0;
  accessionInProgress: string = "progress";
  countObj: CountModel = new CountModel();
  statusArray: StatusReportModel[] = [];
  vwAllowMultiple: boolean = false;
  allowable: string = "multiple";
  isMultiple: boolean = false;
  loader: boolean = false;
  arrayOfIFrames: HTMLIFrameElement[] = [];

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings("single");
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
  ngOnInit() {
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
      this.dataService.IncompleteDone.subscribe((data) => {
        if (data) {
          this.OrderSelected = [];
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
    this.exportFilename += moment().format("MMDDYYYY");

    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
          this.vwShowMissingInfo = data.viewShowMissingInfo;
          this.vwAllowMultiple = data.viewAllowMultiple;
          this.vwDownloadOnBiotechOrders = data.viewDownloadOnBiotechOrders;
          this.vwUpdateInfoOnBiotechOrders = data.viewUpdateInfoOnBiotechOrders;
        }
      })
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
      // console.log("in retrivemasted daa");
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "orderupload",
            0, //login user id
            this.page,
            this.pagesize,
            8 //status of order
          )
          .subscribe(
            (queue) => {
              if (queue != null) {
                this.OrderGridData = queue;
                if (this.OrderGridData["content"] != null) {
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
    this.ViewOrderDetailsComponent.status = 8;
    // this.ViewOrderDetailsComponent.fetchOrderDetails();
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.dataService.IncompleteDone.next(false);
    this.dataService.doRefreshGrid.next(false);
    this.subscription.unsubscribe();
    this.arrayOfIFrames.forEach((item) => {
      item.remove();
    });
  }

  onAssignClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to assign");
      return;
    } else {
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.IncompleteInventory;
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
      this.RetriveMasterData(this.pagesize, this.OrderSkip);
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
          "orderupload"
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
  viewMissingInfo() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select encounter to view missing information"
        );
        return;
      } else {
        if (this.OrderSelected.length > 1) {
          this.clsUtility.showInfo(
            "Select only one encounter to view missing information"
          );
          return;
        }
        this.writeLog("View missing information is clicked.", "UPDATE");
        this.IncompleteOrderAction.orderdetails = {
          orderqueuegroupcode: "",
          providername: "",
        };
        this.IncompleteOrderAction.orderdetails.orderqueuegroupcode = this.OrderSelected[0].orderqueuegroupcode;
        this.IncompleteOrderAction.orderdetails.providername = this.OrderSelected[0].providername;
        this.IncompleteOrderAction.isReadonlyCoverpage = true;
        this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
        $("#viewMissingInfo").modal("show");
        // this.incompleteInfoLoading = true;
        // this.subscription.add(
        //   this.coreService
        //     .getMissingInfo(this.OrderSelected[0].orderqueuegroupid)
        //     .subscribe(
        //       data => {
        //         if (data == 0) {
        //           this.incompleteInfoLoading = false;
        //           this.clsUtility.showError(
        //             "Error while getting missing information"
        //           );
        //           return;
        //         }
        //         if (data) {
        //           this.IncompleteOrderAction.orderdetails = {
        //             orderqueuegroupcode: "",
        //             providername: ""
        //           };
        //           this.IncompleteOrderAction.orderdetails.orderqueuegroupcode = this.OrderSelected[0].orderqueuegroupcode;
        //           this.IncompleteOrderAction.orderdetails.providername = this.OrderSelected[0].providername;
        //           this.OrderSelected[0].incompleteorderinfo = data;
        //           this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
        //           $("#revieworders").modal("show");
        //         } else {
        //           this.clsUtility.showWarning(
        //             "Missing information not available"
        //           );
        //         }
        //         this.incompleteInfoLoading = false;
        //       },
        //       error => {
        //         this.incompleteInfoLoading = false;
        //         this.clsUtility.showError(error);
        //       }
        //     )
        // );
      }
    } catch (error) {
      // this.incompleteInfoLoading = false;
      this.clsUtility.showError(error);
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
        if (this.OrderSelected.length > 1) {
          this.clsUtility.showInfo(
            "Select only one encounter to update missing information"
          );
          return;
        }
        this.writeLog("Update missing information is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.OrderAssistanceWorkqueue //keep it as it is because we want to only update missing info
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Update Missing Information");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(true);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
        this.NoteModalComponent.isUpdateMissingInfo = true;
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  onCloseClick() {
    this.IncompleteOrderAction.IncompleteInfoGroup.reset();
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
  OutputStatusResult(event: any) {
    try {
      if (event) {
        this.importFromDocsVault();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async importFromDocsVault() {
    try {
      var isMultiple: boolean = false;
      this.percentage = 0;
      this.cdr.detectChanges();
      if (this.OrderSelected.length > 1) {
        isMultiple = true;
        this.isPercentLoader = true;
        this.cdr.detectChanges();
      } else {
        this.loader = true;
      }
      var percentIncrease = 100 / this.OrderSelected.length;
      this.countObj = new CountModel();
      this.statusArray = new Array<StatusReportModel>();
      let thisvar = this;
      for (const order of this.OrderSelected) {
        var accessionnumber = order.orderqueuegroupcode;
        this.accessionInProgress = accessionnumber + " in progress";
        var documentList: any;
        thisvar.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
        // this.IncompleteOrderAction.isReadonlyCoverpage=true;
        // this.IncompleteOrderAction.SetIncompleteOrderGrid();
        thisvar.IncompleteOrderAction.IncompleteOrderInfo =
          order.incompleteorderinfo;
        thisvar.IncompleteOrderAction.isReadonlyCoverpage = true;
        thisvar.IncompleteOrderAction.SetIncompleteOrderGrid();

        await this.coreService
          .getDownloadDocumentArray(accessionnumber)
          .toPromise()
          .then(
            async function (queuedetails) {
              if (queuedetails) {
                documentList = queuedetails;

                for (let index = 0; index < documentList.length; index++) {
                  var element =
                    "data:application/pdf;base64," + documentList[index].bytes;
                  var filename = documentList[index].filename;

                  saveAs(element, filename);
                }
                // thisvar.IncompleteOrderAction.IncompleteOrderInfo =
                //   order.incompleteorderinfo;
                // thisvar.IncompleteOrderAction.isReadonlyCoverpage = true;
                // thisvar.IncompleteOrderAction.SetIncompleteOrderGrid();

                var covername = accessionnumber + "-000-Cover.pdf";
                await thisvar.IncompleteOrderAction.exportGrids(covername).then(
                  (data) => {
                    saveAs(data, covername);
                  }
                );
                // console.log("End");
                // retriveDocumentList.next(true);
                if (isMultiple) {
                  thisvar.percentage = thisvar.percentage + percentIncrease;
                  thisvar.cdr.detectChanges();
                  let orderstatus = new StatusReportModel();
                  orderstatus.accessionNo = accessionnumber;
                  orderstatus.status = 2;
                  orderstatus.description = "Downloaded successfully.";
                  thisvar.countObj.success++;
                  thisvar.statusArray.push(orderstatus);
                } else {
                  thisvar.clsUtility.showSuccess("Downloaded successfully.");
                  thisvar.writeLog(
                    "Submitted Incomplete Orders: Encounter downloaded successfully.",
                    "DOWNLOAD"
                  );
                }
                thisvar.cdr.detectChanges();
              } else {
                let orderstatus = new StatusReportModel();
                orderstatus.accessionNo = accessionnumber;
                orderstatus.status = 0;
                orderstatus.description = "Error while downloading documents.";
                thisvar.countObj.error++;
                thisvar.statusArray.push(orderstatus);
                thisvar.percentage = thisvar.percentage + percentIncrease;
                thisvar.cdr.detectChanges();
              }
            },
            (err) => {
              // this.loadingOrderGrid = false;
              let orderstatus = new StatusReportModel();
              orderstatus.accessionNo = accessionnumber;
              orderstatus.status = 0;
              orderstatus.description = "Error while downloading documents.";
              this.countObj.error++;
              this.statusArray.push(orderstatus);
              this.percentage = this.percentage + percentIncrease;
              this.cdr.detectChanges();
            }
          );
      }
      this.loader = false;
      this.OrderSelected = [];
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData(this.pagesize, this.OrderSkip);
      if (isMultiple) {
        setTimeout(() => {
          this.isPercentLoader = false;
          this.percentage = 0;
          this.cdr.detectChanges();
          this.countObj.total = this.statusArray.length;
          // this.OrderStatusloadItems();
          $("#updateStatusModal").modal("hide");
          this.dataService.OrderUpdateDone.next(true);
          this.dataService.statusReportData.next({
            countObj: this.countObj,
            orderStatusData: this.statusArray,
          });
          $("#orderStatusReport").modal("show");
        }, 3000);
      } else {
        $("#updateStatusModal").modal("hide");
      }
    } catch (error) {
      this.loader = false;
      this.isPercentLoader = false;
      this.percentage = 0;
      this.writeLog("Error in ExportToPDF(): " + error, "UPLOAD");
      this.clsUtility.LogError(error);
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
  printDocument(blob: any) {
    var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.
    objFra.style.display = "none"; // Hide the frame.
    let pdfUrl = URL.createObjectURL(blob);
    objFra.src = pdfUrl;
    document.body.appendChild(objFra); // Add the frame to the web page.
    objFra.contentWindow.focus(); // Set focus.
    objFra.contentWindow.print(); // Print it.
    URL.revokeObjectURL(pdfUrl);
    this.arrayOfIFrames.push(objFra);
  }
  // async printMissingInfo() {
  //   try {
  //     if (this.OrderSelected.length <= 0) {
  //       this.clsUtility.showInfo("Select order(s) to print");
  //       return;
  //     }
  //     this.loader = true;
  //     for (const order of this.OrderSelected) {
  //       var accessionnumber = order.orderqueuegroupcode;
  //       this.accessionInProgress = accessionnumber + " in progress";
  //       var documentList: any;
  //       this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
  //       this.IncompleteOrderAction.IncompleteOrderInfo =
  //         order.incompleteorderinfo;
  //       this.IncompleteOrderAction.isReadonlyCoverpage = true;
  //       this.IncompleteOrderAction.SetIncompleteOrderGrid();
  //       var covername = accessionnumber + "-000-Cover.pdf";

  //       await this.coreService
  //         .getDownloadDocumentArray(accessionnumber)
  //         .toPromise()
  //         .then(
  //           async queuedetails => {
  //             if (queuedetails) {
  //               await this.IncompleteOrderAction.exportGrids(covername).then(
  //                 data => {
  //                   this.printDocument(data);
  //                 }
  //               );
  //               documentList = queuedetails;
  //               for (let index = 0; index < documentList.length; index++) {
  //                 const blobltext = await this.b64toBlob(
  //                   documentList[index].bytes,
  //                   "application/pdf"
  //                 );
  //                 this.printDocument(blobltext);
  //               }
  //             }
  //             this.loader = false;
  //           },
  //           err => {
  //             this.loader = false;
  //           }
  //         );
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  b64toBlob = (b64Data, contentType = "application/pdf", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blobpdf = new Blob(byteArrays, { type: contentType });
    return blobpdf;
  };
  // getPrintDocuments() {
  //   try {
  //     if (this.OrderSelected.length <= 0) {
  //       this.clsUtility.showInfo("Select order(s) to print");
  //       return;
  //     }
  //     this.loader = true;
  //     var arrayOfAccessions = [];
  //     for (const order of this.OrderSelected) {
  //       arrayOfAccessions.push(order.orderqueuegroupcode);
  //     }
  //     this.coreService.getMergedDocuments(arrayOfAccessions).subscribe(
  //       data => {
  //         // console.log(data);
  //         if (data) {
  //           this.loader = false;
  //           const blob = this.b64toBlob(data.bytes, "application/pdf");
  //           // var file = new Blob([blob], {
  //           //   type: "application/pdf"
  //           // });
  //           this.printDocument(blob);
  //         }
  //       },
  //       error => {
  //         this.loader = false;
  //         this.clsUtility.LogError(error);
  //       }
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  // async uploadMissingInfo() {
  //   try {
  //     if (this.OrderSelected.length <= 0) {
  //       this.clsUtility.showInfo(
  //         "Select order(s) to upload missing information"
  //       );
  //       return;
  //     }
  //     this.loader = true;
  //     this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
  //     this.IncompleteOrderAction.IncompleteOrderInfo = this.OrderSelected[0].incompleteorderinfo;
  //     this.IncompleteOrderAction.isReadonlyCoverpage = true;
  //     this.IncompleteOrderAction.SetIncompleteOrderGrid();
  //     this.IncompleteOrderAction.cdr.detectChanges();
  //     // console.log(this.OrderSelected);
  //     let body: UploadMissingInfoModel = new UploadMissingInfoModel();
  //     let covername =
  //       this.OrderSelected[0].orderqueuegroupcode + "-000-Cover.pdf";
  //     body.documentname = covername;
  //     body.category = this.OrderSelected[0].orderqueuegroupcode;
  //     body.subcategory = this.OrderSelected[0].ordercategory;
  //     body.sourcetype = "Qonductor";
  //     body.cabinet = this.OrderSelected[0].orderyear;
  //     body.folder = this.OrderSelected[0].orderday;
  //     body.externalcategoryid = "";
  //     body.createdon = this.clsUtility.currentDateTime();
  //     body.modifiedon = this.clsUtility.currentDateTime();
  //     let base64data: any;
  //     await this.IncompleteOrderAction.exportGrids(covername).then(data => {
  //       var reader = new FileReader();
  //       reader.readAsDataURL(data);
  //       let thisvar = this;
  //       reader.onloadend = function() {
  //         base64data = reader.result;
  //         base64data = base64data.replace("data:application/pdf;base64,", "");
  //         body.data = base64data;
  //         console.log(body);
  //         thisvar.uploadCall(body);
  //       };
  //     });
  //     // this.loader = false;

  //     // for (const order of this.OrderSelected) {
  //     // }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  // uploadCall(body: UploadMissingInfoModel) {
  //   this.coreService.uploadMissingInfo(body).subscribe(
  //     data => {
  //       console.log(data);
  //       this.loader = false;
  //       // this.printDocument(data);
  //       this.clsUtility.showSuccess("Uploaded successfully");
  //     },
  //     error => {
  //       this.loader = false;
  //     }
  //   );
  // }
}
