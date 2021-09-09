import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Task } from "src/app/Model/AR Management/Task/task";
import { Utility, enumTaskCallingPage } from "src/app/Model/utility";
import {
  SelectableSettings,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../../Services/Common/filter.service";
import { ContextMenuSelectEvent } from "@progress/kendo-angular-menu";
import { TaskMenuItem } from "src/app/Model/AR Management/Task/task-menu-item";
import { QualityviewdetailsComponent } from "src/app/Pages/AR Management/Quality/qualityviewdetails/qualityviewdetails.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;
@Component({
  selector: "app-my-completed-task",
  templateUrl: "./my-completed-task.component.html",
  styleUrls: ["./my-completed-task.component.css"],
})
export class MyCompletedTaskComponent implements OnInit, OnDestroy {
  public TaskGridData: {};
  public TaskGridView: GridDataResult;
  private TaskItems: any[] = [];
  public TaskSort: SortDescriptor[] = [
    {
      field: "createdon",
      dir: "desc",
    },
    {
      field: "priority",
      dir: "asc",
    },
  ];
  // public pageSize = 10;
  public skip = 0;
  Tasks: any;
  public hiddenColumns: string[] = [];
  public checkboxOnly = true;
  public selectableSettings: SelectableSettings;
  public SelectedTasks: any = [];
  clsUtility: Utility;
  lstFilter: InventoryInputModel = new InventoryInputModel();

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;

  public filterApplied = false;
  public items: any[] = TaskMenuItem.ClosedTaskMenu;
  private subscription = new SubSink();
  public bistasksyncinqpm: boolean = false;

  // Loading
  loadingCompletedtask = true;
  loadingCompletedtaskGrid = true;

  @ViewChild("QualityViewdetailsComponent", { static: true })
  private QualityViewdetailsComponent: QualityviewdetailsComponent;

  constructor(
    private masterService: MasterdataService,
    private router: Router,
    private data: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.subscription.add(
      this.data.loginUserID.subscribe((loginUser) => {
        this.loginuserid = loginUser;
      })
    );
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;
    this.hideColumn("ntaskid");
    this.setSelectableSettings();
    this.RetriveMasterDate();
    // this.loadItems();
  }
  loginuserid = 0;
  ngOnInit() {
    // alert(this.data.SelectedUserid);
  }

  ApplyFilter($event) {
    // console.log('in ApplyFilterWorkgroup of WQ'+$event);
    this.loadingCompletedtask = true;
    this.loadingCompletedtaskGrid = true;
    var Taskevent = $event;
    this.page = 0;
    this.pagesize = 1;
    var Tasks: Task[];
    Tasks = Taskevent.content;

    if (Taskevent.content != null) {
      this.displaycurrentpages = Taskevent.pageable.pageNumber + 1;
      this.displaytotalpages = Taskevent.totalPages;
      this.totalpagescount = Taskevent.totalPages;
      this.displaytotalrecordscount = Taskevent.totalElements;
    } else {
      this.displaycurrentpages = 0;
      this.displaytotalpages = 0;
      this.totalpagescount = 0;
      this.displaytotalrecordscount = 0;
      this.TaskItems = null;
    }

    if (JSON.stringify(Taskevent.last) == "true") {
      this.Isnextdisabled = true;
    } else {
      this.Isnextdisabled = false;
    }
    if (this.page == 0) {
      this.Ispreviousdisabled = true;
    } else {
      this.Ispreviousdisabled = false;
    }

    this.TaskGridData = Tasks;
    this.TaskItems = Tasks;
    if (Taskevent.content != null) this.TaskLoadItems();
    else this.TaskGridView = null;
    this.filterApplied = this.data.isCompletetdTaskFilterApplied;
    this.loadingCompletedtask = false;
    this.loadingCompletedtaskGrid = false;
  }

  TaskLoadItems(): any {
    try {
      this.TaskGridView = {
        // data: orderBy(this.WorkgroupItems.slice(this.WorkgroupSkip, this.WorkgroupSkip + this.WorkgroupPageSize), this.WorkgroupSort),
        data: orderBy(this.TaskItems, this.TaskSort),
        total: this.TaskItems.length,
      };
      // this.SelectedTasks.push(this.TaskItems[0]);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public setSelectableSettings(): void {
    try {
      this.selectableSettings = {
        checkboxOnly: this.checkboxOnly,
        // mode: this.mode
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public selectedCallback = (args) => args.dataItem;

  RetriveMasterDate(): any {
    try {
      //this.Tasks = this.masterService.getTasks();

      if (this.loginuserid > 0) {
        this.subscription.add(
          this.filterService
            .applyFilter(
              JSON.stringify(this.lstFilter),
              "completedtask",
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
                  this.TaskItems = null;
                  this.TaskGridView = null;
                }
                // console.log("data : " + JSON.stringify(data));

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

                this.TaskGridData = data.content;
                this.TaskItems = data.content;
                if (data.content != null) this.TaskLoadItems();
                else this.TaskGridView = null;
                this.loadingCompletedtask = false;
                this.loadingCompletedtaskGrid = false;
              },
              (err) => {
                this.loadingCompletedtaskGrid = false;
              }
            )
        );
      }

      // this.masterService.getAllMyTasks(this.data.SelectedUserid).subscribe((data) => {
      //   console.log(data);
      //   this.TaskGridData = data;
      //   this.TaskItems = data;
      //   this.TaskLoadItems();
      // });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // public TaskPageChange(event: PageChangeEvent): void {
  //   this.TaskSkip = event.skip;
  //   this.TaskloadItems();
  // }

  TaskSortChange(sort: SortDescriptor[]): void {
    if (this.TaskItems != null) {
      this.TaskSort = sort;
      this.TaskLoadItems();
    }
  }

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;
    hiddenColumns.push(columnName);
  }

  onWorkTask(AllTask) {
    try {
      if (this.SelectedTasks == null && AllTask == 1) {
        this.clsUtility.showInfo("Select a task to work");
        return;
      } else {
        if (AllTask == 0) {
          this.SelectedTasks = this.TaskItems;
        }
        this.data.SelectedTasks = this.SelectedTasks;
        this.data.editTaskID = this.SelectedTasks[0].ntaskid;
        this.data.TaskCallingForm = enumTaskCallingPage.MyCompletedTask;
        // console.log(this.data.SelectedTasks);
        this.router.navigate(["/TaskWorkPane"]);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  set TaskData(value) {
    this.data.SelectedTasks = value;
  }

  public editClientid: number = 0;
  public InputEditMessage: string;
  public OutEditResult: boolean;

  EditClientTemplate({ sender, rowIndex, dataItem }) {
    try {
      if (this.SelectedTasks.length == 1) {
        this.SelectedTasks.splice(0);
      }
      if (dataItem.bistasksyncinqpm == false) {
        this.bistasksyncinqpm = false;
        this.SelectedTasks.push(dataItem);

        if (dataItem != null && dataItem != undefined) {
          this.editClientid = dataItem.ntaskid;
          this.InputEditMessage =
            "Do you want to edit task " + dataItem.staskcode + "?";
        }
      } else {
        this.bistasksyncinqpm = true;

        this.clsUtility.showInfo(
          "Modify on synced OR closed task is not allowed"
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (
        this.OutEditResult == true &&
        this.SelectedTasks != null &&
        this.SelectedTasks != undefined
      ) {
        this.data.SelectedTasks = this.SelectedTasks;
        this.data.editTaskID = this.SelectedTasks[0].ntaskid;
        // console.log('move to task'+this.editClientid);
        this.data.TaskCallingForm = enumTaskCallingPage.MyCompletedTask;
        this.router.navigate(["/TaskWorkPane"]);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // onMenuItemSelect(
  //   e: ContextMenuSelectEvent,
  //   ntaskid: any,
  //   nworkqueuegroupid: any
  // ) {
  //   try {
  //     if (e.item.value == 1) {
  //       this.OnViewDetails(ntaskid, nworkqueuegroupid);
  //     } else {
  //       alert(e.item.value);
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  onActionButtonClick(button: string, ntaskid: any, nworkqueuegroupid: any) {
    try {
      if (button === "info") {
        this.OnViewDetails(ntaskid, nworkqueuegroupid);
      } else {
        // this.getTaskbyid(ntaskid);
        // alert(e.item.value);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClickPrevious() {
    try {
      this.loadingCompletedtask = true;
      this.loadingCompletedtaskGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        if (this.data.isCompletetdTaskFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.lstFilter),
                  "completedtask",
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
                      this.TaskItems = null;
                      this.TaskGridView = null;
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

                    this.TaskGridData = data.content;
                    this.TaskItems = data.content;
                    if (data.content != null) this.TaskLoadItems();
                    else this.TaskGridView = null;
                    this.loadingCompletedtask = false;
                    this.loadingCompletedtaskGrid = false;
                  },
                  (err) => {
                    this.loadingCompletedtaskGrid = false;
                  }
                )
            );
          }
        } else {
          this.RetriveMasterDate();
        }
      }
    } catch (error) {
      this.page = this.page + 1;
      this.loadingCompletedtask = false;
      this.loadingCompletedtaskGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingCompletedtask = true;
      this.loadingCompletedtaskGrid = true;
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        // console.log("Next : " + this.page + this.data.isTaskFilterApplied);

        if (this.data.isCompletetdTaskFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.lstFilter),
                  "completedtask",
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
                      this.TaskItems = null;
                      this.TaskGridView = null;
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

                    this.TaskGridData = data.content;
                    this.TaskItems = data.content;
                    if (data.content != null) this.TaskLoadItems();
                    else this.TaskGridView = null;
                    this.loadingCompletedtask = false;
                    this.loadingCompletedtaskGrid = false;
                  },
                  (err) => {
                    this.loadingCompletedtaskGrid = false;
                  }
                )
            );
          }
        } else {
          this.RetriveMasterDate();
        }
      }
    } catch (error) {
      this.page = this.page - 1;
      this.loadingCompletedtask = false;
      this.loadingCompletedtaskGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  OnViewDetails(ntaskid: any, nworkqueuegroupid: any) {
    try {
      $("#qualityviewdetailsModal").modal("show");
      this.QualityViewdetailsComponent.CallingPage = "Completedtask";
      this.QualityViewdetailsComponent.Taskid = ntaskid;
      this.QualityViewdetailsComponent.Workqueuegroupid = nworkqueuegroupid;
      this.QualityViewdetailsComponent.setTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputViewDetailsEditResult($event) {
    try {
      // this.getTaskGridDetails();
      this.QualityViewdetailsComponent.ResetComponents();
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
