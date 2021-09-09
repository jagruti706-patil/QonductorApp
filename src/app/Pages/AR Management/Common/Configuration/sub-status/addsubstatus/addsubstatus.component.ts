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
import { Substatus } from "src/app/Model/AR Management/Configuration/substatus";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addsubstatus",
  templateUrl: "./addsubstatus.component.html",
  styleUrls: ["./addsubstatus.component.css"],
})
export class AddsubstatusComponent implements OnInit, OnChanges {
  public newSubStatus = true;
  private SubStatusdetail: any = [];
  public SubStatusEditid: any;
  public selectedSubStatusValue: string;
  private clsSubStatus: Substatus;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Received Input from parent component
  @Input() InputSubStatusEditid: any;

  // Send Output to parent component
  @Output() OutputSubStatusEditResult = new EventEmitter<boolean>();

  OutputSubstatusEditResult(data: any) {
    let outSubStatusEditResult = data;
    this.OutputSubStatusEditResult.emit(outSubStatusEditResult);
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  SubStatusGroup = this.fb.group({
    fcSubStatusCode: ["", [Validators.required, Validators.maxLength(50)]],
    fcSubStatusDescription: [
      "",
      [Validators.required, Validators.maxLength(150)],
    ],
  });

  get SubStatusCode() {
    return this.SubStatusGroup.get("fcSubStatusCode");
  }

  get SubStatusDescription() {
    return this.SubStatusGroup.get("fcSubStatusDescription");
  }

  ngOnInit() {
    try {
      this.clsSubStatus = new Substatus();
      if (this.InputSubStatusEditid != null && this.InputSubStatusEditid != 0) {
        this.newSubStatus = false;
        this.SubStatusEditid = this.InputSubStatusEditid;
        this.getSubStatusById(this.SubStatusEditid);
      } else {
        this.newSubStatus = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsSubStatus = new Substatus();
      if (this.InputSubStatusEditid != null && this.InputSubStatusEditid != 0) {
        this.newSubStatus = false;
        this.SubStatusEditid = this.InputSubStatusEditid;
        this.getSubStatusById(this.SubStatusEditid);
      } else {
        this.newSubStatus = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateSubStatus() {
    try {
      if (
        this.SubStatusCode.valid &&
        this.SubStatusDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.SubStatusCode.value) &&
        !this.clsUtility.CheckEmptyString(this.SubStatusDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getSubStatusById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getSubStatusById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.SubStatusdetail = data;
            if (
              this.InputSubStatusEditid != null &&
              this.InputSubStatusEditid != 0
            ) {
              this.FillSubStatusGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postSubStatus() {
    try {
      const jsonclient = JSON.stringify(this.clsSubStatus);
      this.subscription.add(
        this.ConfigurationService.saveSubStatus(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Substatus added successfully");
                this.OutputSubstatusEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Substatus not added");
                this.OutputSubstatusEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Substatus already registered with this description"
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

  updateSubStatus() {
    try {
      const jsonclient = JSON.stringify(this.clsSubStatus);
      this.subscription.add(
        this.ConfigurationService.updateSubStatus(
          this.SubStatusEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Substatus updated successfully");
              this.OutputSubstatusEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Substatus not updated");
              this.OutputSubstatusEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Substatus already registered with this description"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveSubStatus() {
    try {
      this.submitted = true;
      if (this.validateSubStatus()) {
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strSubStatusCode: string = this.SubStatusCode.value;
        var strSubStatusDescription: string = this.SubStatusDescription.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newSubStatus) {
          this.clsSubStatus.nsubstatusid = 0;
          this.clsSubStatus.ssubstatuscode = strSubStatusCode.trim();
          this.clsSubStatus.ssubstatusdescription = strSubStatusDescription.trim();
          this.clsSubStatus.sdisplaycodedesc = strSubStatusDescription.trim();
          this.clsSubStatus.bisactive = true;
          this.clsSubStatus.bissystemdefined = true;
          this.clsSubStatus.createdby = SelectedUserid;
          this.clsSubStatus.screatedusername = LoginUsername;
          this.clsSubStatus.createdon = this.clsUtility.currentDateTime();
          this.postSubStatus();
        } else if (
          this.SubStatusdetail.ssubstatuscode != strSubStatusCode.trim() ||
          this.SubStatusdetail.ssubstatusdescription !=
            strSubStatusDescription.trim() ||
          this.SubStatusdetail.createdby != SelectedUserid
        ) {
          this.clsSubStatus.nsubstatusid = this.InputSubStatusEditid;
          this.clsSubStatus.ssubstatuscode = strSubStatusCode.trim();
          this.clsSubStatus.ssubstatusdescription = strSubStatusDescription.trim();
          this.clsSubStatus.sdisplaycodedesc = strSubStatusDescription.trim();
          this.clsSubStatus.bisactive = this.SubStatusdetail.bisactive;
          this.clsSubStatus.bissystemdefined = this.SubStatusdetail.bissystemdefined;
          this.clsSubStatus.createdby = SelectedUserid;
          this.clsSubStatus.screatedusername = LoginUsername;
          this.updateSubStatus();
        } else {
          this.OutputSubstatusEditResult(false);
          $("#addsubstatusModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillSubStatusGroup() {
    try {
      let SubStatus: Substatus;
      SubStatus = this.SubStatusdetail;

      this.SubStatusCode.setValue(SubStatus.ssubstatuscode);
      this.SubStatusDescription.setValue(SubStatus.ssubstatusdescription);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputSubstatusEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.SubStatusGroup.reset();
      this.submitted = false;
      this.InputSubStatusEditid = null;
      this.clsSubStatus = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
