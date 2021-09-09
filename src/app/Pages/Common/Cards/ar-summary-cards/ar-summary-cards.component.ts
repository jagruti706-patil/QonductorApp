import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import {
  Filter,
  OutputClient,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility } from "src/app/Model/utility";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import {
  ARRespesentative,
  ManagerDashboard,
  TopStatus,
  TopAction,
  TopPayerByAR,
  TopClientByAR,
} from "src/app/Model/Dashboard/dashboard";
import { SubSink } from "../../../../../../node_modules/subsink";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";

@Component({
  selector: "app-ar-summary-cards",
  templateUrl: "./ar-summary-cards.component.html",
  styleUrls: ["./ar-summary-cards.component.css"],
})
export class ArSummaryCardsComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  constructor(
    private DataService: DataTransferService,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private filterService: FilterService,
    private masterservice: MasterdataService
  ) {
    this.clsUtility = new Utility();
    this.AR_RepDashboard = new ARRespesentative();
  }
  loginUserRoleID: number = 0;
  clsUtility: Utility;
  Clientid = 0;
  lstClients: OutputClient[];
  lstTopAction: any;
  lstTopPayer: any;
  agingbucket: any;
  lstTopClient: any;
  public View: any = [
    { text: "Default" },
    { text: "Productivity" },
    { text: "Quality" },
    { text: "Efficiency" },
    { text: "Risk" },
  ];
  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  public ViewDefaultValue = { text: "Default" };
  loginUserID: number;
  loadingDashboard = true;
  DropDownGroup = this.fb.group({
    fcClientName: ["", Validators.required],
    fcMasterStatus: ["", Validators.required],
  });
  get fbcClientName() {
    return this.DropDownGroup.get("fcClientName");
  }

  get fbcMasterStatus() {
    return this.DropDownGroup.get("fcMasterStatus");
  }

  AR_RepDashboard: ARRespesentative;
  AR_TodayAssignedTask: number;
  AR_TodayTotalAR: string;
  AR_PendingTask: number;
  AR_PendingTaskAR: string;
  AR_OverdueTask: number;
  AR_HighPriorityAR: string;

  ManagerDashboard: ManagerDashboard;
  MGR_WorkItem: number;
  MGR_TotalAR: string;
  MGR_Agents: number;
  MGR_UntouchWorkItem: number;
  MGR_AvgProd: number;
  MGR_PendingTask: number;
  MGR_ClosedAR: string;
  MGR_NegetiveWorkItemCount: number;
  MGR_OverdueTask: number;
  MGR_HighPriorityAR: string;
  MGR_bucket_1: string;
  MGR_bucket_2: string;
  MGR_bucket_3: string;
  MGR_bucket_4: string;
  MGR_bucket_5: string;
  MGR_bucket_6: string;
  MGR_bucket_7: string;
  MGR_TopStatus: TopStatus[];
  MGR_TopAction: TopAction[];
  MGR_TopPayerByAR: TopPayerByAR[];
  MGR_TopClientByAR: TopClientByAR[];

  ngOnInit() {
    this.loginUserRoleID = this.DataService.SelectedRoleid;
    // console.log(this.DataService.SelectedRoleid);
    this.subscription.add(
      this.DataService.loginUserID.subscribe((loginID) => {
        this.loginUserID = loginID;
      })
    );
    this.getClient(this.Clientid);
    // this.FillTopValue();
    this.formValueChanged();
    // this.SetDashboardCards();
  }
  SetDashboardCards(
    AR_Dashboard: ARRespesentative,
    ManagerDashboard: ManagerDashboard
  ) {
    // console.log(AR_Dashboard);

    if (AR_Dashboard != null) {
      this.AR_TodayAssignedTask = AR_Dashboard.opentodaystaskcount;
      this.AR_TodayTotalAR =
        AR_Dashboard.todaytotalar == null ? "$0" : AR_Dashboard.todaytotalar;
      this.AR_PendingTask = AR_Dashboard.openalltaskcount;
      this.AR_PendingTaskAR =
        AR_Dashboard.alltotalar == null ? "$0" : AR_Dashboard.alltotalar;
      this.AR_OverdueTask = AR_Dashboard.openduetaskcount;
      this.AR_HighPriorityAR =
        AR_Dashboard.highprioritytaskamt == null
          ? "$0"
          : AR_Dashboard.highprioritytaskamt;
    }
    // console.log(ManagerDashboard);

    if (ManagerDashboard) {
      this.MGR_WorkItem = ManagerDashboard.workitems;
      this.MGR_TotalAR =
        ManagerDashboard.totalar == null || ManagerDashboard.totalar == "0"
          ? "$0"
          : ManagerDashboard.totalar;
      this.MGR_Agents = ManagerDashboard.agents;
      this.MGR_UntouchWorkItem =
        ManagerDashboard.untouchworkitem == null ||
        ManagerDashboard.untouchworkitem == 0
          ? 0
          : ManagerDashboard.untouchworkitem;
      this.MGR_AvgProd =
        ManagerDashboard.averageproductivitywork == null ||
        ManagerDashboard.averageproductivitywork == 0
          ? 0
          : ManagerDashboard.averageproductivitywork;
      this.MGR_PendingTask = ManagerDashboard.pendingtask;
      this.MGR_ClosedAR =
        ManagerDashboard.closedar == null || ManagerDashboard.closedar == "0"
          ? "$0"
          : ManagerDashboard.closedar;
      this.MGR_NegetiveWorkItemCount =
        ManagerDashboard.negativeworkitem == null ||
        ManagerDashboard.negativeworkitem == 0
          ? 0
          : ManagerDashboard.negativeworkitem;
      this.MGR_OverdueTask = ManagerDashboard.openduetaskcount;
      this.MGR_HighPriorityAR =
        ManagerDashboard.highprioritytaskamt == null ||
        ManagerDashboard.highprioritytaskamt == "0"
          ? "$0"
          : ManagerDashboard.highprioritytaskamt;
      this.MGR_bucket_1 =
        ManagerDashboard.bucket_1 == null || ManagerDashboard.bucket_1 == "0"
          ? "$0"
          : ManagerDashboard.bucket_1;
      this.MGR_bucket_2 =
        ManagerDashboard.bucket_2 == null || ManagerDashboard.bucket_2 == "0"
          ? "$0"
          : ManagerDashboard.bucket_2;
      this.MGR_bucket_3 =
        ManagerDashboard.bucket_3 == null || ManagerDashboard.bucket_3 == "0"
          ? "$0"
          : ManagerDashboard.bucket_3;
      this.MGR_bucket_4 =
        ManagerDashboard.bucket_4 == null || ManagerDashboard.bucket_4 == "0"
          ? "$0"
          : ManagerDashboard.bucket_4;
      this.MGR_bucket_5 =
        ManagerDashboard.bucket_5 == null || ManagerDashboard.bucket_5 == "0"
          ? "$0"
          : ManagerDashboard.bucket_5;
      this.MGR_bucket_6 =
        ManagerDashboard.bucket_6 == null || ManagerDashboard.bucket_6 == "0"
          ? "$0"
          : ManagerDashboard.bucket_6;
      this.MGR_bucket_7 =
        ManagerDashboard.bucket_7 == null || ManagerDashboard.bucket_7 == "0"
          ? "$0"
          : ManagerDashboard.bucket_7;
      this.MGR_TopStatus = ManagerDashboard.arstatus;
      this.MGR_TopAction = ManagerDashboard.araction;
      this.MGR_TopPayerByAR = ManagerDashboard.payerbyar;
      this.MGR_TopClientByAR = ManagerDashboard.clientbyar;
    }

    this.loadingDashboard = false;
  }

  FillTopValue(): any {
    this.agingbucket = this.masterservice.getTopStatus();
    // this.lstTopAction = this.masterservice.getTopAction();
    // this.lstTopClient = this.masterservice.getTopClientByAR();
    // this.lstTopPayer = this.masterservice.getTopPayerByAR();
  }
  formValueChanged(): any {
    try {
      this.loadingDashboard = false;
      this.subscription.add(
        this.fbcClientName.valueChanges.subscribe((data: number) => {
          // console.log("RC: " + data);
          this.subscription.add(
            this.dashboardService
              .getManagerDashboardData(data, this.loginUserID)
              .subscribe((DashboardDetails) => {
                this.SetDashboardCards(null, DashboardDetails);
                // console.log(DashboardDetails);
              })
          );
        })
      );
      this.subscription.add(
        this.fbcMasterStatus.valueChanges.subscribe((data: number) => {
          console.log("RM: " + data);
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getClient(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe((data) => {
            AllFilterJSON = data;
            this.lstClients = AllFilterJSON.client;
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
