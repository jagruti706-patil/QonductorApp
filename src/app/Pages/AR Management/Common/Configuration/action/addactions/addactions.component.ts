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
import { Actions } from "src/app/Model/AR Management/Configuration/actions";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addactions",
  templateUrl: "./addactions.component.html",
  styleUrls: ["./addactions.component.css"],
})
export class AddactionsComponent implements OnInit, OnChanges {
  public newActions = true;
  private Actionsdetail: any = [];
  public ActionsEditid: any;
  public selectedActionsValue: string;
  private clsActions: Actions;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Received Input from parent component
  @Input() InputActionsEditid: any;

  // Send Output to parent component
  @Output() OutputActionsEditResult = new EventEmitter<boolean>();

  OutputactionsEditResult(data: any) {
    let outActionsEditResult = data;
    this.OutputActionsEditResult.emit(outActionsEditResult);
    this;
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

  ActionsGroup = this.fb.group({
    fcActionsCode: ["", [Validators.required, Validators.maxLength(50)]],
    fcActionsDescription: [
      "",
      [Validators.required, Validators.maxLength(150)],
    ],
  });

  get ActionsCode() {
    return this.ActionsGroup.get("fcActionsCode");
  }

  get ActionsDescription() {
    return this.ActionsGroup.get("fcActionsDescription");
  }

  ngOnInit() {
    try {
      this.clsActions = new Actions();
      if (this.InputActionsEditid != null && this.InputActionsEditid != 0) {
        this.newActions = false;
        this.ActionsEditid = this.InputActionsEditid;
        this.getActionsById(this.ActionsEditid);
      } else {
        this.newActions = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsActions = new Actions();
      if (this.InputActionsEditid != null && this.InputActionsEditid != 0) {
        this.newActions = false;
        this.ActionsEditid = this.InputActionsEditid;
        this.getActionsById(this.ActionsEditid);
      } else {
        this.newActions = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateActions() {
    try {
      if (
        this.ActionsCode.valid &&
        this.ActionsDescription.valid &&
        !this.clsUtility.CheckEmptyString(this.ActionsCode.value) &&
        !this.clsUtility.CheckEmptyString(this.ActionsDescription.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getActionsById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getActionsById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Actionsdetail = data;
            if (
              this.InputActionsEditid != null &&
              this.InputActionsEditid != 0
            ) {
              this.FillActionsGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postActions() {
    try {
      const jsonclient = JSON.stringify(this.clsActions);
      this.subscription.add(
        this.ConfigurationService.saveActions(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Action added successfully");
                this.OutputactionsEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Action not added");
                this.OutputactionsEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Action already registered with this description"
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

  updateActions() {
    try {
      const jsonclient = JSON.stringify(this.clsActions);
      this.subscription.add(
        this.ConfigurationService.updateActions(
          this.ActionsEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Action updated successfully");
              this.OutputactionsEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("Action not updated");
              this.OutputactionsEditResult(false);
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

  saveActions() {
    try {
      this.submitted = true;
      if (this.validateActions()) {
        let SelectedUserid = 0;
        let LoginUsername = null;
        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;
        var strActionCode: string = this.ActionsCode.value;
        var strActionDesc: string = this.ActionsDescription.value;
        if (this.newActions) {
          this.clsActions.nactionid = 0;
          this.clsActions.sactioncode = strActionCode.trim();
          this.clsActions.sactiondescription = strActionDesc.trim();
          this.clsActions.sdisplaycodedesc = strActionDesc.trim();
          this.clsActions.bisactive = true;
          this.clsActions.createdby = SelectedUserid;
          this.clsActions.screatedusername = LoginUsername;
          this.clsActions.createdon = this.clsUtility.currentDateTime();
          this.postActions();
        } else if (
          this.Actionsdetail.sactioncode != this.ActionsCode.value ||
          this.Actionsdetail.sactiondescription !=
            this.ActionsDescription.value ||
          this.Actionsdetail.createdby != SelectedUserid
        ) {
          this.clsActions.nactionid = this.InputActionsEditid;
          this.clsActions.sactioncode = strActionCode.trim();
          this.clsActions.sactiondescription = strActionDesc.trim();
          this.clsActions.sdisplaycodedesc = strActionDesc.trim();
          this.clsActions.bisactive = this.Actionsdetail.bisactive;
          this.clsActions.createdby = SelectedUserid;
          this.clsActions.screatedusername = LoginUsername;
          this.updateActions();
        } else {
          this.OutputactionsEditResult(false);
          $("#addactionsModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillActionsGroup() {
    try {
      let Actions: Actions;
      Actions = this.Actionsdetail;

      this.ActionsCode.setValue(Actions.sactioncode);
      this.ActionsDescription.setValue(Actions.sactiondescription);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputactionsEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.ActionsGroup.reset();
      this.submitted = false;
      this.InputActionsEditid = null;
      this.clsActions = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
