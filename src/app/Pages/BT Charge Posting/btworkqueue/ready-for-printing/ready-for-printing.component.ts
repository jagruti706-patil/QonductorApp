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
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
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
import { SubmittedAndPrintedModel } from "src/app/Model/BT Charge Posting/Order/order-note";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-ready-for-printing",
  templateUrl: "./ready-for-printing.component.html",
  styleUrls: ["./ready-for-printing.component.css"],
})
export class ReadyForPrintingComponent implements OnInit, OnDestroy {
  vwPrintBtn: boolean = false;
  vwPrintAllBtn: boolean = false;
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
  OrderSort: SortDescriptor[] = [];
  totalElements: number = 0;
  totalDocuments: number = 0;
  printInputFilter: PrintFilterInputModel = new PrintFilterInputModel();
  private subscription = new SubSink();
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  isPercentLoader: boolean = false;
  percentage: number = 0;
  CallingPage: string = "readyforprinting";
  InputConfirmationMessage: string = "";
  // yesFrom: string;
  countObj: CountModel;
  statusArray: StatusReportModel[];
  pdfBlob: Blob;
  arrayOfAccessions: any[] = [];
  responseOfPrint: any;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  vwReadyForPrintSendToPracticeBtn: boolean = false;
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
  isPrintClick: boolean = false;
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
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwPrintBtn = data.viewPrintBtn;
          this.vwPrintAllBtn = data.viewPrintAllBtn;
          this.vwReadyForPrintSendToPracticeBtn =
            data.viewReadyForPrintSendToPracticeBtn;
          this.vwAddComment = data.viewAddComment;
        }
      })
    );
  }

  PrintClick() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select order(s) to print");
        return;
      }
      this.isPrintClick = true;
      // this.InputConfirmationMessage =
      //   "Are you sure you want to print selected order(s) ?";
      // $("#confirmationModal").modal("show");
      // this.yesFrom = "print";
      this.writeLog("Print selected is clicked.", "UPDATE");
      this.arrayOfAccessions = [];
      for (const order of this.OrderSelected) {
        this.arrayOfAccessions.push({
          accessionnumber: order.orderqueuegroupcode,
          orderqueueid: order.orderqueuegroupid,
        });
      }
      // if (this.totalDocuments > 100) {
      //   this.InputConfirmationMessage =
      //     "Document count maximum size(100) exceeded.";
      //   // this.yesFrom = "print";
      //   $("#confirmationModal").modal("show");
      // } else {
      //   this.sendPrintBatch();
      //   // this.getMergedDocuments();
      // }
      this.sendPrintBatch();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // PrintSampleClick() {
  //   try {
  //     var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.
  //     objFra.style.display = "none"; // Hide the frame.
  //     objFra.src = "http://www.africau.edu/images/default/sample.pdf";
  //     document.body.appendChild(objFra); // Add the frame to the web page.
  //     objFra.contentWindow.focus(); // Set focus.
  //     objFra.contentWindow.print(); // Print it.
  //     // this.cdr.detectChanges();
  //     // objFra.contentWindow.onafterprint = function(event) {
  //     //   console.log("printed");
  //     // };
  //     // URL.revokeObjectURL(pdfUrl);
  //     this.arrayOfIFrames.push(objFra);
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  PrintAllClick() {
    try {
      if (this.totalElements <= 0) {
        this.clsUtility.showInfo("No orders available for print");
        return;
      }
      this.isPrintClick = true;
      this.RetriveAllOrderData();
      // if (this.OrderItems.length <= 0) {
      //   this.clsUtility.showInfo("No orders available for print");
      //   return;
      // }
      // this.OrderSelected = [];
      // this.arrayOfAccessions = [];
      // let totalDocuments = 0;
      // for (const order of this.OrderItems) {
      //   totalDocuments = totalDocuments + order.documentcount;
      //   this.arrayOfAccessions.push(order.orderqueuegroupcode);
      // }
      // if (totalDocuments > 100) {
      //   this.InputConfirmationMessage =
      //     "Document count maximum size(100) exceeded.";
      //   // this.yesFrom = "printall";
      //   $("#confirmationModal").modal("show");
      // } else {
      //   this.sendPrintBatch(true);
      //   // this.getMergedDocumentsTest();
      // }
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

  allPrint() {
    try {
      if (this.OrderItems.length <= 0) {
        this.clsUtility.showInfo("No orders available for print");
        return;
      }
      this.confirmationTitle = "Confirmation";
      this.confirmationFrom = "printall";
      this.InputStatusMessage =
        "Qonductor will print <b>" +
        this.OrderItems.length +
        "</b> orders. Are you sure you want to continue?";
      $("#UserConfirmationModal").modal("show");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  printConfirmationYesClick() {
    try {
      this.writeLog("Print all confirmation yes clicked.", "UPDATE");
      this.OrderSelected = [];
      this.arrayOfAccessions = [];
      let totalDocuments = 0;
      for (const order of this.OrderItems) {
        totalDocuments = totalDocuments + order.documentcount;
        this.arrayOfAccessions.push({
          accessionnumber: order.orderqueuegroupcode,
          orderqueueid: order.orderqueuegroupid,
        });
      }
      // if (totalDocuments > 100) {
      //   this.InputConfirmationMessage =
      //     "Document count maximum size(100) exceeded.";
      //   // this.yesFrom = "printall";
      //   $("#confirmationModal").modal("show");
      // } else {
      //   this.sendPrintBatch(true);
      //   // this.getMergedDocumentsTest();
      // }
      this.sendPrintBatch(true);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sendPrintBatch(isPrintAll: boolean = false) {
    try {
      let inputJson: {
        accessionnumbers: any[];
        createdon: string;
        userid: string;
        username: string;
      } = {
        accessionnumbers: this.arrayOfAccessions,
        createdon: this.clsUtility.currentDateTime(),
        userid: this.dataService.loginGCPUserID.getValue(),
        username: this.dataService.loginUserName,
      };
      this.loader = true;
      this.subscription.add(
        this.coreService.sendPrintBatch(inputJson).subscribe(
          (data) => {
            if (data) {
              // console.log("batch res", data);
              if (isPrintAll) {
                this.getPrintAllMergedDocuments(data);
              } else {
                this.getMergedDocuments(data);
              }
              // this.loader = false;
            } else {
              this.loader = false;
              this.clsUtility.LogError("Error while sending batch");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  getMergedDocuments(inputBody: string) {
    try {
      // this.loader = true;
      this.subscription.add(
        this.coreService.getMergedDocumentsForPrint(inputBody).subscribe(
          (data) => {
            // console.log(data);
            if (data) {
              this.responseOfPrint = data;
              if (data.bytes == null || data.bytes == "") {
                this.clsUtility.showInfo("Failed to read order documents");
                this.loader = false;
                return;
              }
              const blob = this.clsUtility.b64toBlob(
                data.bytes,
                "application/pdf"
              );
              this.pdfBlob = blob;
              let result: any[] = data.result;
              this.countObj = new CountModel();
              this.countObj.total = result.length;
              this.statusArray = new Array<StatusReportModel>();
              result.forEach((element) => {
                let printstatus = new StatusReportModel();

                printstatus.accessionNo = element.accessionno;
                printstatus.description = element.description;
                if (element.status == "2") {
                  printstatus.status = 2;
                  this.countObj.success++;
                } else if (element.status == "1") {
                  printstatus.status = 1;
                  this.countObj.skipped++;
                } else if (element.status == "0") {
                  printstatus.status = 0;
                  this.countObj.error++;
                }
                printstatus.sequenceno = element.sequenceno;
                // this.statusArray.push(printstatus);
                if (element.status != "2") {
                  this.statusArray.push(printstatus);
                }
                // this.dataService.statusReportData.next({
                //   countObj: this.countObj,
                //   orderStatusData: this.statusArray,
                //   isFrom: "readyforprinting"
                // });
                // $("#orderStatusReport").modal("show");
              });
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

  getPrintAllMergedDocuments(inputBody: string) {
    try {
      // this.loader = true;
      this.subscription.add(
        this.coreService
          .getPrintAllMergedDocumentsForPrint(inputBody)
          .subscribe(
            (data) => {
              // console.log(data);
              if (data) {
                this.responseOfPrint = data;
                const blob = this.clsUtility.b64toBlob(
                  data.bytes,
                  "application/pdf"
                );
                this.pdfBlob = blob;
                let result: any[] = data.result;
                this.countObj = new CountModel();
                this.countObj.total = result.length;
                this.statusArray = new Array<StatusReportModel>();
                result.forEach((element) => {
                  let printstatus = new StatusReportModel();

                  printstatus.accessionNo = element.accessionno;
                  printstatus.description = element.description;
                  if (element.status == "2") {
                    printstatus.status = 2;
                    this.countObj.success++;
                  } else if (element.status == "1") {
                    printstatus.status = 1;
                    this.countObj.skipped++;
                  } else if (element.status == "0") {
                    printstatus.status = 0;
                    this.countObj.error++;
                  }
                  printstatus.sequenceno = element.sequenceno;
                  if (element.status != "2") {
                    this.statusArray.push(printstatus);
                  }

                  // $("#orderStatusReport").modal("show");
                });
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

  // printDocument(blob: any) {
  //   try {
  //     var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.

  //     objFra.style.display = "none"; // Hide the frame.
  //     let pdfUrl = URL.createObjectURL(blob);
  //     objFra.src = pdfUrl;
  //     // objFra.src = null;
  //     document.body.appendChild(objFra); // Add the frame to the web page.
  //     // setTimeout(() => {

  //     objFra.addEventListener("load", () => {
  //       setTimeout(() => {
  //         objFra.contentWindow.onafterprint = function(event) {
  //           console.log("after printed");
  //         };
  //         objFra.contentWindow.onbeforeprint = function(event) {
  //           console.log("before printed");
  //         };
  //         objFra.contentWindow.focus(); // Set focus.
  //         objFra.contentWindow.print(); // Print it.
  //       }, 5000);
  //     });
  //     URL.revokeObjectURL(pdfUrl);
  //     this.arrayOfIFrames.push(objFra);
  //     // }, 5000);
  //     // this.cdr.detectChanges();
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  printDocument(blob: any) {
    try {
      var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.
      objFra.style.display = "none"; // Hide the frame.
      let pdfUrl = URL.createObjectURL(blob);
      objFra.src = pdfUrl;
      document.body.appendChild(objFra); // Add the frame to the web page.
      objFra.contentWindow.focus(); // Set focus.
      objFra.contentWindow.print(); // Print it.
      setTimeout(() => {
        if (this.countObj.error > 0) {
          this.dataService.statusReportData.next({
            countObj: this.countObj,
            orderStatusData: this.statusArray,
            isFrom: "readyforprinting",
          });
          $("#orderStatusReport").modal("show");
        } else if (this.countObj.success == this.countObj.total) {
          this.updateOrderStatus();
        }
        this.loader = false;
      }, 7000);
      // this.cdr.detectChanges();
      // objFra.contentWindow.onafterprint = function(event) {
      //   console.log("printed");
      // };
      URL.revokeObjectURL(pdfUrl);
      this.arrayOfIFrames.push(objFra);
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
      this.totalDocuments = 0;

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
        $("#UserConfirmationModal").modal("show");
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
                  // below code is for if user select all orders from last page and print selected then user will be redirected to 1st page
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
  RetriveAllOrderData() {
    try {
      // this.OrderGridView = null;
      // this.loadingOrders = true;
      this.loader = true;
      this.printInputFilter = this.dataService.SelectedPrintFilter;
      this.subscription.add(
        this.filterService
          .applyPrintFilter(
            this.CallingPage,
            0,
            this.totalElements,
            this.printInputFilter
          )
          .subscribe(
            (queue) => {
              // console.log(queue);
              // this.dataService.SelectedPrintFilter = this.printInputFilter;
              if (queue != null) {
                this.OrderGridData = queue;
                if (this.OrderGridData["content"] != null) {
                  this.OrderItems = this.OrderGridData["content"];
                  // this.OrderloadItems();
                  this.allPrint();
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
              }
              this.loader = false;
            },
            (err) => {
              this.loader = false;
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
  OutputStatusResult(event: any) {
    try {
      if (event) {
        //Print all documents confirmation yes clicked
        // switch (this.yesFrom.toLowerCase()) {
        //   case "print":
        // this.getMergedDocuments();
        //   break;
        // case "printall":
        //   this.getMergedDocuments();
        //   break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    try {
      this.dataService.orderAssignmentDone.next(false);
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
        this.updateOrderStatus();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateOrderStatus() {
    try {
      if (this.responseOfPrint) {
        let statusArray = [];
        for (const item of this.responseOfPrint.result) {
          let status: {
            accessionnumber: string;
            printstatus: string;
          } = {
            accessionnumber: item.accessionno,
            printstatus: item.status == 0 ? "Error" : "Success", //item.description
          };
          statusArray.push(status);
        }
        let inputOfUpdate: SubmittedAndPrintedModel = new SubmittedAndPrintedModel();
        inputOfUpdate.batchcode = this.responseOfPrint.batchcode;
        inputOfUpdate.orderstatus = "10";
        inputOfUpdate.batchuserid = this.dataService.loginGCPUserID.getValue();
        inputOfUpdate.batchusername = this.dataService.loginUserName;
        inputOfUpdate.status = statusArray;
        inputOfUpdate.modifiedon = this.clsUtility.currentDateTime();
        this.loader = true;
        this.subscription.add(
          this.coreService.markSubmittedAndPrinted(inputOfUpdate).subscribe(
            (data) => {
              // console.log(data);
              // if (data) {
              //   this.clsUtility.showSuccess(
              //     "Orders marked as submitted and printed successfully"
              //   );
              // }
              this.OrderSelected = [];
              this.printInputFilter = this.dataService.SelectedPrintFilter;
              this.RetriveMasterData();
              this.loader = false;
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  OutputConfirmationResult(evt: boolean) {
    if (evt) {
      switch (this.confirmationFrom.toLowerCase()) {
        // case "updateorderstatus":
        //   $("#updateStatusModal").modal("show");
        //   break;
        case "paginationchange":
          this.OrderSelected = [];
          this.OrderPageChange(this.pageChangeEvent);
          break;
        case "printall":
          this.printConfirmationYesClick();
          break;
        // default:
        //   break;
      }
    }
    //  else {
    //   if (this.OrderSelected.length > 1) {
    //     this.OrderSelected = [];
    //   }
    // }
  }

  onSendToPracticeClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select order for send to practice");
      return;
    } else {
      this.isPrintClick = false;
      $("#assignOrderModal").modal("show");
      this.writeLog("Send to practice is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.ReadyForPrinting;
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
      screen: "ReadyForBiotechPrintingOrders",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
}
