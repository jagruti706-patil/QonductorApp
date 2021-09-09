import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import {
  MailSave,
  MailInput,
  MailRetrive,
} from "src/app/Model/AR Management/Configuration/mail";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { ThrowStmt } from "@angular/compiler";
import { User, GCPUser } from "src/app/Model/Common/login";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-addmailconfiguration",
  templateUrl: "./addmailconfiguration.component.html",
  styleUrls: ["./addmailconfiguration.component.css"],
})
export class AddmailconfigurationComponent implements OnInit, OnChanges {
  public newMailConfiguration: boolean = false;
  public MailConfigurationEditid: any;
  private MailConfigurationdetail: any = [];
  private clsMailConfiguration: MailSave;
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;
  public Agentdetail: GCPUser[] = [];
  public AllAgentdetail: GCPUser[] = [];
  private Agentid: number = 0;

  // Loading
  loadingMailConfiguration = true;

  // Received Input from parent component
  @Input() InputMailConfigurationEditid: any;

  // Send Output to parent component
  @Output() OutputMailConfigurationEditResult = new EventEmitter<boolean>();
  emailPattern = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  OutputmailConfigurationEditResult(data: any) {
    let outMailConfigurationEditResult = data;
    this.OutputMailConfigurationEditResult.emit(outMailConfigurationEditResult);
  }
  @ViewChild("TO", { static: true }) public TOElement: any;
  @ViewChild("CC", { static: true }) public CCElement: any;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService,
    private authService: CoreauthService,
    private datatransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  // Send Output to parent component
  @Output() outMailConfiguration = new EventEmitter<string>();

