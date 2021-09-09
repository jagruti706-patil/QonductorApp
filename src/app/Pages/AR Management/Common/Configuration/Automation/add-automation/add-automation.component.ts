import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { Automation } from "src/app/Model/AR Management/Configuration/automation";
declare var $: any;

@Component({
  selector: "app-add-automation",
  templateUrl: "./add-automation.component.html",
  styleUrls: ["./add-automation.component.css"],
})
export class AddAutomationComponent implements OnInit, OnChanges {
  public newAutomation = true;
  private Automationdetail: any = [];
  public AutomationEditid: any;
  public selectedAutomationValue: string;
  private clsAutomation: Automation;
  private clsUtility: Utility;
  private statusid: number = 0;
  private subscription = new SubSink();
  public submitted = false;

  // Received Input from parent component
  @Input() InputAutomationEditid: any;

  // Send Output to parent component
  @Output() OutputAutomationEditResult = new EventEmitter<boolean>();

  OutputautomationEditResult(data: any) {
    let outErrortypeEditResult = data;
    this.OutputAutomationEditResult.emit(outErrortypeEditResult);
  }

  constructor(
    private MasterService: MasterdataService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  AutomationGroup = this.fb.group({
    fcAutomationDescription: [
      "",
      [Validators.required, Validators.maxLength(150)],
    ],
  });

  get AutomationDescription() {
    return this.AutomationGroup.get("fcAutomationDescription");
  }

  ngOnInit() {
    try {
      this.clsAutomation = new Automation();
      if (
        this.InputAutomationEditid != null &&
        this.InputAutomationEditid != 0
      ) {
        this.newAutomation = false;
        this.AutomationEditid = this.InputAutomationEditid;
        this.getAutomationById(this.AutomationEditid);
      } else {
        this.newAutomation = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsAutomation = new Automation();
      if (
        this.InputAutomationEditid != null &&
        this.InputAutomationEditid != 0
      ) {
        this.newAutomation = false;
        this.AutomationEditid = this.InputAutomationEditid;
        this.getAutomationById(this.AutomationEditid);
      } else {
        this.newAutomation = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateAutoamtionError() {
    try {
      if (
        this.AutomationDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.AutomationDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAutomationById(id: number) {
    try {
      this.subscription.add(
        this.MasterService.getAutomationError(id, this.statusid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.Automationdetail = data;
              if (
                this.InputAutomationEditid != null &&
                this.InputAutomationEditid != 0
              ) {
                this.FillAutomationGroup();
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postAutomation() {
    try {
      const jsonAutomationError = JSON.stringify(this.clsAutomation);
      // console.log(jsonAutomationError);

      this.subscription.add(
        this.ConfigurationService.saveAutoamtionError(
          jsonAutomationError
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Automation Error added successfully"
              );
              this.OutputautomationEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Automation Error not added");
              this.OutputautomationEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Automation Error already registered with this description"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateAutoamtionError() {
    try {
      const jsonAutomationError = JSON.stringify(this.clsAutomation);
      this.subscription.add(
        this.ConfigurationService.updateAutoamtionError(
          this.AutomationEditid,
          jsonAutomationError
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Automation Error updated successfully"
              );
              this.OutputautomationEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Automation Error not updated");
              this.OutputautomationEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Automation Error already registered with this description"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveAutoamtionError() {
    try {
      this.submitted = true;
      if (this.validateAutoamtionError()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strAutomationDescription: string = this.AutomationDescription.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newAutomation) {
          this.clsAutomation.nautomationerrorid = 0;
          this.clsAutomation.sautomationerrordescription = strAutomationDescription.trim();
          this.clsAutomation.bisactive = true;
          this.clsAutomation.createdby = SelectedUserid.toString();
          this.clsAutomation.createdbyname = LoginUsername;
          this.clsAutomation.bissystemdefined = true;
          this.clsAutomation.createdon = currentDateTime;
          this.clsAutomation.modifiedon = currentDateTime;
          this.postAutomation();
        } else if (
          this.Automationdetail.sautomationerrordescription !=
            strAutomationDescription.trim() ||
          this.Automationdetail.createdby != SelectedUserid
        ) {
          this.clsAutomation.nautomationerrorid = this.InputAutomationEditid;
          this.clsAutomation.sautomationerrordescription = strAutomationDescription.trim();
          this.clsAutomation.bisactive = this.Automationdetail.bisactive;
          this.clsAutomation.createdby = SelectedUserid.toString();
          this.clsAutomation.bissystemdefined = this.Automationdetail.bissystemdefined;
          this.clsAutomation.createdbyname = LoginUsername;
          this.clsAutomation.modifiedon = currentDateTime;
          this.updateAutoamtionError();
        } else {
          this.OutputautomationEditResult(false);
          $("#addAutomationModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillAutomationGroup() {
    try {
      let AutomationError: Automation;
      AutomationError = this.Automationdetail;

      this.AutomationDescription.setValue(
        AutomationError.sautomationerrordescription
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputautomationEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.AutomationGroup.reset();
      this.submitted = false;
      this.InputAutomationEditid = null;
      this.clsAutomation = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
