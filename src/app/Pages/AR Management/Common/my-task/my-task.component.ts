import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import {
  GridDataResult,
  SelectableSettings,
} from "@progress/kendo-angular-grid";
import { Router } from "@angular/router";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import {
  Utility,
  enumTaskCallingPage,
  enumTaskStatus,
} from "src/app/Model/utility";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../../Services/Common/filter.service";
import {
  Task,
  TaskSave,
  Taskaction,
  TaskStatus,
} from "src/app/Model/AR Management/Task/task";
import { TaskMenuItem } from "src/app/Model/AR Management/Task/task-menu-item";
import { ContextMenuSelectEvent } from "@progress/kendo-angular-menu";
import { QualityviewdetailsComponent } from "src/app/Pages/AR Management/Quality/qualityviewdetails/qualityviewdetails.component";
import { CoreoperationService } from "../../../Services/AR/coreoperation.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-my-task",
  templateUrl: "./my-task.component.html",
  styleUrls: ["./my-task.component.css"],
})
export class MyTaskComponent implements OnInit, OnDestroy {
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
  isOverDue = false;
  todaysDate: any;
  public CancelTaskid: number = 0;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;

  public gcurrentTask: any;
  private subscription = new SubSink();
  public items: any[] = TaskMenuItem.OpenTaskMenu;

  public filterApplied = false;

  // Loading
  loadingMytask = true;
  loadingMytaskGrid = true;

  @ViewChild("QualityViewdetailsComponent", { static: true })
  private QualityViewdetailsComponent: QualityviewdetailsComponent;

  constructor(
    private masterService: MasterdataService,
    private router: Router,
    private data: DataTransferService,
    private filterService: FilterService,
    private coreService: CoreoperationService,
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
    this.todaysDate = this.clsUtility.currentDateTime();
    // this.loadItems();
  }
  loginuserid = 0;
  ngOnInit() {
    // alert(this.data.SelectedUserid);
  }

