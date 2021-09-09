import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { AddOrderSubStatusComponent } from "../add-order-sub-status/add-order-sub-status.component";
import { OrderSubStatusModel } from "src/app/Model/AR Management/Configuration/ordersubstatusmodel";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
declare var $: any;
@Component({
  selector: "app-order-sub-status",
  templateUrl: "./order-sub-status.component.html",
  styleUrls: ["./order-sub-status.component.css"],
})
export class OrderSubStatusComponent implements OnInit {
  public subStatusGridView: GridDataResult;
  clsUtility: Utility;
  public subStatusPageSize = 0;
  public subStatusSkip = 0;
  public subStatussort: SortDescriptor[] = [];
  private subStatusitems: any[] = [];
  loadingGrid: boolean = false;
  private subscription = new SubSink();
  public InputEditMessage: string;
  public InputDeleteMessage: string;
  public InputStatusMessage: string;
  public SelectedDataItem: string;
  deleteSubStatusid: number = 0;
  @ViewChild("AddSubstatusChild", { static: true })
  private AddSubstatusChild: AddOrderSubStatusComponent;

  constructor(
    private configurationService: ConfigurationService,
    private toaster: ToastrService,
    private objDataTransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toaster);
    this.subStatusPageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    this.getOrderSubStatusGrid("0");
  }
  getOrderSubStatusGrid(id: string) {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.configurationService.getOrderSubStatus(id).subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.subStatusitems = data;
            } else {
              this.subStatusitems = [];
              this.subStatusGridView = null;
            }
            this.loadSubStatusitems();
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
          }
        )
      );
    } catch (error) {
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  private loadSubStatusitems(): void {
    try {
      this.subStatusGridView = {
        data: orderBy(
          this.subStatusitems.slice(
            this.subStatusSkip,
            this.subStatusSkip + this.subStatusPageSize
          ),
          this.subStatussort
        ),
        total: this.subStatusitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  pageChangeSubStatus(event: PageChangeEvent): void {
    try {
      this.subStatusSkip = event.skip;
      this.loadSubStatusitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sortSubStatusChange(sort: SortDescriptor[]): void {
    try {
      if (sort) {
        this.subStatussort = sort;
        this.loadSubStatusitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddSubstatus() {
    try {
      this.AddSubstatusChild.resetComponents();
      this.AddSubstatusChild.isupdate = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  EditSubStatus({ sender, rowIndex, dataItem }) {
    try {
      this.AddSubstatusChild.resetComponents();
      this.AddSubstatusChild.isupdate = true;
      this.AddSubstatusChild.systemdefined = dataItem.systemdefined;
      this.AddSubstatusChild.subStatusDataItem = dataItem;
      this.AddSubstatusChild.getSubStatusById(dataItem.substatusid);
      this.InputEditMessage = "Do you want to edit encounter sub-status?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OnSubStatusStatus(dataItem: any, status: boolean) {
    try {
      this.SelectedDataItem = dataItem;
      if (status) {
        this.InputStatusMessage =
          "Encounter sub-status will be mark as active and it will available for futher use.<br> Do you want to continue?";
      } else {
        this.InputStatusMessage =
          "Encounter sub-status will be mark as inactive and it will not available for futher use.<br> Do you want to continue?";
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateSubStatusStatus(objsubstatus: OrderSubStatusModel) {
    try {
      this.configurationService.UpdateOrderSubStatus(objsubstatus).subscribe(
        (data) => {
          if (data == 1) {
            this.clsUtility.showSuccess("Status updated successfully");
            this.getOrderSubStatusGrid("0");
          } else {
            this.clsUtility.showError("Error while updating status");
          }
        },
        (error) => {
          this.clsUtility.showError(error);
        }
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  OutputEditResult(event: any) {
    try {
      if (event) {
        $("#addordersubstatusModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputStatusResult(event: any, dataItem: any) {
    try {
      // alert(event);
      // alert(JSON.stringify(dataItem));
      if (event && dataItem != undefined) {
        // $("#addordersubstatusModal").modal("show");
        let objsubstatus: OrderSubStatusModel = new OrderSubStatusModel();
        objsubstatus.isactive = !dataItem.isactive;
        objsubstatus.createdon = dataItem.createdon;
        objsubstatus.modifiedon = this.clsUtility.currentDateTime();
        objsubstatus.statusid = dataItem.statusid;
        objsubstatus.statusname = dataItem.statusname;
        objsubstatus.substatusdescription = dataItem.substatusdescription;
        objsubstatus.substatusname = dataItem.substatusname;
        objsubstatus.substatusid = dataItem.substatusid;
        objsubstatus.userid = this.objDataTransfer.SelectedUserid;
        objsubstatus.username = this.objDataTransfer.loginUserName;
        this.updateSubStatusStatus(objsubstatus);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputSubStatusEditResult(event: any) {
    try {
      if (event) {
        this.getOrderSubStatusGrid("0");
        this.AddSubstatusChild.resetComponents();
        $("#addordersubstatusModal").modal("hide");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
