import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { Payer } from "src/app/Model/AR Management/Configuration/payer";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addpayer",
  templateUrl: "./addpayer.component.html",
  styleUrls: ["./addpayer.component.css"],
})
export class AddpayerComponent implements OnInit, OnChanges {
  public newPayer = true;
  public Payerdetail: any = [];
  public PayerEditid: any;
  public selectedPayerValue: string;
  private clsPayer: Payer;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Received Input from parent component
  @Input() InputPayerEditid: any;

  // Send Output to parent component
  @Output() OutputPayerEditResult = new EventEmitter<boolean>();

  OutputpayerEditResult(data: any) {
    let outPayerEditResult = data;
    this.OutputPayerEditResult.emit(outPayerEditResult);
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  PayerGroup = this.fb.group({
    fcPayerName: ["", [Validators.required, Validators.maxLength(100)]],
  });

  get PayerName() {
    return this.PayerGroup.get("fcPayerName");
  }

  ngOnInit() {
    try {
      this.clsPayer = new Payer();
      if (this.InputPayerEditid != null && this.InputPayerEditid != 0) {
        this.newPayer = false;
        this.PayerEditid = this.InputPayerEditid;
        this.getPayerById(this.PayerEditid);
      } else {
        this.newPayer = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsPayer = new Payer();
      if (this.InputPayerEditid != null && this.InputPayerEditid != 0) {
        this.newPayer = false;
        this.PayerEditid = this.InputPayerEditid;
        this.getPayerById(this.PayerEditid);
      } else {
        this.newPayer = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validatePayer() {
    try {
      if (
        this.PayerName.valid &&
        !this.clsUtility.CheckEmptyString(this.PayerName.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getPayerById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayerById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Payerdetail = data;
            if (this.InputPayerEditid != null && this.InputPayerEditid != 0) {
              this.FillPayerGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postPayer() {
    try {
      const jsonclient = JSON.stringify(this.clsPayer);
      this.subscription.add(
        this.ConfigurationService.savePayer(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Payer added successfully");
                this.OutputpayerEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Payer not added");
                this.OutputpayerEditResult(false);
              } else {
                this.clsUtility.showInfo("Payer already registered");
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updatePayer() {
    try {
      const jsonclient = JSON.stringify(this.clsPayer);
      this.subscription.add(
        this.ConfigurationService.updatePayer(
          this.PayerEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Payer updated successfully");
              this.OutputpayerEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Payer not updated");
              this.OutputpayerEditResult(false);
            } else {
              this.clsUtility.showInfo("Payer already registered");
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  savePayer() {
    try {
      this.submitted = true;
      if (this.validatePayer()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        var strPayer = this.PayerName.value;
        if (this.newPayer) {
          this.clsPayer.npayerid = 0;
          this.clsPayer.spayername = strPayer.trim();
          this.clsPayer.bisactive = true;
          this.clsPayer.createdon = currentDateTime;
          this.clsPayer.modifiedon = currentDateTime;
          this.postPayer();
        } else if (this.Payerdetail.spayername != strPayer.trim()) {
          this.clsPayer.npayerid = this.InputPayerEditid;
          this.clsPayer.spayername = strPayer.trim();
          this.clsPayer.bisactive = this.Payerdetail.bisactive;
          this.clsPayer.modifiedon = currentDateTime;
          this.updatePayer();
        } else {
          this.OutputpayerEditResult(false);
          $("#addpayerModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillPayerGroup() {
    try {
      let Payer: Payer;
      Payer = this.Payerdetail;
      this.PayerName.setValue(Payer.spayername);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputpayerEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.PayerGroup.reset();
      this.submitted = false;
      this.InputPayerEditid = null;
      this.clsPayer = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