  ApplyFilter($event) {
    // console.log('in ApplyFilterWorkgroup of WQ'+$event);
    this.loadingMytask = true;
    this.loadingMytaskGrid = true;
    var Taskevent = $event;
    // console.log("WorkQueueevent : " + JSON.stringify(WorkQueueevent));
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;
    var Tasks: Task[];
    Tasks = Taskevent.content;

    if (Taskevent.content != null) {
      this.SelectedTasks = [];
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
    this.filterApplied = this.data.isTaskFilterApplied;
    this.loadingMytask = false;
    this.loadingMytaskGrid = false;
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
      // console.log(
      //   "in My task this.data.SelectedUserid " + this.data.SelectedUserid
      // );
      // console.log(JSON.stringify(this.lstFilter));

      // console.log("data mytask " + data);
      if (this.loginuserid > 0) {
        this.subscription.add(
          this.filterService
            .applyFilter(
              JSON.stringify(this.lstFilter),
              "Mytask",
              this.loginuserid,
              this.page,
              this.pagesize
            )
            .subscribe(
              (data) => {
                if (data != null) {
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
                  // console.log(data);

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
                  this.loadingMytask = false;
                  this.loadingMytaskGrid = false;
                }
              },
              (err) => {
                this.loadingMytaskGrid = false;
              }
            )
        );
      }

      // console.log("in My task userID " + userID);
      // if (
      //   this.data.SelectedUserid === undefined ||
      //   this.data.SelectedUserid === 0
      // ) {
      //   this.loadingMytask = false;
      //   return;
      // }
      //this.Tasks = this.masterService.getTasks();
      // this.filterService
      //   .applyFilter(
      //     JSON.stringify(this.lstFilter),
      //     "task",
      //     // this.data.SelectedUserid,
      //     userID,
      //     this.page,
      //     this.pagesize,
      //     1
      //   )
      //   .subscribe(data => {
      //     // console.log(dat);

      //     this.displaycurrentpages = data.pageable.pageNumber + 1;
      //     this.displaytotalpages = data.totalPages;
      //     this.displaytotalrecordscount = data.totalElements;
      //     if (JSON.stringify(data.last) == "true") {
      //       this.Isnextdisabled = true;
      //     } else {
      //       this.Isnextdisabled = false;
      //     }
      //     if (this.page == 0) {
      //       this.Ispreviousdisabled = true;
      //     } else {
      //       this.Ispreviousdisabled = false;
      //     }

      //     this.TaskGridData = data.content;
      //     this.TaskItems = data.content;
      //     this.TaskLoadItems();
      //     this.loadingMytask = false;
      //   });
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
      // console.log(this.SelectedTasks);
      // console.log(this.TaskItems);
      if (this.TaskItems != null) {
        if (this.TaskItems.length == 0) {
          this.clsUtility.showInfo("No task available.");
          return;
        }
        if (this.SelectedTasks.length == 0 && AllTask == 1) {
          this.clsUtility.showInfo("Select a task to work");
          return;
        } else {
          if (AllTask == 0) {
            this.SelectedTasks = this.TaskItems;
          }
          this.data.SelectedTasks = this.SelectedTasks;
          this.data.TaskCallingForm = enumTaskCallingPage.MyTask;
          // console.log("myTask" + this.data.SelectedTasks);
          this.router.navigate(["/TaskWorkPane"]);
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  set TaskData(value) {
    this.data.SelectedTasks = value;
  }

  onClickPrevious() {
    try {
      this.loadingMytask = true;
      this.loadingMytaskGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        // console.log("Previous this.page, this.pagesize : " + this.page, this.pagesize);
        if (this.data.isTaskFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.data.SelectedFilter),
                  "Mytask",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data != null) {
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
                      this.loadingMytask = false;
                      this.loadingMytaskGrid = false;
                    }
                  },
                  (err) => {
                    this.loadingMytaskGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterDate();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.loadingMytask = false;
      this.loadingMytaskGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingMytask = true;
      this.loadingMytaskGrid = true;
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        // console.log("Next this.page, this.pagesize : " + this.page, this.pagesize);
        // console.log("JSON.stringify(this.dataService.SelectedFilter) : "+JSON.stringify(this.dataService.SelectedFilter));

        if (this.data.isTaskFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.data.SelectedFilter),
                  "Mytask",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data != null) {
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
                      this.loadingMytask = false;
                      this.loadingMytaskGrid = false;
                    }
                  },
                  (err) => {
                    this.loadingMytaskGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterDate();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.loadingMytask = false;
      this.loadingMytaskGrid = false;
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
  //       this.getTaskbyid(ntaskid);
  //       // alert(e.item.value);
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
        this.CancelTaskid = ntaskid;
        // this.getTaskbyid(ntaskid);
        // alert(e.item.value);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnViewDetails(ntaskid: any, nworkqueuegroupid: any) {
    try {
      $("#qualityviewdetailsModal").modal("show");
      this.QualityViewdetailsComponent.CallingPage = "Mytask";
      this.QualityViewdetailsComponent.Taskid = ntaskid;
      this.QualityViewdetailsComponent.Workqueuegroupid = nworkqueuegroupid;
      this.QualityViewdetailsComponent.setTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getTaskbyid(ntaskid) {
    try {
      this.gcurrentTask = null;
      this.subscription.add(
        this.masterService.getAllTasks(ntaskid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.gcurrentTask = data;
              console.log(
                "this.gcurrentTask : " + JSON.stringify(this.gcurrentTask)
              );
              this.SaveVoidTask();
            }
          },
          (err) => {
            this.loadingMytaskGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveTask(taskSave) {
    try {
      this.subscription.add(
        this.coreService.saveTask(taskSave).subscribe(
          (data: number) => {
            if (data != null || data != undefined) {
              if (data === 1) {
                this.clsUtility.showSuccess("Task canceled");
              } else {
                this.clsUtility.showError("Error to cancel task");
              }
              if (
                (this.data.SelectedFilter != null ||
                  this.data.SelectedFilter != undefined) &&
                this.filterApplied
              ) {
                this.lstFilter = this.data.SelectedFilter;
              }
              this.RetriveMasterDate();
            }
          },
          (err) => {
            this.loadingMytaskGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  SaveVoidTask() {
    try {
      let currenttime = this.clsUtility.currentDateTime();
      var taskSave = new TaskSave();
      var taskAction = new Taskaction();
      var taskStatus = new TaskStatus();

      taskStatus.statusId = 0;
      taskStatus.statusCode = "Cancel";
      taskStatus.statusDescription = "Cancel";

      taskAction.nactionid = 0;
      taskAction.ntaskid = 0;
      taskAction.nuserid = 0;
      taskAction.createdon = currenttime;
      taskAction.modifiedon = currenttime;
      taskAction.notes = null;
      taskAction.reasoncodes = null;
      taskAction.remarkcodes = null;
      taskAction.status = taskStatus;
      taskAction.actioncode = null;
      taskAction.tflfromdos = null;
      taskAction.sworktype = null;

      taskSave.ntaskid = this.gcurrentTask.taskid;
      taskSave.nuserid = this.gcurrentTask.nuserid;
      taskSave.susername = this.gcurrentTask.susername;
      taskSave.nworkqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
      taskSave.nparenttaskid = this.gcurrentTask.nparenttaskid;
      taskSave.staskcode = this.gcurrentTask.staskcode;
      taskSave.tasktitle = this.gcurrentTask.tasktitle;
      taskSave.taskdeciption = this.gcurrentTask.taskdeciption;
      taskSave.priority = this.gcurrentTask.priority;
      taskSave.createdby = this.gcurrentTask.createdby;
      taskSave.nassignedtoid = this.gcurrentTask.nassignedtoid;
      taskSave.sassignedtousername = this.gcurrentTask.assignedtousername;
      taskSave.updatedby = this.data.SelectedGCPUserid;
      taskSave.nstatus = enumTaskStatus.Cancel;
      taskSave.tasktype = this.gcurrentTask.tasktype;
      taskSave.tasknotes = this.gcurrentTask.tasknotes;
      taskSave.taskstarttime = null;
      taskSave.taskendtime = null;
      taskSave.createdon = this.gcurrentTask.createdon;
      taskSave.modifiedon = new Date(currenttime);
      taskSave.taskaction = taskAction;
      taskSave.followup = null;
      taskSave.assigned = null;

      this.saveTask(taskSave);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onCancelTaskConfirmationModal(Status: string) {
    try {
      if (Status.toUpperCase() == "YES") {
        this.getTaskbyid(this.CancelTaskid);
      }
      this.SelectedTasks.splice(0);
      this.CancelTaskid = 0;
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
