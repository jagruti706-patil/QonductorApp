import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Payercrosswalk } from "src/app/Model/AR Management/Configuration/payercrosswalk";
import {
  Filter,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addpayercrosswalk",
  templateUrl: "./addpayercrosswalk.component.html",
  styleUrls: ["./addpayercrosswalk.component.css"],
})
export class AddpayercrosswalkComponent implements OnInit, OnChanges {
  private Clientid: number = 0;
  public selectedClientValue: number;
  public Clientdetail: any = [];

  private Payerid: number = 0;
  public selectedPayerValue: number;
  public Payerdetail: any = [];

  public newPayercrosswalk = true;
  private Payercrosswalkdetail: any = [];
  public PayercrosswalkEditid: any;
  public selectedPayercrosswalkValue: string;
  private clsPayercrosswalk: Payercrosswalk;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Loading
  loadingPayercrosswalk = true;

  // Received Input from parent component
  @Input() InputPayercrosswalkEditid: any;

  // Send Output to parent component
  @Output() OutputPayercrosswalkEditResult = new EventEmitter<boolean>();

  OutputpayercrosswalkEditResult(data: any) {
    let outPayercrosswalkEditResult = data;
    this.OutputPayercrosswalkEditResult.emit(outPayercrosswalkEditResult);
  }

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  PayercrosswalkGroup = this.fb.group({
    fcClient: ["", Validators.required],
    fcPayer: ["", Validators.required],
    fcFilePayerName: ["", [Validators.required, Validators.maxLength(100)]],
  });

  get ClientName() {
    return this.PayercrosswalkGroup.get("fcClient");
  }

  get PayerName() {
    return this.PayercrosswalkGroup.get("fcPayer");
  }

  get FilePayerName() {
    return this.PayercrosswalkGroup.get("fcFilePayerName");
  }

