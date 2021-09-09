import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { OrderAssignmentComponent } from "../order-assignment/order-assignment.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { DatePipe } from "@angular/common";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import * as moment from "moment";
import { Observable } from "rxjs";
import "rxjs/add/observable/empty";
import { HttpClient } from "@angular/common/http";
import { AuthLogs } from "src/app/Model/Common/logs";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
@Component({
  selector: "app-order-workqueue",
  templateUrl: "./order-workqueue.component.html",
  styleUrls: ["./order-workqueue.component.css"],
})
//OrderWorkqueue
export class OrderWorkqueueComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public OrderPageSize = 10;
  private totalRecords = 0;
  private subscription = new SubSink();
  public filterApplied = false;
  showAssignOrder = false;
  clsAuthLogs: AuthLogs;
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;

  private Workqueuegroupid: string = "";
  private CallingPage: string = "WorkQueue";
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  @ViewChild("OrderAssignment")
  private OrderAssignmentComponent: OrderAssignmentComponent;

  public OrderSort: SortDescriptor[] = [
    // {
    //   field: "orderdate",
    //   dir: "desc"
    // }
  ];

  // public openedView = false;
  public openedAssign = false;
  public ClientDefaultValue = { id: 0, value: "All" };
  public PayerDefaultValue = { id: 0, value: "All" };
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;
  lstFilter: InventoryInputModel = new InventoryInputModel();
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
  vwExportButton = false;
  vwAddComment = false;
  ShowDeferWorkItem = false;
  exportFilename: string = "Encounters";
  // Loading
  loadingOrder = true;
  loadingOrderGrid = false;
  totalElements: number = 0;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;

  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private filterService: FilterService,
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.allData = this.allData.bind(this);
    this.clsAuthLogs = new AuthLogs(http);
    // this.lstFilter.startdate = null;
    // this.lstFilter.enddate = null;
    // this.lstFilter.orderyear= 2019;
    // this.setSelectableSettings();
    // this.subscription.add(this.dataService.orderDay.subscribe(
    //   data =>{
    //     this.lstFilter.orderday = data;
    //   }
    // ));
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
          this.vwExportButton = data.viewExportGrid;
          this.vwAddComment = data.viewAddComment;
        }
      })
    );
    // this.subscription.add(
    //   this.dataService.orderDay.subscribe(data => {
    //     if (data) {
    //       this.lstFilter.startdate = null;
    //       this.lstFilter.enddate = null;
    //       // this.lstFilter.orderyear = moment().year();
    //       // this.lstFilter.orderyear = 0;

    //       this.lstFilter.orderday = data;
    //       this.dataService.SelectedFilter = this.lstFilter;
    //       this.RetriveMasterData(this.pagesize, this.OrderSkip);
    //     }
    //   })
    // );
    this.subscription.add(
      this.dataService.defaultYearDay.subscribe((data) => {
        if (data) {
          this.lstFilter.startdate = null;
          this.lstFilter.enddate = null;
          // this.lstFilter.orderyear = moment().year();
          // this.lstFilter.orderyear = 0;

          this.lstFilter.orderday = data.folder;
          this.lstFilter.orderyear = data.cabinet;
          this.lstFilter.servicecode = "ENTR";
          this.dataService.SelectedFilter = this.lstFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
      })
    );
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.showAssignOrder = data.viewAssignOrder;
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
  }
  // RetriveMasterData(recordCount: any, pageindex: any) {
  //   try {
  //     this.OrderGridView = null;
  //     this.loadingOrder = true;
  //     this.loadingOrderGrid = true;
  //     this.subscription.add(
  //       this.coreService.RetriveOrderQueue(0, recordCount, pageindex).subscribe(
  //         queue => {
  //           if (queue != null) {
  //             this.OrderGridData = queue;
  //             if (this.OrderGridData["content"] != null) {
  //               this.OrderItems = this.OrderGridData["content"];
  //               this.OrderloadItems();
  //             } else {
  //               this.OrderGridView = null;
  //             }
  //           }
  //           this.loadingOrder = false;
  //           this.loadingOrderGrid = false;
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
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      // console.log(JSON.stringify(this.lstFilter));
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "OrderWorkqueue",
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
    this.filterApplied = this.dataService.isOrderWorkQueueFilterApplied; //change
  }
  onOpenViewdetails(item) {
    // $("#viewdetailsModal").modal('show');
    // this.ViewOrderDetailsComponent.CallingPage = "WorkQueue";

    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    // console.log(item.orderqueuegroupid);
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = 0;
    this.ViewOrderDetailsComponent.ShowOrderDetails();

    // this.ViewOrderDetailsComponent.fetchOrderDetails();
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataService.doRefreshGrid.next(false);
    this.dataService.orderAssignmentDone.next(false);
  }

  onAssignClick() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to assign");
      return;
    } else {
      this.writeLog("Assign Encounter is clicked.", "UPDATE");
      this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      this.OrderAssignmentComponent.orderAssignSource =
        enumOrderAssignSource.OrderInventory;
      this.OrderAssignmentComponent.orderAssignmentStatus = 1;
      // console.log(this.OrderSelected);
      this.OrderAssignmentComponent.setworkqueueassignment();
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
        $("#confirmationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // exportData(): Promise<any> {
  //   return this.filterService
  //     .applyFilter(
  //       JSON.stringify(this.lstFilter),
  //       "OrderWorkqueue",
  //       0, //login user id
  //       0,    //page index
  //       this.totalElements,
  //       0 //status of order
  //     ).toPromise();
  // }

  // public data = async (): Promise<any> => {
  //   let data = await this.exportData();
  //   console.log(data);
  //   return data.content;
  // }
  // onExcelExport(evt: any) {
  //   console.log(evt);
  //   this.allData = this.data;
  // }
  public allData = (): Observable<any> => {
    try {
      let lstFilter = this.dataService.SelectedFilter;
      if (this.totalElements != 0) {
        return this.filterService.exportData(
          lstFilter,
          0,
          this.totalElements,
          "orderworkqueue"
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
      screen: "OrderInventory",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
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
