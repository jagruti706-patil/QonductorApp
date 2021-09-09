import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  OnDestroy,
} from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  GroupDescriptor,
  DataResult,
  process,
} from "@progress/kendo-data-query";
import { GridComponent } from "@progress/kendo-angular-grid";
import { Group, exportPDF } from "@progress/kendo-drawing";
import { saveAs } from "@progress/kendo-file-saver";
import { MasterdataService } from "../../Services/AR/masterdata.service";
import * as moment from "moment";
import { DailyProductionCloseSave } from "src/app/Model/AR Management/Production/production";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { FilterService } from "../../Services/Common/filter.service";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { BehaviorSubject, Subject } from "rxjs";
import { CoreoperationService } from "../../Services/AR/coreoperation.service";
import { ToastrService } from "ngx-toastr";
import { ConfigurationService } from "../../Services/Common/configuration.service";
import {
  MailRetrive,
  MailSend,
} from "src/app/Model/AR Management/Configuration/mail";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import { BrowserModule } from "@angular/platform-browser";
// import { NgxExtendedPdfViewerModule } from "ngx-extended-pdf-viewer";
declare var $: any;

@Component({
  selector: "app-production-daily-close",
  templateUrl: "./production-daily-close.component.html",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./production-daily-close.component.css"],
})
export class ProductionDailyCloseComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private masterservice: MasterdataService,
    private coreservice: CoreoperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService,
    private ConfigurationService: ConfigurationService,
    private authService: CoreauthService
  ) {
    this.clsUtility = new Utility(toastr);
    this.currentDateTime = new Date(
      moment(this.clsUtility.currentDateTime()).toDate()
    );
  }
  currentDateTime: Date;
  private clsUtility: Utility;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  loadingDailyProduction = false;
  private subscription = new SubSink();
  public max: Date = new Date(
    moment.utc(this.currentDateTime).format("MM/DD/YYYY")
  );

  DateGroup = this.fb.group({
    fcDate: [
      new Date(moment.utc(this.currentDateTime).format("MM/DD/YYYY")),
      Validators.required,
    ],
  });
  // @ViewChild("ProductionData") content: ElementRef;
  IsProductionDateChanged = false;
  selectedFiles: File;

  @ViewChildren(GridComponent)
  public grids: QueryList<GridComponent>;
  get fbcDate() {
    return this.DateGroup.get("fcDate");
  }
  ngOnInit() {
    this.retriveData();
    this.formValueChanged();
  }
  formValueChanged(): any {
    try {
      if (this.fbcDate.valid) {
        this.fbcDate.valueChanges.subscribe(
          (data: Date) => {
            // console.log("date changed");
            this.IsProductionDateChanged = false;
          },
          (err) => {
            // this.loadingFiles = false;
          }
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public gridWorkedData: any;
  public gridBucketData: any;
  public gridProdData: any[] = [];
  public gridProdDetailsData: any[] = [];
  public gridAutoData: any[] = [];
  public gridTodayProduction: any[] = [];
  confirmationMessage: string;
  retriveData() {
    try {
      // console.log(moment(this.fbcDate.value).format("YYYY-MM-DD"));
      if (this.fbcDate.valid) {
        this.subscription.add(
          this.masterservice
            .getdailycloseproduction(
              moment(this.fbcDate.value).format("YYYY-MM-DD")
            )
            .subscribe(
              (data) => {
                if (data != null || data != undefined) {
                  this.loadingDailyProduction = true;
                  // console.log(data);
                  // console.log(data.arbucket);
                  this.gridWorkedData = data.arworkcount;
                  this.gridBucketData = data.arbucket;
                  // console.log(data.arstatus);
                  this.gridProdData = data.arworked;
                  this.gridProdDetailsData = data.arstatus;
                  // console.log(this.gridProdDetailsData);

                  this.gridAutoData = data.arautomationstatus;
                  // console.log(this.gridProdDetailsData);
                  // console.log("before this.loadBucket()");
                  this.loadBucket();
                  // console.log("after this.loadBucket()");
                  // console.log("before this.loadStatus();");
                  this.loadStatus();
                  // console.log("after this.loadStatus();");
                  // console.log("before this.loadAutoStatus();");
                  this.loadAutoStatus();
                  // console.log("after this.loadAutoStatus();");
                  if (this.gridWorkedData != null) {
                    this.unsyncworkitemcount = this.gridWorkedData[0][
                      "unsyncworkitem"
                    ];
                    // console.log(
                    //   "this.unsyncworkitemcount: " + this.unsyncworkitemcount
                    // );
                    if (this.unsyncworkitemcount == 0) {
                      this.confirmationMessage =
                        "Do you want to close production?";
                    } else {
                      this.confirmationMessage =
                        "Some task are not sync with QPM. Do you still want to close production?";
                    }
                  }
                } else {
                  this.gridWorkedData = null;
                  this.gridBucketData = null;
                  // console.log(data.arstatus);
                  this.gridProdData = null;
                  this.gridProdDetailsData = null;
                  this.gridAutoData = null;
                  this.bucketgridView = null;
                  this.statusgridView = null;
                  this.autostatusgridView = null;
                }
                this.loadingDailyProduction = false;
                this.IsProductionDateChanged = true;
              },
              (err) => {
                this.loadingDailyProduction = false;
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public bucketgroups: GroupDescriptor[] = [{ field: "sclientname" }];
  public statusgroups: GroupDescriptor[] = [{ field: "clientname" }];
  public autostatusgroups: GroupDescriptor[] = [{ field: "clientname" }];
  public bucketgridView: DataResult;
  public statusgridView: DataResult;
  public autostatusgridView: DataResult;

  public statusgroupChange(groups: GroupDescriptor[]): void {
    this.statusgroups = groups;
    this.loadStatus();
  }
  public autostatusgroupChange(groups: GroupDescriptor[]): void {
    this.autostatusgroups = groups;
    this.loadAutoStatus();
  }
  public bucketgroupChange(groups: GroupDescriptor[]): void {
    this.bucketgroups = groups;
    this.loadBucket();
  }
  loadBucket() {
    try {
      if (this.gridBucketData != null) {
        this.bucketgridView = process(this.gridBucketData, {
          group: this.bucketgroups,
        });
      } else {
        this.bucketgridView = null;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private loadAutoStatus(): void {
    try {
      // console.log(this.gridAutoData);
      if (this.gridAutoData != null) {
        this.autostatusgridView = process(this.gridAutoData, {
          group: this.autostatusgroups,
        });
      } else {
        this.autostatusgridView = null;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private loadStatus(): void {
    try {
      // console.log(this.gridProdDetailsData);
      if (this.gridProdDetailsData != null) {
        this.statusgridView = process(this.gridProdDetailsData, {
          group: this.statusgroups,
        });
      } else {
        this.statusgridView = null;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public scale = 0.8;
  public exportGrids(): void {
    this.loadingDailyProduction = true;
    try {
      // console.log(this.grids);

      const promises = this.grids.map((grid) => grid.drawPDF());
      Promise.all(promises)
        .then((groups) => {
          const rootGroup = new Group({
            pdf: {
              multiPage: true,
            },
          });
          groups.forEach((group) => {
            rootGroup.append(...group.children);
          });

          return exportPDF(rootGroup, { paperSize: "A4" });
        })
        .then((dataUri) => {
          // console.log(dataUri);
          dataUri = dataUri.replace("data:application/pdf;base64,", "");
          // console.log(dataUri);

          const blobltext = this.b64toBlob(dataUri, "application/pdf");
          // console.log(blobltext);

          var filename =
            "DailyProduction_" +
            moment(this.fbcDate.value).format("MMDDYYYY") +
            ".pdf";

          var testFile = new File([blobltext], filename, {
            type: "application/pdf",
          });
          // console.log(testFile);

          this.selectedFiles = testFile;
          // console.log(this.selectedFiles);

          this.getMailConfigurationByTitle("Daily Production Close");

          // saveAs(dataUri, filename);
          this.loadingDailyProduction = false;
        });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateDailyProduction() {
    try {
      if (this.fbcDate.valid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onConfirmationModal(Status: string) {
    try {
      if (Status.toUpperCase() == "YES") {
        this.saveDailyProduction();
        // this.getMailConfigurationByTitle("Test");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  unsyncworkitemcount: 0;
  saveDailyProduction() {
    try {
      this.loadingDailyProduction = true;
      // console.log(this.gridWorkedData[0]["unsyncworkitem"]);
      this.subscription.add(
        this.masterservice
          .checkProductionclosed(
            moment(this.fbcDate.value).format("YYYY-MM-DD")
          )
          .subscribe(
            (IsProductionClosed) => {
              if (
                IsProductionClosed != null ||
                IsProductionClosed != undefined
              ) {
                // console.log(IsProductionClosed);
                if (IsProductionClosed) {
                  this.clsUtility.showInfo(
                    "Production is already closed for selected date."
                  );
                  this.loadingDailyProduction = false;
                  return;
                } else {
                  this.RetriveTodaysProduction();
                  this.IsProductionRetrive.subscribe((response) => {
                    if (this.IsProductionRetrive.value) {
                      var saveWorkedCount = JSON.parse(
                        JSON.stringify(this.gridWorkedData)
                      );
                      var saveAgingBucket = JSON.parse(
                        JSON.stringify(this.gridBucketData)
                      );
                      var saveProduction = JSON.parse(
                        JSON.stringify(this.gridProdData)
                      );
                      var saveProductionStatus = JSON.parse(
                        JSON.stringify(this.gridProdDetailsData)
                      );
                      var saveAutomationStatus = JSON.parse(
                        JSON.stringify(this.gridAutoData)
                      );

                      var saveTodayProduction = JSON.parse(
                        JSON.stringify(this.gridTodayProduction)
                      );
                      // console.log(saveWorkedCount);
                      // console.log(saveAgingBucket);
                      // console.log(saveProduction);
                      // console.log(saveProductionStatus);
                      // console.log(saveAutomationStatus);
                      // console.log(saveTodayProduction);
                      this.IsProductionRetrive.next(false);
                      const date = this.clsUtility.currentDateTime().toString();
                      // console.log(date);

                      const productionSave = new DailyProductionCloseSave();
                      productionSave.productioncloseddate = moment(
                        this.fbcDate.value
                      ).format("YYYY-MM-DD");
                      productionSave.workedcount = saveWorkedCount;
                      productionSave.agingbucket = saveAgingBucket;
                      productionSave.production = saveProduction;
                      productionSave.productionstatus = saveProductionStatus;
                      productionSave.automationstatus = saveAutomationStatus;
                      productionSave.todayproduction = saveTodayProduction;
                      productionSave.createdon = date;
                      productionSave.userid = "" + this.loggeduser;
                      productionSave.username = this.dataService.loginUserName;

                      // console.log(JSON.stringify(productionSave));

                      this.subscription.add(
                        this.coreservice
                          .saveProductionClose(JSON.stringify(productionSave))
                          .subscribe(
                            (data) => {
                              // console.log(data);

                              if (data != null || data != undefined) {
                                if (data == 1) {
                                  this.clsUtility.showSuccess(
                                    "Daily production close successfully"
                                  );
                                  this.exportGrids();
                                  this.loadingDailyProduction = false;
                                } else {
                                  this.clsUtility.showError(
                                    "Error on daily production close"
                                  );
                                  this.loadingDailyProduction = false;
                                }
                              }
                            },
                            (err) => {
                              this.loadingDailyProduction = false;
                            }
                          )
                      );
                    }
                  });
                }
              }
            },
            (err) => {
              this.loadingDailyProduction = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  IsProductionRetrive: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );
  loggeduser: number;

  RetriveTodaysProduction() {
    try {
      this.subscription.add(
        this.dataService.loginUserID.subscribe((loginUser) => {
          this.loggeduser = loginUser;
        })
      );
      this.lstFilter.startdate = moment(this.fbcDate.value).format(
        "YYYY-MM-DD"
      );
      this.lstFilter.enddate = moment(this.fbcDate.value).format("YYYY-MM-DD");
      this.subscription.add(
        this.filterService
          .applyFilter(
            JSON.stringify(this.lstFilter),
            "Production",
            0,
            0,
            2147483647
          )
          .subscribe(
            (data) => {
              if (data != null && data.content != null) {
                this.gridTodayProduction = data.content;
                this.IsProductionRetrive.next(true);
              }
            },
            (err) => {}
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getMailConfigurationByTitle(Title: String) {
    try {
      this.loadingDailyProduction = true;
      var date = moment(this.fbcDate.value).format("MM/DD/YYYY");
      var objMailSend = new MailSend();

      this.subscription.add(
        this.ConfigurationService.getMailByTitle(Title).subscribe(
          (data) => {
            // console.log(data);

            if ((data != null || data != undefined) && data != 0) {
              objMailSend.FromEmail = data.emailfrom.toString();
              objMailSend.FromPassword = this.clsUtility.decryptAES(
                data.frompassword
              );
              if (
                data.emailsubject == null ||
                data.emailsubject == undefined ||
                data.emailbody == null ||
                data.emailbody == undefined
              ) {
                this.clsUtility.showError(
                  "Email Configuration not proper. Please contact system administrator."
                );
                return;
              } else {
                objMailSend.Subject = data.emailsubject.replace(
                  "{{date}}",
                  date
                );
                objMailSend.Body = data.emailbody.replace("{{date}}", date);
              }
              if (
                data.emailtoreceive != null ||
                data.emailtoreceive != undefined
              ) {
                objMailSend.To = data.emailtoreceive
                  .toString()
                  .replace(/,/g, ";");
              }
              if (
                data.emailccreceive != null ||
                data.emailccreceive != undefined
              ) {
                objMailSend.Cc = data.emailccreceive
                  .toString()
                  .replace(/,/g, ";");
              }

              // console.log(objMailSend);

              this.subscription.add(
                this.authService
                  .sendMail(objMailSend, this.selectedFiles)
                  .subscribe(
                    (response) => {
                      this.clsUtility.showSuccess(response.status);
                      // console.log(response.status);
                      this.loadingDailyProduction = false;
                    },
                    (err) => {
                      this.clsUtility.showError("Error in mail send");
                      this.loadingDailyProduction = false;
                    }
                  )
              );
            } else {
              this.clsUtility.showError(
                "Email configuration is not available. Please contact system administrator."
              );
              this.loadingDailyProduction = false;
            }
          },
          (err) => {
            this.clsUtility.showError("Error to receive email template");
            this.loadingDailyProduction = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  b64toBlob = (b64Data, contentType = "application/pdf", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blobpdf = new Blob(byteArrays, { type: contentType });
    return blobpdf;
  };
}
