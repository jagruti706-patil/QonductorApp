import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { DataTransferService } from "../../../../Services/Common/data-transfer.service";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";

@Component({
  selector: "app-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.css"],
})
export class ReportComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
  }
  clsUtility: Utility;
  private subscription = new SubSink();
  ShowFiles = false;
  ShowProductionReport = false;
  ShowAutomationAccuracyReport = false;

  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          // console.log("Data in ar-cards: " + JSON.stringify(data));
          // console.log(
          //   "Data.dashboardAccess in ar-cards: " +
          //     JSON.stringify(data.dashboardAccess)
          // );
          if (data.reportAccess != undefined) {
            // console.log("data.dashboardAccess is not undefined. ");
            this.ShowFiles = data.reportAccess.FileReport;
            this.ShowProductionReport = data.reportAccess.ProductionReport;
            this.ShowAutomationAccuracyReport =
              data.reportAccess.AutomationReport;
          }
        }
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
