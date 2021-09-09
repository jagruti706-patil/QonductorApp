import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import {
  SelectableSettings,
  GridDataResult,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { MasterdataService } from "../../Services/AR/masterdata.service";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { FilterService } from "../../Services/Common/filter.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { FiltersComponent } from "src/app/Pages/Common/filter/filters/filters.component";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { WorkqueueassignmentComponent } from "src/app/Pages/AR Management/workqueueassignment/workqueueassignment.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../node_modules/subsink";
import { DatePipe } from "@angular/common";
import { NoteModalComponent } from "../../Common/note-modal/note-modal.component";
declare var $: any;

@Component({
  selector: "app-workqueue",
  templateUrl: "./workqueue.component.html",
  styleUrls: ["./workqueue.component.css"],
})
export class WorkqueueComponent implements OnInit, OnDestroy {
  public WorkgroupGridData: {};
  public WorkgroupGridView: GridDataResult;
  private WorkgroupItems: any[] = [];
  public WorkgroupSkip = 0;
  public WorkgroupPageSize = 10;
  private subscription = new SubSink();
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;

  private Workqueuegroupid: string = "";
  private CallingPage: string = "WorkQueue";
  @ViewChild("ViewdetailsComponent", { static: true })
  private ViewdetailsComponent: ViewdetailsComponent;
  @ViewChild("WorkqueueassignmentComponent")
  private WorkqueueassignmentComponent: WorkqueueassignmentComponent;
  @ViewChild("DeferNoteComponent")
  private DeferNoteComponent: NoteModalComponent;

  public WorkgroupSort: SortDescriptor[] = [
    {
      field: "claimage",
      dir: "desc",
    },
    {
      field: "lastworkeddate",
      dir: "asc",
    },
  ];

  // public openedView = false;
  public openedAssign = false;
  public filterApplied = false;
  public ClientDefaultValue = { id: 0, value: "All" };
  public PayerDefaultValue = { id: 0, value: "All" };
  public checkboxOnly = true;
  public mode = "multiple";
  public selectableSettings: SelectableSettings;
  workitem: any;

  public WorkGroupSelected: any = [];
  public hiddenColumns: string[] = [];
  lstFilter: InventoryInputModel = new InventoryInputModel();

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;
  private clsUtility: Utility;
  public sFilters: any;

  ShowAssignWorkItem = false;
  ShowDeferWorkItem = false;

  // Loading
  loadingWorkqueue = true;
  loadingWorkqueueGrid = true;

  ApplyFilter($event) {
    // this.WorkGroupSelected = [];
    // if (this.dataService.SelectedFilter != null || this.dataService.SelectedFilter != undefined) {
    //   let filter = this.dataService.SelectedFilter;
    //   if (filter.workitemstatus == 1)
    //     this.isbtnAssignedtask = true;
    //   else
    //     this.isbtnAssignedtask = false;
    // }

    // console.log("Apply filters this.dataService.SelectedFilter : " + JSON.stringify(this.dataService.SelectedFilter));
    // if (this.dataService.SelectedFilter != null || this.dataService.SelectedFilter != undefined) {
    //   let filter = this.dataService.SelectedFilter;
    //   this.sFilters = null;

    //   // if (JSON.stringify(filter.client) != null && JSON.stringify(filter.client) != undefined)
    //   {
    //     if (JSON.stringify(filter.client) == '[]')
    //       this.sFilters.client = 'All';
    //     else
    //       this.sFilters.client = filter.client[0].clientname;
    //   }

    //   // if (JSON.stringify(filter.payer) != null && JSON.stringify(filter.payer) != undefined)
    //   if (JSON.stringify(filter.payer) == '[]')
    //     this.sFilters.payer = 'All';
    //   else
    //     this.sFilters.payer = filter.payer[0].payername;

    //   if (filter.age == "0" || filter.age == "")
    //     this.sFilters.age = 'All';
    //   else
    //     this.sFilters.age = filter.age;

    //   if (filter.insurancedue == 0)
    //     this.sFilters.insurancedue = '0';
    //   else
    //     this.sFilters.insurancedue = filter.insurancedue;

    //   if (filter.lastworkedage == 0)
    //     this.sFilters.lastworkedage = '0';
    //   else
    //     this.sFilters.lastworkedage = filter.lastworkedage;

    //   if (filter.workitemstatus == 1)
    //     this.sFilters.workitemstatus = 'Assigned';
    //   else if (filter.workitemstatus == 1)
    //     this.sFilters.workitemstatus = 'Unassigned';
    //   else
    //     this.sFilters.workitemstatus = 'All';

    //   if (filter.automationstatus == "")
    //     this.sFilters.automationstatus = 'All';
    //   else
    //     this.sFilters.automationstatus = filter.automationstatus;

    //   if (JSON.stringify(filter.billingProvider) == '[]')
    //     this.sFilters.billingProvider = 'All';
    //   else
    //     this.sFilters.billingProvider = filter.billingProvider[0].providername;

    //   if (JSON.stringify(filter.renderingProvider) == '[]')
    //     this.sFilters.renderingProvider = 'All';
    //   else
    //     this.sFilters.renderingProvider = filter.renderingProvider[0].providername;

    // }
    // console.log('sFilters : ' + JSON.stringify(this.sFilters));
    // console.log("this.dataService.isWorkQueueFilterApplied : " + this.dataService.isWorkQueueFilterApplied);
    this.loadingWorkqueue = true;
    this.loadingWorkqueueGrid = true;
    var WorkQueueevent = $event;
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;
    var WorkQueue: Workgroup[];
    WorkQueue = WorkQueueevent.content;
    if (WorkQueueevent.content != null) {
      this.WorkGroupSelected = [];
      this.displaycurrentpages = WorkQueueevent.pageable.pageNumber + 1;
      this.displaytotalpages = WorkQueueevent.totalPages;
      this.totalpagescount = WorkQueueevent.totalPages;
      this.displaytotalrecordscount = WorkQueueevent.totalElements;
    } else {
      this.displaycurrentpages = 0;
      this.displaytotalpages = 0;
      this.displaytotalrecordscount = 0;
      this.totalpagescount = 0;
      this.WorkgroupItems = null;
      this.WorkGroupSelected = [];
    }
    if (JSON.stringify(WorkQueueevent.last) == "true") {
      this.Isnextdisabled = true;
    } else {
      this.Isnextdisabled = false;
    }
    if (this.page == 0) {
      this.Ispreviousdisabled = true;
    } else {
      this.Ispreviousdisabled = false;
    }

    this.WorkgroupGridData = WorkQueue;
    this.WorkgroupItems = WorkQueue;
    if (WorkQueueevent.content != null) this.WorkgrouploadItems();
    else this.WorkgroupGridView = null;
    this.filterApplied = this.dataService.isWorkQueueFilterApplied;
    this.loadingWorkqueue = false;
    this.loadingWorkqueueGrid = false;
  }

  TaskAssingmentDone($event) {
    if ($event) {
      // this.WorkqueueassignmentComponent.selectedAgent = null;
      // this.WorkqueueassignmentComponent.selectedWorkGroup = null;
      this.WorkGroupSelected = [];
      this.WorkqueueassignmentComponent.ResetComponents();
      if (
        this.dataService.SelectedFilter != null ||
        this.dataService.SelectedFilter != undefined
      ) {
        this.lstFilter = this.dataService.SelectedFilter;
        if (this.lstFilter.age == "All") this.lstFilter.age = "";
        if (this.lstFilter.automationstatus == "All")
          this.lstFilter.automationstatus = "";
      }
      this.RetriveMasterData();
      this.WorkgrouploadItems();
    } else {
      this.WorkqueueassignmentComponent.ResetComponents();
    }
  }
  constructor(
    private MasterService: MasterdataService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.subscription.add(
      this.dataService.loginUserID.subscribe((loginUser) => {
        this.loginuserid = loginUser;
      })
    );
    this.dataService.SelectedFilter = this.lstFilter;
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.setSelectableSettings();
    this.RetriveMasterData();
    // this.WorkgrouploadItems();
    this.hideColumn("nworkqueuegroupid");
    this.hideColumn("patientcode");
    this.hideColumn("accountcode");
  }
  loginuserid = 0;
  RetriveMasterData(): any {
    // this.filterService.applyFilter(JSON.stringify(this.lstFilter)).subscribe(
    //   (data) => {
    //     this.WorkgroupGridData = data.content;
    //     this.WorkgroupItems = data.content;
    //     this.WorkgrouploadItems();
    //   });
    // this.lstFilter.client = [];
    // this.lstFilter.payer = [];
    // this.lstFilter.agent = [];
    // this.lstFilter.workitemstatus = 2;
    // this.lstFilter.lastworkedage = 30;
    // this.lstFilter.startdate = new DatePipe("en-US").transform(
    //   Date.now(),
    //   "yyyy-MM-dd"
    // ); //1month before
    // this.lstFilter.enddate = new DatePipe("en-US").transform(
    //   Date.now(),
    //   "yyyy-MM-dd"
    // );
    // this.lstFilter.renderingProvider =[];
    // this.lstFilter.billingProvider =[];
    // "client": FliterClient[] = [];
    //   "payer": FilterPayer[] = [];
    //   "agent": FilterAgent[] = [];
    //   "workitemstatus" = 2;
    //   "lastworkedage" = 30;
    //   "startdate": string = new DatePipe("en-US").transform(
    //     Date.now(),
    //     "yyyy-MM-dd"
    //   ); //1month before
    //   "enddate": string = new DatePipe("en-US").transform(Date.now(), "yyyy-MM-dd"); //Todays date
    //   "renderingProvider": OutputRenderingproviders[] = [];
    //   "billingProvider": OutputBillingproviders[] = [];
    //   "automationstatus": string = "";
    //   "age": string = "";
    //   "insurancedue": number = 0;
    //   "searchtext": string = "";
    //   "priority": number = 0;
    //   "followupstartdate": string = new DatePipe("en-US").transform(
    //     // Date.now(),
    //     moment(),
    //     "yyyy-MM-dd"
    //   );
    //   "followupenddate": string = new DatePipe("en-US").transform(
    //     // Date.now(),
    //     moment(),
    //     "yyyy-MM-dd"
    //   );

    //   "filestatus" = -1;
    this.subscription.add(
      this.filterService
        .applyFilter(
          JSON.stringify(this.lstFilter),
          "workqueue",
          0,
          this.page,
          this.pagesize
        )
        .subscribe(
          (data) => {
            if (data.content != null) {
              this.displaycurrentpages = data.pageable.pageNumber + 1;
              this.displaytotalpages = data.totalPages;
              this.totalpagescount = data.totalPages;
              this.displaytotalrecordscount = data.totalElements;
            } else {
              this.displaycurrentpages = 0;
              this.displaytotalpages = 0;
              this.totalpagescount = 0;
              this.displaytotalrecordscount = 0;
              this.WorkgroupItems = null;
            }

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

            this.WorkgroupGridData = data.content;
            this.WorkgroupItems = data.content;
            if (data.content != null) {
              this.WorkgrouploadItems();
            } else {
              this.WorkgroupGridView = null;
            }
            this.loadingWorkqueue = false;
            this.loadingWorkqueueGrid = false;
          },
          (err) => {
            this.loadingWorkqueueGrid = false;
          }
        )
    );

    // this.MasterService.getAllWorkQueue(0).subscribe((data) => {
    //   this.WorkgroupGridData = data;
    //   this.WorkgroupItems = data;
    //   this.WorkgrouploadItems();
    // });
  }

  ngOnInit() {
    // var date=Date.UTC.;
    // var _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    // console.log(date);
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          // console.log(
          //   "Data in ar-cards: " + JSON.stringify(data.inventoryAccess)
          // );
          // console.log(
          //   "Data.dashboardAccess in ar-cards: " +
          //     JSON.stringify(data.dashboardAccess)
          // );
          if (data.inventoryAccess != undefined) {
            // console.log("data.dashboardAccess is not undefined. ");
            this.ShowAssignWorkItem = data.inventoryAccess.AssignWorkItem;
            this.ShowDeferWorkItem = data.inventoryAccess.DeferWorkItem;
            // console.log("this.ShowAssignWorkItem" + this.ShowAssignWorkItem);
            // console.log("this.ShowDeferWorkItem" + this.ShowDeferWorkItem);
          }
        }
      })
    );
    this.subscription.add(
      this.dataService.DeferWorkqueueDone.subscribe((data) => {
        if (data) {
          this.WorkGroupSelected = [];
          if (
            this.DeferNoteComponent != null ||
            this.DeferNoteComponent != undefined
          ) {
            this.DeferNoteComponent.ResetComponents();
          }
          if (
            this.dataService.SelectedFilter != null ||
            this.dataService.SelectedFilter != undefined
          ) {
            this.lstFilter = this.dataService.SelectedFilter;
            if (this.lstFilter.age == "All") this.lstFilter.age = "";
            if (this.lstFilter.automationstatus == "All")
              this.lstFilter.automationstatus = "";
          }
          this.RetriveMasterData();
          this.WorkgrouploadItems();
        } else {
          if (
            this.DeferNoteComponent != null ||
            this.DeferNoteComponent != undefined
          ) {
            this.DeferNoteComponent.ResetComponents();
          }
        }
      })
    );
  }
  // public close() {
  //   this.openedView = false;
  // }
  public closeAssign() {
    this.openedAssign = false;
  }

  onOpenViewdetails(item) {
    // $("#viewdetailsModal").modal('show');
    this.ViewdetailsComponent.CallingPage = "WorkQueue";
    this.ViewdetailsComponent.Workqueuegroupid = item.nworkqueuegroupid;
    this.ViewdetailsComponent.setWorkQueueGroupDetails();
    this.workitem = item;
  }

  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      // mode: this.mode
    };
  }

  WorkgrouploadItems(): any {
    this.WorkgroupGridView = {
      // data: orderBy(this.WorkgroupItems.slice(this.WorkgroupSkip, this.WorkgroupSkip + this.WorkgroupPageSize), this.WorkgroupSort),
      data: orderBy(this.WorkgroupItems, this.WorkgroupSort),
      total: this.WorkgroupItems.length,
    };
  }
  public WorkgroupPageChange(event: PageChangeEvent): void {
    this.WorkgroupSkip = event.skip;
    this.WorkgrouploadItems();
  }

  WorkgroupSortChange(sort: SortDescriptor[]): void {
    if (this.WorkgroupItems != null) {
      this.WorkgroupSort = sort;
      this.WorkgrouploadItems();
    }
  }
  onAssignClick() {
    try {
      // console.log("this.WorkGroupSelected.length : " + this.WorkGroupSelected.length);
      // this.isAssignedtask = false;
      // if (this.WorkGroupSelected.length <= 0) {
      //   this.clsUtility.showInfo('Select work group to assign');
      //   return;
      // } else {
      //   console.log("WorkGroupSelected : " + JSON.stringify(this.WorkGroupSelected));

      //   if (this.WorkGroupSelected.find(x => x.workitemstatus === true)) {
      //     this.isAssignedtask = true;
      //     this.clsUtility.showInfo("Assigned task cannot be assigned");
      //     return;
      //   }
      //   else {
      //     // console.log("this.WorkqueueassignmentComponent : " + JSON.stringify(this.WorkqueueassignmentComponent));

      //     this.WorkqueueassignmentComponent.DueDate.setValue(new Date());
      //     this.WorkqueueassignmentComponent.selectedWorkGroup = this.WorkGroupSelected;
      //     this.WorkqueueassignmentComponent.setworkqueueassignment();
      //   }
      if (this.WorkGroupSelected.length <= 0) {
        this.clsUtility.showInfo("Select workitem to assign");
        return;
      } else {
        // this.WorkqueueassignmentComponent.DueDate.setValue(new Date());
        this.WorkqueueassignmentComponent.DueDate.setValue(
          new Date(new DatePipe("en-US").transform(new Date(), "MM/dd/yyyy"))
        );
        this.WorkqueueassignmentComponent.selectedWorkGroup = this.WorkGroupSelected;
        this.WorkqueueassignmentComponent.setworkqueueassignment();
        this.openedAssign = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public selectedCallback = (args) => args.dataItem;

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }
  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;
    hiddenColumns.push(columnName);
  }

  onClickPrevious() {
    try {
      this.loadingWorkqueue = true;
      this.loadingWorkqueueGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        // console.log("Previous this.page, this.pagesize : " + this.page, this.pagesize);
        if (this.dataService.isWorkQueueFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "Workqueue",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pageNumber + 1;
                      this.displaytotalpages = data.totalPages;
                      this.totalpagescount = data.totalPages;
                      this.displaytotalrecordscount = data.totalElements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.WorkgroupItems = null;
                    }

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

                    this.WorkgroupGridData = data.content;
                    this.WorkgroupItems = data.content;
                    if (data.content != null) {
                      this.WorkgrouploadItems();
                    } else {
                      this.WorkgroupGridView = null;
                    }
                    this.loadingWorkqueue = false;
                    this.loadingWorkqueueGrid = false;
                  },
                  (err) => {
                    this.loadingWorkqueueGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.loadingWorkqueue = false;
      this.loadingWorkqueueGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingWorkqueue = true;
      this.loadingWorkqueueGrid = true;
      // console.log(this.loadingWorkqueue);
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        // console.log("Next this.page, this.pagesize : " + this.page, this.pagesize);
        // console.log("JSON.stringify(this.dataService.SelectedFilter) : "+JSON.stringify(this.dataService.SelectedFilter));

        if (this.dataService.isWorkQueueFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "Workqueue",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pageNumber + 1;
                      this.displaytotalpages = data.totalPages;
                      this.totalpagescount = data.totalPages;
                      this.displaytotalrecordscount = data.totalElements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.WorkgroupItems = null;
                    }

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

                    this.WorkgroupGridData = data.content;
                    this.WorkgroupItems = data.content;
                    if (data.content != null) {
                      this.WorkgrouploadItems();
                    } else {
                      this.WorkgroupGridView = null;
                    }
                    this.loadingWorkqueue = false;
                    this.loadingWorkqueueGrid = false;
                  },
                  (err) => {
                    this.loadingWorkqueueGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.loadingWorkqueue = false;
      this.loadingWorkqueueGrid = false;
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

  CheckWorkQueueSelected() {
    if (this.WorkGroupSelected.length <= 0) {
      this.clsUtility.showInfo("Select workitem to defer");
      return;
    } else {
      this.dataService.NoteCalledFrom.next(enumFilterCallingpage.WorkInventory);
      this.dataService.NoteWorkItemCount.next(this.WorkGroupSelected.length);
      this.dataService.NoteTitle.next("Defer Work Item");
      this.dataService.ShowNoteCategory.next(true);
      this.dataService.ShowOrderStatus.next(false);
      this.DeferNoteComponent.selectedWorkGroup = this.WorkGroupSelected;
    }
  }
}
