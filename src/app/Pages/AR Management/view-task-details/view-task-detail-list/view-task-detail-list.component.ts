import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { FormBuilder, Validators } from "@angular/forms";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import {
  Filter,
  OutputFilter,
  OutputAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../../Services/Common/filter.service";
import { ViewTaskDetailsComponent } from "src/app/Pages/AR Management/view-task-details/view-task-details/view-task-details.component";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-view-task-detail-list",
  templateUrl: "./view-task-detail-list.component.html",
  styleUrls: ["./view-task-detail-list.component.css"],
})
export class ViewTaskDetailListComponent implements OnInit, OnDestroy {
  public SelectedTaskid: number = 0;
  public SelectedWorkqueuegroupid: number = 0;
  private ARRepID: number = 0;
  private Statusid: number = -1;
  public ARRepDetail: any = [];
  public sTaskStatus: any = [
    { text: "All", value: 0 },
    { text: "Pending", value: 1 },
    { text: "Completed but not reviewed", value: 2 },
    { text: "Cancel", value: 3 },
    { text: "System closed", value: 4 },
    { text: "Completed and reviewed", value: 5 },
  ];
  // public TaskDefaultStatusValue = { text: "Completed", value: 2 };
  public AgentDefaultValue = { agentname: "All", agentid: 0 };
  public TaskDefaultStatusValue = 1;
  lstFilter: InventoryInputModel = new InventoryInputModel();

  public ViewTaskGridData: {};
  public ViewTaskGridView: GridDataResult;
  private ViewTaskItems: any[] = [];
  public ViewTaskSkip = 0;
  public ViewTaskPageSize = 10;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public totalpagescount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  private subscription = new SubSink();
  SelectedAgentId = 0;
  SelectedStatus = 0;

  private clsUtility: Utility;
  // Loading
  loadingviewtask = true;
  loadingviewtaskGrid = true;
  lstClients: OutputAgent[];

  public ViewTaskSort: SortDescriptor[] = [
    {
      field: "modifiedon",
      dir: "desc",
    },
  ];

  @ViewChild("ViewTaskdetailsComponent", { static: true })
  private ViewTaskdetailsComponent: ViewTaskDetailsComponent;

  constructor(
    private fb: FormBuilder,
    private MasterService: MasterdataService,
    private filterService: FilterService
  ) {
    this.clsUtility = new Utility();
    this.pagesize = this.clsUtility.pagesize;
  }

  DropDownGroup = this.fb.group({
    fcRepName: ["", Validators.required],
    fcTaskStatus: ["", Validators.required],
  });

  get RepName() {
    return this.DropDownGroup.get("fcRepName");
  }

  get TaskStatus() {
    return this.DropDownGroup.get("fcTaskStatus");
  }

  ngOnInit() {
    try {
      this.loadingviewtask = true;
      this.loadingviewtaskGrid = true;
      this.getAgentById(this.ARRepID);
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getAgentById(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = false;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = true;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                AllFilterJSON = data;
                this.lstClients = AllFilterJSON.arrepresentative;
              }
            },
            (err) => {
              this.loadingviewtaskGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getTaskGridDetails() {
    try {
      this.subscription.add(
        this.filterService
          .getARReviewViewTaskDetails(
            this.SelectedAgentId,
            this.page,
            this.pagesize,
            this.SelectedStatus
          )
          .subscribe(
            (data) => {
              // console.log(dat);

              if (data.content != null && data.content.length > 0) {
                this.displaycurrentpages = data.pageable.pageNumber + 1;
                this.displaytotalpages = data.totalPages;
                this.totalpagescount = data.totalPages;
                this.displaytotalrecordscount = data.totalElements;
              } else {
                this.displaycurrentpages = 0;
                this.displaytotalpages = 0;
                this.totalpagescount = 0;
                this.displaytotalrecordscount = 0;
                this.ViewTaskItems = null;
                this.ViewTaskGridView = null;
              }

              // this.displaycurrentpages = data.pageable.pageNumber + 1;
              // this.displaytotalpages = data.totalPages;
              // this.totalpagescount = data.totalPages;
              // this.displaytotalrecordscount = data.totalElements;
              if (JSON.stringify(data.last) == "true") {
                this.Isnextdisabled = true;
              } else {
                this.Isnextdisabled = false;
              }
              if (this.page == 0) {
                this.Ispreviousdisabled = true;
              } else {
                this.Ispreviousdisabled = false;
              }

              this.ViewTaskGridData = data.content;
              this.ViewTaskItems = data.content;
              if (data.content != null) this.ViewTaskLoadItems();
              else this.ViewTaskGridView = null;
              this.loadingviewtask = false;
              this.loadingviewtaskGrid = false;
            },
            (err) => {
              this.loadingviewtaskGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.RepName.valueChanges.subscribe(
          (data: number) => {
            if (data != null || data != undefined) {
              this.page = 0;
              this.ViewTaskSkip = 0;
              this.SelectedAgentId = data;
              this.getTaskGridDetails();
            }
            // console.log("this.SelectedClientId: " + this.SelectedAgentId);
          },
          (err) => {
            this.loadingviewtaskGrid = false;
          }
        )
      );
      this.subscription.add(
        this.TaskStatus.valueChanges.subscribe(
          (data: number) => {
            if (data != null || data != undefined) {
              this.page = 0;
              this.ViewTaskSkip = 0;
              this.SelectedStatus = data;
              this.getTaskGridDetails();
            }
            // console.log("this.SelectedStatus: " + this.SelectedStatus);
          },
          (err) => {
            this.loadingviewtaskGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private ViewTaskLoadItems(): void {
    try {
      this.ViewTaskGridView = {
        // data: orderBy(
        //   this.QualityItems.slice(
        //     this.QualitySkip,
        //     this.QualitySkip + this.QualityPageSize
        //   ),
        //   this.QualitySort
        // ),
        data: orderBy(this.ViewTaskItems, this.ViewTaskSort),
        total: this.ViewTaskItems.length,
      };
      // console.log(
      //   "this.QualityGridView : " + JSON.stringify(this.QualityGridView)
      // );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortAgentChange(sort: SortDescriptor[]): void {
    try {
      if (this.ViewTaskItems) {
        this.ViewTaskSort = sort;
        this.ViewTaskLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeFiles(event: PageChangeEvent): void {
    try {
      this.ViewTaskSkip = event.skip;
      this.ViewTaskLoadItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onAgentChange(event: any) {
    try {
      this.ViewTaskSkip = 0;
      this.getTaskGridDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onStatusChange(event: any) {
    try {
      this.ViewTaskSkip = 0;
      this.getTaskGridDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onMasterStatusChange(event: any) {
    if (event == "Process") this.Statusid = 1;
    else if (event == "Unprocess") this.Statusid = 0;
    else this.Statusid = -1;
    this.ViewTaskSkip = 0;
    this.getTaskGridDetails();
  }

  onClickPrevious() {
    try {
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        this.getTaskGridDetails();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        this.getTaskGridDetails();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.clsUtility.LogError(error);
    }
  }

  OnViewDetails(ntaskid: any, nworkqueuegroupid: any) {
    try {
      // this.QualityViewdetailsComponent.ResetComponents();
      this.ViewTaskdetailsComponent.CallingPage = "QualityReview";
      this.ViewTaskdetailsComponent.Taskid = ntaskid;
      this.ViewTaskdetailsComponent.Workqueuegroupid = nworkqueuegroupid;
      this.ViewTaskdetailsComponent.setTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputViewTaskDetailResult($event) {
    try {
      this.getTaskGridDetails();
      this.ViewTaskdetailsComponent.ResetComponents();
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