  ngOnInit() {
    try {
      this.clsPayercrosswalk = new Payercrosswalk();
      this.loadingPayercrosswalk = true;
      this.getClientConfigurationById(this.Clientid);
      this.formValueChanged(); //saurabh shelar

      if (
        this.InputPayercrosswalkEditid != null &&
        this.InputPayercrosswalkEditid != 0
      ) {
        this.newPayercrosswalk = false;
        this.PayercrosswalkEditid = this.InputPayercrosswalkEditid;
        this.getPayercrosswalkById(this.PayercrosswalkEditid);
      } else {
        this.newPayercrosswalk = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsPayercrosswalk = new Payercrosswalk();
      this.loadingPayercrosswalk = true;
      this.getClientConfigurationById(this.Clientid);
      if (
        this.InputPayercrosswalkEditid != null &&
        this.InputPayercrosswalkEditid != 0
      ) {
        this.newPayercrosswalk = false;
        this.PayercrosswalkEditid = this.InputPayercrosswalkEditid;
        this.getPayercrosswalkById(this.PayercrosswalkEditid);
      } else {
        this.newPayercrosswalk = true;
      }
      this.formValueChanged(); //saurabh shelar
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getPayercrosswalkById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayercrosswalkById(id, 0).subscribe(
          (data) => {
            if (data.content != null || data.content != undefined) {
              this.Payercrosswalkdetail = data.content[0];
              this.FillPayercrosswalkGroup();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientConfigurationById(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe((data) => {
            if (data != null || data != undefined) {
              AllFilterJSON = data;
              this.Clientdetail = AllFilterJSON.client;
              this.getPayerById(this.Payerid);
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  selectedclient: any;
  formValueChanged(): any {
    try {
      if (this.Clientdetail != null) {
        this.subscription.add(
          this.ClientName.valueChanges.subscribe((data: any) => {
            if (data !== null && data > 0) {
              console.log("in ddl client" + this.Clientdetail); //saurabh shelar

              this.getClientConfigurationById(data);
              this.selectedclient = this.Clientdetail.find(
                (x) => x.nclientid === data
              );
              console.log("New Log ->", this.selectedclient);
            }
          })
        );
      } //if condition
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  /////////////////////

  getPayerById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayerById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Payerdetail = data;
            this.loadingPayercrosswalk = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validatePayercrosswalk() {
    try {
      if (
        this.ClientName.valid &&
        this.PayerName.valid &&
        this.FilePayerName.valid &&
        this.ClientName.value != 0 &&
        this.PayerName.value != 0 &&
        this.ClientName.value != null &&
        this.PayerName.value != null &&
        this.ClientName.value != undefined &&
        this.PayerName.value != undefined &&
        !this.clsUtility.CheckEmptyString(this.FilePayerName.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postPayercrosswalk() {
    try {
      const jsonclient = JSON.stringify(this.clsPayercrosswalk);
      this.subscription.add(
        this.ConfigurationService.savePayercrosswalk(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Payercrosswalk added successfully"
                );
                this.OutputpayercrosswalkEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Payercrosswalk not added");
                this.OutputpayercrosswalkEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Payercrosswalk already registered with this filepayer"
                );
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updatePayercrosswalk() {
    try {
      const jsonclient = JSON.stringify(this.clsPayercrosswalk);
      this.subscription.add(
        this.ConfigurationService.updatePayercrosswalk(
          this.PayercrosswalkEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Payercrosswalk updated successfully"
              );
              this.OutputpayercrosswalkEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Payercrosswalk not added");
              this.OutputpayercrosswalkEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Payercrosswalk already registered with this filepayer"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  savePayercrosswalk() {
    try {
      this.submitted = true;
      if (this.validatePayercrosswalk()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        let payername;
        var strFilepayername: string = this.FilePayerName.value;
        const indexpayer = this.Payerdetail.findIndex(
          (x) => x.npayerid == this.PayerName.value
        );
        if (indexpayer >= 0) {
          payername = this.Payerdetail[indexpayer]["spayername"];
        }
        if (this.newPayercrosswalk) {
          this.clsPayercrosswalk.crosswalkid = 0;
          this.clsPayercrosswalk.clientid = this.ClientName.value;
          this.clsPayercrosswalk.payerid = this.PayerName.value;
          this.clsPayercrosswalk.payername = payername;
          this.clsPayercrosswalk.filepayername = strFilepayername.trim();
          this.clsPayercrosswalk.bisactive = true;
          this.clsPayercrosswalk.createdon = currentDateTime;
          this.clsPayercrosswalk.modifiedon = currentDateTime;
          this.postPayercrosswalk();
        } else if (
          this.Payercrosswalkdetail.clientid != this.ClientName.value ||
          this.Payercrosswalkdetail.payerid != this.PayerName.value ||
          this.Payercrosswalkdetail.payername != payername ||
          this.Payercrosswalkdetail.filepayername != strFilepayername.trim()
        ) {
          this.clsPayercrosswalk.crosswalkid = this.InputPayercrosswalkEditid;
          this.clsPayercrosswalk.clientid = this.ClientName.value;
          this.clsPayercrosswalk.payerid = this.PayerName.value;
          this.clsPayercrosswalk.payername = payername;
          this.clsPayercrosswalk.filepayername = strFilepayername.trim();
          this.clsPayercrosswalk.bisactive = this.Payercrosswalkdetail.bisactive;
          this.clsPayercrosswalk.modifiedon = currentDateTime;
          this.updatePayercrosswalk();
        } else {
          this.OutputpayercrosswalkEditResult(false);
          $("#addpayercrosswalkModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClientChange(event: any) {
    try {
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onPayerChange(event: any) {
    try {
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillPayercrosswalkGroup() {
    try {
      let Payercrosswalk: Payercrosswalk;
      Payercrosswalk = this.Payercrosswalkdetail;
      console.log(this.selectedclient);
      this.ClientName.setValue(Payercrosswalk.clientid);
      this.PayerName.setValue(Payercrosswalk.payerid);
      //this.selectedPayerValue = Payercrosswalk.payerid;
      this.FilePayerName.setValue(Payercrosswalk.filepayername);

      //    this.selectedClientValue = Payercrosswalk.clientid;
      if (this.selectedclient == undefined) {
        this.ClientName.setValue(null);

        // this.ClientName.updateValueAndValidity();
      }

      console.log(this.ClientName);

      // this.ClientName.updateValueAndValidity();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputpayercrosswalkEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.PayercrosswalkGroup.reset();
      this.submitted = false;
      this.InputPayercrosswalkEditid = null;
      this.clsPayercrosswalk = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
