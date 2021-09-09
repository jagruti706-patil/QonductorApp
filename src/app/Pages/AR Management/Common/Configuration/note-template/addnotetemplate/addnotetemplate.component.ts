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
import { Notetemplate } from "src/app/Model/AR Management/Configuration/notetemplate";
import { Utility } from "src/app/Model/utility";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;
@Component({
  selector: "app-addnotetemplate",
  templateUrl: "./addnotetemplate.component.html",
  styleUrls: ["./addnotetemplate.component.css"],
})
export class AddnotetemplateComponent implements OnInit, OnChanges {
  public sMasterStatus: any;
  private statusid: number = 0;
  public newNoteTemplate = true;
  private Notedetail: any = [];
  public NoteEditid: any;
  public selectedStatusValue: string;
  private clsNotetemplate: Notetemplate;
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;

  // Loading
  loadingNote = true;

  // Received Input from parent component
  @Input() InputNoteEditid: any;

  // Send Output to parent component
  @Output() OutputNoteEditResult = new EventEmitter<boolean>();

  OutputNoteTemplateEditResult(data: any) {
    let outNoteEditResult = data;
    this.OutputNoteEditResult.emit(outNoteEditResult);
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

  NoteTemplateGroup = this.fb.group({
    fcStatusName: ["", Validators.required],
    fcNoteText: ["", [Validators.required, Validators.maxLength(600)]],
    fcNoteTitle: ["", Validators.required],
  });

  get Status() {
    return this.NoteTemplateGroup.get("fcStatusName");
  }

  get NoteTitle() {
    return this.NoteTemplateGroup.get("fcNoteTitle");
  }

  get NoteText() {
    return this.NoteTemplateGroup.get("fcNoteText");
  }

  ngOnInit() {
    try {
      this.clsNotetemplate = new Notetemplate();
      if (this.InputNoteEditid != null && this.InputNoteEditid != 0) {
        this.newNoteTemplate = false;
        this.NoteEditid = this.InputNoteEditid;
        this.getNoteTemplateById(this.NoteEditid);
      } else {
        this.newNoteTemplate = true;
      }
      if (this.newNoteTemplate) {
        this.loadingNote = true;
        this.statusid = 0;
        this.getStatusById();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsNotetemplate = new Notetemplate();
      if (this.InputNoteEditid != null && this.InputNoteEditid != 0) {
        this.newNoteTemplate = false;
        this.NoteEditid = this.InputNoteEditid;
        this.getNoteTemplateById(this.NoteEditid);
      } else {
        this.newNoteTemplate = true;
      }
      if (this.newNoteTemplate) {
        this.loadingNote = true;
        this.statusid = 0;
        this.getStatusById();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getNoteTemplateById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getNoteTemplateById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Notedetail = data;
            if (this.InputNoteEditid != null && this.InputNoteEditid != 0) {
              this.FillNoteTemplateGroup();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getStatusById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getStatusById(this.statusid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.sMasterStatus = data;
              this.loadingNote = false;
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onStatusChange($event) {
    try {
      if (this.sMasterStatus != undefined) {
        if (
          this.sMasterStatus.find((x) => x.sstatuscode == this.Status.value)
        ) {
          const index = this.sMasterStatus.findIndex(
            (x) => x.sstatuscode == this.Status.value
          );
          this.NoteTitle.setValue(
            this.sMasterStatus[index]["sstatusdescription"]
          );
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateNote() {
    try {
      // console.log("Value " + this.Status.value + " Valid " + this.Status.valid);

      if (this.newNoteTemplate) {
        if (
          this.NoteTitle.valid &&
          this.NoteText.valid &&
          this.Status.value != 0 &&
          this.Status.value != undefined &&
          this.Status.value != null &&
          !this.clsUtility.CheckEmptyString(this.NoteTitle.value) &&
          !this.clsUtility.CheckEmptyString(this.NoteText.value)
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        if (
          this.NoteTitle.valid &&
          this.NoteText.valid &&
          !this.clsUtility.CheckEmptyString(this.NoteTitle.value) &&
          !this.clsUtility.CheckEmptyString(this.NoteText.value)
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

  postNoteTemplate() {
    try {
      const jsonclient = JSON.stringify(this.clsNotetemplate);
      this.subscription.add(
        this.ConfigurationService.saveNoteTemplate(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("NoteTemplate added successfully");
                this.OutputNoteTemplateEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("NoteTemplate not added");
                this.OutputNoteTemplateEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "NoteTemplate already registered with this title"
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

  updateNoteTemplate() {
    try {
      const jsonclient = JSON.stringify(this.clsNotetemplate);
      this.subscription.add(
        this.ConfigurationService.updateNoteTemplate(
          this.NoteEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("NoteTemplate updated successfully");
              this.OutputNoteTemplateEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("NoteTemplate not updated");
              this.OutputNoteTemplateEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "NoteTemplate already registered with this title"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveNote() {
    try {
      this.submitted = true;
      if (this.validateNote()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        let text;
        let count = 0;
        let SelectedUserid = 0;
        let LoginUsername = null;

        var strNoteTitle = this.NoteTitle.value;
        var strNoteText = this.NoteText.value;

        if (this.NoteText.value != null || this.NoteText.value != "") {
          text = this.NoteText.value;
          if (text.indexOf("{") !== -1) count = text.match(/{/g).length;
        }

        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;

        if (this.newNoteTemplate) {
          this.clsNotetemplate.nnoteid = 0;
          this.clsNotetemplate.snotetitle = strNoteTitle.trim();
          this.clsNotetemplate.snotetext = strNoteText.trim();
          this.clsNotetemplate.nnoteparametercount = count;
          this.clsNotetemplate.bisactive = true;
          this.clsNotetemplate.createdby = SelectedUserid;
          this.clsNotetemplate.screatedusername = LoginUsername;
          this.clsNotetemplate.createdon = currentDateTime;
          this.clsNotetemplate.modifiedon = currentDateTime;
          this.postNoteTemplate();
        } else if (
          this.Notedetail.snotetitle != strNoteTitle.trim() ||
          this.Notedetail.snotetext != strNoteText.trim() ||
          this.Notedetail.nnoteparametercount != count ||
          this.Notedetail.createdby != SelectedUserid
        ) {
          this.clsNotetemplate.nnoteid = this.NoteEditid;
          this.clsNotetemplate.snotetitle = strNoteTitle.trim();
          this.clsNotetemplate.snotetext = strNoteText.trim();
          this.clsNotetemplate.nnoteparametercount = count;
          this.clsNotetemplate.bisactive = this.Notedetail.bisactive;
          this.clsNotetemplate.createdby = SelectedUserid;
          this.clsNotetemplate.screatedusername = LoginUsername;
          this.clsNotetemplate.modifiedon = currentDateTime;
          this.updateNoteTemplate();
        } else {
          this.OutputNoteTemplateEditResult(false);
          $("#addnotetemplateModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillNoteTemplateGroup() {
    try {
      let Notetemplate: Notetemplate;
      Notetemplate = this.Notedetail;

      this.NoteTitle.setValue(Notetemplate.snotetitle);
      this.NoteText.setValue(Notetemplate.snotetext);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputNoteTemplateEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.NoteTemplateGroup.reset();
      this.submitted = false;
      this.InputNoteEditid = null;
      this.clsNotetemplate = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
