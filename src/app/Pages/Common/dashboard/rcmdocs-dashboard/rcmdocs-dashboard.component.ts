import { Component, OnInit, OnDestroy } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { FormBuilder, Validators } from "@angular/forms";
import {
  OutputClient,
  Filter,
  OutputFilter,
  InventoryInputModel,
  FliterClient,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { SubSink } from "subsink";
import * as moment from "moment";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { DashboardService } from "src/app/Pages/Services/Common/dashboard.service";
import {
  SortDescriptor,
  orderBy,
  GroupDescriptor,
  process,
  aggregateBy,
  AggregateResult,
  State,
} from "@progress/kendo-data-query";
import {
  GridDataResult,
  PageChangeEvent,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-rcmdocs-dashboard",
  templateUrl: "./rcmdocs-dashboard.component.html",
  styleUrls: ["./rcmdocs-dashboard.component.css"],
})
export class RCMDocsDashboardComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  currentDateTime: Date;
  loginUserRoleID: number = 0;
  clsUtility: Utility;
  Clientid = 0;
  lstClients: OutputClient[];
  AllLstClients: OutputClient[];
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
  public max: Date = new Date(
    moment.utc(this.currentDateTime).format("YYYY-MM-DD")
  );
  loginUserID: number;
  loadingDashboard = true;

  ClientFilterShow = true;
  ManagerCardShow = true;

  TotalDocs: number = 0;
  TotalAcknowledgeDocs: number = 0;
  TotalPendingAcknowledgeDocs: number = 0;
  CategoryDocsList: any = [];
  public RCMgridData: {};
  public RCMgridView: GridDataResult;
  private RCMitems: any[] = [];
  public RCMskip = 0;
  public RCMpageSize = 25;
  public RCMsort: SortDescriptor[] = [
    {
      field: "category",
      dir: "asc",
    },
    {
      field: "scandate",
      dir: "desc",
    },
  ];
  public aggregates: any[] = [
    { field: "category", aggregate: "count" },
    { field: "doccount", aggregate: "sum" },
    { field: "ackdocscount", aggregate: "sum" },
    { field: "pendingackdocscount", aggregate: "sum" },
  ];
  public RCMgroups: GroupDescriptor[] = [
    {
      field: "clientname",
      aggregates: [
        { field: "category", aggregate: "count" },
        { field: "doccount", aggregate: "sum" },
        { field: "ackdocscount", aggregate: "sum" },
        { field: "pendingackdocscount", aggregate: "sum" },
      ],
    },
  ];
  selectedClient = "0";
  selectedFromDate = moment(this.currentDateTime)
    .subtract(1, "day")
    .format("YYYY-MM-DD");
  selectedToDate = moment(this.currentDateTime).format("YYYY-MM-DD");
  RCMDOCSFilter = this.fb.group({
    fcClientName: ["", Validators.required],
    fcMasterStatus: ["", Validators.required],
    fcFromDate: [
      new Date(
        moment(this.currentDateTime).subtract(1, "day").format("YYYY-MM-DD")
      ),
      Validators.required,
    ],
    fcToDate: [
      new Date(moment(this.currentDateTime).format("YYYY-MM-DD")),
      Validators.required,
    ],
  });
  public rcmDocStatusCountsGridView: GridDataResult;
  public statusstate: State = {
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  totalrcmdocumentstatuswisecounts: any[] = [];

  // rcmStatusCountLoader: boolean;
  get fbcClientName() {
    return this.RCMDOCSFilter.get("fcClientName");
  }

  get fbcMasterStatus() {
    return this.RCMDOCSFilter.get("fcMasterStatus");
  }
  get fbcFromDate() {
    return this.RCMDOCSFilter.get("fcFromDate");
  }
  get fbcToDate() {
    return this.RCMDOCSFilter.get("fcToDate");
  }

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private dashboardService: DashboardService,
    private toaster: ToastrService
  ) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    try {
      this.getClient(this.Clientid);
      this.formValueChanged();
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
  validateFilter() {
    if (this.fbcFromDate.valid && this.fbcToDate.valid) {
      return true;
    } else {
      return false;
    }
  }
  btnApplyFilter_Click() {
    try {
      this.GetFilterData();
    } catch (error) {
      this.clsUtility.LogError(error);
      this.loadingDashboard = false;
    }
  }
  GetFilterData() {
    try {
      this.loadingDashboard = true;
      this.TotalDocs = 0;
      this.TotalAcknowledgeDocs = 0;
      this.TotalPendingAcknowledgeDocs = 0;
      this.CategoryDocsList = null;
      this.RCMgridView = null;
      this.RCMitems = [];
      this.RCMskip = 0;
      this.rcmDocStatusCountsGridView = null;
      this.totalrcmdocumentstatuswisecounts = [];
      this.statusstate.filter = {
        logic: "and",
        filters: [],
      };
      this.statusstate.sort = [];

      const SelectedClient = this.lstClients.find(
        (x) => x.nclientid === this.fbcClientName.value
      );
      var client = [];
      if (SelectedClient) {
        const filterclient = new FliterClient();
        filterclient.clientname = SelectedClient.clientcodename;
        filterclient.clientid = SelectedClient.nclientid;
        client.push(filterclient);
      } else {
        this.lstClients.forEach((ele) => {
          let filterclient = new FliterClient();
          filterclient.clientname = ele.clientcodename;
          filterclient.clientid = ele.nclientid;
          client.push(filterclient);
        });
      }
      let inputJson = {
        client: client,
        fromdate: this.selectedFromDate,
        todate: this.selectedToDate,
      };
      this.subscription.add(
        this.dashboardService.getRCMDocsDashboard(inputJson).subscribe(
          (RCMDashboard) => {
            // console.log(RCMDashboard);
            if (RCMDashboard != null || RCMDashboard != undefined) {
              this.TotalDocs = RCMDashboard.totaldocs;
              this.TotalAcknowledgeDocs = RCMDashboard.totalackdocscount;
              this.TotalPendingAcknowledgeDocs =
                RCMDashboard.totalpendingackdocscount;
              if (RCMDashboard.categorylist != null) {
                this.RCMitems = RCMDashboard.categorylist;
                this.loadRCMitems();
                this.loadingDashboard = false;
              } else {
                this.RCMgridView = null;
                this.RCMitems = [];
                this.loadingDashboard = false;
              }
              if (RCMDashboard.totalrcmdocumentstatuswisecounts) {
                this.totalrcmdocumentstatuswisecounts =
                  RCMDashboard.totalrcmdocumentstatuswisecounts;
                this.rcmDocStatusCountsGridView = process(
                  this.totalrcmdocumentstatuswisecounts,
                  this.statusstate
                );
              }
              this.loadingDashboard = false;
            }
          },
          (err) => {
            this.loadingDashboard = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadRCMitems(): void {
    try {
      this.RCMgridView = process(this.RCMitems, {
        skip: this.RCMskip,
        take: this.RCMpageSize,
        group: this.RCMgroups,
        sort: this.RCMsort,
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sortRCMChange(sort: SortDescriptor[]): void {
    try {
      if (this.RCMitems != null) {
        this.RCMsort = sort;
        this.loadRCMitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public RCMgroupChange(groups: GroupDescriptor[]): void {
    this.RCMgroups = groups;
    this.RCMgroups.map((group) => (group.aggregates = this.aggregates));
    this.loadRCMitems();
  }
  public pageChangeRCM(event: PageChangeEvent): void {
    try {
      this.RCMskip = event.skip;
      this.loadRCMitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ClearFilter() {
    try {
      this.fbcClientName.setValue(0);
      this.fbcFromDate.setValue(
        new Date(
          moment(this.currentDateTime).subtract(1, "day").format("YYYY-MM-DD")
        )
      );
      this.fbcToDate.setValue(
        new Date(moment(this.currentDateTime).format("YYYY-MM-DD"))
      );
      this.GetFilterData();
    } catch (error) {
      this.clsUtility.LogError(error);
      this.loadingDashboard = false;
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
      filterinput.servicecode = "ENTR";

      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe((data) => {
            AllFilterJSON = data;
            this.lstClients = AllFilterJSON.client;
            this.AllLstClients = AllFilterJSON.client;
            this.GetFilterData();
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.loadingDashboard = false;
      this.subscription.add(
        this.fbcClientName.valueChanges.subscribe((data: number) => {
          // console.log("fbcClientName: " + data);
          this.selectedClient = data.toString();
        })
      );

      this.subscription.add(
        this.fbcFromDate.valueChanges.subscribe((data: Date) => {
          // console.log("fbcFromDate: " + data);
          this.selectedFromDate = moment(data).format("YYYY-MM-DD").toString();
        })
      );
      this.subscription.add(
        this.fbcToDate.valueChanges.subscribe((data: Date) => {
          // console.log("fbcToDate: " + data);
          this.selectedToDate = moment(data).format("YYYY-MM-DD").toString();
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleClientFilter(searchkey: string) {
    try {
      if (this.AllLstClients) {
        this.lstClients = this.AllLstClients.filter(
          (ele) =>
            ele.clientcodename
              .toLowerCase()
              .includes(searchkey.toLowerCase()) == true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sumStatusCounts(fieldname: string): number {
    try {
      if (this.rcmDocStatusCountsGridView && fieldname) {
        let result: AggregateResult = aggregateBy(
          this.rcmDocStatusCountsGridView.data,
          [{ aggregate: "sum", field: fieldname }]
        );
        return result[fieldname] ? result[fieldname].sum : 0;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public statusDataStateChange(statusstate: DataStateChangeEvent): void {
    try {
      this.statusstate = statusstate;
      if (statusstate.filter != undefined && statusstate.filter != null) {
        statusstate.filter.filters.forEach((f) => {
          if (
            f["field"] == "documentname" ||
            f["field"] == "category" ||
            f["field"] == "scandate"
          ) {
            if (f["value"] != null) {
              f["value"] = f["value"].trim();
            }
          }
        });
      }
      this.rcmDocStatusCountsGridView = process(
        this.totalrcmdocumentstatuswisecounts,
        this.statusstate
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