  OutputMailConfiguration(data: any) {
    try {
      let outMailConfiguration = data;
      this.outMailConfiguration.emit(outMailConfiguration);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddMailConfigurationGroup = this.fb.group({
    fcTitle: ["", Validators.required],
    fcTo: ["", Validators.required],
    fcCC: [""],
    fcUsername: ["", [Validators.required, Validators.maxLength(50)]],
    fcPassword: ["", [Validators.required, Validators.maxLength(50)]],
    fcSendSMS: [false],
  });

  get fbcTitle() {
    return this.AddMailConfigurationGroup.get("fcTitle");
  }

  get fbcTo() {
    return this.AddMailConfigurationGroup.get("fcTo");
  }

  get fbcCC() {
    return this.AddMailConfigurationGroup.get("fcCC");
  }

  get fbcUsername() {
    return this.AddMailConfigurationGroup.get("fcUsername");
  }

  get fbcPassword() {
    return this.AddMailConfigurationGroup.get("fcPassword");
  }

  get fbcSendSMS() {
    return this.AddMailConfigurationGroup.get("fcSendSMS");
  }

  SelectedRSID: Array<any> = [];
  SelectedCCID: Array<any> = [];
  formValueChanged(): any {
    try {
      this.subscription.add(
        this.fbcTo.valueChanges.subscribe(
          (data: any) => {
            if (data) {
              this.SelectedRSID = data;
            } else {
              this.SelectedRSID = [];
            }
            // console.log("RC: " + this.SelectedRSID);
          },
          (err) => {
            this.loadingMailConfiguration = false;
          }
        )
      );
      this.subscription.add(
        this.fbcCC.valueChanges.subscribe(
          (data: any) => {
            if (data) {
              this.SelectedCCID = data;
              // console.log("RC: " + this.SelectedRSID);
            } else {
              this.SelectedCCID = [];
            }
          },
          (err) => {
            this.loadingMailConfiguration = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.getAgentById(this.Agentid);
      this.formValueChanged();
      this.clsMailConfiguration = new MailRetrive();
      if (
        this.InputMailConfigurationEditid != null &&
        this.InputMailConfigurationEditid != 0
      ) {
        this.newMailConfiguration = false;
        this.MailConfigurationEditid = this.InputMailConfigurationEditid;
        this.getMailConfigurationById(this.MailConfigurationEditid);
      } else {
        this.newMailConfiguration = true;
        this.loadingMailConfiguration = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.getAgentById(this.Agentid);
      this.formValueChanged();
      this.clsMailConfiguration = new MailRetrive();
      if (
        this.InputMailConfigurationEditid != null &&
        this.InputMailConfigurationEditid != 0
      ) {
        this.newMailConfiguration = false;
        this.MailConfigurationEditid = this.InputMailConfigurationEditid;
        this.getMailConfigurationById(this.MailConfigurationEditid);
      } else {
        this.newMailConfiguration = true;

        this.loadingMailConfiguration = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAgentById(id: number) {
    try {
      this.subscription.add(
        this.authService.getAllLocalGCPUser().subscribe((data) => {
          if (data != null || data != undefined) {
            this.Agentdetail = data;
            this.AllAgentdetail = data;
            this.loadingMailConfiguration = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getMailConfigurationById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getMailByid(id).subscribe((data) => {
          // console.log(data);

          if (data != null || data != undefined) {
            this.MailConfigurationdetail = data;
            if (
              this.InputMailConfigurationEditid != null &&
              this.InputMailConfigurationEditid != 0
            ) {
              this.FillMailConfigurationGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateMailConfiguration() {
    try {
      if (
        this.fbcTo.valid &&
        this.fbcCC.valid &&
        this.fbcTitle.valid &&
        this.fbcUsername.valid &&
        this.fbcPassword.valid &&
        !this.clsUtility.CheckEmptyString(this.fbcTitle.value) &&
        !this.clsUtility.CheckEmptyString(this.fbcUsername.value) &&
        !this.clsUtility.CheckEmptyString(this.fbcPassword.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postMailConfigurations() {
    try {
      const jsonmail = JSON.stringify(this.clsMailConfiguration);
      this.subscription.add(
        this.ConfigurationService.saveMail(jsonmail).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Mail Configuration added successfully"
              );
              this.OutputmailConfigurationEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Mail Configuration not added");
              this.OutputmailConfigurationEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Mail Configuration already registered with this database"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateMailConfigurations() {
    try {
      const jsonmail = JSON.stringify(this.clsMailConfiguration);
      this.subscription.add(
        this.ConfigurationService.updateMail(jsonmail).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Mail Configuration updated successfully"
              );
              this.OutputmailConfigurationEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Mail Configuration not updated");
              this.OutputmailConfigurationEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Mail Configuration already registered with this Title"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveMailConfiguration() {
    try {
      this.submitted = true;
      let SelectedUserid = 0;
      let LoginUsername = null;

      if (this.datatransfer.SelectedGCPUserid != undefined)
        SelectedUserid = this.datatransfer.SelectedGCPUserid;

      if (this.datatransfer.loginUserName != undefined)
        LoginUsername = this.datatransfer.loginUserName;

      if (this.validateMailConfiguration()) {
        this.clsMailConfiguration = new MailSave();
        var tomails: MailInput[] = [];
        for (const obj of this.SelectedRSID) {
          var toMail: MailInput = new MailInput();
          toMail.Id = obj.ngcpuserid ? obj.ngcpuserid : 0;
          toMail.Email = obj.username;
          tomails.push(toMail);
        }

        var ccmails: MailInput[] = [];
        if (this.SelectedCCID != null) {
          for (const obj of this.SelectedCCID) {
            var ccMail: MailInput = new MailInput();
            ccMail.Id = obj.ngcpuserid ? obj.ngcpuserid : 0;
            ccMail.Email = obj.username;
            ccmails.push(ccMail);
          }
        }
        this.clsMailConfiguration.emailto = tomails;
        this.clsMailConfiguration.emailcc = ccmails;
        if (this.Agentdetail != null || this.Agentdetail != undefined) {
          if (this.fbcTo.value != null || this.fbcTo.value != undefined) {
          }
        }

        let currentDateTime = this.clsUtility.currentDateTime();
        var strtitle: string = this.fbcTitle.value;
        var strusername: string = this.fbcUsername.value;
        // var strPassword: string = this.Password.value;
        var strPassword: string = this.clsUtility
          .encryptAES(this.fbcPassword.value)
          .toString();
        this.fbcSendSMS.value
          ? (this.clsMailConfiguration.sendsms = true)
          : (this.clsMailConfiguration.sendsms = false);
        if (this.newMailConfiguration) {
          this.clsMailConfiguration.configid = 0;
          this.clsMailConfiguration.title = strtitle.trim();

          this.clsMailConfiguration.emailfrom = strusername.trim();

          this.clsMailConfiguration.frompassword = strPassword.trim();

          this.clsMailConfiguration.emailto = tomails;
          this.clsMailConfiguration.emailcc = ccmails;
          this.clsMailConfiguration.createdon = currentDateTime;
          this.clsMailConfiguration.modifiedon = currentDateTime;
          this.clsMailConfiguration.userid = SelectedUserid;
          this.clsMailConfiguration.username = LoginUsername;

          this.postMailConfigurations();
        } else if (
          this.MailConfigurationdetail.title != strtitle.trim() ||
          this.MailConfigurationdetail.emailfrom != strusername.trim() ||
          // this.MailConfigurationdetail.frompassword != strPassword.trim() ||
          this.clsUtility
            .decryptAES(this.MailConfigurationdetail.frompassword)
            .toString() != this.fbcPassword.value.trim() ||
          JSON.stringify(this.MailConfigurationdetail.emailto) !=
            JSON.stringify(tomails) ||
          JSON.stringify(this.MailConfigurationdetail.emailcc) !=
            JSON.stringify(ccmails) ||
          this.MailConfigurationdetail.sendsms !=
            this.clsMailConfiguration.sendsms
        ) {
          this.clsMailConfiguration.configid = this.MailConfigurationEditid;
          this.clsMailConfiguration.title = strtitle.trim();
          this.clsMailConfiguration.emailfrom = strusername.trim();
          this.clsMailConfiguration.frompassword = strPassword.trim();
          this.clsMailConfiguration.emailto = tomails;
          this.clsMailConfiguration.emailcc = ccmails;
          this.clsMailConfiguration.modifiedon = currentDateTime;
          this.clsMailConfiguration.userid = SelectedUserid;
          this.clsMailConfiguration.username = LoginUsername;
          this.updateMailConfigurations();
        } else {
          this.OutputmailConfigurationEditResult(false);
          $("#addclientModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillMailConfigurationGroup() {
    try {
      var selectedToAgent: any[] = [];
      var selectedCCAgent: any[] = [];
      let MailConfiguration: MailSave;
      MailConfiguration = this.MailConfigurationdetail;

      this.fbcUsername.setValue(MailConfiguration.emailfrom);
      // this.Password.setValue(MailConfiguration.frompassword);

      this.fbcPassword.setValue(
        this.clsUtility.decryptAES(MailConfiguration.frompassword).toString()
      );

      this.fbcTitle.setValue(MailConfiguration.title);

      this.fbcSendSMS.setValue(MailConfiguration.sendsms);

      for (const obj of MailConfiguration.emailto) {
        const agent = this.Agentdetail.find((x) => x.username === obj.Email);
        if (agent) {
          selectedToAgent.push(agent);
        } else {
          selectedToAgent.push({
            username: obj.Email,
            displayname: obj.Email,
            ngcpuserid: obj.Id,
          });
        }
      }
      this.fbcTo.setValue(selectedToAgent);

      for (const obj of MailConfiguration.emailcc) {
        const agent = this.Agentdetail.find((x) => x.username === obj.Email);
        if (agent) {
          selectedCCAgent.push(agent);
        } else {
          selectedCCAgent.push({
            username: obj.Email,
            displayname: obj.Email,
            ngcpuserid: obj.Id,
          });
        }
      }
      this.fbcCC.setValue(selectedCCAgent);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputmailConfigurationEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.AddMailConfigurationGroup.reset();
      this.submitted = false;
      this.InputMailConfigurationEditid = null;
      this.clsMailConfiguration = null;
      this.TOElement.toggle(false);
      this.CCElement.toggle(false);
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public fcToValueNormalizer = (email$: Observable<string>) =>
    email$.pipe(
      map((email: string) => {
        try {
          //search for matching item to avoid duplicates

          //search in values
          const matchingValue: any = this.SelectedRSID.find((item: any) => {
            return item.username.toLowerCase() === email.toLowerCase();
          });

          if (matchingValue) {
            this.clsUtility.LogError("Email address getting duplicate");
            return null; //return the already selected matching value and the component will remove it
          }

          //search in data
          const matchingItem: any = this.Agentdetail.find((item: any) => {
            return item.username.toLowerCase() === email.toLowerCase();
          });

          if (matchingItem) {
            return matchingItem;
          } else {
            if (this.emailPattern.test(email)) {
              return {
                username: email, //generate unique value for the custom item
                displayname: email,
                ngcpuserid: "",
              };
              // this.SelectedRSID.push(email);
              // return email;
            } else {
              this.clsUtility.showError("Please enter valid email address");
              return null;
            }
          }
        } catch (error) {
          this.clsUtility.LogError(error);
        }
      })
    );

  public fcCCValueNormalizer = (email$: Observable<string>) =>
    email$.pipe(
      map((email: string) => {
        try {
          //search for matching item to avoid duplicates

          //search in values
          const matchingValue: any = this.SelectedCCID.find((item: any) => {
            return item.username.toLowerCase() === email.toLowerCase();
          });

          if (matchingValue) {
            this.clsUtility.LogError("Email address getting duplicate");
            return null; //return the already selected matching value and the component will remove it
          }

          //search in data
          const matchingItem: any = this.Agentdetail.find((item: any) => {
            return item.username.toLowerCase() === email.toLowerCase();
          });

          if (matchingItem) {
            return matchingItem;
          } else {
            if (this.emailPattern.test(email)) {
              return {
                username: email, //generate unique value for the custom item
                displayname: email,
                ngcpuserid: "",
              };
            } else {
              this.clsUtility.showError("Please enter valid email address");
              return null;
            }
          }
        } catch (error) {
          this.clsUtility.LogError(error);
        }
      })
    );
  validateEmails(emailArray: any): boolean {
    let isValid = true;
    try {
      for (let i = 0; i < emailArray.length; i++) {
        if (!this.emailPattern.test(emailArray[i].email)) {
          isValid = false;
          break;
        }
      }
      return isValid;
    } catch (error) {
      this.clsUtility.LogError(error);
      return isValid;
    }
  }
  public blurTo(): void {
    // console.log(this.TOElement);
    this.TOElement.text = "";
    this.handleFilter("");
  }
  public blurCc(): void {
    // console.log(this.TOElement);
    this.CCElement.text = "";
    this.handleFilter("");
  }
  handleFilter(value: string) {
    try {
      if (value != null && value != undefined) {
        this.Agentdetail = this.AllAgentdetail.filter(
          (s) => s.username.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        this.Agentdetail = this.AllAgentdetail.slice(0);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
