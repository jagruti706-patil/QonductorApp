import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Notetemplate } from "src/app/Model/AR Management/Configuration/notetemplate";
import { AddnotetemplateComponent } from "src/app/Pages/AR Management/Common/Configuration/note-template/addnotetemplate/addnotetemplate.component";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "../../../../../../../../node_modules/subsink";

declare var $: any;

@Component({
  selector: "app-notetemplate",
  templateUrl: "./notetemplate.component.html",
  styleUrls: ["./notetemplate.component.css"],
})
export class NotetemplateComponent implements OnInit {
  public NoteTemplategridData: {};
  public NoteTemplategridView: GridDataResult;
  private NoteTemplateitems: any[] = [];
  public NoteTemplateskip = 0;
  public NoteTemplatepageSize = 10;

  private Noteid: number = 0;
  public editNoteid: number = 0;
  private deleteNoteid: number = 0;
  public EditNoteid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddnotetemplateChild", { static: true })
  private AddnotetemplateChild: AddnotetemplateComponent;

  public NoteTemplatesort: SortDescriptor[] = [
    {
      field: "snotetitle",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.NoteTemplatepageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Noteid = 0;
      this.getNoteTemplateById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getNoteTemplateById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getNoteTemplateById(this.Noteid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.NoteTemplategridData = data;
              this.NoteTemplateitems = data;
              this.loadNoteTemplateitems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // getAllStatus() {
  //   try {
  //     this.ConfigurationService.getAllStatus(this.statusid).subscribe((data) => {
  //       this.NoteTemplategridData = data
  //       this.NoteTemplateitems = data;
  //       this.loadNoteTemplateitems();
  //     })
  //   }
  //   catch (error) { }
  // }

  private loadNoteTemplateitems(): void {
    try {
      this.NoteTemplategridView = {
        data: orderBy(
          this.NoteTemplateitems.slice(
            this.NoteTemplateskip,
            this.NoteTemplateskip + this.NoteTemplatepageSize
          ),
          this.NoteTemplatesort
        ),
        total: this.NoteTemplateitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortNoteTemplateChange(sort: SortDescriptor[]): void {
    try {
      if (this.NoteTemplateitems != null) {
        this.NoteTemplatesort = sort;
        this.loadNoteTemplateitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeNoteTemplate(event: PageChangeEvent): void {
    try {
      this.NoteTemplateskip = event.skip;
      this.loadNoteTemplateitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditNoteTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editNoteid = dataItem.nnoteid;
      this.InputEditMessage = "Do you want to edit note template?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeleteNoteTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.deleteNoteid = dataItem.nnoteid;
      this.InputDeleteMessage = "Do you want to delete note template?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deleteNoteTemplate() {
    try {
      this.subscription.add(
        this.ConfigurationService.deleteNoteTemplate(
          this.deleteNoteid
        ).subscribe((data: {}) => {
          this.Noteid = 0;
          this.getNoteTemplateById();
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateNoteTemplateStatus(Noteid, Notetemplate) {
    try {
      const jsonnote = JSON.stringify(Notetemplate);
      this.subscription.add(
        this.ConfigurationService.updateNoteTemplateStatus(
          Noteid,
          jsonnote
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else {
              this.clsUtility.showError("Status not updated");
            }
            this.getNoteTemplateById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddNotetemplate() {
    try {
      this.editNoteid = 0;
      this.EditNoteid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditNoteid = this.editNoteid;
        $("#addnotetemplateModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deleteNoteTemplate();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputNoteTemplateEditResult($event) {
    try {
      this.Noteid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getNoteTemplateById();
      }
      this.AddnotetemplateChild.ResetComponents();
      this.editNoteid = null;
      this.EditNoteid = null;
      $("#addnotetemplateModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnNoteTemplateStatus(Noteid, NoteStatus) {
    try {
      let objNoteTemplate: Notetemplate;
      objNoteTemplate = new Notetemplate();
      objNoteTemplate.nnoteid = Noteid;
      objNoteTemplate.bisactive = NoteStatus;
      this.updateNoteTemplateStatus(Noteid, objNoteTemplate);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
