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
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-adderrortype",
  templateUrl: "./adderrortype.component.html",
  styleUrls: ["./adderrortype.component.css"],
})
export class AdderrortypeComponent implements OnInit, OnChanges {
  public newErrortype = true;
  private Errortypedetail: any = [];
  public ErrortypeEditid: any;
  public selectedErrortypeValue: string;
  private clsErrortype: Errorcode;
  private clsUtility: Utility;
  private statusid: number = 0;
  private subscription = new SubSink();
  public submitted = false;

  // Received Input from parent component
  @Input() InputErrortypeEditid: any;

  // Send Output to parent component
  @Output() OutputErrortypeEditResult = new EventEmitter<boolean>();

  OutputerrortypeEditResult(data: any) {
    let outErrortypeEditResult = data;
    this.OutputErrortypeEditResult.emit(outErrortypeEditResult);
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

  ErrortypeGroup = this.fb.group({
    fcErrortypeDescription: [
      "",
      [Validators.required, Validators.maxLength(150)],
    ],
  });

  get ErrortypeDescription() {
    return this.ErrortypeGroup.get("fcErrortypeDescription");
  }

  ngOnInit() {
    try {
      this.clsErrortype = new Errorcode();
      if (this.InputErrortypeEditid != null && this.InputErrortypeEditid != 0) {
        this.newErrortype = false;
        this.ErrortypeEditid = this.InputErrortypeEditid;
        this.getErrortypeById(this.ErrortypeEditid);
      } else {
        this.newErrortype = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsErrortype = new Errorcode();
      if (this.InputErrortypeEditid != null && this.InputErrortypeEditid != 0) {
        this.newErrortype = false;
        this.ErrortypeEditid = this.InputErrortypeEditid;
        this.getErrortypeById(this.ErrortypeEditid);
      } else {
        this.newErrortype = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateErrortype() {
    try {
      if (
        this.ErrortypeDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.ErrortypeDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getErrortypeById(id: number) {
    try {
      this.subscription.add(
        this.MasterService.getErrorCode(id, this.statusid).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Errortypedetail = data;
            if (
              this.InputErrortypeEditid != null &&
              this.InputErrortypeEditid != 0
            ) {
              this.FillErrortypeGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postErrortype() {
    try {
      const jsonclient = JSON.stringify(this.clsErrortype);
      this.subscription.add(
        this.ConfigurationService.saveErrortype(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Error added successfully");
                this.OutputerrortypeEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Error not added");
                this.OutputerrortypeEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Error already registered with this description"
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

  updateErrortype() {
    try {
      const jsonclient = JSON.stringify(this.clsErrortype);
      this.subscription.add(
        this.ConfigurationService.updateErrortype(
          this.ErrortypeEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Error updated successfully");
              this.OutputerrortypeEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Error not updated");
              this.OutputerrortypeEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Action already registered with this description"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveErrortype() {
    try {
      this.submitted = true;
      if (this.validateErrortype()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strErrortypeDescription: string = this.ErrortypeDescription.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newErrortype) {
          this.clsErrortype.nerrorid = 0;
          this.clsErrortype.serrordescription = strErrortypeDescription.trim();
          this.clsErrortype.bisactive = true;
          this.clsErrortype.createdby = SelectedUserid.toString();
          this.clsErrortype.createdbyname = LoginUsername;
          this.clsErrortype.bissystemdefined = true;
          this.clsErrortype.createdon = currentDateTime;
          this.clsErrortype.modifiedon = currentDateTime;
          this.postErrortype();
        } else if (
          this.Errortypedetail.serrordescription !=
            strErrortypeDescription.trim() ||
          this.Errortypedetail.createdby != SelectedUserid
        ) {
          this.clsErrortype.nerrorid = this.InputErrortypeEditid;
          this.clsErrortype.serrordescription = strErrortypeDescription.trim();
          this.clsErrortype.bisactive = this.Errortypedetail.bisactive;
          this.clsErrortype.createdby = SelectedUserid.toString();
          this.clsErrortype.bissystemdefined = this.Errortypedetail.bissystemdefined;
          this.clsErrortype.createdbyname = LoginUsername;
          this.clsErrortype.modifiedon = currentDateTime;
          this.updateErrortype();
        } else {
          this.OutputerrortypeEditResult(false);
          $("#adderrortypeModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillErrortypeGroup() {
    try {
      let Errortype: Errorcode;
      Errortype = this.Errortypedetail;

      this.ErrortypeDescription.setValue(Errortype.serrordescription);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputerrortypeEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.ErrortypeGroup.reset();
      this.submitted = false;
      this.InputErrortypeEditid = null;
      this.clsErrortype = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
