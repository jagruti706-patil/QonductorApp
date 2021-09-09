import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { SortDescriptor, orderBy, State } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import * as moment from "moment";
import { Observable } from "rxjs";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import {
  OrderReleaseDetails,
  ReleaseObj,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-practice-assigned",
  templateUrl: "./practice-assigned.component.html",
  styleUrls: ["./practice-assigned.component.css"],
})
export class PracticeAssignedComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  private subscription = new SubSink();
  exportFilename: string = "PracticeAssigned";
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  // @ViewChild("OrderAssignment")
  // private OrderAssignmentComponent: OrderAssignmentComponent;
  clsAuthLogs: AuthLogs;

  public OrderSort: SortDescriptor[] = [];
  public mode = "multiple";
  public selectableSettings: SelectableSettings;

  public OrderSelected: any = [];
  public hiddenColumns: string[] = [];

  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;
  vwExportButton = false;
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  totalElements: number = 0;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  loader: boolean = false;
  vwReleaseAssignment = false;
  @ViewChild("NoteModalComponent", { static: true })
  private NoteModalComponent: NoteModalComponent;

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
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
          this.vwReleaseAssignment = data.viewPracticeAssignedReleaseAssignment;
        }
      })
    );
    this.subscription.add(
      this.dataService.OrderUpdateDone.subscribe((data) => {
        if (data) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData();
        }
        //  else {
        //   this.OrderSelected = [];
        // }
        if (
          this.NoteModalComponent != null ||
          this.NoteModalComponent != undefined
        ) {
          this.NoteModalComponent.ResetComponents();
        }
      })
    );
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData();
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
            "PracticeAssigned",
            0, //login user id
            this.page,
            this.pagesize,
            16 //status of order
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
        this.RetriveMasterData();
      } else {
        this.confirmationTitle = "Confirmation";
        this.confirmationFrom = "paginationchange";
        this.InputStatusMessage =
          "Selection will be discarded. Do you want to continue?";
        this.pageChangeEvent = event;
        $("#releaseAssignmentModal").modal("show");
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
      screen: "PracticeAssigned",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
  }
  onReleaseAssignmentClick() {
    try {
      var LoginUsername = null;
      let currentDateTime = this.clsUtility.currentDateTime();
      var orderreleasedetails = new OrderReleaseDetails();
      for (const order of this.OrderSelected) {
        var reviewObj = new ReleaseObj();
        reviewObj.orderqueuegroupid = order.orderqueuegroupid;
        reviewObj.claimreferencenumber = order.claimreferencenumber;
        orderreleasedetails.reviewObj.push(reviewObj);
      }

      orderreleasedetails.assignedto = this.dataService.loginGCPUserID.getValue(); //to get alphaneumeric value
      if (this.dataService.loginUserName != undefined)
        LoginUsername = this.dataService.loginUserName;
      orderreleasedetails.assignedtoname = LoginUsername;
      orderreleasedetails.modifiedon = currentDateTime;
      orderreleasedetails.nstatus = 3; //send to incomplete
      orderreleasedetails.ordernote =
        "Practice Assigned Released by: " +
        LoginUsername +
        " on " +
        moment(currentDateTime).format("MM-DD-YYYY hh:mm:ss A");
      // console.log(orderreleasedetails);
      this.loader = true;
      this.subscription.add(
        this.coreService.releaseOrderAssignment(orderreleasedetails).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Encounter assignment released successfully"
              );
              this.writeLog(
                "Practice Assigned: Encounter assignment released successfully.",
                "UPDATE"
              );
              this.OrderSelected = [];
              this.lstFilter = this.dataService.SelectedFilter;
              this.RetriveMasterData();
            } else if (data == 2) {
              this.clsUtility.showInfo(
                "Encounter(s) skipped for release assignment due to status mismatch."
              );

              this.writeLog(
                "My Review: Encounter(s) skipped for release assignment due to status mismatch.",
                "UPDATE"
              );
              this.OrderSelected = [];
              this.lstFilter = this.dataService.SelectedFilter;
              this.RetriveMasterData();
            } else {
              this.clsUtility.showError(
                "Failed to release encounter assignment"
              );
              this.writeLog(
                "My Review: Failed to release encounter assignment.",
                "UPDATE"
              );
            }
            this.loader = false;
          },
          (error) => {
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  OutputStatusResult(evt: boolean) {
    try {
      if (evt) {
        switch (this.confirmationFrom.toLowerCase()) {
          case "releaseassignment":
            this.onReleaseAssignmentClick();
            break;
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
  onReleaseBtnClick() {
    try {
      if (this.OrderSelected.length <= 0) {
        this.clsUtility.showInfo("Select encounter to release assignment");
        return;
      } else {
        this.writeLog("Release Assignment is clicked.", "UPDATE");
        this.dataService.NoteCalledFrom.next(
          enumFilterCallingpage.PracticeAssigned
        );
        this.dataService.NoteWorkItemCount.next(0);
        this.dataService.NoteTitle.next("Release Assignment");
        this.dataService.ShowNoteCategory.next(false);
        this.dataService.ShowOrderStatus.next(false);
        this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  ngOnDestroy() {
    try {
      this.dataService.OrderUpdateDone.next(false);
      this.subscription.unsubscribe();
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
}
