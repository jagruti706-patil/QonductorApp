import { Component, OnInit, Input } from "@angular/core";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "subsink";
import { DomSanitizer } from "@angular/platform-browser";
import { EligibilityModel } from "src/app/Model/BT Charge Posting/Order/order-note";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
declare var $: any;

@Component({
  selector: "app-eligibility-information",
  templateUrl: "./eligibility-information.component.html",
  styleUrls: ["./eligibility-information.component.css"],
})
export class EligibilityInformationComponent implements OnInit {
  @Input() coveragestatus: string = "";
  private subscription = new SubSink();
  active_coverage_html: any;
  other_or_additional_payer_html: any;
  index: number = 0;
  benefitInfoArray: EligibilityModel[] = [];
  public OrderSort: SortDescriptor[] = [
    {
      field: "label",
      dir: "asc",
    },
  ];
  patientInfoArray: EligibilityModel[] = [];
  constructor(
    private dataService: DataTransferService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.dataService.eligibilityInfo.subscribe((data) => {
        if (data) {
          let eligibilityInfo = JSON.parse(data.eligibilityinfo);
          // console.log(eligibilityInfo);
          for (var key in eligibilityInfo) {
            // console.log(key);

            if (eligibilityInfo.hasOwnProperty(key)) {
              let label = key;
              let html = eligibilityInfo[key];
              // console.log(val);
              if (key == "other_payer_alert") {
                this.benefitInfoArray.push({
                  label: label,
                  html: html,
                });
              } else {
                if (
                  this.coveragestatus.toLowerCase() == "rejected" &&
                  key == "ActiveCoverage"
                ) {
                  this.benefitInfoArray.push({
                    label: label,
                    html: html,
                  });
                } else {
                  this.benefitInfoArray.push({
                    label: label,
                    html: this.sanitizer.bypassSecurityTrustHtml(
                      "<style> .BenefitDetail .PlanEndDate { color: red; font-weight: bold; } .BenefitDetail tr.child { background: #d8d6d6; } .BenefitDetail td { border-bottom: solid 1px #999999; padding: 3px; } .BenefitDetail tr.child td { padding: 3px; color: black; } .BenefitDetail tr.parent th { padding: 3px; border-right: solid 1px #ffffff; border-bottom: solid 1px #9ea0a2; color: black; } .BenefitDetail th { background-color: #dddddd; padding: 3px; } .BenefitDetail dl dt { display: block; float: left; width: 215px; font-weight: bold; color: black; } .BenefitDetail dt { clear: left; } .BenefitDetail * { margin: 0px; padding: 0px; } #BenefitsTable0 { padding-left: 10px; overflow: auto; } .BenefitDetail { line-height: 1.2em; } table.BenefitDetail { display: table; border-collapse: collapse; border-spacing: 2px; border-color: grey; font-size: 12px; line-height: normal; color: black; clear: both; position: relative; margin: 0px auto; width: 99%; padding: 0px 3px; min-width: 745px; } .BenefitDetail .AltRow { background-color: #eeeeee; } .BenefitDetail tr.parent { background: #bcbbbb; } .BenefitDetail tr.child { background: #d8d6d6; } </style><div id='BenefitsTable0'> <table border='0' cellspacing='0' cellpadding='0' class='BenefitDetail'>" +
                        html +
                        "</table></div>"
                    ),
                  });
                }
              }

              this.benefitInfoArray = orderBy(
                this.benefitInfoArray,
                this.OrderSort
              );
            }
          }
          let patientInfo = JSON.parse(data.patientinfo);
          // console.log(patientInfo);
          for (var key in patientInfo) {
            if (patientInfo.hasOwnProperty(key)) {
              let label = key;
              let html = patientInfo[key];
              // console.log(val);
              this.patientInfoArray.push({
                label: label,
                html: this.sanitizer.bypassSecurityTrustHtml(
                  "<style>#PatientDiv{padding-left:11px;} #PatientDiv dt{display: block; float: left; width: 215px; font-weight: bold; color: black;clear:left;} #PatientDiv dd{display: block; color: black;float: left; width: 350px;} </style><div id='PatientDiv'>" +
                    html +
                    "</div>"
                ),
              });
              this.patientInfoArray = orderBy(
                this.patientInfoArray,
                this.OrderSort
              );
            }
          }
          // if (eligibilityInfo["Active Coverage"]) {
          //   let html =
          //     "<style> .BenefitDetail .PlanEndDate { color: red; font-weight: bold; } .BenefitDetail tr.child { background: #d8d6d6; } .BenefitDetail td { border-bottom: solid 1px #999999; padding: 3px; } .BenefitDetail tr.child td { padding: 3px; color: black; } .BenefitDetail tr.parent th { padding: 3px; border-right: solid 1px #ffffff; border-bottom: solid 1px #9ea0a2; color: black; } .BenefitDetail th { background-color: #dddddd; padding: 3px; } .BenefitDetail dl dt { display: block; float: left; width: 215px; font-weight: bold; color: black; } .BenefitDetail dt { clear: left; } .BenefitDetail * { margin: 0px; padding: 0px; } #BenefitsTable0 { padding-left: 10px; overflow: auto; } .BenefitDetail { line-height: 1.2em; } table.BenefitDetail { display: table; border-collapse: collapse; border-spacing: 2px; border-color: grey; font-size: 12px; line-height: normal; color: black; clear: both; position: relative; margin: 0px auto; width: 99%; padding: 0px 3px; min-width: 745px; } .BenefitDetail .AltRow { background-color: #eeeeee; } .BenefitDetail tr.parent { background: #bcbbbb; } .BenefitDetail tr.child { background: #d8d6d6; } </style><div id='BenefitsTable0'> <table border='0' cellspacing='0' cellpadding='0' class='BenefitDetail'>" +
          //     eligibilityInfo["Active Coverage"];
          //   "</table></div>";
          //   this.active_coverage_html = this.sanitizer.bypassSecurityTrustHtml(
          //     html
          //   );
          // }
          // if (eligibilityInfo.other_or_additional_payer) {
          //   let html =
          //     "<style> .BenefitDetail .PlanEndDate { color: red; font-weight: bold; } .BenefitDetail tr.child { background: #d8d6d6; } .BenefitDetail td { border-bottom: solid 1px #999999; padding: 3px; } .BenefitDetail tr.child td { padding: 3px; color: black; } .BenefitDetail tr.parent th { padding: 3px; border-right: solid 1px #ffffff; border-bottom: solid 1px #9ea0a2; color: black; } .BenefitDetail th { background-color: #dddddd; padding: 3px; } .BenefitDetail dl dt { display: block; float: left; width: 215px; font-weight: bold; color: black; } .BenefitDetail dt { clear: left; } .BenefitDetail * { margin: 0px; padding: 0px; } #BenefitsTable0 { padding-left: 10px; overflow: auto; } .BenefitDetail { line-height: 1.2em; } table.BenefitDetail { display: table; border-collapse: collapse; border-spacing: 2px; border-color: grey; font-size: 12px; line-height: normal; color: black; clear: both; position: relative; margin: 0px auto; width: 99%; padding: 0px 3px; min-width: 745px; } .BenefitDetail .AltRow { background-color: #eeeeee; } .BenefitDetail tr.parent { background: #bcbbbb; } .BenefitDetail tr.child { background: #d8d6d6; } </style><div id='BenefitsTable0'> <table border='0' cellspacing='0' cellpadding='0' class='BenefitDetail'>" +
          //     eligibilityInfo.other_or_additional_payer;
          //   "</table></div>";
          //   this.other_or_additional_payer_html = this.sanitizer.bypassSecurityTrustHtml(
          //     html
          //   );
          // }
        }
      })
    );
  }
  onCloseClick() {
    // this.active_coverage_html = null;
    // this.other_or_additional_payer_html = null;
    this.benefitInfoArray = [];
    this.patientInfoArray = [];
    this.index = 0;
    $("#infoModal").modal("hide");
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public onTabSelect(e: any) {
    this.index = e.index;
    if (this.index == 1) {
    } else {
    }
  }
}
