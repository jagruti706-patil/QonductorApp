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
import { Followup } from "src/app/Model/AR Management/Configuration/followup";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addfollowupaction",
  templateUrl: "./addfollowupaction.component.html",
  styleUrls: ["./addfollowupaction.component.css"],
})
export class AddfollowupactionComponent implements OnInit, OnChanges {
  public newFollowup = true;
  private Followupdetail: any = [];
  public FollowupEditid: any;
  public selectedFollowupValue: string;
  private clsFollowup: Followup;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Received Input from parent component
  @Input() InputFollowupEditid: any;

  // Send Output to parent component
  @Output() OutputFollowupEditResult = new EventEmitter<boolean>();

  OutputfollowupEditResult(data: any) {
    let outFollowupEditResult = data;
    this.OutputFollowupEditResult.emit(outFollowupEditResult);
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

  FollowupGroup = this.fb.group({
    fcFollowupCode: ["", [Validators.required, Validators.maxLength(50)]],
    fcFollowupDescription: [
      "",
      [Validators.required, Validators.maxLength(255)],
    ],
  });

  get FollowupCode() {
    return this.FollowupGroup.get("fcFollowupCode");
  }

  get FollowupDescription() {
    return this.FollowupGroup.get("fcFollowupDescription");
  }

  ngOnInit() {
    try {
      this.clsFollowup = new Followup();
      if (this.InputFollowupEditid != null && this.InputFollowupEditid != 0) {
        this.newFollowup = false;
        this.FollowupEditid = this.InputFollowupEditid;
        this.getFollowupById(this.FollowupEditid);
      } else {
        this.newFollowup = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsFollowup = new Followup();
      if (this.InputFollowupEditid != null && this.InputFollowupEditid != 0) {
        this.newFollowup = false;
        this.FollowupEditid = this.InputFollowupEditid;
        this.getFollowupById(this.FollowupEditid);
      } else {
        this.newFollowup = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateFollowup() {
    try {
      if (
        this.FollowupCode.valid &&
        this.FollowupDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.FollowupCode.value) &&
        !this.clsUtility.CheckEmptyString(this.FollowupDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getFollowupById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getStatusById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Followupdetail = data;
            if (
              this.InputFollowupEditid != null &&
              this.InputFollowupEditid != 0
            ) {
              this.FillFollowupGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postFollowup() {
    try {
      const jsonclient = JSON.stringify(this.clsFollowup);
      this.subscription.add(
        this.ConfigurationService.saveFollowup(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Followup added successfully");
                this.OutputfollowupEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Followup not added");
                this.OutputfollowupEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Followup already registered with this code or description"
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

  // updateFollowup() {
  //   try {
  //     const jsonclient = JSON.stringify(this.clsFollowup);
  //     this.subscription.add(
  //       this.ConfigurationService.updateStatus(
  //         this.FollowupEditid,
  //         jsonclient
  //       ).subscribe((data: {}) => {
  //         if (data != null || data != undefined) {
  //           if (data == 1) {
  //             this.clsUtility.showSuccess("Followup updated successfully");
  //             this.OutputfollowupEditResult(true);
  //           } else if (data == 0) {
  //             this.clsUtility.showError("Followup not updated");
  //             this.OutputfollowupEditResult(false);
  //           } else {
  //             this.clsUtility.showInfo(
  //               "Followup already registered with this descritption"
  //             );
  //           }
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  saveFollowup() {
    try {
      this.submitted = true;
      if (this.validateFollowup()) {
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strStatusCode: string = this.FollowupCode.value;
        var strStatusDescription: string = this.FollowupDescription.value;

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newFollowup) {
          this.clsFollowup.id = 0;
          this.clsFollowup.actioncode = strStatusCode.trim();
          this.clsFollowup.actiondescription = strStatusDescription.trim();
          this.clsFollowup.displayaction = strStatusDescription.trim();
          this.clsFollowup.bisactive = true;
          this.clsFollowup.createdon = this.clsUtility.currentDateTime();
          this.postFollowup();
        }
        //  else if (
        //   this.Followupdetail.actioncode != strStatusCode.trim() ||
        //   this.Followupdetail.actiondescription !=
        //     strStatusDescription.trim() ||
        //   this.Followupdetail.createdby != SelectedUserid
        // ) {
        //   this.clsFollowup.id = this.InputFollowupEditid;
        //   this.clsFollowup.actioncode = strStatusCode.trim();
        //   this.clsFollowup.actiondescription = strStatusDescription.trim();
        //   this.clsFollowup.displayaction = strStatusDescription.trim();
        //   this.clsFollowup.bisactive = this.Followupdetail.bisactive;
        //   this.updateFollowup();
        // }
        else {
          this.OutputfollowupEditResult(false);
          $("#addfollowupModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillFollowupGroup() {
    try {
      let Followup: Followup;
      Followup = this.Followupdetail;

      this.FollowupCode.setValue(Followup.actioncode);
      this.FollowupDescription.setValue(Followup.actiondescription);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputfollowupEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.FollowupGroup.reset();
      this.submitted = false;
      this.InputFollowupEditid = null;
      this.clsFollowup = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
