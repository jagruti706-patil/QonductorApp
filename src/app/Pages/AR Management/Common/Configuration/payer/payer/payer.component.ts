import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Payer } from "src/app/Model/AR Management/Configuration/payer";
import { AddpayerComponent } from "src/app/Pages/AR Management/Common/Configuration/payer/addpayer/addpayer.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-payer",
  templateUrl: "./payer.component.html",
  styleUrls: ["./payer.component.css"],
})
export class PayerComponent implements OnInit, OnDestroy {
  public PayergridData: {};
  public PayergridView: GridDataResult;
  private Payeritems: any[] = [];
  public Payerskip = 0;
  public PayerpageSize = 10;

  private Payerid: number = 0;
  public editPayerid: number = 0;
  private deletePayerid: number = 0;
  public EditPayerid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddPayerChild", { static: true }) private AddPayerChild: AddpayerComponent;

  public Payersort: SortDescriptor[] = [
    {
      field: "spayername",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.PayerpageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Payerid = 0;
      this.getPayerById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getPayerById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayerById(this.Payerid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.PayergridData = data;
              this.Payeritems = data;
              this.loadPayeritems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadPayeritems(): void {
    try {
      this.PayergridView = {
        data: orderBy(
          this.Payeritems.slice(
            this.Payerskip,
            this.Payerskip + this.PayerpageSize
          ),
          this.Payersort
        ),
        total: this.Payeritems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortPayerChange(sort: SortDescriptor[]): void {
    try {
      if (this.Payeritems != null) {
        this.Payersort = sort;
        this.loadPayeritems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangePayer(event: PageChangeEvent): void {
    try {
      this.Payerskip = event.skip;
      this.loadPayeritems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditPayer({ sender, rowIndex, dataItem }) {
    try {
      this.editPayerid = dataItem.npayerid;
      this.InputEditMessage = "Do you want to edit payer?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeletePayer({ sender, rowIndex, dataItem }) {
    try {
      this.deletePayerid = dataItem.npayerid;
      this.InputDeleteMessage = "Do you want to delete payer?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deletePayer() {
    try {
      this.subscription.add(
        this.ConfigurationService.deletePayer(this.deletePayerid).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                alert("Payer deleted successfully");
              } else {
                alert("Payer not deleted");
              }
              this.Payerid = 0;
              this.getPayerById();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updatePayerStatus(Payerid, Payer) {
    try {
      const jsonpayer = JSON.stringify(Payer);
      this.subscription.add(
        this.ConfigurationService.updatePayerStatus(
          Payerid,
          jsonpayer
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else if (data == 0) {
              this.clsUtility.showError("Status not updated");
            } else {
              this.clsUtility.showInfo(
                "Status cannot be updated already in use"
              );
            }
            this.getPayerById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddPayer() {
    try {
      this.editPayerid = 0;
      this.EditPayerid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditPayerid = this.editPayerid;
        $("#addpayerModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deletePayer();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputPayerEditResult($event) {
    try {
      this.Payerid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getPayerById();
      }
      this.AddPayerChild.ResetComponents();
      this.editPayerid = null;
      this.EditPayerid = null;
      $("#addpayerModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnPayerStatus(Payerid, PayerStatus) {
    try {
      let objPayer: Payer;
      objPayer = new Payer();
      objPayer.npayerid = Payerid;
      objPayer.bisactive = PayerStatus;
      this.updatePayerStatus(Payerid, objPayer);
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
