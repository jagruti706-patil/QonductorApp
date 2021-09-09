import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { SaveMissingInfoReport } from "../biotech-report.model";

@Component({
  selector: "app-add-reason",
  templateUrl: "./add-reason.component.html",
  styleUrls: ["./add-reason.component.css"],
})
export class AddReasonComponent implements OnInit {
  loader: boolean;
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  @Input() selectedAccessions: any[] = [];
  @Input() calledFrom: string = "";
  reasonList: any[] = [];
  @Output() missingReportSaved: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private coreService: CoreOperationService
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {}

  addReasonGroup = this.fb.group({
    fcReason: [""],
    fcNote: ["", [Validators.required]], //this.clsUtility.noWhitespaceValidator
  });

  get fbcReason() {
    return this.addReasonGroup.get("fcReason");
  }
  get fbcNote() {
    return this.addReasonGroup.get("fcNote");
  }

  saveMissingDocumentReport() {
    try {
      this.loader = true;
      let currentDateTime = this.clsUtility.currentDateTime();
      let saveMissingDocumentReport: SaveMissingInfoReport[] = new Array<
        SaveMissingInfoReport
      >();
      this.selectedAccessions.forEach((ele) => {
        let obj = new SaveMissingInfoReport();
        obj.accessionno = ele.transactionid;
        obj.cabinetname = ele.cabinetname;
        obj.createdon = currentDateTime;
        obj.folder = ele.folder;
        obj.reason_comments = this.fbcNote.value;
        saveMissingDocumentReport.push(obj);
      });

      this.subscription.add(
        this.coreService
          .saveMissingPdfReport(saveMissingDocumentReport)
          .subscribe(
            (data) => {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Missing document report saved successfully"
                );
                this.selectedAccessions = [];
                this.missingReportSaved.next(true);
                this.close();
              } else if (data == 0) {
                this.clsUtility.LogError(
                  "Error while saving missing document report"
                );
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  saveMissingHl7Report() {
    try {
      this.loader = true;
      let currentDateTime = this.clsUtility.currentDateTime();
      let saveMissingHL7Report: SaveMissingInfoReport[] = new Array<
        SaveMissingInfoReport
      >();
      this.selectedAccessions.forEach((ele) => {
        let obj = new SaveMissingInfoReport();
        obj.accessionno = ele.accession;
        obj.cabinetname = ele.cabinetname;
        obj.createdon = currentDateTime;
        obj.folder = ele.folder;
        obj.reason_comments = this.fbcNote.value;
        saveMissingHL7Report.push(obj);
      });

      this.subscription.add(
        this.coreService.saveMissingHl7Report(saveMissingHL7Report).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Missing HL7 report saved successfully"
              );
              this.selectedAccessions = [];
              this.missingReportSaved.next(true);
              this.close();
            } else if (data == 0) {
              this.clsUtility.LogError("Error while saving missing HL7 report");
            }
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  close() {
    try {
      this.subscription.unsubscribe();
      this.addReasonGroup.reset();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
