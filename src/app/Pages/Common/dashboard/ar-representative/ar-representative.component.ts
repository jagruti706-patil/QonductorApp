import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { ArSummaryCardsComponent } from "../../Cards/ar-summary-cards/ar-summary-cards.component";
import { Utility } from "src/app/Model/utility";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import {
  ARRespesentative,
  ManagerDashboard,
} from "src/app/Model/Dashboard/dashboard";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "../../../../../../node_modules/subsink";
import { ToastrService } from "ngx-toastr";
import { ArCardsComponent } from "../../Cards/ar-cards/ar-cards.component";

@Component({
  selector: "app-ar-representative",
  templateUrl: "./ar-representative.component.html",
  styleUrls: ["./ar-representative.component.css"],
})
export class ArRepresentativeComponent implements OnInit, OnDestroy {
  constructor(
    private dashboardService: DashboardService,
    private dataService: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  @ViewChild("ARRepeChild", { static: true })
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
