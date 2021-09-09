import { Component, OnInit, ViewChild } from "@angular/core";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Utility } from "src/app/Model/utility";
import { DashboardService } from "../../../Services/Common/dashboard.service";
import { ToastrService } from "ngx-toastr";
import { ArSummaryCardsComponent } from "src/app/Pages/Common/Cards/ar-summary-cards/ar-summary-cards.component";
import {
  ARRespesentative,
  ManagerDashboard,
} from "src/app/Model/Dashboard/dashboard";
import { SubSink } from "subsink";
import { ArCardsComponent } from "src/app/Pages/Common/Cards/ar-cards/ar-cards.component";

@Component({
  selector: "app-my-dashboard",
  templateUrl: "./my-dashboard.component.html",
  styleUrls: ["./my-dashboard.component.css"],
})
export class MyDashboardComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  @ViewChild("Home", { static: true })
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
            // console.log(DashboardDetails);
            if (this.dataService.IsShowManagerDashboard) {
              this.subscription.add(
                this.dashboardService
                  .getManagerDashboardData(this.clientID, this.loginUserID)
                  .subscribe((DashboardDetails) => {
                    this.clsManager = DashboardDetails;
                    this.ArSummaryCards.SetDashboardCards(
                      this.clsArResp,
                      this.clsManager
                    );
                    // console.log(DashboardDetails);
                    this.ArSummaryCards.loadingDashboard = false;
                  })
              );
            } else {
              this.ArSummaryCards.SetDashboardCards(this.clsArResp, null);
              this.ArSummaryCards.loadingDashboard = false;
            }
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
