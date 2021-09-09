import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  DataStateChangeEvent,
  GridDataResult,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import {
  aggregateBy,
  AggregateResult,
  CompositeFilterDescriptor,
  orderBy,
  process,
  SortDescriptor,
  State,
} from "@progress/kendo-data-query";
import { AuthLogs } from "src/app/Model/Common/logs";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Router } from "@angular/router";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";

@Component({
  selector: "app-incomplete-encounter-summary",
  templateUrl: "./incomplete-encounter-summary.component.html",
  styleUrls: ["./incomplete-encounter-summary.component.css"],
})
export class IncompleteEncounterSummaryComponent implements OnInit {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  public skip = 0;
  public OrderPageSize = 10;
  public pagesize: number = 0;
  public page: number = 0;
  loadingOrderGrid = false;
  totalElements: number = 0;

  public state: State = {
    skip: 0,
    take: 300,
    filter: {
      logic: "and",
      filters: [
        // { field: "orderdate", operator: "eq", value: new Date() }
      ],
    },
    sort: [
      {
        field: "ordercount",
        dir: "desc",
      },
      {
        field: "clientname",
        dir: "asc",
      },
    ],
  };
  private subscription = new SubSink();
  private clsUtility: Utility;
  public hiddenColumns: string[] = [];
  clsAuthLogs: AuthLogs;
  vwExportButton = false;
  exportFilename: string = "IncompleteSummary";
  totalEncounterCount: number = 0;
  constructor(
    private toastr: ToastrService,
    private filterService: FilterService,
    private http: HttpClient,
    private router: Router,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.clsAuthLogs = new AuthLogs(http);
    // this.RetriveMasterData(this.pagesize, this.OrderSkip);
    // this.WorkgrouploadItems();
    this.hideColumn("clientid");
  }
  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;
    hiddenColumns.push(columnName);
  }

  ngOnInit() {
    this.RetriveMasterData(this.pagesize, this.OrderSkip);
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
        }
      })
    );
  }

  RetriveMasterData(recordCount: any, pageindex: any) {
    try {
      this.OrderGridView = null;
      this.loadingOrderGrid = true;
      // console.log(JSON.stringify(this.lstFilter));
      this.subscription.add(
        this.filterService
          .applyFilter(
            null,
            "IncompleteSummary",
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
                  this.OrderGridView = process(this.OrderItems, this.state);
                  this.totalEncounterCount = this.OrderGridData["totalcount"];
                  // this.OrderloadItems();
                } else {
                  this.totalElements = 0;
                  this.OrderGridView = null;
                  this.OrderItems = [];
                  this.totalEncounterCount = 0;
                  // below code is for if user select all orders from last page and assign selected then user will be redirected to 1st page
                  // let mod =
                  //   this.OrderGridData["totalelements"] %
                  //   this.clsUtility.pagesize;
                  // if (mod == 0 && this.OrderGridData["totalelements"] !== mod) {
                  //   this.OrderPageChange({
                  //     skip: 0,
                  //     take: this.clsUtility.pagesize,
                  //   });
                  // }
                }
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
  OrderSortChange(sort: SortDescriptor[]): void {
    if (this.OrderItems != null) {
      this.state.sort = sort;
      this.OrderGridView = process(this.OrderItems, this.state);
    }
  }
  // OrderloadItems() {
  //   try {
  //     if (this.OrderGridData != null) {
  //       this.OrderGridView = {
  //         data: orderBy(this.OrderItems, this.OrderSort),
  //         total: this.OrderGridData["totalelements"],
  //       };
  //       this.totalElements = this.OrderGridData["totalelements"];
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  OrderPageChange(event: PageChangeEvent): void {
    try {
      // if (this.OrderSelected.length == 0) {
      //   this.OrderGridView = null;
      //   this.OrderSkip = event.skip;
      //   this.page = event.skip / event.take;
      //   this.lstFilter = this.dataService.SelectedFilter;
      //   this.RetriveMasterData(this.pagesize, this.OrderSkip);
      // } else {
      //   this.confirmationTitle = "Confirmation";
      //   this.confirmationFrom = "paginationchange";
      //   this.InputStatusMessage =
      //     "Selection will be discarded. Do you want to continue?";
      //   this.pageChangeEvent = event;
      //   $("#confirmationModal").modal("show");
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  NavigatetoDetails(dataItem: any) {
    try {
      if (this.OrderItems != null) {
        if (this.OrderItems.length == 0) {
          this.clsUtility.showInfo("No encounter available.");
          return;
        }
        // this.dataService.SelectedOrders = this.OrderSelected;
        //   this.gserv.eventEmitter(
        //     "Work Selected Orders",
        //     "Work_selected_orders",
        //     "My_orders",
        //     "Orders selected to work",
        //     1
        //   );
        this.dataService.SummarySelectedPractice.next(dataItem.clientcode);
        this.router.navigate(["/OrderAssisted", dataItem.clientid]);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  gridFilter(state: DataStateChangeEvent) {
    try {
      // console.log(evt);
      this.state = state;
      if (state.filter != undefined && state.filter != null) {
        state.filter.filters.forEach((f) => {
          if (f["value"] != null) {
            f["value"] = f["value"].trim();
          }
        });
      }

      this.OrderGridView = process(this.OrderItems, this.state);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  exportToExcelLog() {
    this.writeLog("Export to excel is clicked.", "DOWNLOAD");
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
}
