import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";

@Component({
  selector: "app-hl7-financial-info",
  templateUrl: "./hl7-financial-info.component.html",
  styleUrls: ["./hl7-financial-info.component.css"],
})
export class HL7FinancialInfoComponent implements OnInit, OnDestroy {
  HL7FTGridView: GridDataResult;
  sort: SortDescriptor[] = [];
  HL7FTItems: any[] = [];
  clsUtility: Utility;
  gridLoader: boolean;
  subscription: SubSink = new SubSink();
  @Input() calledFrom: string;

  constructor(
    private toaster: ToastrService,
    private dataService: DataTransferService,
    private coreservice: CoreOperationService
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.SelectedOrderQueueGroupCode.subscribe((orderCode) => {
        if (orderCode != "" && orderCode != null) {
          if (this.calledFrom === "archivedencounters") {
            if (this.dataService.orderfinancialdetails) {
              this.HL7FTItems = this.dataService.orderfinancialdetails;
              this.loadGrid();
            } else {
              this.HL7FTGridView = null;
              this.HL7FTItems = [];
            }
          } else {
            this.gridLoader = true;
            this.subscription.add(
              this.coreservice.GetHLDetails(orderCode, 2).subscribe(
                (data) => {
                  if (data) {
                    this.HL7FTItems = data;
                    this.loadGrid();
                  } else {
                    this.HL7FTGridView = null;
                    this.HL7FTItems = [];
                  }
                  this.gridLoader = false;
                },
                (error) => {
                  this.gridLoader = false;
                  this.clsUtility.LogError(error);
                }
              )
            );
          }
        }
      })
    );
  }

  sortChange(sort: SortDescriptor[]): void {
    try {
      this.sort = sort;
      this.loadGrid();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  loadGrid() {
    try {
      this.HL7FTGridView = {
        data: orderBy(this.HL7FTItems, this.sort),
        total: this.HL7FTItems.length,
      };
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
