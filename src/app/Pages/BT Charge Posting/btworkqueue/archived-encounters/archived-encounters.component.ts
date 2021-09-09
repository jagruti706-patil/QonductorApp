import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
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
import * as moment from "moment";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
// import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-archived-encounters",
  templateUrl: "./archived-encounters.component.html",
  styleUrls: ["./archived-encounters.component.css"],
})
export class ArchivedEncountersComponent implements OnInit, OnDestroy {
  // @ViewChild("NoteModalComponent")
  // private NoteModalComponent: NoteModalComponent;
  clsAuthLogs: AuthLogs;
  vwExportButton = false;
  exportFilename: string = "ArchivedEncounters";
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  private subscription = new SubSink();
  vwOsUpdateBtn = false;
  loader: boolean = false;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  InputEncounterSource: string = "";
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  public OrderSort: SortDescriptor[] = [];
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;

  public OrderSelected: any[] = [];
  public hiddenColumns: string[] = [];

  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;

  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  totalElements: number = 0;
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  // vwAddComment = false;
  vwReleaseArchived = false;

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
    this.clsAuthLogs = new AuthLogs(http);
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
    // this.subscription.add(
    //   this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
    //     if (doRefreshGrid) {
    //       this.OrderSelected = [];
    //       this.lstFilter = this.dataService.SelectedFilter;
    //       this.RetriveMasterData(this.pagesize, this.OrderSkip);
    //     }
    //   })
    // );
    this.exportFilename += moment().format("MMDDYYYY");
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwOsUpdateBtn = data.viewOsUpdateBtn;
          this.vwExportButton = data.viewExportGrid;
          this.vwReleaseArchived = data.viewReleaseArchived;
          // this.vwAddComment = data.viewAddComment;
        }
      })
    );

    // this.subscription.add(
    //   this.dataService.OrderUpdateDone.subscribe((data) => {
    //     if (data) {
    //       this.OrderSelected = [];
    //       this.dataService.SelectedFilter = this.lstFilter;
    //       this.RetriveMasterData(this.pagesize, this.OrderSkip);
    //     }
    //     if (
    //       this.NoteModalComponent != null ||
    //       this.NoteModalComponent != undefined
    //     ) {
    //       this.NoteModalComponent.ResetComponents();
    //     }
    //   })
    // );
  }

  RetriveMasterData() {
    try {
      this.OrderGridView = null;
      this.loadingOrderGrid = true;
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "ArchivedEncounters",
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
    this.ViewOrderDetailsComponent.showDocumentList = true;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.visibleButtons = false;
    this.ViewOrderDetailsComponent.calledFrom = "archivedencounters";
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
        $("#statusConfirmationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ApplyFilter($event) {
    this.OrderSelected = [];
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
        this.totalElements = 0;
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.lstFilter = this.dataService.SelectedFilter;
    }
  }

  exportToExcelLog() {
    this.writeLog("Export to excel clicked.", "DOWNLOAD");
  }

  // onUpdateOrderStatus() {
  //   if (this.OrderSelected.length <= 0) {
  //     this.clsUtility.showInfo("Select encounter(s) to update status");
  //     return;
  //   } else {
  //     this.writeLog("Update encounter status is clicked", "UPDATE");
  //     if (this.clsUtility.validateOrderSelected(this.OrderSelected) == true) {
  //       if (this.OrderSelected.length == 1) {
  //         this.InputEncounterSource = this.OrderSelected[0].encountersource;
  //         this.noteModalAssignment();
  //         $("#updateStatusModal").modal("show");
  //       } else {

  //         if (
  //           this.clsUtility.checkSelectedOrderType(this.OrderSelected) == false
  //         ) {
  //           this.clsUtility.showInfo(
  //             "Select encounters of same encounter type"
  //           );
  //           return;
  //         } else {
  //           this.InputEncounterSource = this.OrderSelected[0].encountersource;
  //           this.confirmationTitle = "Update Encounter Status Confirmation";
  //           this.confirmationFrom = "updateorderstatus";

  //           if (
  //             this.clsUtility.validateOtherOrderSelected(this.OrderSelected)
  //           ) {
  //             if (this.InputEncounterSource.toLowerCase() === "rcm encounter") {
  //               this.InputStatusMessage =
  //                 "Following encounter status will not be updated:<br><ul class='mb-1'><li><b>New</b></li><li><b>Assigned</b></li><li><b>Practice Assigned</b></li></ul>Are you sure you want to continue?";
  //             } else {
  //               this.InputStatusMessage =
  //                 "Following encounter status will not be updated:<br><ul><li><b>New</b></li><li><b>Assigned</b></li><li><b>Assigned Review</b></li></ul><b>Multiple encounter will not mark as incomplete.</b><br/>Are you sure you want to continue?";
  //             }
  //             $("#statusConfirmationModal").modal("show");
  //           } else {
  //             if (this.InputEncounterSource.toLowerCase() === "rcm encounter") {
  //               this.noteModalAssignment();
  //               $("#updateStatusModal").modal("show");
  //             } else {
  //               this.InputStatusMessage =
  //                 "<b>Multiple encounters will not mark as incomplete.</b><br/>Are you sure you want to continue?";
  //               $("#statusConfirmationModal").modal("show");
  //             }
  //           }
  //         }
  //       }
  //     } else {
  //       this.clsUtility.showInfo(
  //         "Selected encounter(s) status will not be updated."
  //       );
  //     }
  //   }
  // }
  // noteModalAssignment() {
  //   if (this.OrderSelected.length == 1) {
  //     this.NoteModalComponent.showTopSection = true;
  //     this.NoteModalComponent.getOrderStatus("-1", this.InputEncounterSource);
  //   } else {
  //     this.NoteModalComponent.showTopSection = false;
  //     this.NoteModalComponent.getOrderStatus("-2", this.InputEncounterSource);
  //   }
  //   this.dataService.NoteCalledFrom.next(
  //     enumFilterCallingpage.ArchivedEncounters
  //   );
  //   this.dataService.NoteTitle.next("Update Encounter Status");
  //   this.dataService.ShowNoteCategory.next(false);
  //   this.dataService.ShowOrderStatus.next(true);
  //   this.dataService.IncompleteOrderInfo.next(this.OrderSelected);
  //   this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
  // }
  OutputStatusResult(evt: boolean) {
    if (evt) {
      switch (this.confirmationFrom.toLowerCase()) {
        // case "updateorderstatus":
        //   this.noteModalAssignment();
        //   $("#updateStatusModal").modal("show");
        //   break;
        case "paginationchange":
          this.OrderSelected = [];
          this.OrderPageChange(this.pageChangeEvent);
          break;
        case "releasearchived":
          this.releaseArchived();
          break;
        default:
          break;
      }
    }
  }
  // @ViewChild("AddCommentComponent")
  // private AddCommentComponent: AddCommentComponent;
  // onAddCommentClicked(item) {
  //   try {
  //     this.AddCommentComponent.SelectedOrder = item;
  //     this.AddCommentComponent.isComment = true;
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  // outputCommentResult(event: boolean) {
  //   try {
  //     $("#viewAddComment").modal("hide");
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  // onCommentClose() {
  //   this.AddCommentComponent.clearCommentControls();
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
      screen: "OrderSearch",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  ngOnDestroy() {
    // this.dataService.OrderUpdateDone.next(false);
    this.subscription.unsubscribe();
  }
  onReleaseArchivedClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to release");
      return;
    } else {
      this.writeLog("Release archived is clicked.", "UPDATE");
      this.confirmationFrom = "releasearchived";
      this.confirmationTitle = "Release Confirmation";
      this.InputStatusMessage =
        "Do you want to release selected encounter(s) ?";
      $("#confirmationModal").modal("show");
    }
  }
  releaseArchived() {
    try {
      let inputJson = {
        modifiedon: this.clsUtility.currentDateTime(),
        orderqueueid: this.OrderSelected.map((ele) => ele.orderqueuegroupid),
        userid: this.dataService.loginGCPUserID.getValue(),
        username: this.dataService.loginUserName,
      };
      $("#confirmationModal").modal("hide");
      this.loader = true;
      this.subscription.add(
        this.coreService.releaseArchived(inputJson).subscribe(
          (data) => {
            this.loader = false;
            if (data == 1) {
              this.OrderSelected = [];
              this.clsUtility.showSuccess(
                "Encounter released from archived successfully"
              );
              this.lstFilter = this.dataService.SelectedFilter;
              this.RetriveMasterData();
            } else if (data == 0) {
              this.clsUtility.LogError("Error while released from archive");
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
}
