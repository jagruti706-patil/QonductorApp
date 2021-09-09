import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import {
  State,
  process,
  aggregateBy,
  AggregateResult,
} from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "subsink";
import { PracticeDashboardCards } from "../../../../Model/Dashboard/practice-dashboard.model";

@Component({
  selector: "app-practice-dashboard",
  templateUrl: "./practice-dashboard.component.html",
  styleUrls: ["./practice-dashboard.component.css"],
})
export class PracticeDashboardComponent implements OnInit, OnDestroy {
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  loader: boolean;
  practiceDashboardData: any[] = [];
  public state: State = {
    filter: { logic: "and", filters: [] },
    // skip: 0,
    // take: 20,
  };
  practiceDashboardGridView: GridDataResult;
  userWiseResult: PracticeDashboardCards = new PracticeDashboardCards();
  practiceWiseResult: PracticeDashboardCards = new PracticeDashboardCards();
  isviewall: boolean = false;
  vwShowAllGroupDataFilter: boolean = false;
  vwGroupWiseCards: boolean = false;
  vwPracticeAssignedAgingBucket: boolean = false;
  disableSwitch: boolean = false;

  constructor(
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private fb: FormBuilder
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwShowAllGroupDataFilter = data.viewShowAllGroupDataFilter;
          this.vwGroupWiseCards = data.viewGroupWiseCards;
          this.vwPracticeAssignedAgingBucket =
            data.viewPracticeAssignedAgingBucket;
          if (!this.vwGroupWiseCards && !this.vwPracticeAssignedAgingBucket) {
            this.disableSwitch = true;
          }
        }
      })
    );
    this.getPracticeDashboardDetails();
  }
  filterFormGroup = this.fb.group({
    fcSearchBy: [""],
  });
  get fbcSearchBy() {
    return this.filterFormGroup.get("fcSearchBy");
  }
  getPracticeDashboardDetails() {
    try {
      this.loader = true;
      let inputJson: {
        userid: string;
        groupid: any[];
        isviewall: boolean;
        isshowpracticewiseresult: boolean;
        isshowresult: boolean;
        isshowuserwiseresult: boolean;
      } = {
        userid: this.dataService.loginGCPUserID.getValue(),
        groupid: this.dataService.groupIds.split(","),
        isviewall: this.isviewall,
        isshowpracticewiseresult: this.vwGroupWiseCards,
        isshowresult: this.vwPracticeAssignedAgingBucket,
        isshowuserwiseresult: true,
      };
      this.subscription.add(
        this.coreService.GetPracticeDashboardDetails(inputJson).subscribe(
          (data) => {
            this.loader = false;
            if (data) {
              if (data.result) {
                this.practiceDashboardData = data.result;
                this.practiceDashboardGridView = process(
                  this.practiceDashboardData,
                  this.state
                );
              } else {
                this.resetGrid();
              }
              if (data.userwiseresult) {
                this.userWiseResult = data.userwiseresult;
              }
              if (data.practicewiseresult) {
                this.practiceWiseResult = data.practicewiseresult;
              }
            } else {
              this.resetGrid();
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting practice dashboard details"
                );
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
  resetGrid() {
    try {
      this.practiceDashboardData = [];
      this.practiceDashboardGridView = null;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
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
      this.practiceDashboardGridView = process(
        this.practiceDashboardData,
        this.state
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sumDocumentCount(fieldname: string): number {
    try {
      if (this.practiceDashboardGridView && fieldname) {
        let result: AggregateResult = aggregateBy(
          this.practiceDashboardGridView.data,
          [{ aggregate: "sum", field: fieldname }]
        );
        return result[fieldname] ? result[fieldname].sum : 0;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  switchChange(evt: boolean) {
    try {
      this.fbcSearchBy.setValue("");
      this.state.filter.filters = [];
      // this.state.skip = 0;
      this.getPracticeDashboardDetails();
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
    // this.state.skip = 0;
    this.practiceDashboardGridView = process(
      this.practiceDashboardData,
      this.state
    );
  }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
