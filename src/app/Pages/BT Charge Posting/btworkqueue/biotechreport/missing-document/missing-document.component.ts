import { Component, OnInit } from "@angular/core";
import {
  State,
  process,
  AggregateResult,
  aggregateBy,
} from "@progress/kendo-data-query";
import {
  SelectableSettings,
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { SaveMissingInfoReport } from "../biotech-report.model";
declare var $: any;

@Component({
  selector: "app-missing-document",
  templateUrl: "./missing-document.component.html",
  styleUrls: ["./missing-document.component.css"],
})
export class MissingDocumentComponent implements OnInit {
  missingDocAccessionList: any[] = [
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
      juliandate: 200,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
      juliandate: 140,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
      juliandate: 141,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
      juliandate: 160,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
      juliandate: 200,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
      juliandate: 140,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
      juliandate: 141,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
      juliandate: 160,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
      juliandate: 132,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
      juliandate: 200,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 1,
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
      juliandate: 140,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 0,
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
      juliandate: 141,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 0,
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
      juliandate: 160,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 0,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
    {
      filter: 0,
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
      juliandate: 161,
      hl7filename: "ORUR01_202008040209_04393.hl7",
      hl7filenamedate: "ORUR01_20200804",
    },
  ];
  selectedMissingDocAccessions: any[] = [];
  public missingDocAccessionGridState: State = {
    // Initial filter descriptor
    // sort: [
    //   {
    //     field: "accession",
    //     dir: "asc",
    //   },
    // ],
  };
  public selectableSettings: SelectableSettings = {
    checkboxOnly: true,
  };
  missingDocAccesssionGridView: GridDataResult;
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  loader: boolean;
  accessionRowLabels: any[] = [
    { rowlabel: 20200425, countofaccession: 1 },
    { rowlabel: 20200618, countofaccession: 1 },
    { rowlabel: 20200619, countofaccession: 10 },
    { rowlabel: 20200702, countofaccession: 1 },
    { rowlabel: 20200704, countofaccession: 1 },
    { rowlabel: 20200722, countofaccession: 1 },
    { rowlabel: 20200725, countofaccession: 1 },
    { rowlabel: 20200801, countofaccession: 2 },
    { rowlabel: 20200804, countofaccession: 1 },
    { rowlabel: 20200805, countofaccession: 1 },
    { rowlabel: 20200806, countofaccession: 2 },
    { rowlabel: 20200807, countofaccession: 1 },
    { rowlabel: 20200808, countofaccession: 2 },
    { rowlabel: 20200811, countofaccession: 2 },
    { rowlabel: 20200818, countofaccession: 1 },
    { rowlabel: 20200820, countofaccession: 1 },
    { rowlabel: 20200822, countofaccession: 2 },
    { rowlabel: 20200825, countofaccession: 1 },
    { rowlabel: 20200826, countofaccession: 1 },
    { rowlabel: 20200827, countofaccession: 1 },
    { rowlabel: 20200828, countofaccession: 2 },
    { rowlabel: 20200829, countofaccession: 5 },
    { rowlabel: 20200902, countofaccession: 69 },
    { rowlabel: 20200901, countofaccession: 26 },
    { rowlabel: 20200903, countofaccession: 96 },
    { rowlabel: 20200904, countofaccession: 123 },
    { rowlabel: 20200906, countofaccession: 1 },
    { rowlabel: 20200905, countofaccession: 83 },
    { rowlabel: 20200909, countofaccession: 3649 },
  ];
  folderRowLabels: any[] = [
    { rowlabel: "200", countofaccession: 538 },
    { rowlabel: "273", countofaccession: 1 },
    { rowlabel: "\\21", countofaccession: 1 },
    { rowlabel: "249", countofaccession: 1 },
    { rowlabel: "248", countofaccession: 1 },
    { rowlabel: "252", countofaccession: 3546 },
  ];

  constructor(
    private toaster: ToastrService,
    private coreService: CoreOperationService,
    private fb: FormBuilder
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {
    this.missingDocAccesssionGridView = process(
      this.missingDocAccessionList,
      this.missingDocAccessionGridState
    );
    // this.getMissingDocAccessions();
  }

  public selectedCallback = (args) => args.dataItem;

  getMissingDocAccessions() {
    try {
      this.loader = true;
      this.missingDocAccessionList = [];
      this.missingDocAccesssionGridView = null;
      this.subscription.add(
        this.coreService.GetFolderReport().subscribe(
          (data) => {
            if (data) {
              this.missingDocAccessionList = data.missingpdfcount;
              this.missingDocAccesssionGridView = process(
                this.missingDocAccessionList,
                this.missingDocAccessionGridState
              );
            } else {
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting missing accessions"
                );
              }
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
      this.clsUtility.LogError(error);
    }
  }
  dataStateChange(state: DataStateChangeEvent): void {
    try {
      this.missingDocAccessionGridState = state;
      if (state.filter != undefined && state.filter != null) {
        state.filter.filters.forEach((f) => {
          if (f["value"] != null) {
            f["value"] = f["value"].trim();
          }
        });
      }
      this.missingDocAccesssionGridView = process(
        this.missingDocAccessionList,
        this.missingDocAccessionGridState
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onReportSaved(evt: boolean) {
    try {
      if (evt) {
        this.selectedMissingDocAccessions = [];
        $("#updateReasonModal").modal("hide");
        this.getMissingDocAccessions();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      Object.assign(dataItem, formGroup.value);
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.fb.group({
      comment: dataItem.comment,
    });
  }
  onSaveClick() {
    try {
      this.loader = true;
      setTimeout(() => {
        this.saveMissingDocumentReport();
      }, 3000);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  saveMissingDocumentReport() {
    try {
      let currentDateTime = this.clsUtility.currentDateTime();
      let saveMissingDocumentReport: SaveMissingInfoReport[] = new Array<
        SaveMissingInfoReport
      >();
      this.missingDocAccesssionGridView.data.forEach((ele) => {
        if (ele.comment && ele.comment.trim()) {
          let obj = new SaveMissingInfoReport();
          obj.accessionno = ele.accession;
          obj.cabinetname = ele.cabinetname;
          obj.createdon = currentDateTime;
          obj.folder = ele.folder;
          obj.reason_comments = ele.comment;
          saveMissingDocumentReport.push(obj);
        }
      });
      if (saveMissingDocumentReport.length > 0) {
        this.subscription.add(
          this.coreService
            .saveMissingPdfReport(saveMissingDocumentReport)
            .subscribe(
              (data) => {
                this.loader = false;
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    "Missing document report saved successfully"
                  );
                  this.selectedMissingDocAccessions = [];
                  this.getMissingDocAccessions();
                } else if (data == 0) {
                  this.clsUtility.LogError(
                    "Error while saving missing document report"
                  );
                }
              },
              (error) => {
                this.loader = false;
                this.clsUtility.LogError(error);
              }
            )
        );
      } else {
        this.loader = false;
        this.clsUtility.showInfo("Note is required");
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  getSumByFieldName(data: any[], fieldname: string): number {
    try {
      if (data && fieldname) {
        let result: AggregateResult = aggregateBy(data, [
          { aggregate: "sum", field: fieldname },
        ]);
        return result[fieldname] ? result[fieldname].sum : 0;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
