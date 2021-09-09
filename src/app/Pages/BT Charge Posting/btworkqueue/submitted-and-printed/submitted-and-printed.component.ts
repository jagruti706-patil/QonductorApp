import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  SelectableMode,
  SelectableSettings,
  GridDataResult,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { HttpClient } from "@angular/common/http";
import {
  Utility,
  enumFilterCallingpage,
  enumOrderAssignSource,
} from "src/app/Model/utility";
import { AuthLogs } from "src/app/Model/Common/logs";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { PrintFilterInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { SubSink } from "subsink";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import {
  CountModel,
  StatusReportModel,
} from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-submitted-and-printed",
  templateUrl: "./submitted-and-printed.component.html",
  styleUrls: ["./submitted-and-printed.component.css"],
})
export class SubmittedAndPrintedComponent implements OnInit, OnDestroy {
  vwRePrintBtn: boolean = false;
  vwFinishedAndReturned: boolean = false;
  vwFailedAndReturned: boolean = false;
  vwReturnedWithoutWorking: boolean = false;
  loadingOrders: boolean = false;
  OrderSelected: any[] = [];
  clsUtility: Utility;
  orderSkip: number = 0;
  pageSize: number = 0;
  selectableSettings: SelectableSettings;
  clsAuthLogs: AuthLogs;
  loader: boolean = false;
  arrayOfIFrames: HTMLIFrameElement[] = [];
  page: number = 0;
  OrderGridData: any;
  OrderItems: any[] = [];
  OrderGridView: GridDataResult;
  OrderSort: SortDescriptor[] = [
    // {
    //   field: "modifiedon",
    //   dir: "desc"
    // },
    // {
    //   field: "batchsequenceno",
    //   dir: "asc"
    // }
  ];
  totalElements: number = 0;
  totalDocuments: number = 0;
  printInputFilter: PrintFilterInputModel = new PrintFilterInputModel();
  private subscription = new SubSink();
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  isPercentLoader: boolean = false;
  percentage: number = 0;
  CallingPage: string = "submittedandprinted";
  InputConfirmationMessage: string = "";
  // yesFrom: string;
  countObj: CountModel;
  statusArray: StatusReportModel[];
  pdfBlob: Blob;
  arrayOfAccessions: any[] = [];
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  vwSendToPracticeBtn: boolean = false;
  @ViewChild("OrderAssignment", { static: true })
  private OrderAssignmentComponent: OrderAssignmentComponent;
  vwAddComment = false;

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private filterService: FilterService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pageSize = this.clsUtility.printOrdersPageSize;
    this.setSelectableSettings("multiple");
    this.clsAuthLogs = new AuthLogs(http);
  }
  public setSelectableSettings(mode: SelectableMode): void {
    try {
      this.selectableSettings = {
        checkboxOnly: true,
        mode: mode,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public selectedCallback = (args) => args.dataItem;

  ngOnInit() {
    this.RetriveMasterData();
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.printInputFilter = this.dataService.SelectedPrintFilter;
          this.RetriveMasterData();
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
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwRePrintBtn = data.viewRePrintBtn;
          this.vwFinishedAndReturned = data.viewFinishedAndReturnedBtn;
          this.vwFailedAndReturned = data.viewFailedAndReturnedBtn;
          this.vwReturnedWithoutWorking = data.viewReturnedWithoutWorkingBtn;
          this.vwSendToPracticeBtn = data.viewSubmittedAndPrintedSendToPractice;
          this.vwAddComment = data.viewAddComment;
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
          this.printInputFilter = this.dataService.SelectedPrintFilter;
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

  RePrintClick() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select order to print");
        return;
      }
      if (this.OrderSelected.length > 1) {
        this.clsUtility.showInfo("Select only one order");
        return;
      }
      // this.InputConfirmationMessage =
      //   "Are you sure you want to print selected order(s) ?";
      // $("#confirmationModal").modal("show");
      // this.yesFrom = "print";
      // this.arrayOfAccessions = [];
      // for (const order of this.OrderSelected) {
      //   this.arrayOfAccessions.push(order.orderqueuegroupcode);
      // }
      // if (this.totalDocuments > 100) {
      //   this.InputConfirmationMessage =
      //     "Document count maximum size(100) exceeded.\nAre you sure you want to continue?";
      //   // this.yesFrom = "print";
      //   $("#confirmationModal").modal("show");
      // } else {
      //   this.getMergedDocuments();
      // }
      this.writeLog("Reprint is clicked.", "UPDATE");
      this.getMergedDocuments(this.OrderSelected[0].orderqueuegroupcode);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  gridSelectionChange(evt: any) {
    try {
      this.totalDocuments = 0;
      for (const order of this.OrderSelected) {
        this.totalDocuments = this.totalDocuments + order.documentcount;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getMergedDocuments(accessionno: any) {
    try {
      this.loader = true;
      this.subscription.add(
        this.coreService.getMergedDocumentsForReprint(accessionno).subscribe(
          (data) => {
            if (data) {
              // const blob = this.clsUtility.b64toBlob(
              //   data.bytes,
              //   "application/pdf"
              // );
              const blob = data;
              this.pdfBlob = blob;
              // let result: any[] = data.result;
              // this.countObj = new CountModel();
              // this.countObj.total = result.length;
              // this.statusArray = new Array<StatusReportModel>();
              // result.forEach(element => {
              //   let printstatus = new StatusReportModel();

              //   printstatus.accessionNo = element.accessionno;
              //   printstatus.description = element.description;
              //   if (element.status == "2") {
              //     printstatus.status = 2;
              //     this.countObj.success++;
              //   } else if (element.status == "1") {
              //     printstatus.status = 1;
              //     this.countObj.skipped++;
              //   } else if (element.status == "0") {
              //     printstatus.status = 0;
              //     this.countObj.skipped++;
              //   }
              //   printstatus.sequenceno = element.sequenceno;
              //   this.statusArray.push(printstatus);
              //   this.dataService.statusReportData.next({
              //     countObj: this.countObj,
              //     orderStatusData: this.statusArray,
              //     isFrom: "readyforprinting"
              //   });
              //   $("#orderStatusReport").modal("show");
              // });
              this.printDocument(blob);
            } else if (data == 0) {
              this.loader = false;
              this.clsUtility.LogError("Error while reading document.");
              this.OrderSelected = [];
              this.printInputFilter = this.dataService.SelectedPrintFilter;
              this.RetriveMasterData();
            }
          },
          (error) => {
            this.loader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  printDocument(blob: any) {
    try {
      var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.
      objFra.style.display = "none"; // Hide the frame.
      let pdfUrl = URL.createObjectURL(blob);
      objFra.src = pdfUrl;
      document.body.appendChild(objFra); // Add the frame to the web page.
      objFra.contentWindow.focus(); // Set focus.
      objFra.contentWindow.print(); // Print it.
      // this.cdr.detectChanges();
      // objFra.contentWindow.onafterprint = function(event) {
      //   console.log("printed");
      // };
      URL.revokeObjectURL(pdfUrl);
      this.arrayOfIFrames.push(objFra);
      this.loader = false;
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    try {
      this.OrderSelected = [];
      var Orderevent = $event;
      this.page = 0;
      this.orderSkip = 0;
      this.pageSize = this.clsUtility.printOrdersPageSize;
      if (Orderevent != null) {
        this.OrderGridData = Orderevent;
        if (this.OrderGridData["content"] != null) {
          this.OrderItems = this.OrderGridData["content"];
          this.OrderloadItems();
        } else {
          this.totalElements = 0;
          this.OrderGridView = null;
          this.OrderItems = [];
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
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
  OrderSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.OrderItems != null) {
        this.OrderSort = sort;
        this.OrderloadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OrderPageChange(event: PageChangeEvent): void {
    try {
      if (this.OrderSelected.length == 0) {
        this.OrderGridView = null;
        this.totalDocuments = 0;
        this.orderSkip = event.skip;
        this.page = event.skip / event.take;
        this.printInputFilter = this.dataService.SelectedPrintFilter;
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
  RetriveMasterData() {
    try {
      this.OrderGridView = null;
      this.loadingOrders = true;
      this.subscription.add(
        this.filterService
          .applyPrintFilter(
            this.CallingPage,
            this.page,
            this.pageSize,
            this.printInputFilter
          )
          .subscribe(
            (queue) => {
              // console.log(queue);
              this.dataService.SelectedPrintFilter = this.printInputFilter;
              if (queue != null) {
                this.OrderGridData = queue;
                if (this.OrderGridData["content"] != null) {
                  this.OrderItems = this.OrderGridData["content"];
                  this.OrderloadItems();
                } else {
                  this.totalElements = 0;
                  this.OrderGridView = null;
                  this.OrderItems = [];
                  let mod =
                    this.OrderGridData["totalelements"] %
                    this.clsUtility.printOrdersPageSize;
                  if (mod == 0 && this.OrderGridData["totalelements"] !== mod) {
                    this.OrderPageChange({
                      skip: 0,
                      take: this.clsUtility.printOrdersPageSize,
                    });
                  }
                }
                this.loadingOrders = false;
              }
            },
            (err) => {
              this.loadingOrders = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onOpenViewdetails(item) {
    try {
      this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
      this.ViewOrderDetailsComponent.SelectedOrder = item;
      this.ViewOrderDetailsComponent.status = 8;
      this.ViewOrderDetailsComponent.ShowOrderDetails();
      this.ViewOrderDetailsComponent.title = "Order";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.dataService.doRefreshGrid.next(false);
      this.subscription.unsubscribe();
      this.arrayOfIFrames.forEach((item) => {
        item.remove();
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  reportOkClicked(event: boolean) {
    try {
      if (event) {
        // this.printDocument(this.pdfBlob);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  FinishedAndReturnedClicked() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select order to mark as finished and returned"
        );
        return;
      } else {
        if (this.OrderSelected.length > 1) {
          this.clsUtility.showInfo("Select only one order");
          return;
        }
        $("#revieworders").modal("show");
        this.writeLog("Finished & Returned is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.SubmittedAndPrinted
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Finished & Returned");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(false);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.NoteModalComponent.isFromSubmittedAndPrinted = true;
        this.NoteModalComponent.buttonClicked = "finishedandreturned";
        // this.NoteModalComponent.isUpdateMissingInfo = false;
        // this.NoteModalComponent.isDownloadAndSendToBT = false;
        this.NoteModalComponent.getOrderSubStatusAndNotes("11");
        this.NoteModalComponent.title = "Order";
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
  }
  FailedAndReturnedClicked() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select order to mark as failed and returned");
        return;
      } else {
        if (this.OrderSelected.length > 1) {
          this.clsUtility.showInfo("Select only one order");
          return;
        }
        $("#revieworders").modal("show");
        this.writeLog("Failed & Returned is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.SubmittedAndPrinted
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Failed & Returned");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(false);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.NoteModalComponent.isFromSubmittedAndPrinted = true;
        this.NoteModalComponent.buttonClicked = "failedandreturned";
        // this.NoteModalComponent.isUpdateMissingInfo = false;
        // this.NoteModalComponent.isDownloadAndSendToBT = false;
        this.NoteModalComponent.getOrderSubStatusAndNotes("12");
        this.NoteModalComponent.title = "Order";
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
  }
  ReturnedWithoutWorkingClicked() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo(
          "Select order to mark as returned without working"
        );
        return;
      } else {
        if (this.OrderSelected.length > 1) {
          this.clsUtility.showInfo("Select only one order");
          return;
        }
        $("#revieworders").modal("show");
        this.writeLog("Returned Without Working is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.SubmittedAndPrinted
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Returned Without Working");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(false);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
        this.NoteModalComponent.isFromSubmittedAndPrinted = true;
        this.NoteModalComponent.buttonClicked = "returnedwithoutworking";
        // this.NoteModalComponent.isUpdateMissingInfo = false;
        // this.NoteModalComponent.isDownloadAndSendToBT = false;
        this.NoteModalComponent.getOrderSubStatusAndNotes("13");
        this.NoteModalComponent.title = "Order";
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
  }
  // ReturnToReadyForPrinting() {
  //   try {
  //     if (this.OrderSelected.length <= 0) {
  //       this.clsUtility.showInfo(
  //         "Select order to return to ready for printing"
  //       );
  //       return;
  //     } else {
  //       this.writeLog("Return to Ready for Printing is clicked.", "UPDATE");
  //       this.dataService.NoteCalledFrom.next(
  //         enumFilterCallingpage.SubmittedAndPrinted
  //       );
  //       this.dataService.NoteWorkItemCount.next(0);
  //       this.dataService.NoteTitle.next("Return to Ready for Printing");
  //       this.dataService.ShowNoteCategory.next(false);
  //       this.dataService.ShowOrderStatus.next(false);
  //       this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
  //       this.NoteModalComponent.isFromSubmittedAndPrinted = true;
  //       this.NoteModalComponent.buttonClicked = "returnedtoreadyforprinting";
  //       // this.NoteModalComponent.isUpdateMissingInfo = false;
  //       // this.NoteModalComponent.isDownloadAndSendToBT = false;
  //       this.NoteModalComponent.getOrderSubStatusAndNotes("8");
  //       this.NoteModalComponent.title = "Order";
  //     }
  //   } catch (error) {
  //     this.clsUtility.showError(error);
  //   }
  //   // this.NoteModalComponent.refreshgrid.subscribe(data => {
  //   //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
  //   // });
  // }
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
      screen: "Submitted&PrintedOrders",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
  OutputStatusResult(evt: boolean) {
    try {
      if (evt) {
        switch (this.confirmationFrom.toLowerCase()) {
          case "paginationchange":
            this.OrderSelected = [];
            this.OrderPageChange(this.pageChangeEvent);
            break;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSendToPracticeClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select order for send to practice");
      return;
    } else {
      $("#assignOrderModal").modal("show");
      this.writeLog("Send to practice is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.SubmittedAndPrinted;
      this.OrderAssignmentComponent.title = "Send To Practice";
      this.OrderAssignmentComponent.orderAssignmentStatus = 16; //practice assigned status
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
}
