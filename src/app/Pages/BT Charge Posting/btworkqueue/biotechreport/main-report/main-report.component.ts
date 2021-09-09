import { Component, OnDestroy, OnInit } from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import {
  aggregateBy,
  AggregateResult,
  State,
  process,
} from "@progress/kendo-data-query";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";

@Component({
  selector: "app-main-report",
  templateUrl: "./main-report.component.html",
  styleUrls: ["./main-report.component.css"],
})
export class MainReportComponent implements OnInit, OnDestroy {
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

  constructor(private toastr: ToastrService) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
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
}
