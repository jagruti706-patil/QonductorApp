import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { Utility } from "src/app/Model/utility";
import { Notetemplate } from "src/app/Model/AR Management/Configuration/notetemplate";
import { FormBuilder } from "@angular/forms";
import { SubSink } from "../../../../../../node_modules/subsink";

declare var require: any;
@Component({
  selector: "app-qcriber",
  templateUrl: "./qcriber.component.html",
  styleUrls: ["./qcriber.component.css"],
})
export class QcriberComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();

  constructor(
    private masterService: MasterdataService,
    private data: DataTransferService,
    private fb: FormBuilder
  ) {
    this.clsUtility = new Utility();
  }
  noteType: Notetemplate[];
  clsUtility: Utility;
  selectedNoteType: any;
  testNote = "";
  noteTemplate: string;

  parameterArray: Array<any> = [];
  fillerArray = [];
  public NoteDefaultValue = { snotetitle: "", snotetext: "" };
  NoteDefault: Notetemplate = new Notetemplate();

  NoteFormGroup = this.fb.group({
    fcNote: [""],
    fcParameter: [""],
    fcTestNote: [""],
  });

  get fbcNote() {
    return this.NoteFormGroup.get("fcNote");
  }

  ngOnInit() {
    this.RetriveMasterData();
  }

  RetriveMasterData(): any {
    try {
      this.subscription.add(
        this.masterService.getNoteTemplate(0, 1).subscribe((data) => {
          if (data != null || data != undefined) {
            this.noteType = data;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  txtNoteParameter_TextChanged($event: any, id: string): any {
    try {
      const index = this.parameterArray.findIndex((x) => x.nid == id);
      if (index >= 0) {
        this.parameterArray.splice(index, 1);
        this.parameterArray.push({ nid: id, value: $event.target.value });
      } else {
        this.parameterArray.push({ nid: id, value: $event.target.value });
      }
      this.CascadeNotes(this.noteTemplate);
    } catch (error) {}
  }
  CascadeNotes(note: string): any {
    try {
      if (this.parameterArray.length === 0) {
        return;
      }
      let newNote = note;
      for (const parameter of this.parameterArray) {
        const replacestring = "{" + parameter.nid.toString() + "}";
        newNote = newNote.replace(replacestring, parameter.value);
        this.testNote = newNote;
        this.data.cascadedNote.next(this.testNote);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public cmbNoteType_onSelChange(event: any) {
    try {
      // console.log('in sel change'+event);
      // console.log('fbcnote:'+this.fbcNote.value);
      const notetemplate = this.noteType.find((x) => x.nnoteid === event);
      // console.log(notetemplate);

      if (notetemplate !== undefined) {
        this.fillerArray = [];
        const controlcount = notetemplate.nnoteparametercount;
        for (let index = 0; index < controlcount; index++) {
          this.fillerArray.push("{" + index + "}");
        }

        this.testNote = notetemplate.snotetext;
        this.noteTemplate = notetemplate.snotetext;
        this.data.cascadedNote.next(notetemplate.snotetext);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ClearComponent() {
    // console.log('in Qriber clear');
    this.fillerArray = null;
    this.NoteFormGroup.reset();
    // console.log('befor: '+this.fbcNote.value);

    // this.fbcNote.setValue('');
    // console.log('after: '+this.fbcNote.value);
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
