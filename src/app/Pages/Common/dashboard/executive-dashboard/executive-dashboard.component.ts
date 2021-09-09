import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  DataStateChangeEvent,
  GridDataResult,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import {
  State,
  process,
  aggregateBy,
  AggregateResult,
} from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { PracticeWiseEncounterCount } from "src/app/Model/Dashboard/practice-dashboard.model";
import { Utility } from "src/app/Model/utility";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "subsink";

@Component({
  selector: "app-executive-dashboard",
  templateUrl: "./executive-dashboard.component.html",
  styleUrls: ["./executive-dashboard.component.css"],
})
export class ExecutiveDashboardComponent implements OnInit, OnDestroy {
  loader: boolean;
  practiceWiseCount: PracticeWiseEncounterCount = new PracticeWiseEncounterCount();
  allLstPractice: any[] = [];
  lstPractice: any[] = [];
  public PracticeDefaultValue = { clientid: "0", client: "All" };
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  executiveDashboardGridView: GridDataResult;
  public state: State;
  executiveDashboardData: any[] = [];
  currentUserGroupIds: string = "";
  vwShowAllPractice: boolean = false;

  constructor(
    private toaster: ToastrService,
    private coreops: CoreOperationService,
    private fb: FormBuilder,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility(toaster);
    this.currentUserGroupIds = this.dataService.groupIds;
    this.state = this.defaultGridState;
  }

  filterFormGroup = this.fb.group({
    // fcShowAllPractices: [false],
    fcPractice: [[]],
    fcSearchBy: [""],
  });

  // get fbcShowAllPractices() {
  //   return this.filterFormGroup.get("fcShowAllPractices");
  // }
  get fbcPractice() {
    return this.filterFormGroup.get("fcPractice");
  }
  get fbcSearchBy() {
    return this.filterFormGroup.get("fcSearchBy");
  }

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwShowAllPractice = data.viewShowAllPractice;
        }
      })
    );
    if (this.vwShowAllPractice) this.getPracticesByGroup("0");
    else this.getPracticesByGroup(this.currentUserGroupIds);
    this.getExecutiveDashboardData();
    // this.formValueChanges();
  }
  // formValueChanges() {
  //   try {
  //     this.fbcShowAllPractices.valueChanges.subscribe((data) => {
  //       this.fbcPractice.setValue([]);
  //       if (data) {
  //         this.getPracticesByGroup("0");
  //       } else {
  //         this.getPracticesByGroup(this.currentUserGroupIds);
  //       }
  //     });
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  getPracticesByGroup(groupIds: string) {
    try {
      this.subscription.add(
        this.coreops.GetPracticeByGroup(groupIds).subscribe(
          (data) => {
            if (data) {
              this.allLstPractice = data;
              this.lstPractice = data;
            } else {
              if (data == 0) {
                this.clsUtility.LogError("Error while getting practice");
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
  getExecutiveDashboardData() {
    try {
      let input = {
        clientid: this.fbcPractice.value,
        groupid: this.currentUserGroupIds.split(","),
        isviewall: this.vwShowAllPractice,
      };
      this.loader = true;
      this.subscription.add(
        this.coreops.GetExecutiveDashboardData(input).subscribe(
          (data) => {
            this.loader = false;
            if (data) {
              this.practiceWiseCount = data.dashboardcards
                ? data.dashboardcards
                : new PracticeWiseEncounterCount();
              if (data.practicewiseresult) {
                this.executiveDashboardData = data.practicewiseresult;
                this.state = this.defaultGridState;
                this.executiveDashboardGridView = process(
                  this.executiveDashboardData,
                  this.state
                );
                this.executiveDashboardData.forEach((element) => {
                  element.loader = true;
                  this.subscription.add(
                    this.coreops
                      .GetLastLoginUser(
                        element.practiceid,
                        element.groups.join(",")
                      )
                      .subscribe((data) => {
                        element.loader = false;
                        if (data) {
                          element.initials = data.initials;
                          element.lastloginuser = data.name;
                          element.lastlogindate = data.logindate;
                        }
                      })
                  );
                });
              } else {
                this.executiveDashboardData = [];
                this.executiveDashboardGridView = null;
              }
            } else {
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting executive dashboard data"
                );
              } else {
                this.clsUtility.showInfo("Data not found");
              }
            }
          },
          (error) => {
            this.loader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  applyFilter() {
    try {
      this.fbcSearchBy.setValue("");
      this.getExecutiveDashboardData();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  clearFilter() {
    try {
      // if (this.fbcShowAllPractices.value) {
      //   this.fbcShowAllPractices.setValue(false);
      // } else {
      //   this.fbcPractice.setValue([]);
      // }
      this.fbcSearchBy.setValue("");
      this.fbcPractice.setValue([]);
      this.getExecutiveDashboardData();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  get defaultGridState(): State {
    try {
      return <State>{
        filter: {
          logic: "and",
          filters: [],
        },
        sort: [
          // {
          //   field: "pending",
          //   dir: "desc",
          // },
          // {
          //   field: "practicename",
          //   dir: "asc",
          // },
        ],
        skip: 0,
        take: 20,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  handlePracticeFilter(value: string) {
    this.lstPractice = this.allLstPractice.filter(
      (s) =>
        s.client.toLowerCase().includes(value.toLowerCase().trim()) === true
    );
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    try {
      this.state = state;
      // if (state.filter != undefined && state.filter != null) {
      //   state.filter.filters.forEach((f) => {
      //     if (f["value"] != null) {
      //       f["value"] = f["value"].trim();
      //     }
      //   });
      // }
      this.executiveDashboardGridView = process(
        this.executiveDashboardData,
        this.state
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // sumStatusCount(fieldname: string): number {
  //   try {
  //     if (this.executiveDashboardGridView && fieldname) {
  //       let result: AggregateResult = aggregateBy(
  //         this.executiveDashboardGridView.data,
  //         [{ aggregate: "sum", field: fieldname }]
  //       );
  //       return result[fieldname] ? result[fieldname].sum : 0;
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  public isItemSelected(
    selectedFormControlArray: any[],
    itemText: string
  ): boolean {
    return selectedFormControlArray.some((item) => item === itemText);
  }
  public summaryTagSelectedValues(dataItems: any[], key: string): string {
    return dataItems.map((ele) => ele[key]).join(",");
  }
  public pageChange(event: PageChangeEvent): void {
    try {
      this.state.skip = event.skip;
      this.executiveDashboardGridView = process(
        this.executiveDashboardData,
        this.state
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
  public onFilter(inputValue: string): void {
    this.state.filter.filters = [
      {
        field: "practicename",
        operator: "contains",
        value: inputValue.trim(),
      },
    ];
    this.state.skip = 0;
    this.executiveDashboardGridView = process(
      this.executiveDashboardData,
      this.state
    );
  }

  // public valueChange(value: any): void {
  //   console.log(value);
  //   console.log(value.length);
  //   // console.log(this.fbcPractice)
  //   if (value.length == 0) {
  //     this.getExecutiveDashboardData();
  //   }
  // }
  // public close(): void {
  //   console.log(this.fbcPractice.value);
  //   this.getExecutiveDashboardData();
  // }
}
