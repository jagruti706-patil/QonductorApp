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
import { Status } from "src/app/Model/AR Management/Configuration/status";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addstatus",
  templateUrl: "./addstatus.component.html",
  styleUrls: ["./addstatus.component.css"],
})
export class AddstatusComponent implements OnInit, OnChanges {
  public newStatus = true;
  private Statusdetail: any = [];
  public StatusEditid: any;
  public selectedStatusValue: string;
  private clsStatus: Status;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Received Input from parent component
  @Input() InputStatusEditid: any;

  // Send Output to parent component
  @Output() OutputStatusEditResult = new EventEmitter<boolean>();

  OutputstatusEditResult(data: any) {
    let outStatusEditResult = data;
    this.OutputStatusEditResult.emit(outStatusEditResult);
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

  StatusGroup = this.fb.group({
    fcStatusCode: ["", [Validators.required, Validators.maxLength(50)]],
    fcStatusDescription: ["", [Validators.required, Validators.maxLength(150)]],
  });

  get StatusCode() {
    return this.StatusGroup.get("fcStatusCode");
  }

  get StatusDescription() {
    return this.StatusGroup.get("fcStatusDescription");
  }

  ngOnInit() {
    try {
      this.clsStatus = new Status();
      if (this.InputStatusEditid != null && this.InputStatusEditid != 0) {
        this.newStatus = false;
        this.StatusEditid = this.InputStatusEditid;
        this.getStatusById(this.StatusEditid);
      } else {
        this.newStatus = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsStatus = new Status();
      if (this.InputStatusEditid != null && this.InputStatusEditid != 0) {
        this.newStatus = false;
        this.StatusEditid = this.InputStatusEditid;
        this.getStatusById(this.StatusEditid);
      } else {
        this.newStatus = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateStatus() {
    try {
      if (
        this.StatusCode.valid &&
        this.StatusDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.StatusCode.value) &&
        !this.clsUtility.CheckEmptyString(this.StatusDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getStatusById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getStatusById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Statusdetail = data;
            if (this.InputStatusEditid != null && this.InputStatusEditid != 0) {
              this.FillStatusGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postStatus() {
    try {
      const jsonclient = JSON.stringify(this.clsStatus);
      this.subscription.add(
        this.ConfigurationService.saveStatus(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Status added successfully");
                this.OutputstatusEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Status not added");
                this.OutputstatusEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Status already registered with this description"
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

  updateStatus() {
    try {
      const jsonclient = JSON.stringify(this.clsStatus);
      this.subscription.add(
        this.ConfigurationService.updateStatus(
          this.StatusEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
              this.OutputstatusEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Status not updated");
              this.OutputstatusEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Status already registered with this description"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveStatus() {
    try {
      this.submitted = true;
      if (this.validateStatus()) {
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strStatusCode: string = this.StatusCode.value;
        var strStatusDescription: string = this.StatusDescription.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newStatus) {
          this.clsStatus.nstatusid = 0;
          this.clsStatus.sstatuscode = strStatusCode.trim();
          this.clsStatus.sstatusdescription = strStatusDescription.trim();
          this.clsStatus.sdisplaycodedesc = strStatusDescription.trim();
          this.clsStatus.bisactive = true;
          this.clsStatus.bissystemdefined = true;
          this.clsStatus.createdby = SelectedUserid;
          this.clsStatus.screatedusername = LoginUsername;
          this.clsStatus.createdon = this.clsUtility.currentDateTime();
          this.postStatus();
        } else if (
          this.Statusdetail.sstatuscode != strStatusCode.trim() ||
          this.Statusdetail.sstatusdescription != strStatusDescription.trim() ||
          this.Statusdetail.createdby != SelectedUserid
        ) {
          this.clsStatus.nstatusid = this.InputStatusEditid;
          this.clsStatus.sstatuscode = strStatusCode.trim();
          this.clsStatus.sstatusdescription = strStatusDescription.trim();
          this.clsStatus.sdisplaycodedesc = strStatusDescription.trim();
          this.clsStatus.bisactive = this.Statusdetail.bisactive;
          this.clsStatus.bissystemdefined = this.Statusdetail.bissystemdefined;
          this.clsStatus.screatedusername = LoginUsername;
          this.clsStatus.createdby = SelectedUserid;
          this.updateStatus();
        } else {
          this.OutputstatusEditResult(false);
          $("#addstatusModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillStatusGroup() {
    try {
      let Status: Status;
      Status = this.Statusdetail;

      this.StatusCode.setValue(Status.sstatuscode);
      this.StatusDescription.setValue(Status.sstatusdescription);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputstatusEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.StatusGroup.reset();
      this.submitted = false;
      this.InputStatusEditid = null;
      this.clsStatus = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
