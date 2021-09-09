import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Utility, enumTaskCallingPage } from "src/app/Model/utility";
import {
  SelectableSettings,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../../Services/Common/filter.service";
import { TaskMenuItem } from "src/app/Model/AR Management/Task/task-menu-item";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-my-canceled-task",
  templateUrl: "./my-canceled-task.component.html",
  styleUrls: ["./my-canceled-task.component.css"],
})
export class MyCanceledTaskComponent implements OnInit, OnDestroy {
  public TaskDefaultStatusValue = 3;
  public sTaskStatus: any = [
    { text: "Cancel", value: 3 },
    { text: "System Closed", value: 4 },
  ];
  public CanceledTaskGridData: {};
  public CanceledTaskGridView: GridDataResult;
  private CanceledTaskItems: any[] = [];
  public CanceledTaskSort: SortDescriptor[] = [
    {
      field: "createdon",
      dir: "desc",
    },
    {
      field: "priority",
      dir: "asc",
    },
  ];

  public skip = 0;
  Tasks: any;
  public checkboxOnly = true;
  public selectableSettings: SelectableSettings;
  public SelectedTasks: any = [];
  clsUtility: Utility;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  public Status: number = 3;

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

  // Loading
  loadingCanceledtask = true;
  loadingCanceledtaskGrid = true;
  constructor(
    private fb: FormBuilder,
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
  }
  loginuserid = 0;
  DropDownGroup = this.fb.group({
    fcTaskStatus: ["", Validators.required],
  });

  get TaskStatus() {
    return this.DropDownGroup.get("fcTaskStatus");
  }

  ngOnInit() {
    try {
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.TaskStatus.valueChanges.subscribe(
          (data: number) => {
            if (data != null || data != undefined) {
              this.Status = data;
              this.RetriveMasterData();
            }
          },
          (err) => {
            this.loadingCanceledtaskGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  TaskLoadItems(): any {
    try {
      this.CanceledTaskGridView = {
        data: orderBy(this.CanceledTaskItems, this.CanceledTaskSort),
        total: this.CanceledTaskItems.length,
      };
      // this.SelectedTasks.push(this.CanceledTaskItems[0]);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  RetriveMasterData(): any {
    try {
      if (this.loginuserid > 0) {
        this.subscription.add(
          this.filterService
            .applyFilter(
              JSON.stringify(this.lstFilter),
              "canceledtask",
              this.loginuserid,
              this.page,
              this.pagesize,
              this.Status
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
                  this.CanceledTaskItems = null;
                  this.CanceledTaskGridView = null;
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

                this.CanceledTaskGridData = data.content;
                this.CanceledTaskItems = data.content;
                if (data.content != null) this.TaskLoadItems();
                else this.CanceledTaskGridView = null;
                this.loadingCanceledtask = false;
                this.loadingCanceledtaskGrid = false;
              },
              (err) => {
                this.loadingCanceledtaskGrid = false;
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  CanceledTaskSortChange(sort: SortDescriptor[]): void {
    if (this.CanceledTaskItems != null) {
      this.CanceledTaskSort = sort;
      this.TaskLoadItems();
    }
  }

  onClickPrevious() {
    try {
      this.loadingCanceledtask = true;
      this.loadingCanceledtaskGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }

        if (this.loginuserid > 0) {
          this.subscription.add(
            this.filterService
              .applyFilter(
                JSON.stringify(this.lstFilter),
                "canceledtask",
                this.loginuserid,
                this.page,
                this.pagesize,
                this.Status
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
                    this.CanceledTaskItems = null;
                    this.CanceledTaskGridView = null;
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

                  this.CanceledTaskGridData = data.content;
                  this.CanceledTaskItems = data.content;
                  if (data.content != null) this.TaskLoadItems();
                  else this.CanceledTaskGridView = null;
                  this.loadingCanceledtask = false;
                  this.loadingCanceledtaskGrid = false;
                },
                (err) => {
                  this.loadingCanceledtaskGrid = false;
                }
              )
          );
        }
      } else {
        this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.loadingCanceledtask = false;
      this.loadingCanceledtaskGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingCanceledtask = true;
      this.loadingCanceledtaskGrid = true;
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;

        if (this.loginuserid > 0) {
          this.subscription.add(
            this.filterService
              .applyFilter(
                JSON.stringify(this.lstFilter),
                "canceledtask",
                this.loginuserid,
                this.page,
                this.pagesize,
                this.Status
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
                    this.CanceledTaskItems = null;
                    this.CanceledTaskGridView = null;
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

                  this.CanceledTaskGridData = data.content;
                  this.CanceledTaskItems = data.content;
                  if (data.content != null) this.TaskLoadItems();
                  else this.CanceledTaskGridView = null;
                  this.loadingCanceledtask = false;
                  this.loadingCanceledtaskGrid = false;
                },
                (err) => {
                  this.loadingCanceledtaskGrid = false;
                }
              )
          );
        }
      } else {
        this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page - 1;
      this.loadingCanceledtask = false;
      this.loadingCanceledtaskGrid = false;
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
