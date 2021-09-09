import { Component, OnInit, OnDestroy } from "@angular/core";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { Utility } from "src/app/Model/utility";
import {
  ARRespesentative,
  ManagerDashboard,
  TopStatus,
  TopAction,
  TopPayerByAR,
  TopClientByAR,
} from "src/app/Model/Dashboard/dashboard";
import {
  OutputClient,
  Filter,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";

@Component({
  selector: "app-ar-cards",
  templateUrl: "./ar-cards.component.html",
  styleUrls: ["./ar-cards.component.css"],
})
export class ArCardsComponent implements OnInit, OnDestroy {
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
  AR_TodayAssignedTask: number = 0;
  AR_TodayTotalAR: string = "$ 0.00";
  AR_PendingTask: number = 0;
  AR_PendingTaskAR: string = "$ 0.00";
  AR_OverdueTask: number = 0;
  AR_HighPriorityAR: string = "$ 0.00";

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
  MGR_bucket_1_ClaimCount: number;
  MGR_bucket_2_ClaimCount: number;
  MGR_bucket_3_ClaimCount: number;
  MGR_bucket_4_ClaimCount: number;
  MGR_bucket_5_ClaimCount: number;
  MGR_bucket_6_ClaimCount: number;
  MGR_bucket_7_ClaimCount: number;
  MGR_deferbucket_1: string;
  MGR_deferbucket_2: string;
  MGR_deferbucket_3: string;
  MGR_deferbucket_4: string;
  MGR_deferbucket_5: string;
  MGR_deferbucket_6: string;
  MGR_deferbucket_7: string;
  MGR_deferbucket_1_ClaimCount: number;
  MGR_deferbucket_2_ClaimCount: number;
  MGR_deferbucket_3_ClaimCount: number;
  MGR_deferbucket_4_ClaimCount: number;
  MGR_deferbucket_5_ClaimCount: number;
  MGR_deferbucket_6_ClaimCount: number;
  MGR_deferbucket_7_ClaimCount: number;
  MGR_deferWorkItem: number;
  MGR_deferTotalAR: string;
  MGR_netWorkItem: number;
  MGR_netTotalAR: string;
  MGR_TopStatus: TopStatus[];
  MGR_TopAction: TopAction[];
  MGR_TopPayerByAR: TopPayerByAR[];
  MGR_TopClientByAR: TopClientByAR[];

  MyTaskCardShow = false;
  ClientFilterShow = false;
  ManagerCardShow = false;
  AgingBucketShow = false;
  StatusCardShow = false;

  ngOnInit() {
    this.subscription.add(
      this.DataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          // console.log("Data in ar-cards: ");
          // console.log(data);
          // console.log(
          //   "Data.dashboardAccess in ar-cards: " +
          //     JSON.stringify(data.dashboardAccess)
          // );
          if (data.dashboardAccess != undefined) {
            // console.log("data.dashboardAccess is not undefined. ");
            // console.log("data.dashboardAccess is not equal undefined. ");
            // console.log(data.dashboardAccess);
            this.MyTaskCardShow = data.dashboardAccess.MyTaskCardAccess;
            this.ClientFilterShow = data.dashboardAccess.ClientFilterAccess;
            this.ManagerCardShow = data.dashboardAccess.ManagerCardAccess;
            this.AgingBucketShow = data.dashboardAccess.AgingBucketAccess;
            this.StatusCardShow = data.dashboardAccess.StatusCardAccess;
          }

          if (
            this.ClientFilterShow === true ||
            this.ManagerCardShow === true ||
            this.AgingBucketShow === true ||
            this.StatusCardShow === true
          ) {
            this.DataService.IsShowManagerDashboard = true;
            console.log("IsShowDashboard = true ");
          } else {
            this.DataService.IsShowManagerDashboard = false;
            console.log("IsShowDashboard = false ");
          }
        }
      })
    );
    this.loginUserRoleID = this.DataService.SelectedRoleid;
    //  console.log(this.DataService.SelectedRoleid);     //saurabh shelar
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
    // console.log("AR_Dashboard");
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
    // console.log("ManagerDashboard");
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
      this.MGR_bucket_1_ClaimCount =
        ManagerDashboard.bucket_1_claimcount == null ||
        ManagerDashboard.bucket_1_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_1_claimcount;
      this.MGR_bucket_2 =
        ManagerDashboard.bucket_2 == null || ManagerDashboard.bucket_2 == "0"
          ? "$0"
          : ManagerDashboard.bucket_2;
      this.MGR_bucket_2_ClaimCount =
        ManagerDashboard.bucket_2_claimcount == null ||
        ManagerDashboard.bucket_2_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_2_claimcount;
      this.MGR_bucket_3 =
        ManagerDashboard.bucket_3 == null || ManagerDashboard.bucket_3 == "0"
          ? "$0"
          : ManagerDashboard.bucket_3;
      this.MGR_bucket_3_ClaimCount =
        ManagerDashboard.bucket_3_claimcount == null ||
        ManagerDashboard.bucket_3_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_3_claimcount;
      this.MGR_bucket_4 =
        ManagerDashboard.bucket_4 == null || ManagerDashboard.bucket_4 == "0"
          ? "$0"
          : ManagerDashboard.bucket_4;
      this.MGR_bucket_4_ClaimCount =
        ManagerDashboard.bucket_4_claimcount == null ||
        ManagerDashboard.bucket_4_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_4_claimcount;
      this.MGR_bucket_5 =
        ManagerDashboard.bucket_5 == null || ManagerDashboard.bucket_5 == "0"
          ? "$0"
          : ManagerDashboard.bucket_5;
      this.MGR_bucket_5_ClaimCount =
        ManagerDashboard.bucket_5_claimcount == null ||
        ManagerDashboard.bucket_5_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_5_claimcount;
      this.MGR_bucket_6 =
        ManagerDashboard.bucket_6 == null || ManagerDashboard.bucket_6 == "0"
          ? "$0"
          : ManagerDashboard.bucket_6;
      this.MGR_bucket_6_ClaimCount =
        ManagerDashboard.bucket_6_claimcount == null ||
        ManagerDashboard.bucket_6_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_6_claimcount;
      this.MGR_bucket_7 =
        ManagerDashboard.bucket_7 == null || ManagerDashboard.bucket_7 == "0"
          ? "$0"
          : ManagerDashboard.bucket_7;
      this.MGR_bucket_7_ClaimCount =
        ManagerDashboard.bucket_7_claimcount == null ||
        ManagerDashboard.bucket_7_claimcount == 0
          ? 0
          : ManagerDashboard.bucket_7_claimcount;
      this.MGR_deferbucket_1 =
        ManagerDashboard.deferbucket_1 == null ||
        ManagerDashboard.deferbucket_1 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_1;
      this.MGR_deferbucket_2 =
        ManagerDashboard.deferbucket_2 == null ||
        ManagerDashboard.deferbucket_2 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_2;
      this.MGR_deferbucket_3 =
        ManagerDashboard.deferbucket_3 == null ||
        ManagerDashboard.deferbucket_3 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_3;
      this.MGR_deferbucket_4 =
        ManagerDashboard.deferbucket_4 == null ||
        ManagerDashboard.deferbucket_4 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_4;
      this.MGR_deferbucket_5 =
        ManagerDashboard.deferbucket_5 == null ||
        ManagerDashboard.deferbucket_5 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_5;
      this.MGR_deferbucket_6 =
        ManagerDashboard.deferbucket_6 == null ||
        ManagerDashboard.deferbucket_6 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_6;
      this.MGR_deferbucket_7 =
        ManagerDashboard.deferbucket_7 == null ||
        ManagerDashboard.deferbucket_7 == "0"
          ? "$0"
          : ManagerDashboard.deferbucket_7;

      this.MGR_deferbucket_1_ClaimCount =
        ManagerDashboard.deferbucket_1_claimcount == null ||
        ManagerDashboard.deferbucket_1_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_1_claimcount;
      this.MGR_deferbucket_2_ClaimCount =
        ManagerDashboard.deferbucket_2_claimcount == null ||
        ManagerDashboard.deferbucket_2_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_2_claimcount;
      this.MGR_deferbucket_3_ClaimCount =
        ManagerDashboard.deferbucket_3_claimcount == null ||
        ManagerDashboard.deferbucket_3_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_3_claimcount;
      this.MGR_deferbucket_4_ClaimCount =
        ManagerDashboard.deferbucket_4_claimcount == null ||
        ManagerDashboard.deferbucket_4_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_4_claimcount;
      this.MGR_deferbucket_5_ClaimCount =
        ManagerDashboard.deferbucket_5_claimcount == null ||
        ManagerDashboard.deferbucket_5_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_5_claimcount;
      this.MGR_deferbucket_6_ClaimCount =
        ManagerDashboard.deferbucket_6_claimcount == null ||
        ManagerDashboard.deferbucket_6_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_6_claimcount;
      this.MGR_deferbucket_7_ClaimCount =
        ManagerDashboard.deferbucket_7_claimcount == null ||
        ManagerDashboard.deferbucket_7_claimcount == 0
          ? 0
          : ManagerDashboard.deferbucket_7_claimcount;
      this.MGR_TopStatus = ManagerDashboard.arstatus;
      this.MGR_TopAction = ManagerDashboard.araction;
      this.MGR_TopPayerByAR = ManagerDashboard.payerbyar;
      this.MGR_TopClientByAR = ManagerDashboard.clientbyar;
      this.MGR_deferWorkItem = ManagerDashboard.deferworkitems;
      this.MGR_deferTotalAR =
        ManagerDashboard.defertotalar == null ||
        ManagerDashboard.defertotalar == "0"
          ? "$0"
          : ManagerDashboard.defertotalar;
      this.MGR_netWorkItem = ManagerDashboard.networkitems;
      this.MGR_netTotalAR =
        ManagerDashboard.nettotalar == null ||
        ManagerDashboard.nettotalar == "0"
          ? "$0"
          : ManagerDashboard.nettotalar;
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
          // console.log("RM: " + data);
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
