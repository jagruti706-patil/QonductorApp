import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import {
  SortDescriptor,
  orderBy,
  State,
  process,
} from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { Navbarlinks } from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-my-review",
  templateUrl: "./my-review.component.html",
  styleUrls: ["./my-review.component.css"],
})
export class MyReviewComponent implements OnInit {
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
  lstFilter: InventoryInputModel = new InventoryInputModel();

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
      field: "dtassignedon",
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
  loginuserid: string = "";

  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;

  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  showmarkcompleted: boolean = false;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
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
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
    // this.lstFilter.orderyear= 2019;
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
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
  vwAddComment = false;
  ngOnInit() {
    //this.NoteModalComponent.ResetComponents();
    // this.NoteModalComponent.refreshgrid.subscribe(data => {
    //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // });
    var testnavlinks: Navbarlinks;
    this.dataService.navSubject.subscribe((data) => {
      if (data != null || data != undefined) {
        testnavlinks = data;
        // console.log("testnavlinks" + JSON.stringify(testnavlinks));
        this.vwUpdateEncounterStatus =
          testnavlinks.viewUpdateEntrStatusOnMyReview;
        this.vwMarkIncomplete = testnavlinks.viewMarkIncompleteOnMyReview;
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
  }

  // RetriveMasterData(recordCount: any, pageindex: any) {
  //   try {
  //     this.loadingOrderGrid = true;
  //     this.subscription.add(
  //       this.dataService.loginGCPUserID.subscribe((loginUser) => {
  //         this.loginuserid = loginUser;
  //       })
  //     );
  //     this.OrderGridView = null;
  //     this.subscription.add(
  //       this.coreService
  //         .RetriveUserActiveOrderQueue(
  //           this.loginuserid,
  //           6, //status for my review
  //           this.pagesize,
  //           this.page
  //         )
  //         .subscribe(
  //           (queue) => {
  //             this.loadingOrderGrid = false;
  //             if (queue != null) {
  //               this.OrderGridData = queue;
  //               if (this.OrderGridData["content"] != null) {
  //                 this.OrderItems = this.OrderGridData["content"];
  //                 this.OrderloadItems();
  //               } else {
  //                 this.OrderGridView = null;
  //                 this.OrderItems = [];
  //                 // below code is for if user select all orders from last page and assign selected then user will be redirected to 1st page
  //                 let mod =
  //                   this.OrderGridData["totalelements"] %
  //                   this.clsUtility.pagesize;
  //                 if (mod == 0 && this.OrderGridData["totalelements"] !== mod) {
  //                   this.OrderPageChange({
  //                     skip: 0,
  //                     take: this.clsUtility.pagesize,
  //                   });
  //                 }
  //               }
  //               this.loadingOrder = false;
  //             }
  //           },
  //           (err) => {
  //             this.loadingOrderGrid = false;
  //           }
  //         )
  //     );
  //   } catch (error) {}
  // }
  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      // console.log(JSON.stringify(this.lstFilter));
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "MyReview",
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
    this.ViewOrderDetailsComponent.status = 6;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.dataService.OrderReviewDone.next(false);
    this.dataService.ShowOrderStatus.next(false);
    this.subscription.unsubscribe();
  }

  onMarkComplete() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to update status");
      return;
    } else {
      this.writeLog("Update encounter status is clicked", "UPDATE");
      this.dataService.NoteCalledFrom.next(enumFilterCallingpage.MyReview);
      this.dataService.NoteWorkItemCount.next(this.OrderSelected.length);
      this.dataService.NoteTitle.next("Encounter Review");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(true);
      this.NoteModalComponent.selectedOrderReviewGroup = this.OrderSelected;
      this.NoteModalComponent.isMarkIncomplete = false;
      this.NoteModalComponent.getOrderStatus("6");
    }
    this.NoteModalComponent.refreshgrid.subscribe((data) => {
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData(this.pagesize, this.OrderSkip);
    });
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
      $("#revieworders").modal("show");
      this.writeLog("Mark Incomplete is clicked.", "UPDATE");
      this.dataService.NoteCalledFrom.next(enumFilterCallingpage.MyReview);
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
  // public dataStateChange(state: DataStateChangeEvent): void {
  //   debugger;

  //   this.state = state;
  //   console.log(this.state);
  //   this.OrderGridView = process(this.OrderItems, this.state);
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
      screen: "MyReview",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
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
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.loadingOrder = false;
      this.loadingOrderGrid = false;
      // this.OrderItems = queue;
      // this.OrderloadItems();
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
