import { Component, OnInit } from "@angular/core";
import {
  State,
  process,
  aggregateBy,
  AggregateResult,
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
  selector: "app-missing-hl7",
  templateUrl: "./missing-hl7.component.html",
  styleUrls: ["./missing-hl7.component.css"],
})
export class MissingHL7Component implements OnInit {
  missingHL7AccessionList: any[] = [
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
    },
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
    },
    {
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
    },
    {
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
    },
    {
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
    },
    {
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
    },
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
    },
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
    },
    {
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
    },
    {
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
    },
    {
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
    },
    {
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
    },
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320808",
    },
    {
      folder: 132,
      category: "Blood/Clinical",
      accession: "201320997",
    },
    {
      folder: 132,
      category: "PAP SMEAR",
      accession: "0C2003632",
    },
    {
      folder: 140,
      category: "TOX Toxicology",
      accession: "201404502",
    },
    {
      folder: 141,
      category: "Blood/Clinical",
      accession: "201410044",
    },
    {
      folder: 160,
      category: "TOX Urine Toxicology",
      accession: "201603338",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201610244",
    },
    {
      folder: 161,
      category: "Blood/Clinical",
      accession: "201611447",
    },
  ];
  selectedMissingHL7Accessions: any[] = [];
  public missingHL7AccessionGridState: State = {
    // Initial filter descriptor
    // sort: [
    //   {
    //     field: "accession",
    //     dir: "asc",
    //   },
    // ],
  };
  categoryWiseAccessionCountGridState: State = {
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
  missingHL7AccessionGridView: GridDataResult;
  categoryWiseAccessionCountsGridView: GridDataResult;
  categoryWiseAccessionCountsGridData: any[] = [
    {
      category: "Blood/Clinical",
      countofaccession: 51,
    },
    {
      category: "PAP SMEAR",
      countofaccession: 6,
    },
    {
      category: "Toxicology",
      countofaccession: 8,
    },
    {
      category: "Urine Toxicology",
      countofaccession: 17,
    },
    {
      category: "4Medica",
      countofaccession: 2,
    },
    {
      category: "UNKNOWN",
      countofaccession: 2,
    },
    {
      category: "COVID",
      countofaccession: 45,
    },
    {
      category: "Biopsy",
      countofaccession: 1,
    },
  ];

  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  loader: boolean;

  constructor(
    private toaster: ToastrService,
    private coreService: CoreOperationService,
    private fb: FormBuilder
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {
    // this.getMissingHL7Accessions();
    this.missingHL7AccessionGridView = process(
      this.missingHL7AccessionList,
      this.missingHL7AccessionGridState
    );
    this.categoryWiseAccessionCountsGridView = process(
      this.categoryWiseAccessionCountsGridData,
      this.categoryWiseAccessionCountGridState
    );
  }

  public selectedCallback = (args) => args.dataItem;

  getMissingHL7Accessions() {
    try {
      this.loader = true;
      this.missingHL7AccessionList = [];
      this.missingHL7AccessionGridView = null;
      this.subscription.add(
        this.coreService.GetFolderReport().subscribe(
          (data) => {
            if (data) {
              this.missingHL7AccessionList = data.missinghl7count;
              this.missingHL7AccessionGridView = process(
                this.missingHL7AccessionList,
                this.missingHL7AccessionGridState
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
      this.missingHL7AccessionGridState = state;
      if (state.filter != undefined && state.filter != null) {
        state.filter.filters.forEach((f) => {
          if (f["value"] != null) {
            f["value"] = f["value"].trim();
          }
        });
      }
      this.missingHL7AccessionGridView = process(
        this.missingHL7AccessionList,
        this.missingHL7AccessionGridState
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onReportSaved(evt: boolean) {
    try {
      if (evt) {
        this.selectedMissingHL7Accessions = [];
        $("#updateReasonModal").modal("hide");
        this.getMissingHL7Accessions();
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
        this.saveMissingHl7Report();
      }, 3000);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  saveMissingHl7Report() {
    try {
      let currentDateTime = this.clsUtility.currentDateTime();
      let saveMissingHL7Report: SaveMissingInfoReport[] = new Array<
        SaveMissingInfoReport
      >();
      this.missingHL7AccessionGridView.data.forEach((ele) => {
        if (ele.comment && ele.comment.trim()) {
          let obj = new SaveMissingInfoReport();
          obj.accessionno = ele.accession;
          obj.cabinetname = ele.cabinetname;
          obj.createdon = currentDateTime;
          obj.folder = ele.folder;
          obj.reason_comments = ele.comment;
          saveMissingHL7Report.push(obj);
        }
      });
      if (saveMissingHL7Report.length > 0) {
        this.subscription.add(
          this.coreService.saveMissingHl7Report(saveMissingHL7Report).subscribe(
            (data) => {
              this.loader = false;
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Missing HL7 report saved successfully"
                );
                this.selectedMissingHL7Accessions = [];
                this.getMissingHL7Accessions();
              } else if (data == 0) {
                this.clsUtility.LogError(
                  "Error while saving missing HL7 report"
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
  getSumByFieldName(fieldname: string): number {
    try {
      if (this.categoryWiseAccessionCountsGridView && fieldname) {
        let result: AggregateResult = aggregateBy(
          this.categoryWiseAccessionCountsGridView.data,
          [{ aggregate: "sum", field: fieldname }]
        );
        return result[fieldname] ? result[fieldname].sum : 0;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
