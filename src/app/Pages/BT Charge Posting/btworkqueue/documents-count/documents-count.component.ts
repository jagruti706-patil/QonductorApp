import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  GridDataResult,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import {
  State,
  process,
  aggregateBy,
  AggregateResult,
} from "@progress/kendo-data-query";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";

@Component({
  selector: "app-documents-count",
  templateUrl: "./documents-count.component.html",
  styleUrls: ["./documents-count.component.css"],
})
export class DocumentsCountComponent implements OnInit, OnDestroy {
  biotechdocumentcounts: any;
  rcmdocumentcounts: any[] = [];
  public rcmDocCountsGridView: GridDataResult;
  // totalrcmdocumentstatuswisecounts: any[] = [];
  // public rcmDocStatusCountsGridView: GridDataResult;
  public state: State = {
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  // public statusstate: State = {
  //   // Initial filter descriptor
  //   filter: {
  //     logic: "and",
  //     filters: [],
  //   },
  // };
  totalrcmdocumentcounts: any;
  biotechCountLoader: boolean;
  rcmDocCountLoader: boolean;
  // rcmStatusCountLoader: boolean;
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();

  constructor(
    private filterService: FilterService,
    private toastr: ToastrService,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {}

  ApplyFilter(event: any) {
    try {
      this.state.filter = {
        logic: "and",
        filters: [],
      };
      this.state.sort = [];
      // this.statusstate.filter = {
      //   logic: "and",
      //   filters: [],
      // };
      // this.statusstate.sort = [];

      if (event) {
        this.biotechdocumentcounts = event.biotechdocumentcounts;
        this.totalrcmdocumentcounts = event.totalrcmdocumentcounts;
        this.rcmdocumentcounts = event.rcmdocumentcounts;
        this.rcmDocCountsGridView = process(this.rcmdocumentcounts, this.state);
        // this.totalrcmdocumentstatuswisecounts =
        //   event.totalrcmdocumentstatuswisecounts;
        // this.rcmDocStatusCountsGridView = process(
        //   this.totalrcmdocumentstatuswisecounts,
        //   this.statusstate
        // );
      } else {
        this.biotechdocumentcounts = null;
        this.totalrcmdocumentcounts = null;
        this.rcmdocumentcounts = [];
        this.rcmDocCountsGridView = process(this.rcmdocumentcounts, this.state);
        // this.totalrcmdocumentstatuswisecounts = [];
        // this.rcmDocStatusCountsGridView = process(
        //   this.totalrcmdocumentstatuswisecounts,
        //   this.statusstate
        // );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    try {
      this.state = state;
      if (state.filter != undefined && state.filter != null) {
        state.filter.filters.forEach((f) => {
          if (f["field"] == "documentname") {
            if (f["value"] != null) {
              f["value"] = f["value"].trim();
            }
          }
        });
      }
      this.rcmDocCountsGridView = process(this.rcmdocumentcounts, this.state);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // public statusDataStateChange(statusstate: DataStateChangeEvent): void {
  //   try {
  //     this.statusstate = statusstate;
  //     if (statusstate.filter != undefined && statusstate.filter != null) {
  //       statusstate.filter.filters.forEach((f) => {
  //         if (
  //           f["field"] == "documentname" ||
  //           f["field"] == "category" ||
  //           f["field"] == "scandate"
  //         ) {
  //           if (f["value"] != null) {
  //             f["value"] = f["value"].trim();
  //           }
  //         }
  //       });
  //     }
  //     this.rcmDocStatusCountsGridView = process(
  //       this.totalrcmdocumentstatuswisecounts,
  //       this.statusstate
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  getDocumentCounts(doRefresh: string) {
    try {
      if (doRefresh == "biotechcount") {
        this.biotechCountLoader = true;
      } else if (doRefresh == "rcmdocumentcount") {
        this.rcmDocCountLoader = true;
      }
      // else if (doRefresh == "rcmstatuscount") {
      //   this.rcmStatusCountLoader = true;
      // }
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.dataService.SelectedFilter),
            enumFilterCallingpage.DocumentCount
          )
          .subscribe(
            (data) => {
              if (data) {
                // console.log(data);
                if (doRefresh == "biotechcount") {
                  this.biotechdocumentcounts = data.biotechdocumentcounts;
                  this.biotechCountLoader = false;
                } else if (doRefresh == "rcmdocumentcount") {
                  this.totalrcmdocumentcounts = data.totalrcmdocumentcounts;
                  this.rcmdocumentcounts = data.rcmdocumentcounts;
                  this.rcmDocCountsGridView = process(
                    this.rcmdocumentcounts,
                    this.state
                  );
                  this.rcmDocCountLoader = false;
                }
                // else if (doRefresh == "rcmstatuscount") {
                //   this.totalrcmdocumentstatuswisecounts =
                //     data.totalrcmdocumentstatuswisecounts;
                //   this.rcmDocStatusCountsGridView = process(
                //     this.totalrcmdocumentstatuswisecounts,
                //     this.statusstate
                //   );
                // this.rcmStatusCountLoader = false;
                // }
              } else {
                if (data == 0) {
                  this.biotechCountLoader = false;
                  this.rcmDocCountLoader = false;
                  // this.rcmStatusCountLoader = false;
                  this.clsUtility.LogError("Error while getting data");
                }
              }
            },
            (error) => {
              this.biotechCountLoader = false;
              this.rcmDocCountLoader = false;
              // this.rcmStatusCountLoader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.biotechCountLoader = false;
      this.rcmDocCountLoader = false;
      // this.rcmStatusCountLoader = false;
      this.clsUtility.LogError(error);
    }
  }
  // sumStatusCounts(fieldname: string): number {
  //   try {
  //     if (this.rcmDocStatusCountsGridView && fieldname) {
  //       let result: AggregateResult = aggregateBy(
  //         this.rcmDocStatusCountsGridView.data,
  //         [{ aggregate: "sum", field: fieldname }]
  //       );
  //       return result[fieldname] ? result[fieldname].sum : 0;
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  sumDocumentCount(fieldname: string): number {
    try {
      if (this.rcmDocCountsGridView && fieldname) {
        let result: AggregateResult = aggregateBy(
          this.rcmDocCountsGridView.data,
          [{ aggregate: "sum", field: fieldname }]
        );
        return result[fieldname] ? result[fieldname].sum : 0;
      }
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
