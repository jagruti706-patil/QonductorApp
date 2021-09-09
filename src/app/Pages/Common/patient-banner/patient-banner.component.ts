import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { SubSink } from "../../../../../node_modules/subsink";
import { Utility } from "src/app/Model/utility";
@Component({
  selector: "app-patient-banner",
  templateUrl: "./patient-banner.component.html",
  styleUrls: ["./patient-banner.component.css"],
})
export class PatientBannerComponent implements OnInit, OnDestroy {
  PatientDetails: any;
  private subscription = new SubSink();
  private clsUtility: Utility;
  constructor(private data: DataTransferService) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    this.subscription.add(
      this.data.SubSelectedTasksPatientInfo.subscribe((data) => {
        this.PatientDetails = data;
      })
    );
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
