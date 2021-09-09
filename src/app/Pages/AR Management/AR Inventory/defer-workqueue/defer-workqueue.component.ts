import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import {
  GridDataResult,
  SelectableSettings,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { ViewdetailsComponent } from "src/app/Pages/Common/viewdetails/viewdetails.component";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { FilterService } from "../../../Services/Common/filter.service";
import { ToastrService } from "ngx-toastr";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";

@Component({
  selector: "app-defer-workqueue",
  templateUrl: "./defer-workqueue.component.html",
  styleUrls: ["./defer-workqueue.component.css"],
})
export class DeferWorkqueueComponent implements OnInit, OnDestroy {
  public DeferWorkgroupGridData: {};
  public DeferWorkgroupGridView: GridDataResult;
  private DeferWorkgroupItems: any[] = [];
  public DeferWorkgroupSkip = 0;
  public DeferWorkgroupPageSize = 10;
  private subscription = new SubSink();
  // public isAssignedtask = false;
  // public isbtnAssignedtask = false;

  @ViewChild("ViewdetailsComponent", { static: true })
  private ViewdetailsComponent: ViewdetailsComponent;
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  // @ViewChild("WorkqueueassignmentComponent")
  // private WorkqueueassignmentComponent: WorkqueueassignmentComponent;

  public DeferWorkgroupSort: SortDescriptor[] = [
    {
      field: "claimage",
      dir: "desc",
    },
    {
      field: "dtdeferdate",
      dir: "desc",
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

  public DeferWorkGroupSelected: any = [];
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

  ShowUndeferWorkItem = false;

  // Loading
  loadingWorkqueue = true;
  loadingDeferWorkqueueGrid = true;

  ApplyFilter($event) {
    this.loadingWorkqueue = true;
    this.loadingDeferWorkqueueGrid = true;
    var WorkQueueevent = $event;
    // console.log(WorkQueueevent);
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;
    var WorkQueue: Workgroup[];
    WorkQueue = WorkQueueevent.content;
    if (WorkQueueevent.content != null) {
      this.DeferWorkGroupSelected = [];
      this.displaycurrentpages = WorkQueueevent.pageable.pagenumber + 1;
      this.displaytotalpages = WorkQueueevent.totalpages;
      this.totalpagescount = WorkQueueevent.totalpages;
      this.displaytotalrecordscount = WorkQueueevent.totalelements;
    } else {
      this.displaycurrentpages = 0;
      this.displaytotalpages = 0;
      this.displaytotalrecordscount = 0;
      this.totalpagescount = 0;
      this.DeferWorkgroupItems = null;
      this.DeferWorkGroupSelected = [];
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

    this.DeferWorkgroupGridData = WorkQueue;
    this.DeferWorkgroupItems = WorkQueue;
    if (WorkQueueevent.content != null) this.WorkgrouploadItems();
    else this.DeferWorkgroupGridView = null;
    this.filterApplied = this.dataService.isDeferWorkQueueFilterApplied;
    this.loadingWorkqueue = false;
    this.loadingDeferWorkqueueGrid = false;
  }

  constructor(
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
    this.hideColumn("accountcode");
  }
  loginuserid = 0;
  RetriveMasterData(): any {
    this.subscription.add(
      this.filterService
        .applyFilter(
          JSON.stringify(this.lstFilter),
          enumFilterCallingpage.DeferWorkInventory,
          0,
          this.page,
          this.pagesize
        )
        .subscribe(
          (data) => {
            if (data.content != null) {
              this.displaycurrentpages = data.pageable.pagenumber + 1;
              this.displaytotalpages = data.totalpages;
              this.totalpagescount = data.totalpages;
              this.displaytotalrecordscount = data.totalelements;
            } else {
              this.displaycurrentpages = 0;
              this.displaytotalpages = 0;
              this.totalpagescount = 0;
              this.displaytotalrecordscount = 0;
              this.DeferWorkgroupItems = null;
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

            this.DeferWorkgroupGridData = data.content;
            this.DeferWorkgroupItems = data.content;
            if (data.content != null) {
              this.WorkgrouploadItems();
            } else {
              this.DeferWorkgroupGridView = null;
            }
            this.loadingWorkqueue = false;
            this.loadingDeferWorkqueueGrid = false;
          },
          (err) => {
            this.loadingDeferWorkqueueGrid = false;
          }
        )
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          if (data.inventoryAccess != undefined) {
            this.ShowUndeferWorkItem = data.inventoryAccess.UndeferWorkItem;
          }
        }
      })
    );
    this.subscription.add(
      this.dataService.UndeferWorkqueueDone.subscribe((data) => {
        if (data) {
          this.DeferWorkGroupSelected = [];
          if (
            this.NoteModalComponent != null ||
            this.NoteModalComponent != undefined
          ) {
            this.NoteModalComponent.ResetComponents();
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
            this.NoteModalComponent != null ||
            this.NoteModalComponent != undefined
          ) {
            this.NoteModalComponent.ResetComponents();
          }
        }
      })
    );
  }
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
    this.DeferWorkgroupGridView = {
      // data: orderBy(this.WorkgroupItems.slice(this.WorkgroupSkip, this.WorkgroupSkip + this.WorkgroupPageSize), this.WorkgroupSort),
      data: orderBy(this.DeferWorkgroupItems, this.DeferWorkgroupSort),
      total: this.DeferWorkgroupItems.length,
    };
  }
  public WorkgroupPageChange(event: PageChangeEvent): void {
    this.DeferWorkgroupSkip = event.skip;
    this.WorkgrouploadItems();
  }

  DeferWorkgroupSortChange(sort: SortDescriptor[]): void {
    if (this.DeferWorkgroupItems != null) {
      this.DeferWorkgroupSort = sort;
      this.WorkgrouploadItems();
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
      this.loadingDeferWorkqueueGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        // console.log("Previous this.page, this.pagesize : " + this.page, this.pagesize);
        if (this.dataService.isDeferWorkQueueFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  enumFilterCallingpage.DeferWorkInventory,
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pagenumber + 1;
                      this.displaytotalpages = data.totalpages;
                      this.totalpagescount = data.totalpages;
                      this.displaytotalrecordscount = data.totalelements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.DeferWorkgroupItems = null;
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

                    this.DeferWorkgroupGridData = data.content;
                    this.DeferWorkgroupItems = data.content;
                    if (data.content != null) {
                      this.WorkgrouploadItems();
                    } else {
                      this.DeferWorkgroupGridView = null;
                    }
                    this.loadingWorkqueue = false;
                    this.loadingDeferWorkqueueGrid = false;
                  },
                  (err) => {
                    this.loadingDeferWorkqueueGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.loadingWorkqueue = false;
      this.loadingDeferWorkqueueGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingWorkqueue = true;
      this.loadingDeferWorkqueueGrid = true;
      // console.log(this.loadingWorkqueue);
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        // console.log("Next this.page, this.pagesize : " + this.page, this.pagesize);
        // console.log("JSON.stringify(this.dataService.SelectedFilter) : "+JSON.stringify(this.dataService.SelectedFilter));

        if (this.dataService.isDeferWorkQueueFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  enumFilterCallingpage.DeferWorkInventory,
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pagenumber + 1;
                      this.displaytotalpages = data.totalpages;
                      this.totalpagescount = data.totalpages;
                      this.displaytotalrecordscount = data.totalelements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.DeferWorkgroupItems = null;
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

                    this.DeferWorkgroupGridData = data.content;
                    this.DeferWorkgroupItems = data.content;
                    if (data.content != null) {
                      this.WorkgrouploadItems();
                    } else {
                      this.DeferWorkgroupGridView = null;
                    }
                    this.loadingWorkqueue = false;
                    this.loadingDeferWorkqueueGrid = false;
                  },
                  (err) => {
                    this.loadingDeferWorkqueueGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.loadingWorkqueue = false;
      this.loadingDeferWorkqueueGrid = false;
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
    if (this.DeferWorkGroupSelected.length <= 0) {
      this.clsUtility.showInfo("Select workitem to activate");
      return;
    } else {
      this.dataService.NoteWorkItemCount.next(
        this.DeferWorkGroupSelected.length
      );
      this.dataService.NoteCalledFrom.next(
        enumFilterCallingpage.DeferWorkInventory
      );
      this.dataService.NoteTitle.next("Activate Work Item");
      this.dataService.ShowNoteCategory.next(false);
      this.dataService.ShowOrderStatus.next(false);

      this.NoteModalComponent.selectedWorkGroup = this.DeferWorkGroupSelected;
    }
  }
}
