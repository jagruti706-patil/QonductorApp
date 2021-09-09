import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { GetFolders } from "src/app/Model/AR Management/Configuration/cabinet";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { ToastrService } from "ngx-toastr";
import {
  DataStateChangeEvent,
  GridDataResult,
  SelectableSettings,
} from "@progress/kendo-angular-grid";
import {
  aggregateBy,
  AggregateResult,
  State,
  process,
} from "@progress/kendo-data-query";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { SaveMissingInfoReport } from "../biotech-report.model";
import { TabStripComponent } from "@progress/kendo-angular-layout";
declare var $: any;

@Component({
  selector: "app-generate-report",
  templateUrl: "./generate-report.component.html",
  styleUrls: ["./generate-report.component.css"],
})
export class GenerateReportComponent implements OnInit {
  folders: GetFolders[] = [];
  years: any[] = [];
  private clsUtility: Utility;
  private subscription: SubSink = new SubSink();
  folderAccessionsCountGridData: any[] = [
    {
      date: "09/09/2020",
      juliandate: 248,
      folderAccessionsCountData: [
        {
          folder: 248,
          docsvaultfilecount: 2989,
          uniqueaccession: 1930,
          coversheetcount: 0,
          qonductorordercount: 1930,
        },
        {
          folder: "248 TOX",
          docsvaultfilecount: 1139,
          uniqueaccession: 432,
          coversheetcount: 0,
          qonductorordercount: 432,
        },
      ],
    },
    {
      date: "09/09/2020",
      juliandate: 249,
      folderAccessionsCountData: [
        {
          folder: 249,
          docsvaultfilecount: 347,
          uniqueaccession: 261,
          coversheetcount: 0,
          qonductorordercount: 261,
        },
        {
          folder: "249 TOX",
          docsvaultfilecount: 59,
          uniqueaccession: 18,
          coversheetcount: 0,
          qonductorordercount: 18,
        },
      ],
    },
    {
      date: "09/09/2020",
      juliandate: 250,
      folderAccessionsCountData: [
        {
          folder: 250,
          docsvaultfilecount: 162,
          uniqueaccession: 67,
          coversheetcount: 0,
          qonductorordercount: 67,
        },
        {
          folder: "250 TOX",
          docsvaultfilecount: 0,
          uniqueaccession: 0,
          coversheetcount: 0,
          qonductorordercount: 0,
        },
      ],
    },
  ];
  orderByCategoryGridData: any[] = [
    {
      folder: 248,
      orderByCategoryData: [
        {
          category: "4Medica",
          count: 235,
        },
        {
          category: "Blood/Clinical",
          count: 1102,
        },
        {
          category: "COVID",
          count: 527,
        },
        {
          category: "Cytology",
          count: 49,
        },
        {
          category: "Pathology",
          count: 17,
        },
        {
          category: "Toxicology",
          count: 432,
        },
      ],
    },
    {
      folder: 249,
      orderByCategoryData: [
        {
          category: "Blood/Clinical",
          count: 29,
        },
        {
          category: "COVID",
          count: 232,
        },
        {
          category: "Toxicology",
          count: 18,
        },
      ],
    },
    {
      folder: 250,
      orderByCategoryData: [
        {
          category: "COVID",
          count: 67,
        },
      ],
    },
  ];
  hl7DftsGridData: any[] = [
    {
      category: "HL7 DFT's Received",
      count: 68,
      comments: "",
    },
    {
      category: "HL7 Processed",
      count: 67,
      comments: "",
    },
    {
      category: "HL7 Error",
      count: 1,
      comments:
        "Duplicate Accession file (1) : HL7 received for previously processed order. Missing/Invalid Patient DOB (0) : HL7 file without date of birth information (Filename: NA)",
    },
    {
      category: "Orders Missing HL7 DFT's",
      count: 132,
      comments: "",
    },
    {
      category: "HL7 Without Order Document",
      count: 4088,
      comments:
        "As of 09/07/2020. We have skipped HL7 files with accession number prior to 343 ",
    },
  ];
  folderAccessionsCountGridView: GridDataResult;
  public state: State = {};
  mainGridData: any[] = [];
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
  @ViewChild("kendoTabstripTab", { static: true }) private kendoTabstripTab: TabStripComponent;
  loader: boolean;
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
  missingDocAccesssionGridView: GridDataResult;
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
  @Input() calledFrom: string;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private toastr: ToastrService,
    private coreService: CoreOperationService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    // this.getFilterMaster("0");
    this.mainGridData = [
      {
        folderAccessionsCountGridData: this.folderAccessionsCountGridData,
      },
      {
        orderByCategoryGridData: this.orderByCategoryGridData,
      },
      {
        hl7DftsGridData: this.hl7DftsGridData,
      },
    ];
    // console.log(this.mainGridData);
    // console.log(this.folderAccessionsCountGridData);
    this.folderAccessionsCountGridView = process(
      this.folderAccessionsCountGridData,
      this.state
    );
    this.missingHL7AccessionGridView = process(
      this.missingHL7AccessionList,
      this.missingHL7AccessionGridState
    );
    this.categoryWiseAccessionCountsGridView = process(
      this.categoryWiseAccessionCountsGridData,
      this.categoryWiseAccessionCountGridState
    );
    this.missingDocAccesssionGridView = process(
      this.missingDocAccessionList,
      this.missingDocAccessionGridState
    );
    // this.getMissingDocAccessions();
  }
  onClose() {
    try {
      this.resetAll();
    } catch (error) {
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
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
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
  missingHL7DataStateChange(state: DataStateChangeEvent): void {
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
  // onReportSaved(evt: boolean) {
  //   try {
  //     if (evt) {
  //       this.selectedMissingHL7Accessions = [];
  //       $("#updateReasonModal").modal("hide");
  //       this.getMissingHL7Accessions();
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  // public cellClickHandler({
  //   sender,
  //   rowIndex,
  //   columnIndex,
  //   dataItem,
  //   isEdited,
  // }) {
  //   if (!isEdited) {
  //     sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
  //   }
  // }

  // public cellCloseHandler(args: any) {
  //   const { formGroup, dataItem } = args;

  //   if (!formGroup.valid) {
  //     // prevent closing the edited cell if there are invalid values.
  //     args.preventDefault();
  //   } else if (formGroup.dirty) {
  //     Object.assign(dataItem, formGroup.value);
  //   }
  // }

  // public createFormGroup(dataItem: any): FormGroup {
  //   return this.fb.group({
  //     comment: dataItem.comment,
  //   });
  // }
  // onSaveClick() {
  //   try {
  //     this.loader = true;
  //     setTimeout(() => {
  //       this.saveMissingHl7Report();
  //     }, 3000);
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
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
  // public selectedCallback = (args) => args.dataItem;

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
  missingDocDataStateChange(state: DataStateChangeEvent): void {
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
  resetAll() {
    try {
      this.kendoTabstripTab.selectTab(0);
      // this.cdr.detectChanges();
      this.selectedMissingDocAccessions = [];
      this.selectedMissingHL7Accessions = [];
      this.state = {};
      this.categoryWiseAccessionCountGridState = {};
      this.missingDocAccessionGridState = {};
      this.missingHL7AccessionGridState = {};
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
}
