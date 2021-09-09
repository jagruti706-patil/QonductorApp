import { Component, OnInit, ViewChild } from "@angular/core";
import { SubSink } from "subsink";
import {
  ARRespesentative,
  ManagerDashboard,
} from "src/app/Model/Dashboard/dashboard";
import { Utility } from "src/app/Model/utility";
import { ArSummaryCardsComponent } from "../../Cards/ar-summary-cards/ar-summary-cards.component";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import { ArCardsComponent } from "../../Cards/ar-cards/ar-cards.component";

@Component({
  selector: "app-practice-user",
  templateUrl: "./practice-user.component.html",
  styleUrls: ["./practice-user.component.css"],
})
export class PracticeUserComponent implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  @ViewChild("Client", { static: true })
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
                  // console.log(DashboardDetails);
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
