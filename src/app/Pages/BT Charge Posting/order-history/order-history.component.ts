import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { FormBuilder } from "@angular/forms";
import { CoreOperationService } from "../../Services/BT/core-operation.service";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.css"],
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  selectedorder: any;
  orderaccession: any;
  orderqueuegroupid: any;
  clsUtility: Utility;
  orderstatus: number;
  private subscription = new SubSink();
  orderdetails: any;
  orderarray: string[];

  public HistorygridData: {};
  public HistorygridView: GridDataResult;
  private Historyitems: any[] = [];

  public Historysort: SortDescriptor[] = [
    {
      field: "date",
      dir: "desc",
    },
  ];

  constructor(
    private route: Router,
    private dataService: DataTransferService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private coreService: CoreOperationService
  ) {}

  ngOnInit() {
    //this.selectedorder = this.dataService.order;
    // debugger;
    this.subscription.add(
      this.dataService.orderdetailinformation.subscribe((data) => {
        this.orderarray = data;

        // console.log(this.orderarray);
      })
    );
    if (this.orderarray) {
      this.retriveOrderHistory();
    }

    // this.ShowOrderDetails();
  }
  // ShowOrderDetails() {
  //   try {
  //     this.orderqueuegroupid = this.orderarray[0];
  //     this.orderstatus = +this.orderarray[1];

  //     console.log(this.orderqueuegroupid);

  //     this.subscription.add(
  //       this.coreService
  //         .RetriveOrderQueueDetails(this.orderqueuegroupid, this.orderstatus)
  //         .subscribe(
  //           data => {
  //             if (data != null || data != undefined) {
  //               // this.loadingTask = true;
  //               // console.log(data);

  //               this.orderdetails = data;
  //               this.dataService.SelectedOrderPatientInfo.next(
  //                 this.orderdetails
  //               );
  //               this.dataService.SelectedOrderInsuranceInfo.next(
  //                 this.orderdetails.content
  //               );
  //               this.dataService.SelectedOrderQueueGroupID.next(
  //                 this.orderdetails.orderqueuegroupid
  //               );
  //               this.dataService.SelectedOrderDocumentInfo.next(
  //                 this.orderdetails.documentlist
  //               );
  //               this.dataService.CollapsePatientInfoBanner.next(false);
  //             }
  //           },
  //           err => {}
  //         )
  //     );
  //   } catch (error) {}
  // }

  retriveOrderHistory() {
    try {
      // console.log(this.dataService.SelectedGCPUserid);
      this.orderaccession = this.orderarray[0];
      this.subscription.add(
        this.coreService.getOrderHistory(this.orderaccession).subscribe(
          (data) => {
            if (data != undefined || data != null) {
              // this.getordersdata = data;
              this.Historyitems = data["content"];
              this.loadHistoryitems();
            } else {
              this.Historyitems = null;
            }
          },
          (err) => {
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadHistoryitems(): void {
    try {
      this.HistorygridView = {
        data: orderBy(this.Historyitems, this.Historysort),
        total: this.Historyitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortHistoryChange(sort: SortDescriptor[]): void {
    try {
      if (this.Historyitems != null) {
        this.Historysort = sort;
        this.loadHistoryitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onCloseClick() {
    //this.subscription.unsubscribe();
    this.HistorygridView = null;
    this.Historyitems = null;
    this.NavigateBack();
  }
  NavigateBack() {
    try {
      this.route.navigate(["/OrderSearch"]);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
