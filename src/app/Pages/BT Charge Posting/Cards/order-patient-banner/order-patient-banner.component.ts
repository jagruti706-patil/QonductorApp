import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
declare var $: any;
@Component({
  selector: "app-order-patient-banner",
  templateUrl: "./order-patient-banner.component.html",
  styleUrls: ["./order-patient-banner.component.css"],
})
export class OrderPatientBannerComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  clsUtility: Utility;
  orderPatientInfo: any;
  orderInfo: any = {};
  selectedOrderCode: string;

  public InsuranceGridData: {};
  public InsuranceGridView: GridDataResult;
  private InsuranceItems: any[] = [];
  public InsuranceSkip = 0;
  public InsurancePageSize = 3;
  public InsuranceSort: SortDescriptor[] = [
    {
      field: "set_id_in1",
      dir: "asc",
    },
  ];
  coveragestatus: string = "";
  index: number = 0;

  constructor(
    private data: DataTransferService,
    private coreservice: CoreOperationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  loading: boolean = false;
  @Input() title: string = "Encounter";
  @Input() calledFrom: string = "";

  ngOnInit() {
    this.subscription.add(
      this.data.CollapsePatientInfoBanner.subscribe((data) => {
        this.bannerCollapse = data;
      })
    );

    this.subscription.add(
      this.data.SelectedOrderInfo.subscribe((data) => {
        if (data != null) {
          this.orderInfo = data;
        }
      })
    );
    this.subscription.add(
      this.data.SelectedOrderQueueGroupCode.subscribe((orderCode) => {
        // this.selectedOrderCode = orderCode;

        if (orderCode != "" && orderCode != null) {
          if (
            (this.orderInfo &&
              this.orderInfo.encountersource &&
              this.orderInfo.encountersource.toLowerCase() ===
                "rcm encounter") ||
            this.calledFrom == "assistance"
          ) {
            return;
          }
          if (this.calledFrom === "archivedencounters") {
            if (
              this.data.orderpatientdetails != null &&
              this.data.orderpatientdetails.length > 0
            )
              this.orderPatientInfo = this.data.orderpatientdetails[0];
            else this.orderPatientInfo = null;

            if (this.data.orderinsurancedetails) {
              this.InsuranceGridData = this.data.orderinsurancedetails;
              this.InsuranceItems = this.data.orderinsurancedetails;
              this.OrderloadItems();
            } else {
              this.InsuranceGridData = null;
              this.InsuranceItems = [];
              this.InsuranceGridView = null;
            }
          } else {
            this.loading = true;
            this.selectedOrderCode = orderCode;

            this.subscription.add(
              this.coreservice.GetHLDetails(this.selectedOrderCode).subscribe(
                (hl7details) => {
                  if (hl7details != null && hl7details.length > 0) {
                    this.orderPatientInfo = hl7details[0];
                    this.InsuranceGridView = null;
                    this.RetriveInsuranceInfo();
                    if (hl7details[0].content != null) {
                      this.InsuranceGridData = hl7details[0].content;
                      // console.log(hl7details);

                      if (this.InsuranceGridData != null) {
                        this.InsuranceItems = hl7details[0].content;
                        this.OrderloadItems();
                        this.loading = false;
                      } else {
                        this.InsuranceGridView = null;
                        this.loading = false;
                      }
                    }
                    this.loading = false;
                  } else {
                    this.orderPatientInfo = null;
                    this.loading = false;
                  }
                },
                (err) => {
                  this.loading = false;
                }
              )
            );
          }
        }
      })
    );
    // this.subscription.add(
    //   this.data.SelectedOrderPatientInfo.subscribe(data => {
    //     this.orderPatientInfo = data;
    //   })
    // );

    // this.subscription.add(
    //   this.data.SelectedOrderInsuranceInfo.subscribe(data => {
    //     if (data != null) {
    //       this.InsuranceGridData = data;

    //       if (this.InsuranceGridData != null) {
    //         this.InsuranceItems = data;
    //         this.OrderloadItems();
    //       } else {
    //         this.InsuranceGridView = null;
    //       }
    //     }
    //   })
    // );
  }
  OrderloadItems() {
    try {
      if (this.InsuranceGridData != null) {
        this.InsuranceGridView = {
          data: orderBy(this.InsuranceItems, this.InsuranceSort),
          total: this.InsuranceSkip,
        };
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
  OnClose() {
    this.InsuranceGridView = null;
    this.orderPatientInfo = null;
    this.orderInfo = {};
    this.data.eligibilityInfo.next(null);
  }
  bannerCollapse: boolean = false;
  BannercollapseClick() {
    this.bannerCollapse = !this.bannerCollapse;
  }
  copyInputMessage(ordercode) {
    ordercode.select();
    var isCopy = document.execCommand("copy");
    ordercode.setSelectionRange(0, 0);
    if (isCopy) {
      this.clsUtility.showSuccess("Copied");
    }
  }

  RetriveInsuranceInfo() {
    if (this.InsuranceGridView == null) {
      this.subscription.add(
        this.coreservice.GetHLDetails(this.selectedOrderCode, 1).subscribe(
          (hl7details) => {
            if (hl7details != null && hl7details.length > 0) {
              if (hl7details != null) {
                this.InsuranceGridData = hl7details;
                if (this.InsuranceGridData != null) {
                  this.InsuranceItems = hl7details;
                  this.OrderloadItems();
                } else {
                  this.InsuranceGridView = null;
                }
              }
            }
          },
          (err) => {}
        )
      );
    }
  }
  getInsuranceEligibilityData(eligibilityid: string, coveragestatus: string) {
    try {
      // let accessionnumber = this.SelectedOrder.orderqueuegroupcode;
      this.coveragestatus = coveragestatus;
      this.subscription.add(
        this.coreservice.getInsuranceEligibilityData(eligibilityid).subscribe(
          (data) => {
            // console.log(data);
            if (data) {
              // console.log(data);
              // let json = JSON.parse(data.eligibilityinfo);
              this.data.eligibilityInfo.next(data);
            } else {
              this.clsUtility.showInfo(
                "Insurance eligiblity info not available"
              );
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
  onViewDocClose() {
    try {
      this.data.ViewDocMasterDocId.next("");
      this.index = 0;
      if (this.calledFrom == "assistance")
        this.clsUtility.applyModalOpenClassOnClose(
          "vieworiginaldocfrom" + this.calledFrom
        );
      $("#vieworiginaldocfrom" + this.calledFrom).modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public onTabSelect(e: any) {
    this.index = e.index;
  }

  onViewEligibilityData(dataItem: any) {
    try {
      if (this.calledFrom === "archivedencounters") {
        if (dataItem.eligibilitydetails) {
          this.data.eligibilityInfo.next(dataItem.eligibilitydetails);
        } else {
          this.clsUtility.showInfo("Insurance eligiblity info not available");
        }
      } else {
        this.getInsuranceEligibilityData(
          dataItem.eligibilityid,
          dataItem.coveragestatus
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
