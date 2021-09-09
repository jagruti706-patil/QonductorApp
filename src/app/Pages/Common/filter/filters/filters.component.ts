import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import {
  Filter,
  FliterClient,
  FilterPayer,
  FilterAgent,
  InventoryInputModel,
  OutputClient,
  OutputInsurance,
  OutputBucket,
  OutputAutomationstatus,
  OutputBillingproviders,
  OutputRenderingproviders,
  OutputFilter,
  OutputAgent,
  OutputDeferCategory,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { SubSink } from "../../../../../../node_modules/subsink";
import * as moment from "moment";
import {
  GetFolders,
  GetCategory,
  FolderCategoryAndYearModel,
  GetProviderList,
  SubStatus,
  InsuranceCompanyName,
} from "src/app/Model/AR Management/Configuration/cabinet";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
import {
  GenericSearchModel,
  OrderDefaultYearDay,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import "rxjs/add/observable/of";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent implements OnInit, OnDestroy, AfterViewInit {
  // same data i.e. YesNoDropdown for hl7 and client billing dropdown
  YesNoDropdown: Array<any> = [
    {
      text: "All",
      value: -1,
    },
    {
      text: "Yes",
      value: 1,
    },
    {
      text: "No",
      value: 0,
    },
  ];
  folders: GetFolders[];
  allFolders: GetFolders[];
  categories: GetCategory[];
  allCategories: GetCategory[];
  providersList: GetProviderList[];
  allProvidersList: GetProviderList[];
  private subscription = new SubSink();
  defaultFolderName: string = "";
  orderType: string;
  loginUser: number = 0;
  GroupUsers: any;
  AllGroupUsers: any;
  loginUserGroup: any;
  allLoginUserGroup: any;
  // public groupDefault = { groupid: 0, groupname: "Select" };
  // public defaulta = { userid: 0, displayname: "Select" };
  loadingData: boolean;
  sourceOrderStatus: any;
  orderStatus: any[] = [];
  orderInsurance: InsuranceCompanyName[] = [];
  allOrderInsurance: InsuranceCompanyName[] = [];
  subStatusItems: SubStatus[] = [];
  AllLstEncounterClients: any[] = [];
  encounter: any[] = [];
  assignmentTypes: any[] = [
    {
      displayname: "Group",
      assignmenttype: 1,
    },
    {
      displayname: "Individual",
      assignmenttype: 0,
    },
  ];
  searchField: string;
  practiceFilterLoader: boolean;
  providerFilterLoader: boolean;
  insuranceFilterLoader: boolean;
  useDropdownFilter: boolean;
  // ddPracticeLoader: boolean;
  // archivalLoader: boolean;
  isarchived: boolean;
  // showArchivalSwitch: boolean;

  constructor(
    private filterService: FilterService,
    private dataService: DataTransferService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private authService: CoreauthService,
    private masterService: MasterdataService,
    private coreService: CoreOperationService,
    private toaster: ToastrService,
    private configurationService: ConfigurationService,
    private router: Router
  ) {
    this.clsUtility = new Utility(toaster);
    this.subscription.add(
      this.dataService.loginUserID.subscribe((loginUser) => {
        this.loginUser = loginUser;
      })
    );
  }

  clsUtility: Utility;
  years: any = [
    // {
    //   year: moment()
    //     .add(1, "year")
    //     .year()
    // },
    // {
    //   year: moment()
    //     .add(2, "year")
    //     .year()
    // },
    // {
    //   year: moment()
    //     .add(3, "year")
    //     .year()
    // }
  ];

  lstClients: OutputClient[];
  lstPayers: OutputInsurance[];
  lstAgents: OutputAgent[];
  lstAgeBucket: OutputBucket[];
  AutomationStatus: OutputAutomationstatus[];
  WorkitemStatus: any;
  Providers: OutputBillingproviders[];
  RenderingProviders: OutputRenderingproviders[];
  CPTGroups: any;
  loadingGrid = false;

  DeferCategory: OutputDeferCategory[];
  FileStatus: any = [
    // { id: -1, displayname: "All" },
    { id: 1, displayname: "Processed" },
    { id: 0, displayname: "Unprocessed" },
  ];
  lstPriority: any = [
    { id: 1, displayname: "High" },
    { id: 2, displayname: "Medium" },
    { id: 3, displayname: "Low" },
  ];

  lstFollowup: any = [
    { id: 1, displayname: "This Week" },
    { id: 2, displayname: "This Month" },
    { id: 3, displayname: "No Followup Date" },
    { id: 4, displayname: "Yesterday" },
    { id: 5, displayname: "Last Week" },
    { id: 6, displayname: "Last Month" },
    { id: 7, displayname: "All" },
  ];
  // OrderWorkqueueStatus: any = [
  //   { id: 1, displayname: "Assign" },
  //   { id: 2, displayname: "Completed" },
  //   { id: 3, displayname: "Assistance" },
  //   { id: 4, displayname: "Review" },
  //   { id: 5, displayname: "Void" }
  // ];
  AccuracyStatus: any = [
    //saurabh shelar

    //{id:0,  displayname:"All"},
    { value: "Yes", displayname: "Match" },
    { value: "No", displayname: "Not Match" },
    { value: "N/A", displayname: "N/A" },
  ];

  filterData: any;
  lstEncounterClients: any = [];
  allLstPractice: any[] = [];
  lstPractice: any[] = [];
  FilterJSON: Filter; //Input for filter json
  AllFilterJSON: OutputFilter; //Output of filter json
  bIsShowWorkQueueFilter = false;
  bIsShowDeferWorkQueueFilter = false;
  bIsShowTaskFilter = false;
  bIsShowProductionFilter = false;
  bIsShowFileFilter = false;
  bIsShowAutomationAccuracyFilter = false; //saurabh shelar
  bIsShowOrderTab = false;
  bIsShowForDocumentSearch = false;
  bIsShowForIncompleteOrders = false;
  bIsShowGroupUserStatusFilter = false;
  bIsShowStatusFilter = false;
  bIsShowGroupUserFilter = false;
  bIsShowForuploadedOrders = false;
  bIsShowForCompletedOrders = false;
  bIsShowForOrderReview = false;
  bIsShowForOrderAssistance = false;
  bIsShowOrderExport = false;
  bIsShowForMyEncounters = false;
  bIsShowForMyReview = false;
  bIsShowForDocumentCount = false;
  bIsShowPendingForAdditionalInfo = false;
  bIsShowAdvanceSearchOrder = false;
  bIsShowForPracticeCompleted = false;
  bIsShowForPracticeAssigned = false;
  bIsShowForPracticeUserEncounter = false;
  bIsShowForPracticeAssistanceCompleted = false;
  bIsShowArchivedEncounters = false;
  bIsShowForEncounters = false;

  public StartDate: Date = new Date();
  public EndDate: Date = new Date();
  public bisWorkitemstatusassigned: boolean = false;
  public bisARRepresentative: boolean = false;
  //public firstclick: boolean = true;
  // private subscription = new SubSink();

  @Input() CallingPage: string;
  @Output() FilterData = new EventEmitter<Workgroup[]>();

  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  public PayerDefaultValue = { companyid: "0", companyname: "All" };
  public AgeBucketDefaultValue = { bucket: "All" };
  public AutomationstatusDefaultValue = { sautomationstatus: "All" };
  public AgentDefaultValue = { agentid: 0, agentname: "All" };
  public BillingproviderDefaultValue = { providerid: 0, providername: "All" };
  public RenderingproviderDefaultValue = { providerid: 0, providername: "All" };
  public default = { id: 0, value: "All" };
  public PriorityDefaultValue = { id: 0, displayname: "All" };
  public FollowupDefaultValue = { id: 0, displayname: "Today" };
  public FileDefaultValue = { id: -1, displayname: "All" };
  public AccuracyDefaultValue = { value: "", displayname: "All" }; //saurabh shelar

  public DeferCategoryDefaultValue = { sdefercategory: "All" };
  // public defaultYear = {
  //   // year: moment().year()
  // };
  public categoryDefaultValue = { categoryname: "All" };
  public folderDefaultValue = { foldername: "All" };
  public yearDefaultValue = { year: "All" };
  public providerDefaultValue = { npi: "0", providername: "All" };
  public ordergroupDefaultValue = { groupid: "", groupname: "All" };
  public orderuserDefaultValue = { userid: "", displayname: "All" }; //saurabh shelar
  public OrderWorkQueueDefaultValue = { statuscode: 0, status: "All" };
  public subStatusDefaultValue = { substatusid: "", substatusname: "All" };
  public insuranceDefaultValue = { insurancecompanyname: "All" };
  public EncounterClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  public PracticeDefaultValue = { clientid: "0", client: "All" };
  public EncounterSourceDefaultValue = { encountertype: "All" };
  public AssignmentTypeDefaultValue = {
    displayname: "All",
    assignmenttype: -1,
  };
  lstFilter: InventoryInputModel = new InventoryInputModel();

  FilterFormGroup = this.fb.group({
    fcFilterClient: [""],
    fcFilterInsurance: [""],
    fcFilterClaimAge: [""],
    fcFilterAutomationStatus: [""],
    fcFilterLastWorkedAge: [30],
    fcFilterInsurnaceDue: [0],
    fcFilterWorkItemStatus: [2],
    fcFilterProvider: [""],
    fcFilterRenderingProvider: [""],
    fcFilterCPTGroup: [""],
    fcFilterAgent: [""],
    fcFilterStartDate: [new Date(), Validators.required],

    fcFilterEndDate: [new Date(), Validators.required],
    fcSearch: [""],
    fcFilterPriority: [""],
    fcFilterFollowup: [""],
    fcFilterFileStatus: [2],
    fcFilterAccuracyStatus: [], //saurabh shelar

    fcFilterDeferCategory: [],
    fcAccessionNumber: [""],
    fcYear: ["All"], //moment().year()
    fcFolder: [[]],
    fcDropdownFolder: ["All"],
    fcCategory: [[]],
    fcFilterOrderStatus: [0],
    fcOrderUser: [""],
    fcOrderGroup: [""],
    fcFilterOrderWorkQueue: [0], //shelar
    fcProvider: [[]],
    fcHL7: [-1],
    fcClientBilling: [-1],
    fcSubStatus: [""],
    fcOrderInsurance: [[]],
    fcEncounterClient: [],
    fcEncounterSource: "All",
    fcAssignmentType: -1,
    fcPractice: [[]],
    fcSearchInArchival: [false],
  });

  get fbcFilterClient() {
    return this.FilterFormGroup.get("fcFilterClient");
  }
  get fbcFilterInsurance() {
    return this.FilterFormGroup.get("fcFilterInsurance");
  }
  get fbcFilterClaimAge() {
    return this.FilterFormGroup.get("fcFilterClaimAge");
  }
  get fbcFilterAutomationStatus() {
    return this.FilterFormGroup.get("fcFilterAutomationStatus");
  }
  get fbcFilterLastWorkedAge() {
    return this.FilterFormGroup.get("fcFilterLastWorkedAge");
  }
  get fbcFilterInsuranceDue() {
    return this.FilterFormGroup.get("fcFilterInsurnaceDue");
  }
  get fbcFilterWorkItemStatus() {
    return this.FilterFormGroup.get("fcFilterWorkItemStatus");
  }
  get fbcFilterProvider() {
    return this.FilterFormGroup.get("fcFilterProvider");
  }
  get fbcFilterCPTGroup() {
    return this.FilterFormGroup.get("fcFilterCPTGroup");
  }
  get fbcFilterAgent() {
    return this.FilterFormGroup.get("fcFilterAgent");
  }
  get fbcFilterStartDate() {
    return this.FilterFormGroup.get("fcFilterStartDate");
  }
  get fbcFilterEndDate() {
    return this.FilterFormGroup.get("fcFilterEndDate");
  }
  get fbcFilterRenderingProvider() {
    return this.FilterFormGroup.get("fcFilterRenderingProvider");
  }
  get fbcFilterSearch() {
    return this.FilterFormGroup.get("fcSearch");
  }
  get fbcFilterPriority() {
    return this.FilterFormGroup.get("fcFilterPriority");
  }
  get fbcFilterFollowup() {
    return this.FilterFormGroup.get("fcFilterFollowup");
  }
  get fbcFilterFileStatus() {
    return this.FilterFormGroup.get("fcFilterFileStatus");
  }
  get fbcAccuracyStatus() {
    return this.FilterFormGroup.get("fcFilterAccuracyStatus"); //saurabh shelar
  }

  get fbcFilterDeferCategory() {
    return this.FilterFormGroup.get("fcFilterDeferCategory");
  }
  get fcAccessionNumber() {
    return this.FilterFormGroup.get("fcAccessionNumber");
  }
  get fbcYear() {
    return this.FilterFormGroup.get("fcYear");
  }
  get fbcFolder() {
    return this.FilterFormGroup.get("fcFolder");
  }
  get fbcDropdownFolder() {
    return this.FilterFormGroup.get("fcDropdownFolder");
  }
  get fbcCategory() {
    return this.FilterFormGroup.get("fcCategory");
  }
  get fbcOrderGroup() {
    return this.FilterFormGroup.get("fcOrderGroup");
  }
  get fbcOrderUser() {
    return this.FilterFormGroup.get("fcOrderUser");
  }
  get fbcOrderWorkQueueStatus() {
    return this.FilterFormGroup.get("fcFilterOrderWorkQueue"); //saurabh shelar
  }
  get fbcProvider() {
    return this.FilterFormGroup.get("fcProvider");
  }
  get fcHL7() {
    return this.FilterFormGroup.get("fcHL7");
  }
  get fcClientBilling() {
    return this.FilterFormGroup.get("fcClientBilling");
  }
  get fbcSubStatus() {
    return this.FilterFormGroup.get("fcSubStatus");
  }
  get fbcOrderInsurance() {
    return this.FilterFormGroup.get("fcOrderInsurance");
  }
  get fbcEncounterClient() {
    return this.FilterFormGroup.get("fcEncounterClient");
  }
  get fbcEncounterSource() {
    return this.FilterFormGroup.get("fcEncounterSource");
  }
  get fbcAssignmentType() {
    return this.FilterFormGroup.get("fcAssignmentType");
  }
  get fbcPractice() {
    return this.FilterFormGroup.get("fcPractice");
  }
  get fbcSearchInArchival() {
    return this.FilterFormGroup.get("fcSearchInArchival");
  }
  searchTextChanged: Subject<string> = new Subject<string>();
  summarypracticeid: string = "0";
  ngOnInit() {
    try {
      // if (this.fbcFilterAutomationStatus.value == "All")
      //   this.lstFilter.automationstatus = "";
      // if (this.fbcFilterClaimAge.value == "All")
      //   this.lstFilter.age = "";
      if (this.dataService.SelectedRoleName == "AR Representative") {
        this.fbcFilterAgent.setValue(this.dataService.SelectedGCPUserid);
        this.bisARRepresentative = true;
      }
      this.subscription.add(
        this.dataService.SummarySelectedPracticeid.subscribe((data) => {
          if (data != "") {
            this.summarypracticeid = data;
            if (this.summarypracticeid !== "0") {
              this.lstFilter.practicecode = [this.summarypracticeid];
              this.fbcPractice.setValue([this.summarypracticeid]);
            } else {
              this.lstFilter.practicecode = [];
              this.fbcPractice.setValue([]);
            }

            if (data == "0") {
              this.RetriveFilterData();
              this.formValueChanged();
              this.filterData = null;
              this.ApplyFilter(null);
            }
            // this.btnApplyFilter_Click();
          }
        })
      );
      this.subscription.add(
        this.dataService.SummarySelectedPractice.subscribe((data) => {
          if (data != "0") {
            this.searchField = "practice";
            this.getGenericSearchData(data);
          }
        })
      );

      this.RetriveFilterData();
      this.formValueChanged();
      this.dataService.advanceSearchValue.subscribe((data) => {
        if (
          data != "" &&
          this.bIsShowAdvanceSearchOrder &&
          this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.AdvanceSearchOrder.toLowerCase()
        ) {
          this.isarchived = false;
          this.fbcSearchInArchival.setValue(false);
          this.fcAccessionNumber.setValue(
            this.dataService.advanceSearchValue.value
          );
        }
      });
      this.subscription.add(
        this.searchTextChanged
          .pipe(
            debounceTime(750),
            switchMap((searchValue) => {
              if (this.searchField == "practice")
                this.practiceFilterLoader = true;
              else if (this.searchField == "provider")
                this.providerFilterLoader = true;
              else if (this.searchField == "insurance")
                this.insuranceFilterLoader = true;
              if (searchValue && searchValue.trim() && searchValue.length > 2) {
                let reqbody: GenericSearchModel = new GenericSearchModel();
                reqbody.searchfield = this.searchField;
                reqbody.searchtext = searchValue.trim();
                reqbody.status = this.fbcOrderWorkQueueStatus.value;
                reqbody.group = this.dataService.groupIds
                  ? this.dataService.groupIds.split(",")
                  : [];
                return this.filterService.getGenericSearchData(reqbody);
              } else {
                if (this.searchField == "practice") {
                  return Observable.of({ practice: this.allLstPractice });
                } else if (this.searchField == "provider") {
                  return Observable.of({ provider: this.allProvidersList });
                } else if (this.searchField == "insurance") {
                  return Observable.of({ insurance: this.allOrderInsurance });
                }
              }
            })
          )
          .subscribe(
            (data) => {
              if (data) {
                if (this.searchField == "practice") {
                  this.lstPractice = data.practice;
                  this.practiceFilterLoader = false;
                } else if (this.searchField == "provider") {
                  this.providersList = data.provider;
                  this.providerFilterLoader = false;
                } else if (this.searchField == "insurance") {
                  this.orderInsurance = data.insurance;
                  this.insuranceFilterLoader = false;
                }
              } else {
                if (this.searchField == "practice") {
                  this.lstPractice = [];
                  this.practiceFilterLoader = false;
                }
                if (this.searchField == "provider") {
                  this.providersList = [];
                  this.providerFilterLoader = false;
                }
                if (this.searchField == "insurance") {
                  this.orderInsurance = [];
                  this.insuranceFilterLoader = false;
                }
              }
            },
            (error) => {
              this.clsUtility.LogError(error);
            }
          )
      );
      this.subscription.add(
        this.dataService.isarchived.subscribe((data) => {
          this.isarchived = data;
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngAfterViewInit() {
    if (
      // this.fcAccessionNumber.value != "" &&
      this.bIsShowAdvanceSearchOrder &&
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.AdvanceSearchOrder.toLowerCase()
    ) {
      document.getElementById("idfcAccessionNumber").focus();
    }
  }
  formValueChanged(): any {
    try {
      // this.subscription.add
      this.fbcFilterClient.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.client.splice(0, this.lstFilter.client.length);
          if (data !== 0) {
            const SelectedClient = this.lstClients.find(
              (x) => x.nclientid === data
            );
            const filterclient = new FliterClient();
            filterclient.clientname = SelectedClient.clientcodename;
            filterclient.clientid = SelectedClient.nclientid;
            this.lstFilter.client.push(filterclient);
          }
        }
        // this.SelectedRSID = data;
      });
      // this.subscription.add
      this.fbcFilterInsurance.valueChanges.subscribe((data: string) => {
        if (data != null || data != undefined) {
          this.lstFilter.payer.splice(0, this.lstFilter.payer.length);
          if (data !== "0") {
            const SelectedPayer = this.lstPayers.find(
              (x) => x.companyid === data
            );
            const filterPayer = new FilterPayer();
            filterPayer.payerid = SelectedPayer.companyid;
            filterPayer.payername = SelectedPayer.companyname;
            this.lstFilter.payer.push(filterPayer);
          }
        }
      });
      // this.subscription.add
      this.fbcFilterAgent.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.agent.splice(0, this.lstFilter.agent.length);
          if (data !== 0) {
            const SelectedAgent = this.lstAgents.find(
              (x) => x.agentid === data
            );
            const filteragent = new FilterAgent();
            filteragent.agentid = SelectedAgent.agentid;
            filteragent.agentname = SelectedAgent.agentname;
            // console.log("filteragent : " + JSON.stringify(filteragent));

            this.lstFilter.agent.push(filteragent);
            // console.log("lstFilter : " + JSON.stringify(this.lstFilter));
          }
        }
      });
      // this.subscription.add
      this.fbcFilterLastWorkedAge.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.lastworkedage = data;
        }
      });
      // this.subscription.add
      this.fbcFilterInsuranceDue.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.insurancedue = data;
        }
      });
      // this.subscription.add
      this.fbcFilterWorkItemStatus.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.workitemstatus = data;
          if (
            this.fbcFilterWorkItemStatus.value == 0 ||
            this.fbcFilterWorkItemStatus.value == 2
          ) {
            this.bisWorkitemstatusassigned = false;
          } else {
            this.fbcFilterLastWorkedAge.setValue(0);
            this.bisWorkitemstatusassigned = true;
          }
        }
      });
      // this.subscription.add
      this.fbcFilterStartDate.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.startdate = this.datePipe.transform(
            data,
            "yyyy-MM-dd"
          );
        }
      });
      // this.subscription.add
      this.fbcFilterEndDate.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.enddate = this.datePipe.transform(data, "yyyy-MM-dd");
        }
      });
      // this.subscription.add
      this.fbcFilterAutomationStatus.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.automationstatus = this.fbcFilterAutomationStatus.value;
        }
      });

      this.fbcFilterDeferCategory.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.defercategory = this.fbcFilterDeferCategory.value;
        }
      });
      // this.subscription.add
      this.fbcFilterClaimAge.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.age = this.fbcFilterClaimAge.value;
        }
      });
      // this.subscription.add
      this.fbcFilterProvider.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.billingProvider.splice(
            0,
            this.lstFilter.billingProvider.length
          );
          if (data !== 0) {
            const SelectedBillingprovider = this.Providers.find(
              (x) => x.providerid === data
            );
            const filterbillingprovider = new OutputBillingproviders();
            filterbillingprovider.providerid =
              SelectedBillingprovider.providerid;
            filterbillingprovider.providername =
              SelectedBillingprovider.providername;
            this.lstFilter.billingProvider.push(filterbillingprovider);
            // console.log("lstFilter : " + JSON.stringify(this.lstFilter));
          }
        }
      });
      // this.subscription.add
      this.fbcFilterRenderingProvider.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.renderingProvider.splice(
            0,
            this.lstFilter.renderingProvider.length
          );
          if (data !== 0) {
            const SelectedRenderingprovider = this.RenderingProviders.find(
              (x) => x.providerid === data
            );
            const filterrenderingprovider = new OutputRenderingproviders();
            filterrenderingprovider.providerid =
              SelectedRenderingprovider.providerid;
            filterrenderingprovider.providername =
              SelectedRenderingprovider.providername;
            this.lstFilter.renderingProvider.push(filterrenderingprovider);
            // console.log("lstFilter : " + JSON.stringify(this.lstFilter));
          }
        }
      });
      // this.subscription.add
      this.fbcFilterSearch.valueChanges.subscribe((data: any) => {
        if (data != null || data != undefined) {
          this.lstFilter.searchtext = this.fbcFilterSearch.value;
        }
      });
      // this.subscription.add
      this.fbcFilterPriority.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.priority = data;
        }
      });

      this.fcHL7.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.hl7present = data;
        }
      });
      this.fcClientBilling.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.clientbilling = data;
        }
      });
      this.fbcOrderInsurance.valueChanges.subscribe((data: string[]) => {
        // console.log(data);
        this.lstFilter.insurancecompanyname = data;
        // if (data && data.length > 0) {
        //   this.lstFilter.insurancecompanyname = data.map(
        //     (ele) => ele.insurancecompanyname
        //   );
        // }
      });
      this.fbcFilterFollowup.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          // 0= Today
          // 1= This Week
          // 2= This Month
          // 3= No Followup Date
          // 4= Yesterday
          // 5= Last Week
          // 6= Last Month
          // 7= All
          switch (data) {
            case 0:
              var todayMoment: moment.Moment = moment();
              // console.log(todayMoment.date);
              this.lstFilter.followupstartdate = this.datePipe.transform(
                todayMoment,
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                todayMoment,
                "yyyy-MM-dd"
              );
              break;
            case 1:
              const thisweek = moment();

              this.lstFilter.followupstartdate = this.datePipe.transform(
                thisweek.startOf("week"),
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                thisweek.endOf("week"),
                "yyyy-MM-dd"
              );
              break;
            case 2:
              const thismonth = moment();
              // console.log(thismonth.date);
              this.lstFilter.followupstartdate = this.datePipe.transform(
                thismonth.startOf("month"),
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                thismonth.endOf("month"),
                "yyyy-MM-dd"
              );
              break;
            case 3:
              const noFollowup = moment("1999-12-31 18:30:00");
              this.lstFilter.followupstartdate = this.datePipe.transform(
                noFollowup,
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                noFollowup,
                "yyyy-MM-dd"
              );
              break;
            case 4:
              const yesterday = moment().subtract(1, "day");
              // console.log(yesterday.date);
              this.lstFilter.followupstartdate = this.datePipe.transform(
                yesterday,
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                yesterday,
                "yyyy-MM-dd"
              );
              break;
            case 5:
              const lastweek = moment().subtract(1, "weeks");
              // console.log(lastweek.date);
              this.lstFilter.followupstartdate = this.datePipe.transform(
                lastweek.startOf("week"),
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                lastweek.endOf("week"),
                "yyyy-MM-dd"
              );
              break;
            case 6:
              const lastmonth = moment().subtract(1, "month");
              // console.log(lastmonth.date);
              this.lstFilter.followupstartdate = this.datePipe.transform(
                lastmonth.startOf("month"),
                "yyyy-MM-dd"
              );
              this.lstFilter.followupenddate = this.datePipe.transform(
                lastmonth.endOf("month"),
                "yyyy-MM-dd"
              );
              break;
            case 7:
              this.lstFilter.followupstartdate = null;
              this.lstFilter.followupenddate = null;
              break;
          }
        }
      });

      this.fbcFilterFileStatus.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.filestatus = data;
        }
      });
      this.fbcAccuracyStatus.valueChanges.subscribe((data: string) => {
        //saurabh shelar
        if (data != null || data != undefined) {
          this.lstFilter.accuracystatus = data;
        }
      });

      this.fbcOrderWorkQueueStatus.valueChanges.subscribe((data: number) => {
        //saurabh shelar
        if (data != null || data != undefined) {
          if (data == 0) this.lstFilter.status = [];
          else this.lstFilter.status = [data];
          this.lstFilter.startdate = null;
          this.lstFilter.enddate = null;
        }
      });
      this.fbcSubStatus.valueChanges.subscribe((data: string) => {
        //saurabh shelar
        if (data) {
          this.lstFilter.ordersubstatus = [data];
        } else {
          this.lstFilter.ordersubstatus = [];
        }
      });
      this.fbcYear.valueChanges.subscribe((data: string) => {
        if (data != null && data != undefined) {
          if (data == "All") this.lstFilter.orderyear = [];
          else this.lstFilter.orderyear = [data];
        }
      });
      this.fbcFolder.valueChanges.subscribe((data: string[]) => {
        // console.log(data);
        if (!this.useDropdownFilter) this.lstFilter.orderday = data;
        // if (data && data.length > 0) {
        //   this.lstFilter.orderday = data.map((ele) => ele.foldername);
        // }
      });
      this.fbcDropdownFolder.valueChanges.subscribe((data: string) => {
        // console.log(data);
        if (this.useDropdownFilter)
          this.lstFilter.orderday = data == "All" ? [] : [data];
        // if (data && data.length > 0) {
        //   this.lstFilter.orderday = data.map((ele) => ele.foldername);
        // }
      });
      this.fbcCategory.valueChanges.subscribe((data: string[]) => {
        // console.log(data);
        this.lstFilter.orderCategory = data;
        // if (data && data.length > 0) {
        //   this.lstFilter.orderCategory = data.map((ele) => ele.categoryname);
        // }
      });
      this.fbcProvider.valueChanges.subscribe((data: string[]) => {
        // console.log(data);
        this.lstFilter.npi = data;
        // if (data && data.length > 0) {
        //   this.lstFilter.npi = data.map((ele) => ele.npi);
        // }
      });
      this.fcAccessionNumber.valueChanges.subscribe((data: string) => {
        this.lstFilter.accessionNo = data;
      });
      this.fbcOrderUser.valueChanges.subscribe((data: string) => {
        // if (data == "All") {
        // this.lstFilter.userid = "";
        // } else {
        this.lstFilter.userid = data;
        // }
      });
      this.fbcOrderGroup.valueChanges.subscribe((group) => {
        this.lstFilter.filtergroup = group ? group.toString() : "";
        if (group && group > 0) {
          this.fbcOrderUser.setValue("");
          this.subscription.add(
            this.authService.getGroupsUser(group).subscribe(
              (users) => {
                if (users != null || users != undefined) {
                  users.splice(0, 0, {
                    userid: "-1",
                    displayname: "Group Assigned Only",
                  });
                  this.AllGroupUsers = users;
                  this.GroupUsers = users;
                }
              },
              (err) => {}
            )
          );
        } else {
          this.GroupUsers = null;
          this.fbcOrderUser.setValue("");
        }
      });

      this.fbcEncounterClient.valueChanges.subscribe((data: number) => {
        if (data != null || data != undefined) {
          this.lstFilter.client.splice(0, this.lstFilter.client.length);
          if (data !== 0) {
            const SelectedClient = this.lstEncounterClients.find(
              (x) => x.nclientid === data
            );
            const filterclient = new FliterClient();
            filterclient.clientname = SelectedClient.clientcodename;
            filterclient.clientid = SelectedClient.nclientid;
            this.lstFilter.client.push(filterclient);
          }
        }
        // this.SelectedRSID = data;
      });
      this.fbcEncounterSource.valueChanges.subscribe((data: string) => {
        if (data && data !== "All") {
          this.lstFilter.encountertype = data;
        } else {
          this.lstFilter.encountertype = "";
        }
      });
      this.fbcAssignmentType.valueChanges.subscribe((data: number) => {
        this.lstFilter.assignmenttype = data;
      });
      this.fbcPractice.valueChanges.subscribe((data: string[]) => {
        this.lstFilter.practicecode = data;
      });
      this.fbcSearchInArchival.valueChanges.subscribe((data: boolean) => {
        this.lstFilter.searchinarchive = data;
        if (data) {
          if (this.fbcOrderWorkQueueStatus.value !== 0) {
            this.fbcOrderWorkQueueStatus.setValue(0);
            this.lstFilter.ordersubstatus = [];
            this.fbcSubStatus.reset();
            this.fbcSubStatus.setValue("");
            this.getFolderCategoryAndYear(
              this.fbcYear.value == "All" ? "0" : this.fbcYear.value,
              0,
              true
            );
          }
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter(data: any) {
    this.FilterData.emit(this.filterData);
  }

  // getFilterJSON() {
  //   try {
  //     this.filterService.getAllFilterList(JSON.stringify(this.FilterJSON)).subscribe(
  //       (data) => {
  //         this.AllFilterJSON = data;
  //       });
  //     // this.filterService.getAllFilterList(this.FilterJSON);
  //   }
  //   catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  RetriveFilterData(): any {
    try {
      this.AllFilterJSON = new OutputFilter();
      switch (this.CallingPage.toLowerCase()) {
        case enumFilterCallingpage.WorkInventory:
          this.bIsShowWorkQueueFilter = true;
          this.FilterJSON = new Filter(
            true,
            true,
            true,
            true,
            true,
            true,
            false,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              // console.log(" Data : " + JSON.stringify(data));
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          break;
        case enumFilterCallingpage.DeferWorkInventory:
          this.bIsShowDeferWorkQueueFilter = true;
          this.FilterJSON = new Filter(
            true,
            true,
            true,
            false,
            true,
            true,
            false,
            true
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              // console.log(" Data : " + JSON.stringify(data));
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          break;
        case enumFilterCallingpage.MyTask:
          this.bIsShowTaskFilter = true;
          this.FilterJSON = new Filter(
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          break;
        case enumFilterCallingpage.CompletedTask:
          this.bIsShowTaskFilter = true;
          this.FilterJSON = new Filter(
            true,
            true,
            true,
            false,
            false,
            false,
            false,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          break;
        case enumFilterCallingpage.Production:
          this.bIsShowProductionFilter = true;
          this.FilterJSON = new Filter(
            false,
            false,
            false,
            false,
            false,
            false,
            true,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.lstAgents = this.AllFilterJSON.arrepresentative;
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }

              // this.masterService.getAgents(0).subscribe(
              //   (data) => {
              //     this.lstAgents = data;
              //     // console.log(this.Agents);
              //   });
              // this.lstAgents = this.filterService.getAgents();
            });
          break;
        case enumFilterCallingpage.File:
          this.bIsShowFileFilter = true;
          this.FilterJSON = new Filter(
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.lstAgents = this.AllFilterJSON.arrepresentative;
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          break;
        case enumFilterCallingpage.Automation: //saurabh shelar
          this.bIsShowAutomationAccuracyFilter = true;
          this.FilterJSON = new Filter(
            true,
            true,
            false,
            false,
            false,
            false,
            false,
            false
          );
          // this.subscription.add
          this.filterService
            .getAllFilterList(JSON.stringify(this.FilterJSON))
            .subscribe((data) => {
              if (data != null || data != undefined) {
                this.AllFilterJSON = data;
                this.lstClients = this.AllFilterJSON.client;
                this.lstPayers = this.AllFilterJSON.insurances;
                this.lstAgeBucket = this.AllFilterJSON.bucket;
                this.AutomationStatus = this.AllFilterJSON.automationstatus;
                this.WorkitemStatus = this.filterService.getWorkItemStatus();
                this.Providers = this.AllFilterJSON.billingproviders;
                this.RenderingProviders = this.AllFilterJSON.renderingproviders;
                this.CPTGroups = this.filterService.getCPTGroup();
                this.lstAgents = this.AllFilterJSON.arrepresentative;
                //this.AccuracyStatus=this.filterService.getAutomationStatus;
                this.DeferCategory = this.AllFilterJSON.defercategory;
              }
            });
          const lastweek = moment().subtract(1, "weeks");

          this.fbcFilterStartDate.setValue(
            new Date(
              new DatePipe("en-US").transform(
                lastweek.startOf("week"),
                "yyyy-MM-dd"
              )
            )
          );

          this.fbcFilterEndDate.setValue(
            new Date(
              new DatePipe("en-US").transform(
                lastweek.endOf("week"),
                "yyyy-MM-dd"
              )
            )
          );

          break;

        case enumFilterCallingpage.OrderAssistanceWorkqueue: //for incomplete
          // this.fbcOrderWorkQueueStatus.setValue(3);
          this.bIsShowOrderTab = true;
          this.bIsShowStatusFilter = true;
          this.bIsShowForIncompleteOrders = true;
          this.getFolderCategoryAndYear(0, 3);
          this.getOrderStatus("3");

          break;
        case enumFilterCallingpage.PendingAdditionalInfo:
          this.bIsShowOrderTab = true;
          this.bIsShowPendingForAdditionalInfo = true;
          this.getFolderCategoryAndYear(0);

          break;
        case enumFilterCallingpage.OrderWorkqueue:
          this.bIsShowOrderTab = true;
          this.bIsShowForEncounters = true;
          this.getFolderCategoryAndYear(0);
          break;
        case enumFilterCallingpage.MyEncounters:
          this.bIsShowOrderTab = true;
          this.bIsShowForMyEncounters = true;
          this.fbcOrderWorkQueueStatus.setValue(1);
          this.getFolderCategoryAndYear(0, 1);
          break;
        case enumFilterCallingpage.MyReview:
          this.bIsShowOrderTab = true;
          this.bIsShowForMyReview = true;
          this.fbcOrderWorkQueueStatus.setValue(6);
          this.getFolderCategoryAndYear(0, 6);
          break;
        case enumFilterCallingpage.OrderCompletedWorkqueue:
          this.bIsShowForCompletedOrders = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(2);
          this.getFolderCategoryAndYear(0, 2);
          break;
        case enumFilterCallingpage.OrderMyOrder:
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(1);
          this.getFolderCategoryAndYear(0, 1);
          break;
        case enumFilterCallingpage.OrderReview:
          this.bIsShowForOrderReview = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(4);
          this.getFolderCategoryAndYear(0, 4);

          break;
        case enumFilterCallingpage.OrderAssistance:
          // this.getFolders();
          // this.getCategory();
          this.bIsShowForOrderAssistance = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(7);
          this.getFolderCategoryAndYear(0, 7);

          break;
        case enumFilterCallingpage.OrderSearchOrder:
          // this.getFolders();
          // this.getCategory();
          this.bIsShowOrderTab = true;
          this.bIsShowGroupUserStatusFilter = true;
          this.bIsShowAdvanceSearchOrder = true;
          this.getFolderCategoryAndYear(0);
          this.getOrderStatus("0");
          this.getLoginUserGroup();

          break;
        case enumFilterCallingpage.AdvanceSearchOrder:
          // this.getFolders();
          // this.getCategory();
          this.bIsShowOrderTab = true;
          this.bIsShowGroupUserStatusFilter = true;
          this.bIsShowAdvanceSearchOrder = true;
          this.getFolderCategoryAndYear(0);
          this.getOrderStatus("0");
          this.getLoginUserGroup();

          break;
        case enumFilterCallingpage.OrderExport:
          // this.getFolders();
          // this.getCategory();
          this.bIsShowOrderTab = true;
          this.bIsShowGroupUserStatusFilter = true;
          this.bIsShowOrderExport = true;
          this.useDropdownFilter = true;
          this.getFolderCategoryAndYear(0);
          this.getOrderStatus("0");
          this.getLoginUserGroup();

          break;
        case enumFilterCallingpage.OrderPendingOrder:
          this.bIsShowGroupUserFilter = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(1);
          this.getFolderCategoryAndYear(0, 1);
          this.getAllGroups();
          // this.getLoginUserGroup();

          break;
        case enumFilterCallingpage.OrderDocumentSearch:
          this.bIsShowOrderTab = true;
          this.bIsShowForDocumentSearch = true;
          break;
        case enumFilterCallingpage.OrderUpload: //for incomplete
          this.bIsShowOrderTab = true;
          this.bIsShowForuploadedOrders = true;
          this.getFolderCategoryAndYear(0, 8);
          // this.getOrderStatus("8");

          break;
        case enumFilterCallingpage.DocumentCount:
          this.bIsShowOrderTab = true;
          this.bIsShowForDocumentCount = true;
          this.useDropdownFilter = true;
          this.getFolderCategoryAndYear(0);
          break;
        case enumFilterCallingpage.PracticeAssigned:
          this.bIsShowForPracticeAssigned = true;
          this.bIsShowGroupUserFilter = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(16);
          this.getFolderCategoryAndYear(0, 16);
          this.getAllGroups();
          // this.getLoginUserGroup();

          break;
        case enumFilterCallingpage.PracticeCompleted:
          this.bIsShowForPracticeCompleted = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(17);
          this.getFolderCategoryAndYear(0, 17);

          break;
        case enumFilterCallingpage.PracticeUserEncounter:
          this.bIsShowForPracticeUserEncounter = true;
          this.bIsShowOrderTab = true;
          this.fbcOrderWorkQueueStatus.setValue(16);
          this.getFolderCategoryAndYear(0, 16);

          break;
        case enumFilterCallingpage.PracticeAssistanceCompleted:
          this.bIsShowForPracticeUserEncounter = true;
          this.bIsShowForPracticeAssistanceCompleted = true;
          this.bIsShowOrderTab = true;
          // this.fbcOrderWorkQueueStatus.setValue(16);
          this.getFolderCategoryAndYear(0);

          break;
        case enumFilterCallingpage.ArchivedEncounters:
          this.bIsShowOrderTab = true;
          this.bIsShowStatusFilter = true;
          // this.bIsShowAdvanceSearchOrder = true;
          this.bIsShowArchivedEncounters = true;
          this.getFolderCategoryAndYear(0);
          this.getOrderStatus("0");

          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  statusChanged(evt: any) {
    if (evt) {
      // console.log("event", evt);
      this.lstFilter.ordersubstatus = [];
      this.fbcSubStatus.reset();
      this.fbcSubStatus.setValue("");
      this.getFolderCategoryAndYear(
        this.fbcYear.value == "All" ? "0" : this.fbcYear.value,
        evt.statuscode,
        true
      );
    }
  }

  yearChanged(evt: any) {
    if (evt) {
      // console.log("event", evt);
      // this.fbcYear.reset();
      this.getFolderCategoryAndYear(
        evt.year == "All" ? "0" : evt.year,
        this.fbcOrderWorkQueueStatus.value
          ? this.fbcOrderWorkQueueStatus.value
          : 0,
        false,
        true,
        this.fbcEncounterClient.value ? this.fbcEncounterClient.value : 0
      );
    }
  }
  clientChanged(evt: any) {
    if (evt) {
      this.getFolderCategoryAndYear(
        0,
        this.fbcOrderWorkQueueStatus.value
          ? this.fbcOrderWorkQueueStatus.value
          : 0,
        false,
        true,
        evt.nclientid
      );
    }
  }

  // RetriveFilterData(): any {
  //   try {
  //     switch (this.CallingPage.toLowerCase()) {
  //       case 'workqueue':
  //         this.filterService.getAllClientList(0).subscribe(
  //           (data) => {
  //             this.lstClients = data;
  //           });
  //         this.filterService.getAllPayerList(0).subscribe(
  //           (data) => {
  //             this.lstPayers = data;
  //           });
  //         this.filterService.getAgingBucket().subscribe(
  //           (data) => {
  //             this.lstAgeBucket = data;
  //           });
  //         this.AutomationStatus = this.filterService.getAutomationStatus();
  //         this.WorkitemStatus = this.filterService.getWorkItemStatus();
  //         this.Providers = this.filterService.getProvider();
  //         this.CPTGroups = this.filterService.getCPTGroup();
  //         break;
  //       case 'task':
  //         this.filterService.getAllClientList(0).subscribe(
  //           (data) => {
  //             this.lstClients = data;
  //           });
  //         this.filterService.getAllPayerList(0).subscribe(
  //           (data) => {
  //             this.lstPayers = data;
  //           });
  //         this.filterService.getAgingBucket().subscribe(
  //           (data) => {
  //             this.lstAgeBucket = data;
  //           });
  //         this.AutomationStatus = this.filterService.getAutomationStatus();
  //         this.WorkitemStatus = this.filterService.getWorkItemStatus();
  //         this.Providers = this.filterService.getProvider();
  //         this.CPTGroups = this.filterService.getCPTGroup();
  //         break;
  //       case 'production':
  //         this.filterService.getAllClientList(0).subscribe(
  //           (data) => {
  //             this.lstClients = data;
  //           });
  //         // this.filterService.getAgents().subscribe(
  //         //   (data) => {
  //         //     this.lstAgents = data;
  //         //   });

  //         this.lstAgents = this.filterService.getAgents();
  //         this.filterService.getAllPayerList(0).subscribe(
  //           (data) => {
  //             this.lstPayers = data;
  //           });
  //         this.filterService.getAgingBucket().subscribe(
  //           (data) => {
  //             this.lstAgeBucket = data;
  //           });
  //         this.AutomationStatus = this.filterService.getAutomationStatus();
  //         this.WorkitemStatus = this.filterService.getWorkItemStatus();
  //         this.Providers = this.filterService.getProvider();
  //         this.CPTGroups = this.filterService.getCPTGroup();

  //         break;
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  defaultclientID: any = 0;
  selectionChange($event) {
    // const selectedValue: any = $event;
    // const selectedKey: any = Object.keys($event);
    // switch (selectedKey[0].toLowerCase()) {
    //   case 'nclientid':
    //     if (this.lstFilter.client == undefined) {
    //       this.lstFilter.client = [];
    //     }
    //     // console.log('client selected');
    //     this.lstFilter.client.splice(0, this.lstFilter.client.length);
    //     const filterclient = new FliterClient();
    //     filterclient.clientCode = selectedValue.clientcode;
    //     filterclient.clientid = selectedValue.nclientid;
    //     if (selectedValue.nclientid != 0) {
    //       this.lstFilter.client.push(filterclient);
    //     }
    //     // console.log(JSON.stringify(this.lstFilter));
    //     break;
    //   case 'npayerid':
    //     if (this.lstFilter.payer === undefined) {
    //       this.lstFilter.payer = [];
    //     }
    //     // console.log('payer selected');
    //     this.lstFilter.payer.splice(0, this.lstFilter.payer.length);
    //     // console.log(selectedValue);
    //     const filterPayer = new FilterPayer();
    //     filterPayer.payername = selectedValue.spayername;
    //     filterPayer.payerid = selectedValue.npayerid;
    //     if (selectedValue.npayerid != 0) {
    //       this.lstFilter.payer.push(filterPayer);
    //     }
    //     break;
    // }
    // //console.log(JSON.stringify(this.lstFilter));
    // // console.log('Filter Selection changed:'+ JSON.stringify($event));
  }

  btnApplyFilter_Click(page = 0, pagesize = this.clsUtility.pagesize) {
    try {
      //const lastweek = moment().subtract(1, "weeks");
      this.loadingGrid = true;
      if (
        this.CallingPage.toLowerCase() !==
        String(enumFilterCallingpage.OrderWorkqueue)
      ) {
        this.lstFilter.startdate = moment(this.fbcFilterStartDate.value).format(
          "YYYY-MM-DD"
        ); //saurabh shelar
        this.lstFilter.enddate = moment(this.fbcFilterEndDate.value).format(
          "YYYY-MM-DD"
        ); //saurabh shelar
        //console.log("After assignment :",this.lstFilter.startdate);
      }

      if (this.dataService.SelectedRoleName == "AR Representative") {
        this.lstFilter.agent.splice(0, this.lstFilter.agent.length);
        const filteragent = new FilterAgent();
        filteragent.agentid = this.dataService.SelectedGCPUserid;
        filteragent.agentname = this.dataService.loginUserName;
        this.lstFilter.agent.push(filteragent);
      }

      // if(this.bIsShowAutomationAccuracyFilter==true && this.firstclick && this.fbcFilterStartDate && this.fbcFilterEndDate)    //saurabh shelar
      // {
      //  const lastweek = moment().subtract(1, "weeks");
      //   this.fbcFilterStartDate.setValue(new Date(new DatePipe("en-US")
      //   .transform(lastweek.startOf("week"),"yyyy-MM-dd"
      //         )
      //      )
      //    );

      //    this.fbcFilterEndDate.setValue(new Date(new DatePipe("en-US")
      //    .transform(lastweek.endOf("week"),"yyyy-MM-dd"
      //          )
      //       )
      //     );

      //     this.firstclick=false;
      // }  //sairabh shelar

      if (this.fbcFilterAutomationStatus.value == "All") {
        this.lstFilter.automationstatus = "";
      }
      if (this.fbcFilterClaimAge.value == "All") {
        this.lstFilter.age = "";
      }
      if (this.fbcFilterDeferCategory.value == "All") {
        this.lstFilter.defercategory = "";
      }
      // if (this.fbcFolder.value == "All") {
      //   this.lstFilter.orderday = "";
      // }

      // if (this.fbcOrderUser.value == "All" || this.fbcOrderGroup.value == "") {
      //saurabh shelar
      // this.lstFilter.userid = "";
      // }
      // if (this.fbcOrderWorkQueueStatus)
      // if (this.fbcCategory.value == "All") {
      //   // if (this.fcYear.value == moment().year()) {
      //   //   this.lstFilter.orderyear = moment().year();
      //   // }
      //   this.lstFilter.orderCategory = "";
      // }

      // if (this.fcYear.value == 0) {
      //   this.lstFilter.orderyear = moment().year();
      // } else {
      //   this.lstFilter.orderyear = this.fcYear.value;
      // }
      // this.lstFilter.orderyear = this.fbcYear.value;
      if (this.fbcYear.value == "All") {
        this.lstFilter.orderyear = [];
      } else {
        this.lstFilter.orderyear = [this.fbcYear.value];
      }
      // if (
      //   this.bIsShowAdvanceSearchOrder &&
      //   this.CallingPage.toLowerCase() ==
      //     enumFilterCallingpage.AdvanceSearchOrder.toLowerCase() &&
      //   this.fcAccessionNumber.value == ""
      // ) {
      //   // this.lstFilter.accessionNo = this.dataService.advanceSearchValue.value;
      //   this.fcAccessionNumber.setValue(
      //     this.dataService.advanceSearchValue.value
      //   );
      // }

      //Trim accession number
      if (this.fcAccessionNumber.value) {
        this.fcAccessionNumber.setValue(this.fcAccessionNumber.value.trim());
        this.lstFilter.accessionNo = this.fcAccessionNumber.value;
      }
      if (this.bIsShowOrderTab) {
        this.lstFilter.servicecode = "ENTR";
      } else {
        this.lstFilter.servicecode = "ARTR";
      }
      if (
        this.fbcOrderWorkQueueStatus.value == 0 ||
        this.fbcOrderWorkQueueStatus.value == null
      )
        this.lstFilter.status = [];
      else this.lstFilter.status = [this.fbcOrderWorkQueueStatus.value];
      this.dataService.SelectedFilter = this.lstFilter;
      // console.log(
      //   "btnApplyFilter_Click this.dataService.SelectedFilter after" +
      //     JSON.stringify(this.dataService.SelectedFilter)
      // );
      this.isarchived = false;
      {
        // this.subscription.add
        // this.dataService.loginUserID.subscribe(loginUser => {
        // console.log(loginUser);

        if (
          this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.OrderDocumentSearch.toLowerCase() &&
          !this.fcAccessionNumber.value
        ) {
          this.filterData = null;
          this.ApplyFilter(this.filterData);
          this.loadingGrid = false;
        } else {
          if (this.loginUser > 0) {
            if (this.fbcSearchInArchival.value) {
              this.loadingGrid = true;
              this.filterService
                .applyFilter(
                  JSON.stringify(this.lstFilter),
                  enumFilterCallingpage.ArchivedEncounters,
                  this.loginUser,
                  0,
                  this.clsUtility.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data != null || data != undefined) {
                      this.filterData = data;
                      this.ApplyFilter(this.filterData);
                    }
                    this.loadingGrid = false;
                  },
                  (error) => {
                    this.loadingGrid = false;
                  }
                );
            } else {
              this.filterService
                .applyFilter(
                  JSON.stringify(this.lstFilter),
                  this.CallingPage,
                  this.loginUser,
                  page,
                  pagesize
                )
                .subscribe(
                  (data) => {
                    // console.log("Applyfilter : " + JSON.stringify(data));

                    // this.filterData = data.content;
                    // if (this.CallingPage.toLowerCase() == 'workqueue' || this.CallingPage.toLowerCase() == 'task')
                    //   this.filterData = data;
                    // else
                    if (data != null || data != undefined) {
                      this.filterData = data;
                      this.setFilter(true);
                      if (this.bIsShowAdvanceSearchOrder) {
                        this.isarchived = this.filterData.isarchived;
                        this.ApplyFilter(this.filterData);
                      } else {
                        this.ApplyFilter(this.filterData);
                      }
                    }
                    this.loadingGrid = false;
                  },
                  (error) => {
                    this.loadingGrid = false;
                  }
                );
            }
          }
        }
        // });
      }

      // this.filterService.applyFilter(JSON.stringify(this.lstFilter), this.CallingPage, this.dataService.SelectedUserid).subscribe(
      //   (data) => {
      //     this.filterData = data.content;
      //     // console.log(this.filterWorkqueue);
      //     this.setFilter(true);

      //     this.ApplyFilter(this.filterData);
      //   });
    } catch (error) {
      this.setFilter(false);
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }
  setFilter(value: boolean): any {
    switch (this.CallingPage.toLowerCase()) {
      case "mytask":
        this.dataService.isTaskFilterApplied = value;
        break;
      case "completedtask":
        this.dataService.isCompletetdTaskFilterApplied = value;
        break;
      case "workqueue":
        this.dataService.isWorkQueueFilterApplied = value;
        break;
      case "deferworkqueue":
        this.dataService.isDeferWorkQueueFilterApplied = value;
        break;
      case "production":
        this.dataService.isProductionFilterApplied = value;
        break;
      case "file":
        this.dataService.isFileFilterApplied = value;
        break;

      case "automation":
        this.dataService.isAutomationFilterApplied = value; //saurabh shelar
      case "orderassistanceworkqueue":
        this.dataService.isOrderAssistanceFilterApplied = value;
      case "orderworkqueue":
        this.dataService.isOrderWorkQueueFilterApplied = value;
      case "ordercompletedworkqueue":
        this.dataService.isOrderCompletedFilterApplied = value;
      case "ordermyorder":
        this.dataService.isOrderMyOrderFilterApplied = value;
      case "orderpendingorder":
        this.dataService.isOrderPendingOrderFilterApplied = value;
      case "ordersearchorder":
        this.dataService.isOrderSearchFilterApplied = value;
    }
  }

  async ClearFilter() {
    try {
      this.loadingGrid = true;
      const lstClearFilter = new InventoryInputModel();
      if (this.dataService.SelectedRoleName == "AR Representative") {
        lstClearFilter.agent.splice(0, lstClearFilter.agent.length);
        const filteragent = new FilterAgent();
        filteragent.agentid = this.dataService.SelectedGCPUserid;
        filteragent.agentname = this.dataService.loginUserName;
        lstClearFilter.agent.push(filteragent);
      }

      if (this.bIsShowAutomationAccuracyFilter == true) {
        //saurabh shelar
        const lastweek = moment().subtract(1, "weeks");
        lstClearFilter.startdate = this.datePipe.transform(
          lastweek.startOf("week"),
          "yyyy-MM-dd"
        );
        lstClearFilter.enddate = this.datePipe.transform(
          lastweek.endOf("week"),
          "yyyy-MM-dd"
        );
      } //sairabh shelar
      //harish salve
      lstClearFilter.status = []; //saurabh shelar
      lstClearFilter.ordersubstatus = [];
      lstClearFilter.insurancecompanyname = [];
      if (this.bIsShowOrderTab) {
        lstClearFilter.servicecode = "ENTR";

        if (this.bIsShowGroupUserStatusFilter || this.bIsShowStatusFilter)
          this.fbcOrderWorkQueueStatus.setValue(0);

        if (!this.bIsShowForDocumentSearch)
          await this.getFolderCategoryAndYear(
            0,
            this.fbcOrderWorkQueueStatus.value
              ? this.fbcOrderWorkQueueStatus.value
              : 0,
            false,
            true
          );
      } else {
        lstClearFilter.servicecode = "ARTR";
      }
      if (
        this.CallingPage.toLowerCase() ==
          enumFilterCallingpage.PracticeUserEncounter.toLowerCase() ||
        this.CallingPage.toLowerCase() ==
          enumFilterCallingpage.PracticeAssistanceCompleted.toLowerCase() ||
        (this.summarypracticeid != "0" &&
          this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.OrderAssistanceWorkqueue.toLowerCase())
      ) {
        lstClearFilter.orderyear = [];
      } else {
        lstClearFilter.orderyear =
          this.fbcYear.value == "All" ? [] : [this.fbcYear.value];
      }
      if (this.defaultFolderName) {
        lstClearFilter.orderday = [this.defaultFolderName];
      } else {
        lstClearFilter.orderday = [];
      }
      // lstClearFilter.orderday = this.defaultFolderName;
      // if (lstClearFilter.orderday == "All") {
      //   lstClearFilter.orderday = "";
      // }
      lstClearFilter.hl7present = -1;
      lstClearFilter.clientbilling = -1;
      // if (lstClearFilter.orderCategory == "All") {
      //   lstClearFilter.orderCategory = "";
      // }

      if (
        this.summarypracticeid != "0" &&
        this.CallingPage.toLowerCase() ==
          enumFilterCallingpage.OrderAssistanceWorkqueue.toLowerCase()
      ) {
        lstClearFilter.practicecode = this.fbcPractice.value;
      } else {
        lstClearFilter.practicecode = [];
      }
      if (
        this.fbcOrderWorkQueueStatus.value == 0 ||
        this.fbcOrderWorkQueueStatus.value == null
      )
        lstClearFilter.status = [];
      else lstClearFilter.status = [this.fbcOrderWorkQueueStatus.value];
      this.dataService.SelectedFilter = lstClearFilter;
      // console.log("this.CallingPage.toLowerCase() : " + this.CallingPage.toLowerCase());
      // this.subscription.add\
      // this.dataService.loginUserID.subscribe(loginUser => {
      if (
        this.CallingPage.toLowerCase() !=
        enumFilterCallingpage.OrderDocumentSearch.toLowerCase()
      ) {
        if (
          this.CallingPage.toLowerCase() ===
            enumFilterCallingpage.OrderSearchOrder.toLowerCase() ||
          this.CallingPage.toLowerCase() ===
            enumFilterCallingpage.AdvanceSearchOrder.toLowerCase() ||
          this.CallingPage.toLowerCase() ===
            enumFilterCallingpage.ArchivedEncounters.toLowerCase()
        ) {
          this.filterData = {
            content: null,
            last: true,
            pageable: { pagenumber: 0 },
            pagenumber: 0,
            totalelements: 0,
            totalpages: 0,
          };
          this.dataService.advanceSearchValue.next("");
          this.setFilter(false);
          this.ApplyFilter(this.filterData);
          this.ClearControls();
          this.loadingGrid = false;
          return;
        }
        if (this.loginUser > 0) {
          this.filterService
            .applyFilter(
              JSON.stringify(lstClearFilter),
              this.CallingPage,
              this.loginUser
            )
            .subscribe(
              (data) => {
                if (data != null || data != undefined) {
                  // if (this.CallingPage.toLowerCase() == 'workqueue' || this.CallingPage.toLowerCase() == 'task')
                  //   this.filterData = data;
                  // else
                  this.filterData = data;
                  // console.log(this.filterWorkqueue);
                  this.setFilter(false);
                  this.ApplyFilter(this.filterData);
                  this.ClearControls();
                  // this.FilterFormGroup.reset();
                }
                this.loadingGrid = false;
              },
              (error) => {
                this.loadingGrid = false;
              }
            );
        }
      } else {
        this.filterData = null;
        this.setFilter(false);
        this.ApplyFilter(this.filterData);
        this.ClearControls();
        this.loadingGrid = false;
      }
      // });
    } catch (error) {
      this.setFilter(true);
      this.clsUtility.LogError(error);
      this.loadingGrid = false;
    }
  }
  private SetDefaultYear() {
    if (this.years != undefined && this.years != null) {
      if (this.years.length > 0) {
        var temp = this.years.filter(
          (element) => element.isdefault.toString() === "true"
        );
        if (temp != undefined && temp != null) {
          if (temp.length > 0) {
            this.fbcYear.setValue(temp[0].year);
          } else {
            this.fbcYear.setValue(this.years[0].year);
          }
        } else {
          this.fbcYear.setValue(this.years[0].year);
        }
      }
    }
  }

  ClearControls(): any {
    try {
      this.fbcFilterClient.setValue(0);
      if (this.dataService.SelectedRoleName == "AR Representative") {
        this.fbcFilterAgent.setValue(this.dataService.SelectedGCPUserid);
        this.bisARRepresentative = true;
      } else {
        this.fbcFilterAgent.setValue(0);
        this.bisARRepresentative = false;
      }
      this.fbcFilterInsurance.setValue("0");
      this.fbcFilterClaimAge.setValue("All");
      this.fbcFilterAutomationStatus.setValue("All");
      this.fbcFilterLastWorkedAge.setValue(30);
      this.fbcFilterWorkItemStatus.setValue(2);
      this.fbcFilterProvider.setValue(0);
      this.fbcFilterCPTGroup.setValue(0);
      this.fbcFilterInsuranceDue.setValue(0);
      this.fbcFilterRenderingProvider.setValue(0);
      // this.fbcOrderUser.setValue(""); //saurabh shelar
      // this.fbcOrderGroup.setValue(""); //saurabh shelar

      // this.fbcOrderWorkQueueStatus.setValue("All"); //saurabh shelar
      if (this.bIsShowAutomationAccuracyFilter == true) {
        //saurabh shelar
        const lastweek = moment().subtract(1, "weeks");

        this.fbcFilterStartDate.setValue(
          new Date(
            new DatePipe("en-US").transform(
              lastweek.startOf("week"),
              "yyyy-MM-dd"
            )
          )
        );

        this.fbcFilterEndDate.setValue(
          new Date(
            new DatePipe("en-US").transform(
              lastweek.endOf("week"),
              "yyyy-MM-dd"
            )
          )
        );
      } else {
        this.fbcFilterStartDate.setValue(new Date());
        this.fbcFilterEndDate.setValue(new Date());
      }
      this.fbcFilterSearch.setValue("");
      this.fbcFilterPriority.setValue(0);
      this.fbcFilterFollowup.setValue(0);
      this.fbcFilterFileStatus.setValue(-1);
      this.fbcAccuracyStatus.setValue(""); //saurabh shelar

      this.fcAccessionNumber.setValue("");
      // this.fbcYear.setValue(moment().year());
      // this.SetDefaultYear();
      if (this.defaultFolderName) {
        this.fbcFolder.setValue([this.defaultFolderName]);
        this.fbcDropdownFolder.setValue(this.defaultFolderName);
      } else {
        this.fbcFolder.setValue([]);
        this.fbcDropdownFolder.setValue("All");
      }

      this.fbcCategory.setValue([]);
      this.fbcOrderGroup.setValue(""); //saurabh shelar
      this.fbcOrderUser.setValue(""); //saurabh shelar
      if (this.bIsShowGroupUserStatusFilter || this.bIsShowStatusFilter)
        this.fbcOrderWorkQueueStatus.setValue(0); //defaultvalue
      this.fbcSubStatus.setValue(""); //defaultvalue
      this.fbcProvider.setValue([]);
      this.fcHL7.setValue(-1);
      this.fcClientBilling.setValue(-1);
      this.fbcOrderInsurance.setValue([]);
      if (this.lstEncounterClients && this.lstEncounterClients.length == 1) {
        this.fbcEncounterClient.setValue(this.lstEncounterClients[0].nclientid);
      } else {
        this.fbcEncounterClient.setValue(0);
      }
      this.fbcEncounterSource.setValue("All");
      this.fbcAssignmentType.setValue(-1);
      if (this.summarypracticeid == "0") this.fbcPractice.setValue([]);
      // this.showArchivalSwitch = false;
      this.fbcSearchInArchival.setValue(false);
      this.isarchived = false;
      // this.FilterFormGroup.updateValueAndValidity();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      // this.subscription.unsubscribe();
      // this.dataService.orderDay.next("");
      this.dataService.defaultYearDay.next(null);
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateFilter() {
    if (
      this.bIsShowProductionFilter ||
      this.bIsShowFileFilter ||
      this.bIsShowAutomationAccuracyFilter
    ) {
      if (this.fbcFilterStartDate.valid && this.fbcFilterEndDate.valid) {
        return true;
      }
    } else {
      return true;
    }
  }

  getOrderStatus(stauts: string) {
    try {
      this.subscription.add(
        this.coreService.OrderInventoryStatus(stauts).subscribe(
          (data) => {
            // console.log("Master Data");
            // console.log(data);
            if (data != null || data != undefined) {
              this.sourceOrderStatus = data;
              this.orderStatus = this.sourceOrderStatus.slice();
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getLoginUserGroup() {
    this.subscription.add(
      this.authService
        .getLoginUserGroups(this.dataService.loginGCPUserID.getValue())
        .subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.allLoginUserGroup = data;
              this.loginUserGroup = data;
            }
          },
          (err) => {}
        )
    );
  }
  getAllGroups() {
    try {
      this.subscription.add(
        this.authService.getAllGroups().subscribe(
          (data) => {
            if (data) {
              if (!!data.content) {
                this.allLoginUserGroup = data.content;
                this.loginUserGroup = data.content;
              } else {
                this.allLoginUserGroup = null;
                this.loginUserGroup = null;
              }
              this.loadingData = false;
            }
          },
          (error) => {
            this.loadingData = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  objOrderDefaultYearDay: OrderDefaultYearDay = new OrderDefaultYearDay();
  getfolder(yearDefault: any, statusid: any = 0, clientid: any = 0) {
    return this.filterService
      .getFolderCategoryAndYear(yearDefault, statusid, clientid)
      .toPromise();
  }
  async getFolderCategoryAndYear(
    yearDefault: any = 0,
    statusid: any = 0,
    isStausChanged: boolean = false,
    doNotRefreshOrders: boolean = false,
    clientid: any = 0
  ) {
    try {
      let year: number = 0;
      if (yearDefault == 0 || yearDefault == null) {
        yearDefault = 0;
        if (!this.defaultYearEnable) {
          year = -1;
        }
      } else {
        year = yearDefault;
      }
      if (this.bIsShowForIncompleteOrders && statusid == 0) {
        statusid = 3;
      }
      const res = await this.getfolder(year, statusid, clientid);
      // console.log("res", res);
      let response = <FolderCategoryAndYearModel>res;
      if (response) {
        if (isStausChanged) {
          this.subStatusItems = response.substatus;
          return;
        }
        this.categories = response.category;
        this.allCategories = response.category;
        this.folders = response.folder;
        this.allFolders = response.folder;
        this.years = response.year;
        this.allProvidersList = response.providernpi;
        this.providersList = response.providernpi;
        this.subStatusItems = response.substatus;
        this.allOrderInsurance = response.insurancecompanyname;
        this.orderInsurance = response.insurancecompanyname;
        this.lstEncounterClients = response.client;
        this.AllLstEncounterClients = response.client;
        this.encounter = response.encounter;
        this.allLstPractice = response.practice;
        if (this.allLstPractice) {
          this.allLstPractice.splice(0, 0, {
            clientid: "-1",
            client: "NOPRACTICE-Practice not configured",
          });
          this.lstPractice = this.allLstPractice.slice();
        }
        // this.lstPractice = response.practice;
        if (this.lstEncounterClients == null) {
          this.clsUtility.showInfo("Login user is not associated with client");
          this.fbcEncounterClient.setValue(0);
          return;
        } else {
          if (this.lstEncounterClients.length == 1) {
            this.fbcEncounterClient.setValue(
              this.lstEncounterClients[0].nclientid
            );
          }
        }
        if (this.categories == null) {
          this.fbcCategory.setValue([]);
        }
        if (this.folders == null) {
          this.fbcFolder.setValue([]);
          this.fbcDropdownFolder.setValue("All");
        }
        if (this.years == null) {
          this.fbcYear.reset();
          // this.fbcYear.setValue("All");
        }
        if (this.providersList == null) {
          this.fbcProvider.setValue([]);
        }
        if (this.subStatusItems == null) {
          this.fbcSubStatus.setValue("");
        }
        if (this.orderInsurance == null) {
          this.fbcOrderInsurance.setValue([]);
        }
        if (this.lstPractice == null) {
          this.fbcPractice.setValue([]);
        }
        if (this.encounter && this.encounter.length == 1) {
          this.fbcEncounterSource.setValue(this.encounter[0].encountertype);
        } else {
          this.fbcEncounterSource.setValue("All");
        }

        if (yearDefault == "0") {
          if (this.defaultYearEnable) {
            this.SetDefaultYear();
          } else {
            this.fbcYear.setValue("All");
          }
        }
        //for default folder set
        let julianDay = moment().dayOfYear(); // Julian day
        // let julianDay = 360; // Julian day
        let julianDayObj: GetFolders;
        if (this.folders) {
          julianDayObj = this.folders.find(
            (element) => +element.foldername <= julianDay
          );
        }
        if (this.defaultFolderEnable) {
          if (julianDayObj) {
            this.fbcFolder.setValue([julianDayObj.foldername]);
            this.fbcDropdownFolder.setValue(julianDayObj.foldername);
            this.defaultFolderName = julianDayObj.foldername;
          } else {
            this.fbcFolder.setValue([]);
            this.fbcDropdownFolder.setValue("All");
            this.defaultFolderName = "";
          }
        } else {
          this.fbcFolder.setValue([]);
          this.fbcDropdownFolder.setValue("All");
          this.defaultFolderName = "";
        }
        if (
          yearDefault == "0" &&
          (this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.MyEncounters.toLowerCase() ||
            this.CallingPage.toLowerCase() ==
              enumFilterCallingpage.MyReview.toLowerCase() ||
            this.CallingPage.toLowerCase() ==
              enumFilterCallingpage.DocumentCount.toLowerCase() ||
            this.CallingPage.toLowerCase() ==
              enumFilterCallingpage.AdvanceSearchOrder.toLowerCase() ||
            this.CallingPage.toLowerCase() ==
              enumFilterCallingpage.PracticeUserEncounter.toLowerCase() ||
            this.CallingPage.toLowerCase() ==
              enumFilterCallingpage.PracticeAssistanceCompleted.toLowerCase() ||
            (this.summarypracticeid != "0" &&
              this.CallingPage.toLowerCase() ==
                enumFilterCallingpage.OrderAssistanceWorkqueue.toLowerCase())) &&
          doNotRefreshOrders == false
        ) {
          if (
            this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.AdvanceSearchOrder.toLowerCase()
          ) {
            if (this.dataService.advanceSearchValue.value != "") {
              this.btnApplyFilter_Click();
            }
          } else {
            this.btnApplyFilter_Click();
          }
        }
        if (
          this.CallingPage.toLowerCase() ==
            enumFilterCallingpage.OrderWorkqueue.toLowerCase() &&
          yearDefault == "0" &&
          doNotRefreshOrders == false
        ) {
          // this.dataService.orderDay.next(julianDayObj.foldername);

          // this.objOrderDefaultYearDay.folder = [julianDayObj.foldername];
          this.objOrderDefaultYearDay.folder = [];
          this.objOrderDefaultYearDay.cabinet = [this.fbcYear.value];
          this.dataService.defaultYearDay.next(this.objOrderDefaultYearDay);
        }
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  handleClientFilter(searchkey: string) {
    try {
      if (this.AllLstEncounterClients) {
        this.lstEncounterClients = this.AllLstEncounterClients.filter(
          (ele) =>
            ele.clientcodename
              .toLowerCase()
              .includes(searchkey.toLowerCase().trim()) == true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleGroupFilter(value: string) {
    if (this.allLoginUserGroup) {
      this.loginUserGroup = this.allLoginUserGroup.filter(
        (s) =>
          s.groupname.toLowerCase().includes(value.toLowerCase().trim()) ===
          true
      );
    }
  }
  handleAgentFilter(value: string) {
    if (this.AllGroupUsers) {
      this.GroupUsers = this.AllGroupUsers.filter(
        (s) =>
          s.displayname.toLowerCase().includes(value.toLowerCase().trim()) ===
          true
      );
    }
  }
  handleFolderFilter(value: string) {
    if (this.allFolders) {
      this.folders = this.allFolders.filter(
        (s) =>
          s.foldername.toLowerCase().includes(value.toLowerCase().trim()) ===
          true
      );
    }
  }
  handleCategoryFilter(value: string) {
    if (this.allCategories) {
      this.categories = this.allCategories.filter(
        (s) =>
          s.categoryname.toLowerCase().includes(value.toLowerCase().trim()) ===
          true
      );
    }
  }

  handleGenericSearchFilter(value: string, searchField: string) {
    this.searchField = searchField;
    this.searchTextChanged.next(value);
  }
  getGenericSearchData(searchText: string) {
    try {
      if (this.searchField == "practice") this.practiceFilterLoader = true;
      else if (this.searchField == "provider") this.providerFilterLoader = true;
      else if (this.searchField == "insurance")
        this.insuranceFilterLoader = true;
      let reqbody: GenericSearchModel = new GenericSearchModel();
      reqbody.searchfield = this.searchField;
      reqbody.searchtext = searchText.trim();
      reqbody.status = this.fbcOrderWorkQueueStatus.value;
      reqbody.group = this.dataService.groupIds
        ? this.dataService.groupIds.split(",")
        : [];
      this.subscription.add(
        this.filterService.getGenericSearchData(reqbody).subscribe(
          (data) => {
            if (data) {
              if (this.searchField == "practice") {
                this.lstPractice = data.practice;
                this.practiceFilterLoader = false;
              } else if (this.searchField == "provider") {
                this.providersList = data.provider;
                this.providerFilterLoader = false;
              } else if (this.searchField == "insurance") {
                this.orderInsurance = data.insurance;
                this.insuranceFilterLoader = false;
              }

              // if (this.dataService.SummarySelectedPracticeid.value != "") {
              //   this.btnApplyFilter_Click();
              // }
            } else {
              if (this.searchField == "practice") {
                this.lstPractice = [];
                this.practiceFilterLoader = false;
              }
              if (this.searchField == "provider") {
                this.providersList = [];
                this.providerFilterLoader = false;
              }
              if (this.searchField == "insurance") {
                this.orderInsurance = [];
                this.insuranceFilterLoader = false;
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public isItemSelected(
    selectedFormControlArray: any[],
    itemText: string
  ): boolean {
    return selectedFormControlArray.some((item) => item === itemText);
  }
  public summaryTagSelectedValues(dataItems: any[], key: string): string {
    return dataItems.map((ele) => ele[key]).join(",");
  }
  get defaultYearEnable(): boolean {
    if (
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.OrderWorkqueue.toLowerCase() ||
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.OrderExport.toLowerCase() ||
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.DocumentCount.toLowerCase() ||
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.ArchivedEncounters.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  }
  get defaultFolderEnable(): boolean {
    if (
      // this.CallingPage.toLowerCase() ==
      //   enumFilterCallingpage.OrderWorkqueue.toLowerCase() ||
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.OrderExport.toLowerCase() ||
      this.CallingPage.toLowerCase() ==
        enumFilterCallingpage.DocumentCount.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  }
}
