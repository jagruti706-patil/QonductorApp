import { Component, OnInit, OnDestroy } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreoperationService } from "src/app/Pages/Services/AR/coreoperation.service";
import {
  patientinfo,
  claiminfo,
  statusinfo,
} from "src/app/Model/AR Management/Workgroup/viewdetails";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "../../../../../node_modules/subsink";

@Component({
  selector: "app-viewdetails",
  templateUrl: "./viewdetails.component.html",
  styleUrls: ["./viewdetails.component.css"],
})
export class ViewdetailsComponent implements OnInit, OnDestroy {
  public IsWorkQueue = false;

  public ClaimlinesgridData: {};
  public ClaimlinesgridView: GridDataResult;
  private Claimlinesitems: any[] = [];

  public HistorygridData: {};
  public HistorygridView: GridDataResult;
  private Historyitems: any[] = [];

  clsWorkgroupdetails: any = null;
  InWorkqueuegroupid: string = "";

  public ViewDetailsData: any = null;
  lstpatientinfo: patientinfo[] = null;
  lstclaiminfo: claiminfo[] = null;
  lststatusinfo: statusinfo[] = null;

  private clsUtility: Utility;
  public Workqueuegroupid: string = "";
  public CallingPage: string = "";
  private subscription = new SubSink();
  public Claimlinessort: SortDescriptor[] = [
    {
      field: "dos",
      dir: "desc",
    },
  ];

  public Historysort: SortDescriptor[] = [
    {
      field: "date",
      dir: "desc",
    },
  ];

  constructor(
    private DataService: DataTransferService,
    private CoreService: CoreoperationService
  ) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    try {
      this.setWorkQueueGroupDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadClaimlinesitems(): void {
    try {
      this.ClaimlinesgridView = {
        data: orderBy(this.Claimlinesitems, this.Claimlinessort),
        total: this.Claimlinesitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortClaimlinesChange(sort: SortDescriptor[]): void {
    try {
      if (this.Claimlinesitems != null) {
        this.Claimlinessort = sort;
        this.loadClaimlinesitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadHistoryitems(): void {
    try {
      this.HistorygridView = {
        data: orderBy(this.Historyitems, this.Historysort),
        total: this.Historyitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortHistoryChange(sort: SortDescriptor[]): void {
    try {
      if (this.Historyitems != null) {
        this.Historysort = sort;
        this.loadHistoryitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getWorkgroupdetailsbyid() {
    try {
      if (
        this.CallingPage != null &&
        this.CallingPage != undefined &&
        this.CallingPage != ""
      ) {
        if (this.CallingPage.toLowerCase() == "workqueue") {
          this.clsWorkgroupdetails = {
            workQueueInfo: true,
            workQueueDetails: true,
            workQueueHistory: true,
          };
        } else if (this.CallingPage.toLowerCase() == "claim-banner") {
          this.clsWorkgroupdetails = {
            workQueueInfo: false,
            workQueueDetails: true,
            workQueueHistory: false,
          };
        }
      }

      if (
        this.InWorkqueuegroupid != null &&
        this.InWorkqueuegroupid != undefined &&
        this.InWorkqueuegroupid != "" &&
        this.clsWorkgroupdetails != null
      ) {
        const jsonworkqueue = JSON.stringify(this.clsWorkgroupdetails);
        this.subscription.add(
          this.CoreService.getViewDetailsbyId(
            this.InWorkqueuegroupid,
            jsonworkqueue
          ).subscribe((data: any = {}) => {
            if (data != null || data != undefined) {
              this.ViewDetailsData = data;

              if (this.ViewDetailsData.workQueueInfo != null) {
                this.lstpatientinfo = this.ViewDetailsData.workQueueInfo.patientinfo;
                this.lstclaiminfo = this.ViewDetailsData.workQueueInfo.claiminfo;
                this.lststatusinfo = this.ViewDetailsData.workQueueInfo.statusinfo;
                // this.DataService.SelectedTasksClaimInfo = this.ViewDetailsData.workQueueInfo.claiminfo;
                // this.DataService.SelectedTasksPatientInfo = this.ViewDetailsData.workQueueInfo.patientinfo;
                this.DataService.SubSelectedTasksClaimInfo.next(
                  this.ViewDetailsData.workQueueInfo.claiminfo
                );
                this.DataService.SubSelectedTasksPatientInfo.next(
                  this.ViewDetailsData.workQueueInfo.patientinfo
                );
                this.DataService.SubSelectedTasksStatusInfo.next(
                  this.ViewDetailsData.workQueueInfo.statusinfo
                );
              }
              if (this.ViewDetailsData.workQueueDetails != null) {
                this.Claimlinesitems = this.ViewDetailsData.workQueueDetails;
                this.loadClaimlinesitems();
              }
              if (this.ViewDetailsData.workQueueHistory != null) {
                this.Historyitems = this.ViewDetailsData.workQueueHistory;
                this.loadHistoryitems();
              }
              this.setDisplayWorkGroupQueueDetails();
            }
          })
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setWorkQueueGroupDetails() {
    try {
      if (
        this.Workqueuegroupid != null &&
        this.Workqueuegroupid != undefined &&
        this.Workqueuegroupid != "" &&
        this.CallingPage != null &&
        this.CallingPage != undefined &&
        this.CallingPage != ""
      ) {
        this.InWorkqueuegroupid = this.Workqueuegroupid;
        this.getWorkgroupdetailsbyid();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setDisplayWorkGroupQueueDetails() {
    try {
      if (this.CallingPage.toLowerCase() == "workqueue") {
        this.IsWorkQueue = true;
        this.DataService.isCallingWorkQueue = true;
      } else if (this.CallingPage.toLowerCase() == "claim-banner") {
        this.IsWorkQueue = false;
        this.DataService.isCallingWorkQueue = false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.Claimlinesitems = null;
      this.Historyitems = null;
      this.ClaimlinesgridView = null;
      this.HistorygridView = null;
      this.lstclaiminfo = null;
      this.lstpatientinfo = null;
      this.lststatusinfo = null;
      this.CallingPage = null;
      this.ViewDetailsData = null;
      this.Workqueuegroupid = null;
      this.DataService.isCallingWorkQueue = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
