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
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Clientlogin } from "src/app/Model/AR Management/Configuration/clientlogin";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  Filter,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addclientlogin",
  templateUrl: "./addclientlogin.component.html",
  styleUrls: ["./addclientlogin.component.css"],
})
export class AddclientloginComponent implements OnInit {
  private Clientid: number = 0;
  public selectedClientValue: number;
  public Clientdetail: any = [];

  private Payerid: number = 0;
  public selectedPayerValue: number;
  public Payerdetail: any = [];

  public newClientlogin = true;
  public ClientloginEditid: any;
  private Clientlogindetail: any = [];
  private clsClientlogin: Clientlogin;
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;

  public bIsLoginUsingCredentials = true;
  // Loading
  loadingClientlogin = true;

  // Received Input from parent component
  @Input() InputClientloginEditid: any;

  // Send Output to parent component
  @Output() OutputClientloginEditResult = new EventEmitter<boolean>();

  OutputClientLoginEditResult(data: any) {
    let outClientloginEditResult = data;
    this.OutputClientloginEditResult.emit(outClientloginEditResult);
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  AddClientLoginGroup = this.fb.group({
    fcClient: ["", Validators.required],
    fcPayer: ["", Validators.required],
    fcUsing: ["", Validators.required],
    fcUsername: ["", [Validators.required, Validators.maxLength(50)]],
    fcPassword: [
      "",
      [Validators.required, Validators.maxLength(50)],
      // [Validators.required, Validators.minLength(8), Validators.maxLength(50)]
    ],
    fcTIN: ["", [Validators.required, Validators.maxLength(50)]],
  });

  get ClientName() {
    return this.AddClientLoginGroup.get("fcClient");
  }

  get PayerName() {
    return this.AddClientLoginGroup.get("fcPayer");
  }

  get Using() {
    return this.AddClientLoginGroup.get("fcUsing");
  }

  get LoginUsername() {
    return this.AddClientLoginGroup.get("fcUsername");
  }

  get LoginPassword() {
    return this.AddClientLoginGroup.get("fcPassword");
  }

  get TIN() {
    return this.AddClientLoginGroup.get("fcTIN");
  }

  ngOnInit() {
    try {
      this.clsClientlogin = new Clientlogin();
      this.bIsLoginUsingCredentials = true;
      if (this.bIsLoginUsingCredentials) {
        this.SetUsingelement("Credentials");
      } else {
        this.SetUsingelement("TIN");
      }
      this.getClientConfigurationById(this.Clientid);
      this.formValueChanged(); //saurabh shelar
      if (
        this.InputClientloginEditid != null &&
        this.InputClientloginEditid != 0
      ) {
        this.newClientlogin = false;
        this.ClientloginEditid = this.InputClientloginEditid;
        this.getClientLoginById(this.ClientloginEditid);
      } else {
        this.newClientlogin = true;
        this.loadingClientlogin = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsClientlogin = new Clientlogin();
      this.bIsLoginUsingCredentials = true;
      if (this.bIsLoginUsingCredentials) {
        this.SetUsingelement("Credentials");
      } else {
        this.SetUsingelement("TIN");
      }
      this.getClientConfigurationById(this.Clientid);
      if (
        this.InputClientloginEditid != null &&
        this.InputClientloginEditid != 0
      ) {
        this.newClientlogin = false;
        this.ClientloginEditid = this.InputClientloginEditid;
        this.getClientLoginById(this.ClientloginEditid);
      } else {
        this.newClientlogin = true;
        this.loadingClientlogin = true;
      }
      this.formValueChanged(); //saurabh shelar
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  selectedclient: any;
  selectedCategory: any;
  formValueChanged(): any {
    try {
      if (this.Clientdetail.length != 0) {
        this.subscription.add(
          this.ClientName.valueChanges.subscribe((data: any) => {
            if (data !== null && data > 0) {
              //console.log("in ddl client"+this.ddlClientdetail);    //saurabh shelar

              this.getClientConfigurationById(data);
              this.selectedclient = this.Clientdetail.find(
                (x) => x.nclientid === data
              );
              console.log("New Log ->", this.selectedclient);
              // this.fbcDOSBefore.setValue("");
              // this.fbcDOSAfter.setValue("");
              // this.fbcInsurance.setValue(null);
              // this.fbcBillingProvider.setValue(null);
              // this.fbcRenderingProvider.setValue(null);
            }
            // if (this.fbcClientID.valid) {
            //   this.IsClientSelected = true;
            // } else {
            //   this.IsClientSelected = false;
            // }
          })
        );
      } //if condition
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

  getPayerById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getPayerById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Payerdetail = data;
            this.loadingClientlogin = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientLoginById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientLoginById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Clientlogindetail = data;
            if (
              this.InputClientloginEditid != null &&
              this.InputClientloginEditid != 0
            ) {
              this.FillClientLoginGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateClientLogin() {
    try {
      if (this.bIsLoginUsingCredentials) {
        if (
          this.Clientdetail.length != 0 && //saurabh shelar
          this.Using.valid &&
          this.ClientName.valid &&
          this.PayerName.valid &&
          this.LoginUsername.valid &&
          this.LoginPassword.valid &&
          this.ClientName.value != 0 &&
          this.PayerName.value != 0 &&
          this.ClientName.value != null &&
          this.PayerName.value != null &&
          this.ClientName.value != undefined &&
          this.PayerName.value != undefined &&
          !this.clsUtility.CheckEmptyString(this.LoginUsername.value) &&
          !this.clsUtility.CheckEmptyString(this.LoginPassword.value)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.Using.valid &&
          this.ClientName.valid &&
          this.PayerName.valid &&
          this.TIN.valid &&
          this.ClientName.value != 0 &&
          this.PayerName.value != 0 &&
          !this.clsUtility.CheckEmptyString(this.TIN.value)
        ) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postClientLogin() {
    try {
      const jsonclientlogin = JSON.stringify(this.clsClientlogin);
      this.subscription.add(
        this.ConfigurationService.saveClientLogin(jsonclientlogin).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Clientlogin added successfully");
                // alert("Clientlogin added successfully");
                this.OutputClientLoginEditResult(true);
              } else {
                this.clsUtility.showError("Clientlogin not added");
                // alert("Clientlogin not added");
                this.OutputClientLoginEditResult(false);
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateClientLogin() {
    try {
      const jsonclientlogin = JSON.stringify(this.clsClientlogin);
      this.subscription.add(
        this.ConfigurationService.updateClientLogin(
          this.ClientloginEditid,
          jsonclientlogin
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Clientlogin updated successfully");
              // alert("Clientlogin updated successfully");
              this.OutputClientLoginEditResult(true);
            } else {
              this.clsUtility.showError("Clientlogin not updated");
              // alert("Clientlogin not updated");
              this.OutputClientLoginEditResult(false);
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveClientLogin() {
    try {
      this.submitted = true;
      if (this.validateClientLogin()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        let SelectedUserid = "0";
        let Providerid = "0";
        let LoginUsername = null;

        var strLoginUsername: string = this.LoginUsername.value;
        // var strLoginPassword: string = this.LoginPassword.value;
        var strLoginPassword: string = this.clsUtility
          .encryptAES(this.LoginPassword.value)
          .toString();

        var strTIN: string = this.TIN.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid.toString();

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        let bIsUsing;
        if (this.Using.value.toUpperCase() == "CREDENTIALS") {
          bIsUsing = "Credentials";
          Providerid = "0";
        } else {
          bIsUsing = "TIN";
          Providerid = "1";
        }

        if (this.newClientlogin) {
          this.clsClientlogin.nloginid = 0;
          this.clsClientlogin.nclientid = this.ClientName.value;
          this.clsClientlogin.npayerid = this.PayerName.value;
          this.clsClientlogin.nproviderid = Providerid;
          this.clsClientlogin.nupdatetoid = SelectedUserid;
          this.clsClientlogin.supdatetousername = LoginUsername;
          this.clsClientlogin.sloginusing = bIsUsing;
          this.clsClientlogin.createdon = currentDateTime;
          this.clsClientlogin.modifiedon = currentDateTime;

          if (this.bIsLoginUsingCredentials) {
            this.clsClientlogin.sloginname = strLoginUsername.trim();
            this.clsClientlogin.spassword = strLoginPassword.trim();
          } else {
            this.clsClientlogin.sloginname = strTIN.trim();
            this.clsClientlogin.spassword = "";
          }

          this.clsClientlogin.sloginemailid = "";
          this.clsClientlogin.sloginemailpassword = "";
          this.clsClientlogin.dtloginstartdate = "";
          this.clsClientlogin.dtloginendate = "";
          this.clsClientlogin.bisactivelogin = true;
          this.postClientLogin();
        } else {
          if (this.bIsLoginUsingCredentials) {
            if (
              this.Clientlogindetail.nclientid != this.ClientName.value ||
              this.Clientlogindetail.npayerid != this.PayerName.value ||
              this.Clientlogindetail.nproviderid != Providerid ||
              this.Clientlogindetail.nupdatetoid != SelectedUserid ||
              this.Clientlogindetail.sloginusing != this.Using.value ||
              this.Clientlogindetail.sloginname != strLoginUsername.trim() ||
              this.Clientlogindetail.spassword != strLoginPassword.trim()
              // this.clsUtility
              //   .decryptobj(this.Clientlogindetail.spassword)
              //   .toString() != this.LoginPassword.value.trim()
            ) {
              this.clsClientlogin.nloginid = this.InputClientloginEditid;
              this.clsClientlogin.nclientid = this.ClientName.value;
              this.clsClientlogin.npayerid = this.PayerName.value;
              this.clsClientlogin.nproviderid = Providerid;
              this.clsClientlogin.nupdatetoid = SelectedUserid;
              this.clsClientlogin.sloginusing = bIsUsing;
              this.clsClientlogin.modifiedon = currentDateTime;
              this.clsClientlogin.sloginname = strLoginUsername.trim();
              this.clsClientlogin.spassword = strLoginPassword.trim();
              this.clsClientlogin.sloginemailid = this.Clientlogindetail.sloginemailid;
              this.clsClientlogin.sloginemailpassword = this.Clientdetail.sloginemailpassword;
              this.clsClientlogin.dtloginstartdate = this.Clientlogindetail.dtloginstartdate;
              this.clsClientlogin.dtloginendate = this.Clientlogindetail.dtloginendate;
              this.clsClientlogin.bisactivelogin = this.Clientlogindetail.bisactivelogin;
              this.clsClientlogin.supdatetousername = LoginUsername;
              this.updateClientLogin();
            } else {
              this.OutputClientLoginEditResult(false);
              $("#addclientloginModal").modal("hide");
            }
          } else {
            if (
              this.Clientlogindetail.nclientid != this.ClientName.value ||
              this.Clientlogindetail.npayerid != this.PayerName.value ||
              this.Clientlogindetail.nproviderid != Providerid ||
              this.Clientlogindetail.nupdatetoid != SelectedUserid ||
              this.Clientlogindetail.sloginusing != this.Using.value ||
              this.Clientlogindetail.sloginname != strTIN.trim()
            ) {
              this.clsClientlogin.nloginid = this.InputClientloginEditid;
              this.clsClientlogin.nclientid = this.ClientName.value;
              this.clsClientlogin.npayerid = this.PayerName.value;
              this.clsClientlogin.nproviderid = Providerid;
              this.clsClientlogin.nupdatetoid = SelectedUserid;
              this.clsClientlogin.sloginusing = bIsUsing;
              this.clsClientlogin.modifiedon = currentDateTime;
              this.clsClientlogin.sloginname = strTIN.trim();
              this.clsClientlogin.spassword = "";
              this.clsClientlogin.sloginemailid = this.Clientlogindetail.sloginemailid;
              this.clsClientlogin.sloginemailpassword = this.Clientdetail.sloginemailpassword;
              this.clsClientlogin.dtloginstartdate = this.Clientlogindetail.dtloginstartdate;
              this.clsClientlogin.dtloginendate = this.Clientlogindetail.dtloginendate;
              this.clsClientlogin.bisactivelogin = this.Clientlogindetail.bisactivelogin;
              this.updateClientLogin();
            } else {
              this.OutputClientLoginEditResult(false);
              $("#addclientloginModal").modal("hide");
            }
          }
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnLoginUsingChange(LoginUsing: string) {
    try {
      if (LoginUsing == "Credentials") {
        this.bIsLoginUsingCredentials = true;
      } else if (LoginUsing == "TIN") {
        this.bIsLoginUsingCredentials = false;
      }
      if (
        this.InputClientloginEditid != null &&
        this.InputClientloginEditid != 0
      ) {
        if (this.bIsLoginUsingCredentials) {
          this.LoginUsername.setValue(this.Clientlogindetail.sloginname);

          if (
            this.Clientlogindetail.spassword != "" &&
            this.Clientlogindetail.spassword != null &&
            this.Clientlogindetail.spassword != undefined
          ) {
            this.LoginPassword.setValue(this.Clientlogindetail.spassword);
            // this.LoginPassword.setValue(
            //   this.clsUtility
            //     .decryptobj(this.Clientlogindetail.spassword)
            //     .toString()
            // );
          }
        } else {
          this.TIN.setValue(this.Clientlogindetail.sloginname);
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillClientLoginGroup() {
    try {
      let ClientLogin: Clientlogin;
      ClientLogin = this.Clientlogindetail;
      // this.selectedClientValue = ClientLogin.nclientid;
      // this.selectedPayerValue = ClientLogin.npayerid;
      this.ClientName.setValue(ClientLogin.nclientid);
      this.PayerName.setValue(ClientLogin.npayerid);
      if (this.selectedclient == undefined) {
        this.ClientName.setValue(null);

        // this.ClientName.updateValueAndValidity();
      }

      if (ClientLogin.sloginusing.toUpperCase() == "CREDENTIALS") {
        this.bIsLoginUsingCredentials = true;
        this.LoginUsername.setValue(ClientLogin.sloginname);
        // this.LoginPassword.setValue(ClientLogin.spassword);
        this.LoginPassword.setValue(
          this.clsUtility.decryptAES(ClientLogin.spassword).toString()
        );

        this.SetUsingelement("Credentials");
      } else {
        this.bIsLoginUsingCredentials = false;
        this.TIN.setValue(ClientLogin.sloginname);
        this.SetUsingelement("TIN");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  SetUsingelement(Using: string) {
    try {
      const UsingCredentialselement = document.getElementById(
        "UsingCredentials"
      ) as HTMLInputElement;
      const UsingTINelement = document.getElementById(
        "UsingTIN"
      ) as HTMLInputElement;
      if (Using.toUpperCase() == "CREDENTIALS") {
        UsingCredentialselement.checked = true;
        UsingTINelement.checked = false;
        this.Using.setValue("Credentials");
      } else {
        UsingCredentialselement.checked = false;
        UsingTINelement.checked = true;
        this.Using.setValue("TIN");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputClientLoginEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.AddClientLoginGroup.reset();
      this.submitted = false;
      this.InputClientloginEditid = null;
      this.clsClientlogin = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
