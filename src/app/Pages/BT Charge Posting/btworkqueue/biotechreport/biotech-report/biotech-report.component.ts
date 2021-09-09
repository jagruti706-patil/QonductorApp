import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { BiotechReportService } from "src/app/Pages/Services/BT/biotech-report.service";
import { SubSink } from "subsink";
import {
  State,
  process,
  aggregateBy,
  AggregateResult,
} from "@progress/kendo-data-query";

@Component({
  selector: "app-biotech-report",
  templateUrl: "./biotech-report.component.html",
  styleUrls: ["./biotech-report.component.css"],
})
export class BiotechReportComponent implements OnInit, OnDestroy {
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  biotechReportGridData: any[] = [];
  biotechReportGridView: GridDataResult;
  public state: State = {
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  calledFrom: string = "";

  constructor(
    private toaster: ToastrService,
    private biotechReportService: BiotechReportService
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {
    this.getBiotechDailyStatusReports();
  }
  getBiotechDailyStatusReports() {
    try {
      this.subscription.add(
        this.biotechReportService.GetDailyStatusReports().subscribe(
          (data) => {
            if (data) {
              this.biotechReportGridData = data;
              this.biotechReportGridView = process(
                this.biotechReportGridData,
                this.state
              );
            } else {
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting biotech report details"
                );
              } else {
                this.clsUtility.showInfo("Biotech report details not found");
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
  dataStateChange(state: DataStateChangeEvent): void {
    try {
      this.state = state;
      if (state.filter != undefined && state.filter != null) {
        state.filter.filters.forEach((f) => {
          if (f["value"] != null) {
            f["value"] = f["value"].trim();
          }
        });
      }
      this.biotechReportGridView = process(
        this.biotechReportGridData,
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
}
