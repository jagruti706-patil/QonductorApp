import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
import { RCM_Acknowledge } from "src/app/Model/BT Charge Posting/Order/rcmdoc-note";
declare var $: any;

@Component({
  selector: "app-rcm-encounter-documents",
  templateUrl: "./rcm-encounter-documents.component.html",
  styleUrls: ["./rcm-encounter-documents.component.css"],
})
export class RcmEncounterDocumentsComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  documentid: string = "";
  private clsUtility: Utility;
  loadingDocs: boolean = false;
  doclookuppreference: string = "";
  noteCollapse: boolean = true;
  pagenotes: any;
  pagecompleted: boolean;
  originaldocinfo: any;
  @ViewChild("AddCommentComponent")
  private AddCommentComponent: AddCommentComponent;
  masterdocid: string = "";
  documentList: any;
  showPagePanel: boolean = false;
  commentTitle: string = "Add Note";
  public leftside: boolean = true;
  showActionPane: boolean;
  @Input() showAcknoledgeButton: boolean = true;
  @Input() calledFrom: string = "";
  confirmationMsg: string;
  encounternumber: string;
  statustype: string = "";

  constructor(
    private coreService: CoreOperationService, // private fb: FormBuilder
    private toastr: ToastrService,
    private dataService: DataTransferService // private cdr: ChangeDetectorRef
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    if (this.calledFrom == "viewmasterdocument") {
      this.subscription.add(
        this.dataService.ViewDocMasterDocId.subscribe((data) => {
          this.ResetDocuments();
          if (data) {
            this.masterdocid = data;
            this.fetchMasterFileDetails();
          }
        })
      );
    } else {
      this.subscription.add(
        this.dataService.showActionPane.subscribe((data) => {
          this.showActionPane = data;
          if (this.showActionPane) {
            this.leftside = false;
          }
        })
      );
      this.subscription.add(
        this.dataService.SelectedOrderQueueGroupCode.subscribe((data) => {
          if (data) {
            if (this.calledFrom == "assistance") {
              var datasource = data.split(":");
              if (datasource[0] == "SendToPractice") {
                this.encounternumber = data.substring(data.indexOf(":") + 1);
                this.getDocumentsByAccession(this.encounternumber);
              }
            } else {
              this.encounternumber = data;
              this.getDocumentsByAccession(this.encounternumber);
            }
          }
        })
      );
      this.subscription.add(
        this.dataService.SelectedMasterDocId.subscribe((data) => {
          this.ResetDocuments();
          if (data != "" && data != null) {
            if (
              this.calledFrom == "encounteraction" ||
              this.calledFrom == "assistance"
            ) {
              this.masterdocid = data;
            } else {
              this.masterdocid = data;
              this.fetchMasterFileDetails();
            }
          }
        })
      );
      this.subscription.add(
        this.dataService.isMarkedAcknowledged.subscribe((data) => {
          if (data) {
            this.originaldocinfo
              ? (this.originaldocinfo["isacknowledged"] = true)
              : false;
            // if (this.calledFrom !== "encounteraction") {
            this.dataService.SelectedMasterDocId.next(null);
            // }
          }
        })
      );
    }
  }
  sidebar() {
    if (this.showActionPane) {
      this.leftside = !this.leftside;
      this.dataService.leftside.next(this.leftside);
    } else {
      this.leftside = false;
    }
  }
  ResetDocuments() {
    this.documentList = null;
    this.pagenotes = null;
    this.originaldocinfo = null;
    this.pagecompleted = false;
    this.pdfViewer.pdfSrc = null;
    this.pdfViewer.refresh(); //saurabh shelar
    this.doclookuppreference = "";
    this.dataService.documentList.next(null);
    this.currentindex = 0;
    // this.dataService.SelectedMasterDocId.next(null);
    this.selectedPage = "";
    this.statustype = "";
    this.dataService.isMarkedAcknowledged.next(false);
  }

  GetMasterDocumentNotes() {
    try {
      return this.coreService
        .GetMasterDocumentNotes(this.masterdocid)
        .toPromise();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  fetchMasterFileDetails() {
    try {
      // this.ResetDocuments();
      this.loadingDocs = true;
      this.subscription.add(
        this.coreService.GetOriginalDocumentList(this.masterdocid).subscribe(
          async (queuedetails) => {
            if (queuedetails) {
              //let res = await this.GetMasterDocumentNotes();
              this.originaldocinfo = queuedetails["originalfile"];
              this.documentList = queuedetails["pages"];
              this.dataService.documentList.next(this.documentList);
              // if (res && res.length > 0) {
              //   for (let i = 0; i < this.documentList.length; i++) {
              //     let item = res.find(
              //       (ele) => this.documentList[i].docid == ele.docid
              //     );
              //     if (item) {
              //       this.documentList[i].hasNote = true;
              //       this.documentList[i].note = item.ordernote;
              //       this.documentList[i].pagenotes = item.pagenotes;
              //     }
              //   }
              //   this.totalelement = this.documentList.length;
              // }
              if (this.documentList) {
                // this.cdr.detectChanges();
                // if (
                //   document.getElementById(
                //     "doc_" + this.documentList[0].filedisplayname
                //   )
                // ) {
                //   document
                //     .getElementById(
                //       "doc_" + this.documentList[0].filedisplayname
                //     )
                //     .click();
                // }
                this.showDocumentByIndex(0);
              } else {
                this.clsUtility.showWarning(
                  "Document pages may not be processed. Please contact system administrator."
                );
              }
            }
            this.loadingDocs = false;
          },
          (err) => {
            this.loadingDocs = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.loadingDocs = false;
      this.clsUtility.LogError(error);
    }
  }
  getDocumentsByAccession(accessionnumber: string) {
    try {
      this.loadingDocs = true;
      this.subscription.add(
        this.coreService.GetDocumentsByAccession(accessionnumber).subscribe(
          async (queuedetails) => {
            if (queuedetails) {
              if (queuedetails["originalfile"]) {
                this.dataService.SelectedMasterDocId.next(
                  queuedetails["originalfile"].masterdocid
                );
              } else {
                this.dataService.SelectedMasterDocId.next(null);
              }
              this.originaldocinfo = queuedetails["originalfile"];

              this.documentList = queuedetails["pages"];
              this.dataService.documentList.next(this.documentList);
              if (this.documentList) {
                // this.cdr.detectChanges();
                // if (
                //   document.getElementById(
                //     "doc_" + this.documentList[0].filedisplayname
                //   )
                // ) {
                //   document
                //     .getElementById(
                //       "doc_" + this.documentList[0].filedisplayname
                //     )
                //     .click();
                // }
                this.showDocumentByIndex(0);
              } else {
                this.clsUtility.showWarning(
                  "Document pages may not be processed. Please contact system administrator."
                );
              }
            } else {
              if (queuedetails == 0) {
                this.clsUtility.LogError("Error while getting document");
              } else {
                this.clsUtility.showInfo("No information found");
              }
            }
            this.loadingDocs = false;
          },
          (err) => {
            this.loadingDocs = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.loadingDocs = false;
      this.clsUtility.LogError(error);
    }
  }
  @ViewChild("pdfViewerRCMAutoLoad", { static: true }) pdfViewer;
  loadingPDF: boolean = false;
  selectedPage: "";
  currentindex = 0;
  totalelement = 0;
  //saurabh shelar
  showDocument(event: any) {
    try {
      this.pdfViewer.pdfSrc = "";
      this.pdfViewer.refresh();
      this.loadingPDF = true;
      this.documentid = event.docid;
      this.pagenotes = event.pagenotes;
      this.doclookuppreference = "";
      this.subscription.add(
        this.coreService
          .DownloadDocsFromGCPOrDocsVault(event.FFID, event.docid)
          .subscribe(
            (res) => {
              if (res) {
                if (res.doclookuppreference) {
                  switch (res.doclookuppreference.toUpperCase()) {
                    case "GCP":
                      this.doclookuppreference = "GCP";
                      break;
                    case "DV":
                      this.doclookuppreference = "DV";
                      break;
                    default:
                      this.doclookuppreference = "";
                      break;
                  }
                } else {
                  this.clsUtility.showInfo(
                    "Unable to read document from TRIARQ Storage"
                  );
                }
                if (res.data) {
                  this.selectedPage = event.filedisplayname;
                  const blobltext = this.b64toBlob(res.data, "application/pdf");
                  var file = new Blob([blobltext], {
                    type: "application/pdf",
                  });

                  this.pdfViewer.pdfSrc = file;
                } else {
                  this.pdfViewer.pdfSrc = "";
                }
              } else {
                this.pdfViewer.pdfSrc = "";
                this.clsUtility.showWarning(
                  "Unable to get encounter document.\nPlease contact system administrator."
                );
              }
              this.pdfViewer.refresh();
              this.loadingPDF = false;
            },
            (err) => {
              this.loadingPDF = false;
              this.clsUtility.LogError(err);
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  showDocumentByIndex(index: number) {
    try {
      this.currentindex = index;
      this.pdfViewer.pdfSrc = "";
      this.pdfViewer.refresh();
      this.loadingPDF = true;

      let event: any;
      event = this.documentList[index];
      // this.totalelement=this.documentList.length;
      this.documentid = event.docid;
      this.pagenotes = event.pagenotes;
      this.pagecompleted = event.iscompleted;
      this.doclookuppreference = "";
      this.statustype = event.statustype;
      this.subscription.add(
        this.coreService
          .DownloadDocsFromGCPOrDocsVault(event.FFID, event.docid)
          .subscribe(
            (res) => {
              if (res) {
                if (res.doclookuppreference) {
                  switch (res.doclookuppreference.toUpperCase()) {
                    case "GCP":
                      this.doclookuppreference = "GCP";
                      break;
                    case "DV":
                      this.doclookuppreference = "DV";
                      break;
                    default:
                      this.doclookuppreference = "";
                      break;
                  }
                } else {
                  this.clsUtility.showInfo(
                    "Unable to read document from TRIARQ Storage"
                  );
                }
                if (res.data) {
                  this.selectedPage = event.filedisplayname;
                  const blobltext = this.b64toBlob(res.data, "application/pdf");
                  var file = new Blob([blobltext], {
                    type: "application/pdf",
                  });

                  this.pdfViewer.pdfSrc = file;
                } else {
                  this.pdfViewer.pdfSrc = "";
                }
              } else {
                this.pdfViewer.pdfSrc = "";
                this.clsUtility.showWarning(
                  "Unable to get encounter document.\nPlease contact system administrator."
                );
              }
              this.pdfViewer.refresh();
              this.loadingPDF = false;
            },
            (err) => {
              this.loadingPDF = false;
              this.clsUtility.LogError(err);
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

  outputCommentResult(event: boolean) {
    try {
      if (this.calledFrom == "assistance") {
        $("#addCommentModal")
          .modal()
          .on("hidden.bs.modal", function (e) {
            $("body").addClass("modal-open");
          });
      }
      $("#addCommentModal").modal("hide"); //save or cancel click
      if (event) {
        if (!this.AddCommentComponent.isAcknowledgeDocument) {
          this.GetMasterDocumentNotes().then(
            (res) => {
              if (res && res.length > 0) {
                for (let i = 0; i < this.documentList.length; i++) {
                  let item = res.find(
                    (ele) => this.documentList[i].docid == ele.docid
                  );
                  if (item) {
                    this.documentList[i].hasNote = true;
                    this.documentList[i].note = item.ordernote;
                    this.documentList[i].pagenotes = item.pagenotes;
                    if (item.docid == this.documentid) {
                      this.pagenotes = item.pagenotes;
                    }
                  }
                }
                // this.originaldocinfo["isacknowledged"] == true;
              }
            },
            (error) => {
              this.clsUtility.LogError(error);
            }
          );
        }
        if (this.AddCommentComponent.showIncompleteWarning) {
          this.documentList[this.currentindex]["iscompleted"] = false;
          this.documentList[this.currentindex]["statustype"] = "";
          this.statustype = "";
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddCommentClicked() {
    try {
      this.commentTitle = "Add Note";
      this.AddCommentComponent.clearCommentControls();
      this.AddCommentComponent.documentList = this.documentList;
      this.AddCommentComponent.AllDocumentList = this.documentList;
      this.AddCommentComponent.fbcPage.setValue(this.documentid);
      this.AddCommentComponent.fbcPage.disable();
      this.AddCommentComponent.currentindex = this.currentindex;
      this.AddCommentComponent.showIncompleteWarning = false;
      this.AddCommentComponent.getCommentTypes();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAcknowledgedDocument() {
    try {
      if (this.originaldocinfo && this.documentList) {
        this.loadingDocs = true;
        this.subscription.add(
          this.coreService.GetPendingQueCount(this.masterdocid, "0").subscribe(
            (data) => {
              this.loadingDocs = false;
              if (data.masterFilePendingQueCount == 0) {
                this.confirmationMsg =
                  "Selected document contains no question(s) or all question(s) are answered or all encounter(s) are completed.<br>Do you want to acknowledge the document?";
                $("#ackConfirmationModal").modal("show");
              } else {
                this.confirmationMsg =
                  "Some questions are unanswered or some of the encounters are incomplete.<br>Do you want to acknowledge the document?";
                $("#ackConfirmationModal").modal("show");
                // this.clsUtility.showInfo(
                //   "Some questions are unanswered or some of the encounters are incomplete"
                // );
              }
            },
            (error) => {
              this.loadingDocs = false;
              this.clsUtility.LogError(error);
            }
          )
        );
        // if (this.originaldocinfo.completedcount !== this.documentList.length) {
        //   this.confirmationMsg =
        //     "Some page(s) still not completed. Do you want to acknowledge the document ?";
        //   $("#ackConfirmationModal").modal("show");
        // } else {
        //   this.showAcknowledgementModal();
        // }
      }
    } catch (error) {
      this.loadingDocs = false;
      this.clsUtility.LogError(error);
    }
  }
  showAcknowledgementModal() {
    try {
      this.commentTitle = "Acknowledge Document";
      this.AddCommentComponent.clearCommentControls();
      this.AddCommentComponent.isAcknowledgeDocument = true;
      $("#addCommentModal").modal("show");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAcknowledgePageClicked() {
    try {
      this.markPageAcknowledge(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private markPageAcknowledge(movenextpage: boolean = false) {
    try {
      let clsAcknowledge = new RCM_Acknowledge();
      clsAcknowledge.masterdocid = this.masterdocid;
      clsAcknowledge.isacknowledged = true;
      clsAcknowledge.acknowledgedon = this.clsUtility.currentDateTime();
      clsAcknowledge.acknowledgedby = this.dataService.loginUserName;
      clsAcknowledge.docid = this.documentList[this.currentindex]["docid"];
      clsAcknowledge.statustype = "Completed";
      if (this.encounternumber != "" && this.encounternumber != undefined) {
        clsAcknowledge.accessionno = this.encounternumber;
      } else {
        clsAcknowledge.accessionno = "";
      }
      clsAcknowledge.accessionreferenceno = this.originaldocinfo
        .accessionreferenceno
        ? this.originaldocinfo.accessionreferenceno
        : 0;
      // alert("Acknowledge page click" + JSON.stringify(clsAcknowledge));
      this.subscription.add(
        this.coreService.MarkPageacknowledged(clsAcknowledge).subscribe(
          (data) => {
            if (data["response"] == 1) {
              this.clsUtility.showSuccess("Page mark completed.");
              this.documentList[this.currentindex]["iscompleted"] = true;
              this.documentList[this.currentindex]["statustype"] = "Completed";
              this.originaldocinfo["completedcount"] = data["completedcount"];
              if (data.supplementarypages) {
                data.supplementarypages.forEach((docid: string) => {
                  for (let i = 0; i < this.documentList.length; i++) {
                    if (this.documentList[i].docid == docid) {
                      this.documentList[i]["iscompleted"] = true;
                      this.documentList[i]["statustype"] = "Completed";
                      break;
                    }
                  }
                });
              }
              if (movenextpage) {
                this.showDocumentByIndex(this.currentindex + 1);
              } else {
                this.statustype = "Completed";
              }
            } else if (data["response"] == 2) {
              this.clsUtility.showSuccess("Page already mark completed.");
              this.documentList[this.currentindex]["iscompleted"] = true;
              this.originaldocinfo["completedcount"] = data["completedcount"];
              if (movenextpage) {
                this.showDocumentByIndex(this.currentindex + 1);
              }
            } else if (data["response"] == 3) {
              if (
                this.calledFrom == "encounteraction" ||
                this.calledFrom == "assistance"
              )
                this.clsUtility.showWarning(
                  "Some of the questions for this page are unanswered in current encounter / other encounters. Can not mark page as complete. For more details view original document."
                );
              else
                this.clsUtility.showWarning(
                  "Some of the questions are unanswered. Can not mark page as complete."
                );

              this.originaldocinfo["completedcount"] = data["completedcount"];
              // if (movenextpage) {
              //   this.showDocumentByIndex(this.currentindex + 1);
              // }
            } else {
              this.clsUtility.LogError("Error while page mark completed.");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onAcknowledgeNextPageClicked() {
    try {
      this.markPageAcknowledge(true);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    try {
      this.ResetDocuments();
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputAckConfirmationResult(event: boolean) {
    try {
      if (event) {
        this.showAcknowledgementModal();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseClick() {
    try {
      if (this.calledFrom == "assistance") {
        $("#addCommentModal")
          .modal()
          .on("hidden.bs.modal", function (e) {
            $("body").addClass("modal-open");
          });
      }
      $("#addCommentModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onViewMasterDocument() {
    try {
      this.dataService.ViewDocMasterDocId.next(this.masterdocid);
      $("#vieworiginaldocfrom" + this.calledFrom).modal("show");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
