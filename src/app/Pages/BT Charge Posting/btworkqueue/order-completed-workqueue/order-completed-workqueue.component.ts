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
import { Utility } from "src/app/Model/utility";
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
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-order-completed-workqueue",
  templateUrl: "./order-completed-workqueue.component.html",
  styleUrls: ["./order-completed-workqueue.component.css"],
})
export class OrderCompletedWorkqueueComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  private totalRecords = 0;
  private subscription = new SubSink();
  showAssignOrder = false;
  exportFilename: string = "CompletedEncounters";
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;
  clsAuthLogs: AuthLogs;
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
    sort: this.sort,
  };

  public OrderSort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];

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
  lstFilter: InventoryInputModel = new InventoryInputModel();
  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;
  vwExportButton = false;
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  totalElements: number = 0;
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
    // this.lstFilter.orderyear = 2019;
    this.setSelectableSettings();
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
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
  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
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
          this.showAssignOrder = data.viewMyOrders;
          this.vwExportButton = data.viewExportGrid;
          this.vwAddComment = data.viewAddComment;
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

  // RetriveMasterData(recordCount: any, pageindex: any) {
  //   try {
  //     this.OrderGridView = null;
  //     this.loadingOrder = true;
  //     this.loadingOrderGrid = true;
  //     this.subscription.add(
  //       this.coreService.RetriveOrderQueue(2, recordCount, pageindex).subscribe(
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
            "OrderCompletedWorkqueue",
            0, //login user id
            this.page,
            this.pagesize,
            2 //status of order
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
    // this.ViewOrderDetailsComponent.fetchOrderDetails();
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = 2;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  onClickNext() {}
  onClickPrevious() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataService.doRefreshGrid.next(false);
  }

  // onAssignClick() {
  //   if (this.OrderSelected.length <= 0) {
  //     this.clsUtility.showInfo("Select order to assign");
  //     return;
  //   } else {
  //     this.OrderAssignmentComponent.selectedWorkGroup = this.OrderSelected;
  //     // console.log(this.OrderSelected);

  //     this.OrderAssignmentComponent.setworkqueueassignment();
  //   }
  // }              //remove???????
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

  ApplyFilter($event) {
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
    this.filterApplied = this.dataService.isOrderCompletedFilterApplied; //change
  }
  public allData = (): Observable<any> => {
    try {
      let lstFilter = this.dataService.SelectedFilter;
      if (this.totalElements != 0) {
        return this.filterService.exportData(
          lstFilter,
          0,
          this.totalElements,
          "ordercompletedorder"
        );
      } else {
        this.clsUtility.showInfo("No records available for export");
        return Observable.empty();
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  };
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
      screen: "CompletedOrders",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
  }
}
