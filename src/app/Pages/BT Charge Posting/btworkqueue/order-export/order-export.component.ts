import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { OrderDetailsComponent } from "../order-details/order-details.component";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import * as moment from "moment";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-order-export",
  templateUrl: "./order-export.component.html",
  styleUrls: ["./order-export.component.css"],
})
export class OrderExportComponent implements OnInit {
  public OrderSort: SortDescriptor[] = [];
  clsAuthLogs: AuthLogs;
  exportFilename: string = "EncounterExport";
  public OrderGridData: {};
  public OrderGridView: GridDataResult;
  private OrderItems: any[] = [];
  lstFilter: InventoryInputModel = new InventoryInputModel();
  loader: boolean = false;
  @ViewChild("OrderDetailsComponent", { static: true })
  private ViewOrderDetailsComponent: OrderDetailsComponent;
  public OrderSelected: any[] = [];
  public hiddenColumns: string[] = [];
  public page: number = 0;
  public pagesize: number = 0;
  private clsUtility: Utility;
  loadingOrderGrid = false;
  totalElements: number = 0;

  constructor(
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    this.clsAuthLogs = new AuthLogs(http);
    this.hideColumn("orderqueuegroupid");
  }

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;
    hiddenColumns.push(columnName);
  }

  ngOnInit() {
    this.exportFilename += moment().format("MMDDYYYY");
  }

  onOpenViewdetails(item: any) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = true;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.visibleButtons = false;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
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

  ApplyFilter($event) {
    this.OrderSelected = [];
    this.loadingOrderGrid = true;
    var Orderevent = $event;
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;

    if (Orderevent != null) {
      this.OrderGridData = Orderevent; // this.OrderItems = queue.content;
      if (this.OrderGridData["content"] != null) {
        this.OrderItems = this.OrderGridData["content"];
        this.OrderloadItems();
      } else {
        this.totalElements = 0;
        this.OrderGridView = null;
        this.OrderItems = [];
      }
      this.lstFilter = this.dataService.SelectedFilter;
      this.loadingOrderGrid = false;
    }
  }

  onOpenOrderHistory(item) {
    this.ViewOrderDetailsComponent.orderqueuegroupid = item.orderqueuegroupid;
    this.ViewOrderDetailsComponent.SelectedOrder = item;
    this.ViewOrderDetailsComponent.showDocumentList = false;
    this.ViewOrderDetailsComponent.status = item.nstatus;
    this.ViewOrderDetailsComponent.ShowOrderDetails();
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
      screen: "OrderExport",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  exportToExcelLog() {
    this.writeLog("Export to excel clicked.", "DOWNLOAD");
  }
}
