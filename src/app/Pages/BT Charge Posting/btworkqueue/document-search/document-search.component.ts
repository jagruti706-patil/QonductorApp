import { Component, OnInit } from "@angular/core";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";

@Component({
  selector: "app-document-search",
  templateUrl: "./document-search.component.html",
  styleUrls: ["./document-search.component.css"],
})
export class DocumentSearchComponent implements OnInit {
  OrderGridData: any[] = [];
  OrderGridView: GridDataResult;
  private clsUtility: Utility;
  vwExportButton = false;
  private subscription = new SubSink();
  public OrderSkip = 0;
  public pagesize: number = 0;
  public OrderSort: SortDescriptor[] = [
    // {
    //   field: "orderdate",
    //   dir: "desc"
    // }
  ];

  constructor(
    private toaster: ToastrService,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility(toaster);
    this.pagesize = 20;
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwExportButton = data.viewExportGrid;
        }
      })
    );
  }

  OrderloadItems() {
    try {
      if (this.OrderGridData != null) {
        this.OrderGridView = {
          data: orderBy(
            this.OrderGridData.slice(
              this.OrderSkip,
              this.OrderSkip + this.pagesize
            ),
            this.OrderSort
          ),
          total: this.OrderGridData.length,
        };
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    var Orderevent = $event;
    this.OrderSkip = 0;
    if (Orderevent) {
      this.OrderGridData = Orderevent;
      this.OrderloadItems();
    } else {
      this.OrderGridData = [];
      this.OrderGridView = null;
    }
  }

  OrderSortChange(sort: SortDescriptor[]): void {
    if (this.OrderGridData != null) {
      this.OrderSort = sort;
      this.OrderloadItems();
    }
  }

  OrderPageChange(event: PageChangeEvent): void {
    this.OrderGridView = null;
    this.OrderSkip = event.skip;
    this.OrderloadItems();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
