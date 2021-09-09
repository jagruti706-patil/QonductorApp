import { Component, OnInit } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
declare var $: any;

@Component({
  selector: "app-rcm-documents-import",
  templateUrl: "./rcm-documents-import.component.html",
  styleUrls: ["./rcm-documents-import.component.css"],
})
export class RcmDocumentsImportComponent implements OnInit {
  documentsGridView: GridDataResult;
  pageSkip = 0;
  pageSize: number = 0;
  gridSort: SortDescriptor[] = [
    {
      field: "createdon",
      dir: "desc",
    },
  ];
  clsUtility: Utility;
  subscription: SubSink = new SubSink();
  loadingGrid: boolean;
  page: number = 0;
  documentGridData: any;

  constructor(
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private coreops: CoreOperationService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pageSize = this.clsUtility.pagesize;
  }

  ngOnInit() {
    this.getRCMDocumentsList();
  }

  getRCMDocumentsList() {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.coreops
          .getRCMImportDocumentList(this.page, this.clsUtility.pagesize)
          .subscribe(
            (data) => {
              if (data && data["content"]) {
                this.documentGridData = data;
                this.loadGridItems();
              } else {
                this.documentGridData = null;
                this.documentsGridView = null;
              }
              // } this.documentGridData = [];
              this.loadingGrid = false;
            },
            (error) => {
              this.loadingGrid = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sortChange(sort: SortDescriptor[]): void {
    try {
      this.gridSort = sort;
      this.loadGridItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  pageChange(event: PageChangeEvent): void {
    try {
      // this.documentsGridView = null;
      this.pageSkip = event.skip;
      // this.OrderSkip = event.skip;
      this.page = event.skip / event.take;
      this.getRCMDocumentsList();
      // this.loadGridItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  loadGridItems() {
    try {
      // this.documentsGridView = {
      //   data: orderBy(
      //     this.documentGridItems.slice(
      //       this.pageSkip,
      //       this.pageSkip + this.pageSize
      //     ),
      //     this.gridSort
      //   ),
      //   total: this.documentGridItems.length,
      // };
      if (this.documentGridData) {
        this.documentsGridView = {
          data: orderBy(this.documentGridData["content"], this.gridSort),
          total: this.documentGridData["totalelements"],
        };
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
