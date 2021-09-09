import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import {
  SortDescriptor,
  orderBy,
  State,
  process,
} from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-practice-user-queue",
  templateUrl: "./practice-user-queue.component.html",
  styleUrls: ["./practice-user-queue.component.css"],
})
export class PracticeUserQueueComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  private subscription = new SubSink();
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  public sort: SortDescriptor[] = [
    {
      field: "dtassignedon",
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
  private clsUtility: Utility;
  public sFilters: any;

  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;
  public OrderSort: SortDescriptor[] = [
    {
      field: "dtassignedon",
      dir: "desc",
    },
  ];
  // Loading
  loadingOrder = false;
  loadingOrderGrid = false;
  loginuserid: string = "";
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private router: Router,
    private filterService: FilterService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.hideColumn("orderqueuegroupid");
    this.hideColumn("assignedid");
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
    this.subscription.add(
      this.dataService.doRefreshGrid.subscribe((doRefreshGrid) => {
        if (doRefreshGrid) {
          this.OrderSelected = [];
          this.lstFilter = this.dataService.SelectedFilter;
          this.RetriveMasterData(this.pagesize, this.OrderSkip);
        }
      })
    );
  }
  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "PracticeUserEncounter",
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
                    this.AssignedOrderPageChange({
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
    this.ViewOrderDetailsComponent.status = 1;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataService.doRefreshGrid.next(false);
  }
  loadingMytask = true;
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

  onWorkTask(AllTask) {
    try {
      if (this.OrderItems != null) {
        if (this.OrderItems.length == 0) {
          this.clsUtility.showInfo("No record available.");
          return;
        }
        this.dataService.showActionPane.next(true);
        if (this.OrderSelected.length == 0 && AllTask == 1) {
          this.clsUtility.showInfo("Select record to work");
          return;
        } else {
          if (AllTask == 0) {
            this.OrderSelected = this.OrderItems;
          }
          this.dataService.SelectedOrders = this.OrderSelected;
          this.router.navigate(["/OrderActionPane"]);
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AssignedOrderPageChange(event: PageChangeEvent): void {
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

  OutputStatusResult(evt: boolean) {
    if (evt) {
      switch (this.confirmationFrom.toLowerCase()) {
        case "paginationchange":
          this.OrderSelected = [];
          this.AssignedOrderPageChange(this.pageChangeEvent);
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

    if (Orderevent != null) {
      this.OrderGridData = Orderevent;
      if (this.OrderGridData["content"] != null) {
        this.OrderItems = this.OrderGridData["content"];
        this.OrderloadItems();
      } else {
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.loadingOrder = false;
      this.loadingOrderGrid = false;
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
