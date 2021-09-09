import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { SubSink } from "subsink";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { CountModel } from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";

@Component({
  selector: "app-status-report",
  templateUrl: "./status-report.component.html",
  styleUrls: ["./status-report.component.css"],
})
export class StatusReportComponent implements OnInit, OnDestroy {
  isFrom: string = "";
  countObj: CountModel = new CountModel();
  OrderStatusGridView: GridDataResult;
  public OrderStatusSort: SortDescriptor[] = [
    {
      field: "status",
      dir: "asc",
    },
  ];
  orderStatusData: any[] = [];
  private subscription = new SubSink();
  @Input() title: string = "Encounter Status Report";
  @Input() isForPrint: boolean = false;
  @Output() onOkClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  clsUtility: Utility;

  constructor(
    private dataService: DataTransferService,
    private toaster: ToastrService
  ) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.statusReportData.subscribe((data) => {
        if (data) {
          if (data.isFrom) {
            this.isFrom = data.isFrom.toLowerCase();
          }
          this.orderStatusData = data.orderStatusData;
          this.OrderStatusloadItems();
          this.countObj = data.countObj;
        }
      })
    );
  }
  OrderStatusSortChange(sort: SortDescriptor[]): void {
    this.OrderStatusSort = sort;
    this.OrderStatusloadItems();
  }

  OrderStatusloadItems() {
    try {
      this.OrderStatusGridView = {
        data: orderBy(this.orderStatusData, this.OrderStatusSort),
        total: this.orderStatusData.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onOkClick() {
    try {
      this.onOkClicked.emit(true);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onPrintClick(isPrint: boolean = false) {
    try {
      this.onOkClicked.emit(isPrint);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
