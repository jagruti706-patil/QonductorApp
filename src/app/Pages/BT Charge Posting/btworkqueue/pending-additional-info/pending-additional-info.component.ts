import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility } from "src/app/Model/utility";
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
import { OrderSearchStatusModel } from "src/app/Model/BT Charge Posting/Order/order-note";
declare var $: any;

@Component({
  selector: "app-pending-additional-info",
  templateUrl: "./pending-additional-info.component.html",
  styleUrls: ["./pending-additional-info.component.css"],
})
export class PendingAdditionalInfoComponent implements OnInit, OnDestroy {
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  public OrderSkip = 0;
  private subscription = new SubSink();
  clsAuthLogs: AuthLogs;
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  public OrderSort: SortDescriptor[] = [];
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  public OrderSelected: any = [];
  public hiddenColumns: string[] = [];
  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;
  vwExportButton = false;
  exportFilename: string = "PendingForAdditionalInformation";
  // Loading
  loadingOrder = true;
  loadingOrderGrid = false;
  totalElements: number = 0;
  InputStatusMessage: string = "";
  confirmationTitle: string = "";
  confirmationFrom: string = "";
  pageChangeEvent: PageChangeEvent;

  constructor(
    private toastr: ToastrService,
    private filterService: FilterService,
    private dataService: DataTransferService,
    private http: HttpClient,
    private coreops: CoreOperationService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.clsAuthLogs = new AuthLogs(http);
    this.hideColumn("orderqueuegroupid");
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
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
          this.RetriveMasterData();
        }
      })
    );
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
        }
      })
    );
    // this.subscription.add(
    //   this.dataService.defaultYearDay.subscribe(data => {
    //     if (data) {
    //       this.lstFilter.startdate = null;
    //       this.lstFilter.enddate = null;
    //       this.lstFilter.orderday = data.folder;
    //       this.lstFilter.orderyear = data.cabinet;
    //       this.lstFilter.servicecode = "ENTR";
    //       this.dataService.SelectedFilter = this.lstFilter;
    //       this.RetriveMasterData();
    //     }
    //   })
    // );
  }
  RetriveMasterData() {
    try {
      this.loadingOrderGrid = true;
      this.OrderGridView = null;
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "PendingAdditionalInfo",
            0, //login user id
            this.page,
            this.pagesize,
            -1 //status of order
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
      this.loadingOrder = false;
      this.loadingOrderGrid = false;
    }
  }
  onOpenViewdetails(item) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.status = -1;
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
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dataService.doRefreshGrid.next(false);
    this.dataService.orderAssignmentDone.next(false);
  }

  onDocumentReceived() {
    if (this.OrderSelected.length <= 0) {
      this.clsUtility.showInfo("Select encounter to mark as document received");
      return;
    } else {
      this.writeLog("Document Received is clicked.", "UPDATE");
      this.confirmationFrom = "documentreceived";
      this.confirmationTitle = "Confirmation";
      this.InputStatusMessage = "Do you want to bill selected encounter(s) ?";
      $("#confirmationModal").modal("show");
      // this.OrderAssignmentComponent.selectedOrders = this.OrderSelected;
      // this.OrderAssignmentComponent.orderAssignSource =
      //   enumOrderAssignSource.OrderInventory;
      // this.OrderAssignmentComponent.orderAssignmentStatus = 1;
      // // console.log(this.OrderSelected);
      // this.OrderAssignmentComponent.setworkqueueassignment();
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
        $("#confirmationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
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
      screen: "PendingForAdditionalInformation",
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
        case "documentreceived":
          var jsonArray: OrderSearchStatusModel[] = [];
          for (let i = 0; i < this.OrderSelected.length; i++) {
            var json = new OrderSearchStatusModel();
            json.currentStatus = this.OrderSelected[i].nstatus;
            json.orderqueuegroupid = this.OrderSelected[i].orderqueuegroupid;
            json.assignedto = this.dataService.loginGCPUserID.getValue(); //to get alphaneumeric value
            if (this.dataService.loginUserName != undefined)
              var LoginUsername = this.dataService.loginUserName;
            json.assignedtoname = LoginUsername;
            json.modifiedon = this.clsUtility.currentDateTime();
            json.nstatus = 0;
            json.ordersubstatus = "";
            json.ordersubstatusname = "";
            json.incompleteorderinfo = null;
            json.ordernote = "Document Received";
            jsonArray.push(json);
          }
          this.markAsNew(jsonArray);
          break;
      }
    }
  }
  async markAsNew(jsonArray: OrderSearchStatusModel[]) {
    try {
      this.loadingOrderGrid = true;
      let successcount: number = 0;
      let errorcount: number = 0;
      for (let i = 0; i < jsonArray.length; i++) {
        await this.coreops
          .UpdateOrderSearchStatus(jsonArray[i])
          .toPromise()
          .then(
            (data) => {
              successcount++;
            },
            (error) => {
              errorcount++;
              // this.clsUtility.LogError(error);
            }
          );
      }
      this.loadingOrderGrid = false;
      this.OrderSelected = [];
      this.lstFilter = this.dataService.SelectedFilter;
      this.RetriveMasterData();
      if (errorcount == 0)
        this.clsUtility.showSuccess("Encounter status updated successfully");
      else {
        this.clsUtility.showInfo(
          "Successfully updated " +
            successcount +
            "encounter status & Failed to update " +
            errorcount +
            " encounter status."
        );
      }
    } catch (error) {
      this.loadingOrderGrid = false;
      this.clsUtility.LogError(error);
    }
  }
}
