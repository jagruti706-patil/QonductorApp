import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { ArSummaryCardsComponent } from "../../Cards/ar-summary-cards/ar-summary-cards.component";
import { SubSink } from "subsink";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import {
  ManagerDashboard,
  ARRespesentative,
} from "src/app/Model/Dashboard/dashboard";
import { ArCardsComponent } from "../../Cards/ar-cards/ar-cards.component";

@Component({
  selector: "app-sys-admin",
  templateUrl: "./sys-admin.component.html",
  styleUrls: ["./sys-admin.component.css"],
})
export class SysAdminComponent implements OnInit, OnDestroy {
  constructor(
    private dashboardService: DashboardService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  @ViewChild("SystemAdmin", { static: true })
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
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  fetchDashboardDetails() {
    try {
      this.ArSummaryCards.loadingDashboard = true;
      this.subscription.add(
        this.dashboardService
          .getARRepresentativeData(this.loginUserID)
          .subscribe((DashboardDetails) => {
            this.clsArResp = DashboardDetails;
            // this.ArSummaryCards.SetDashboardCards(this.clsArResp, null);
            // console.log("Agent Dashboard Details");
            // console.log(DashboardDetails);
            if (this.dataService.IsShowManagerDashboard) {
              this.subscription.add(
                this.dashboardService
                  .getManagerDashboardData(this.clientID, this.loginUserID)
                  .subscribe((DashboardDetails) => {
                    this.clsManager = DashboardDetails;
                    // console.log("Manager Dashboard Details");
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
