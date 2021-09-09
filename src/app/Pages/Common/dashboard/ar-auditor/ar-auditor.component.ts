import { Component, OnInit, ViewChild } from "@angular/core";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { ArSummaryCardsComponent } from "../../Cards/ar-summary-cards/ar-summary-cards.component";
import {
  ARRespesentative,
  ManagerDashboard,
} from "src/app/Model/Dashboard/dashboard";
import { SubSink } from "subsink";
import { ArCardsComponent } from "../../Cards/ar-cards/ar-cards.component";

@Component({
  selector: "app-ar-auditor",
  templateUrl: "./ar-auditor.component.html",
  styleUrls: ["./ar-auditor.component.css"],
})
export class ArAuditorComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  @ViewChild("ARAuditorChild", { static: true })
  private ArSummaryCards: ArCardsComponent;
  clsUtility: Utility;
  clsArResp: ARRespesentative = null;
  clsManager: ManagerDashboard = null;
  loginUserID: number;
  clientID: number = 0;
  private subscription = new SubSink();
  ngOnInit() {
    try {
      this.subscription.add(
        this.dataService.loginUserID.subscribe((loginID) => {
          this.loginUserID = loginID;
        })
      );
      this.fetchDashboardDetails();
    } catch (error) {}
  }
  fetchDashboardDetails() {
    try {
      // this.ArSummaryCards.loadingDashboard = true;
      this.subscription.add(
        this.dashboardService
          .getARRepresentativeData(this.loginUserID)
          .subscribe((DashboardDetails) => {
            this.clsArResp = DashboardDetails;
            // console.log(this.dataService.IsShowManagerDashboard);
            if (this.dataService.IsShowManagerDashboard) {
              this.subscription.add(
                this.dashboardService
                  .getManagerDashboardData(this.clientID, this.loginUserID)
                  .subscribe((DashboardDetails) => {
                    // console.log(DashboardDetails);
                    this.clsManager = DashboardDetails;
                    // console.log(this.clsManager);
                    this.ArSummaryCards.SetDashboardCards(
                      this.clsArResp,
                      this.clsManager
                    );
                    this.ArSummaryCards.loadingDashboard = false;
                  })
              );
            } else {
              this.ArSummaryCards.SetDashboardCards(this.clsArResp, null);
              this.ArSummaryCards.loadingDashboard = false;
            }
            // console.log(this.clsManager);
          })
      );
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
