import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import { SubSink } from "../../../../../node_modules/subsink";
import { Utility } from "src/app/Model/utility";
declare var $: any;

@Component({
  selector: "app-claim-banner",
  templateUrl: "./claim-banner.component.html",
  styleUrls: ["./claim-banner.component.css"],
})
export class ClaimBannerComponent implements OnInit, OnDestroy {
  clsUtility: Utility;
  claiminfo: any;
  Workqueuegroupid: any;
  isCallingWorkQueueby: boolean;
  isTaskViewDetails: boolean;
  CallingPage = "Claim-banner";
  private subscription = new SubSink();
  @ViewChild("ViewdetailsComponent")
  private ViewdetailsComponent: ViewdetailsComponent;

  constructor(private data: DataTransferService) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    this.isCallingWorkQueueby = this.data.isCallingWorkQueue;
    this.isTaskViewDetails = this.data.isTaskViewDetails;
    this.subscription.add(
      this.data.SubSelectedTasksClaimInfo.subscribe((data) => {
        this.claiminfo = data;
      })
    );
  }

  onOpenViewdetails() {
    $("#viewdetailsModal").modal("show");
    this.ViewdetailsComponent.CallingPage = "Claim-banner";
    // this.ViewdetailsComponent.Workqueuegroupid = this.data.SelectedTasksClaimInfo.workqueuegroupid;
    this.ViewdetailsComponent.Workqueuegroupid = this.data.SelectedTasksworkqueuegroupid;
    this.ViewdetailsComponent.setWorkQueueGroupDetails();
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
