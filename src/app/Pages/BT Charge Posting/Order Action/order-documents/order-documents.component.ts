import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { FormBuilder, Validators } from "@angular/forms";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
import {
  EncounterSubStatusModel,
  TriarqNoteModel,
  UpdateSubStatusModel,
  UploadMissingInfoModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
import { ButtonInformation } from "src/app/Pages/Common/confirmation/yes-no-cancel-confirmation/yes-no-cancel-confirmation.component";
import { Router } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-order-documents",
  templateUrl: "./order-documents.component.html",
  styleUrls: ["./order-documents.component.css"],
})
export class OrderDocumentsComponent implements OnInit {
  orderqueuegroupid: string;
  orderqueuegroupcode: string;
  private subscription = new SubSink();
  note: string;
  documentid: string = "";
  public leftside: boolean = true;
  pdfSource: string;
  private clsUtility: Utility;
  // @ViewChild("OrderDetailsNote")
  // private OrderDetailsNote: NoteModalComponent;
  // NoteGroup: FormGroup;
  getordersdata: any;
  collapsedata: any = false;
  selectedOrderQueueGroupID: any;
  noteCount: number;
  loadingDocs: boolean = false;
  coll: any;
  showActionPane: boolean;
  doclookuppreference: string = "";
  @Input() title: string = "Encounter";
  noteCollapse: boolean = true;
  encouterpagenotes: any;
  @ViewChild("AddCommentComponent")
  private AddCommentComponent: AddCommentComponent;
  SelectedOrder: any;
  statustype: string = "";
  arrayOfIFrames: HTMLIFrameElement[] = [];
  @Input() calledFrom: string = "";
  @Input() hideTitle: boolean = false;
  inputConfirmationTitle: string;
  confirmationMsg: string;
  encounterSubStatus: EncounterSubStatusModel[] = [];
  subStatus: any;
  updateSubStatusObj: UpdateSubStatusModel;
  inProcessConfirmationTitle: string;
  inProcessConfirmationMsg: string;
  confirmationFrom: string;
  currentSubStatus: string = "";

  constructor(
    private fb: FormBuilder,
    private coreService: CoreOperationService, // private fb: FormBuilder
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private cdr: ChangeDetectorRef,
    private auditLog: WriteAuditLogService,
    private route: Router
  ) {
    this.clsUtility = new Utility(toastr);
    // this.pdfSrc = "";
  }
  NoteGroup = this.fb.group({
    fcNote: ["", Validators.required],
  });
  get fbcNote() {
    return this.NoteGroup.get("fcNote");
  }
  public gridAutomation: GridDataResult;
  ngOnInit() {
    // this.OrderDetailsNote.ResetComponents(); //saurabh shelar
    // this.formValueChanged();
    this.subscription.add(
      this.dataService.showActionPane.subscribe((data) => {
        this.showActionPane = data;
        if (this.showActionPane) {
          this.leftside = false;
        }
      })
    );
    // this.subscription.add(
    //   this.OrderDetailsNote.boolok.subscribe(data => {
    //     // this.retriveNotes(false);
    //   })
    // );
    this.subscription.add(
      this.dataService.SelectedOrderInfo.subscribe((data) => {
        if (data != null) {
          this.SelectedOrder = data;
          if (
            this.calledFrom === "encounteraction" &&
            this.SelectedOrder.encountersource.toLowerCase() ==
              "biotech encounter" &&
            this.SelectedOrder.nstatus == 16
          ) {
            if (
              this.SelectedOrder.ordersubstatusname.toLowerCase() ===
              "in process"
            ) {
              this.subStatus = true;
            } else {
              this.subStatus = false;
            }
            this.currentSubStatus = this.SelectedOrder.ordersubstatus;
            this.subscription.add(
              this.dataService.practiceEncounterStatus.subscribe(
                (subStatusInfo) => {
                  if (subStatusInfo) {
                    this.subStatus =
                      subStatusInfo.ordersubstatusname.toLowerCase() ===
                      "in process"
                        ? true
                        : false;
                    this.currentSubStatus = subStatusInfo.ordersubstatus;
                  }
                }
              )
            );
            this.getOrderSubStatusAndNotes();
          }
        }
      })
    );
    this.subscription.add(
      this.dataService.SelectedOrderQueueGroupCode.subscribe((data) => {
        // this.orderqueuegroupid = data;
        if (data != "" && data != null) {
          var datasource = data.split(":");
          if (datasource[0] != "SendToPractice") {
            this.orderqueuegroupcode = data;
            this.fetchOrderDetails();
          }
        }
      })
    );
  }
  getOrderSubStatusAndNotes() {
    try {
      this.subscription.add(
        this.coreService
          .getOrderSubStatusAndNotes(this.SelectedOrder.nstatus)
          .subscribe(
            (data) => {
              // console.log(data);
              if (data) {
                this.encounterSubStatus = data.substatus;
              }
            },
            (error) => {
              this.clsUtility.showError(error);
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  noteCollapseClick() {
    this.noteCollapse = !this.noteCollapse;
  }
  collapseClick() {
    if (this.pdfclick) {
      this.collapsedata = !this.collapsedata;
    }
  }
  // retriveNotes(callfrom: boolean) {
  //   //debugger;
  //   try {
  //     // console.log(this.dataService.SelectedGCPUserid);
  //     this.noteCount = 0;
  //     this.subscription.add(
  //       this.coreService.GetNotes("0", this.documentid).subscribe(
  //         (data) => {
  //           if (data != undefined || data != null) {
  //             this.getordersdata = data;
  //             this.noteCount = this.getordersdata.length;
  //             if (callfrom) this.collapsedata = !this.collapsedata; //saurabh shelar
  //             // this.loadingPDF = false;
  //           } else {
  //             this.getordersdata = null;
  //             // this.loadingPDF = false;
  //             this.noteCount = 0;
  //           }
  //         },
  //         (err) => {
  //           this.clsUtility.LogError(err);
  //           // this.loadingPDF = false;
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  // showNote: boolean = false;
  // onNoteViewClick(data: any) {
  //   //saurabh shelar
  //   this.showNote = true;
  //   this.note = data.note;
  // }

  sidebar() {
    if (this.showActionPane) {
      this.leftside = !this.leftside;
      this.dataService.leftside.next(this.leftside);
    } else {
      this.leftside = false;
    }
  }

  OnClose() {
    // this.PdfSearchGroup.reset();
    // this.pdfSrc = "";
    // this.pdfComponent = null;
    // this.pdfViewer.refresh(); //saurabh shelar
    this.documentList = null;
    this.encouterpagenotes = null;
    this.pdfclick = false;
    this.pdfViewer.pdfSrc = null;
    this.collapsedata = true;
    this.pdfViewer.refresh(); //saurabh shelar
    this.doclookuppreference = "";
    this.dataService.documentList.next(null);
    this.statustype = "";
    // console.log(this.pdfSrc);
  }

  documentList: any;
  GetDocumentNoteList() {
    try {
      if (this.SelectedOrder) {
        return this.coreService
          .GetDocumentNoteList(this.SelectedOrder.orderqueuegroupid)
          .toPromise();
      } else {
        return null;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  fetchOrderDetails() {
    try {
      if (this.SelectedOrder) {
        this.pdfclick = false; //current change
        // this.showNote = false; //saurabh shelar
        this.collapsedata = true;
        this.loadingDocs = true;
        // this.OrderDetailsNote.ResetComponents(); //saurabh shelar
        if (
          this.SelectedOrder.encountersource &&
          this.SelectedOrder.encountersource.toLowerCase() == "rcm encounter"
        ) {
          this.subscription.add(
            this.coreService
              .GetDocumentsByAccession(this.orderqueuegroupcode)
              .subscribe(
                async (queuedetails) => {
                  this.loadingDocs = false;
                  if (queuedetails) {
                    this.documentList = queuedetails["pages"];
                    this.dataService.documentList.next(this.documentList);
                    if (this.documentList) {
                      let res: any[];
                      if (this.calledFrom === "archivedencounters") {
                        res = this.dataService.orderdocnotes;
                      } else {
                        res = await this.GetDocumentNoteList();
                      }

                      if (res && res.length > 0) {
                        for (let i = 0; i < this.documentList.length; i++) {
                          let item = res.find(
                            (ele) => this.documentList[i].docid == ele.docid
                          );
                          if (item) {
                            this.documentList[i].hasNote = true;
                            this.documentList[i].note = item.ordernote;
                            this.documentList[i].encouterpagenotes =
                              item.pagenotes;
                          }
                        }
                      }
                      this.cdr.detectChanges();
                      if (
                        document.getElementById(
                          "doc_" + this.documentList[0].filedisplayname
                        )
                      ) {
                        document
                          .getElementById(
                            "doc_" + this.documentList[0].filedisplayname
                          )
                          .click();
                      }
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
                },
                (err) => {
                  this.loadingDocs = false;
                  this.clsUtility.LogError(err);
                }
              )
          );
        } else {
          this.subscription.add(
            this.coreService
              .GetDocumentList(
                this.orderqueuegroupcode,
                this.SelectedOrder.orderday,
                this.SelectedOrder.orderyear
              )
              .subscribe(
                async (queuedetails) => {
                  if (queuedetails && queuedetails.length > 0) {
                    if (this.SelectedOrder.nstatus === 16) {
                      //don't give get notes call for practice encounter
                      this.documentList = queuedetails;
                      this.dataService.documentList.next(this.documentList);
                    } else {
                      let res: any[];
                      if (this.calledFrom === "archivedencounters") {
                        res = this.dataService.orderdocnotes;
                      } else {
                        res = await this.GetDocumentNoteList();
                      }
                      this.documentList = queuedetails;
                      this.dataService.documentList.next(this.documentList);
                      if (res && res.length > 0) {
                        for (let i = 0; i < this.documentList.length; i++) {
                          let item = res.find(
                            (ele) => this.documentList[i].docid == ele.docid
                          );
                          if (item) {
                            this.documentList[i].hasNote = true;
                            this.documentList[i].note = item.ordernote;
                            this.documentList[i].encouterpagenotes =
                              item.pagenotes;
                          }
                        }
                      }
                    }
                    this.loadingDocs = false;
                    this.cdr.detectChanges();
                    if (
                      document.getElementById(
                        "doc_" + this.documentList[0].filedisplayname
                      )
                    ) {
                      document
                        .getElementById(
                          "doc_" + this.documentList[0].filedisplayname
                        )
                        .click();
                    }
                  } else {
                    this.loadingDocs = false;
                  }
                },
                (err) => {
                  // this.loadingOrderGrid = false;
                  this.loadingDocs = false;
                  this.clsUtility.LogError(err);
                }
              )
          );
        }
      }
    } catch (error) {
      this.loadingDocs = false;
      this.clsUtility.LogError(error);
    }
  }
  @ViewChild("pdfViewerAutoLoad", { static: true }) pdfViewer;
  loadingPDF: boolean = false;
  anotherdocclick: boolean = true;
  pdfclick: boolean = false;
  loader: boolean = false;
  //saurabh shelar
  showDocument(event: any) {
    try {
      this.statustype = event.statustype;
      this.pdfViewer.pdfSrc = "";
      this.pdfViewer.refresh();
      this.loadingPDF = true;
      this.documentid = event.docid;
      this.encouterpagenotes = event.encouterpagenotes;
      // this.retriveNotes(true);
      this.collapsedata = false; //saurabh
      // this.subscription.add(
      //   this.coreService.DownloadOrderDocument(event.FFID).subscribe(
      //     data => {
      //       if (data.size != undefined && data.size != null) {
      //         if (data.size != 0) {
      //           var file = new Blob([data], { type: "application/pdf" });
      //           // console.log(file);
      //           this.pdfViewer.pdfSrc = file;
      //           this.pdfViewer.refresh();
      //           this.loadingPDF = false;
      //           this.pdfclick = true;
      //           this.anotherdocclick = false;
      //           // this.documentid = event.docid; //saurabh shelar
      //           //this.retriveNotes();
      //         } else {
      //           this.clsUtility.showWarning(
      //             "Unable to get order document.\nPlease contact system administrator."
      //           );
      //           this.pdfViewer.pdfSrc = "";
      //           this.pdfViewer.refresh();
      //           this.loadingPDF = false;
      //           this.pdfclick = true;
      //           this.anotherdocclick = false;
      //         }
      //       }
      //     },
      //     err => {
      //       this.loadingPDF = false;
      //       this.pdfclick = false;
      //       this.clsUtility.LogError(err);
      //     }
      //   )
      // );
      this.doclookuppreference = "";
      let FFID = event.FFID ? event.FFID : "0";
      this.subscription.add(
        this.coreService
          .DownloadDocsFromGCPOrDocsVault(FFID, event.docid)
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
                    "Unable to read document from TRIARQ Storage OR DocsVault"
                  );
                }
                if (res.data) {
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
                  "Unable to get " +
                    this.title.toLowerCase() +
                    " document.\nPlease contact system administrator."
                );
              }
              this.pdfViewer.refresh();
              this.loadingPDF = false;
              this.pdfclick = true;
              this.anotherdocclick = false;
            },
            (err) => {
              this.loadingPDF = false;
              this.pdfclick = false;
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

  //////////////////////////////

  // checkOrderDetails() {
  //   //  this.dataService.NoteWorkItemCount.next(this.WorkGroupSelected.length);
  //   this.dataService.NoteCalledFrom.next(enumFilterCallingpage.OrderDetails); //saurabh shelar
  //   this.dataService.NoteTitle.next("Note");
  //   this.dataService.ShowNoteCategory.next(false);
  //   this.dataService.ShowOrderStatus.next(false);
  //   //this.DeferNoteComponent.selectedWorkGroup = this.WorkGroupSelected;
  //   // console.log("this is doc id==>", this.documentid);

  //   this.OrderDetailsNote.selecteddocumentid = this.documentid;
  // }

  ////////////////////////////

  OnNoteStatus(noteid, noteStatus) {
    try {
      this.subscription.add(
        this.coreService
          .updateNoteStatus(noteid, noteStatus)
          .subscribe((data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Note Status updated successfully");
                // this.retriveNotes(false);
              } else {
                this.clsUtility.showError("Failed to update Note Status");
              }
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      // this.dataService.SelectedOrderQueueGroupCode.next("");     added this to order details close
      this.arrayOfIFrames.forEach((item) => {
        item.remove();
      });
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  validate() {
    let isvalid: boolean = false;

    if (
      this.fbcNote.valid &&
      !this.clsUtility.CheckEmptyString(this.fbcNote.value)
    ) {
      isvalid = true;
      return isvalid;
    }
  }
  onCloseClick() {
    try {
      $("#addCommentModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  outputCommentResult(event: boolean) {
    try {
      $("#addCommentModal").modal("hide"); //save or cancel click
      if (event) {
        //save click
        this.GetDocumentNoteList().then(
          (res) => {
            if (res && res.length > 0) {
              for (let i = 0; i < this.documentList.length; i++) {
                let item = res.find(
                  (ele) => this.documentList[i].docid == ele.docid
                );
                if (item) {
                  this.documentList[i].hasNote = true;
                  this.documentList[i].note = item.ordernote;
                  this.documentList[i].encouterpagenotes = item.pagenotes;
                  if (item.docid == this.documentid) {
                    this.encouterpagenotes = item.pagenotes;
                  }
                }
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddCommentClicked() {
    try {
      this.AddCommentComponent.clearCommentControls();
      this.AddCommentComponent.documentList = this.documentList;
      this.AddCommentComponent.AllDocumentList = this.documentList;
      this.AddCommentComponent.fbcPage.setValue(this.documentid);
      this.AddCommentComponent.fbcPage.disable();
      this.AddCommentComponent.getCommentTypes();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // async onUploadMissingInfo() {
  //   try {
  //     await this.ViewActionPaneIncompleteInfoOrder.exportGrids(
  //       covername
  //     ).then(
  //       async (data) => {
  //         base64data = await this.getFile(data);
  //         body.data = base64data;
  //         // console.log(body);
  //         res = await this.uploadCall(body);
  //       },
  //       (error) => {
  //         this.loader = false;
  //         this.clsUtility.LogError("Error while uploading missing info");
  //         return;
  //       }
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  async uploadFile(event: any) {
    if (event && event.length > 0) {
      let currentDateTime: string = this.clsUtility.currentDateTime();
      let body: UploadMissingInfoModel = new UploadMissingInfoModel();
      let covername = this.SelectedOrder.orderqueuegroupcode + "-000-Cover.pdf";
      body.documentname = covername;
      body.category = this.SelectedOrder.orderqueuegroupcode;
      body.orderqueueid = this.SelectedOrder.orderqueuegroupid;
      body.subcategory = this.SelectedOrder.ordercategory;
      body.sourcetype = "Qonductor";
      body.cabinet = this.SelectedOrder.orderyear;
      body.folder = this.SelectedOrder.orderday;
      body.externalcategoryid = "";
      body.createdon = currentDateTime;
      body.modifiedon = currentDateTime;
      body.actionfrom = "Assigned";
      this.loader = true;
      body.data = await this.clsUtility.blobToBytes(event[0]);
      let res = await this.uploadCall(body);
      this.loader = false;
      if (res === 1) {
        let objTriarqNote = new TriarqNoteModel();
        objTriarqNote.accessionnumber = this.SelectedOrder.orderqueuegroupcode;
        objTriarqNote.commentcode = "";
        objTriarqNote.commenttype = "";
        objTriarqNote.createdbyuserid = this.dataService.loginGCPUserID.getValue();
        objTriarqNote.createdbyusername = this.dataService.loginUserName;
        objTriarqNote.createdon = this.clsUtility.currentDateTime();
        objTriarqNote.docid = "";
        objTriarqNote.ordernote =
          "Document uploaded by user: " + this.dataService.loginUserName;
        objTriarqNote.orderstatus = this.SelectedOrder.nstatus;
        objTriarqNote.page = "Encounter";
        objTriarqNote.supplementarypages = "";
        objTriarqNote.orderqueueid = this.SelectedOrder.orderqueuegroupid;

        this.subscription.add(
          this.coreService.saveTriarqNote(objTriarqNote).subscribe(
            (data) => {},
            (error) => {}
          )
        );
        this.documentList = [];
        this.fetchOrderDetails();
        this.clsUtility.showSuccess("Information uploaded successfully");
      } else if (res === 0) {
        this.clsUtility.LogError("Error while uploading information");
      }
    }
  }
  async uploadCall(body: UploadMissingInfoModel) {
    return await this.coreService.uploadMissingInfo(body).toPromise();
  }
  onPrintClick() {
    try {
      this.writeLog("Print All Docs button is clicked.", "UPDATE");
      this.updateSubStatus(3);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onUploadClick() {
    try {
      this.loader = true;
      this.subscription.add(
        this.coreService
          .GetOrderqueueIsanswered(this.SelectedOrder.orderqueuegroupid)
          .subscribe(
            (data) => {
              this.loader = false;
              if (data) {
                this.inputConfirmationTitle = "Update Document Confirmation";
                this.confirmationMsg =
                  "Previously uploaded Answer Response document will be updated.<br/>Do you want to continue?";
                this.confirmationFrom = "upload";
                $("#actionConfirmationModal").modal("show");
              } else {
                $("#fileInput").click();
              }
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
              return;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sendPrintBatch() {
    try {
      let inputJson: {
        accessionnumbers: any[];
        createdon: string;
        userid: string;
        username: string;
      } = {
        accessionnumbers: [
          {
            accessionnumber: this.SelectedOrder.orderqueuegroupcode,
            orderqueueid: this.SelectedOrder.orderqueuegroupid,
          },
        ],
        createdon: this.clsUtility.currentDateTime(),
        userid: this.dataService.loginGCPUserID.getValue(),
        username: this.dataService.loginUserName,
      };
      this.loader = true;
      this.subscription.add(
        this.coreService.sendPrintBatch(inputJson).subscribe(
          (data) => {
            if (data) {
              this.getMergedDocuments(data);
            } else {
              this.loader = false;
              this.clsUtility.LogError("Error while sending batch");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  getMergedDocuments(inputBody: string) {
    try {
      this.subscription.add(
        this.coreService.getMergedDocumentsForPrint(inputBody).subscribe(
          (data) => {
            this.loader = false;
            if (data) {
              if (data.bytes == null || data.bytes == "") {
                this.clsUtility.showInfo("Failed to read order documents");
                return;
              }
              const blob = this.clsUtility.b64toBlob(
                data.bytes,
                "application/pdf"
              );
              this.printDocument(blob);
            } else if (data == 0) {
              this.clsUtility.LogError("Error while reading document.");
            }
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
  printDocument(blob: any) {
    try {
      var objFra: HTMLIFrameElement = document.createElement("iframe"); // Create an IFrame.
      objFra.style.display = "none"; // Hide the frame.
      let pdfUrl = URL.createObjectURL(blob);
      objFra.src = pdfUrl;
      document.body.appendChild(objFra); // Add the frame to the web page.
      objFra.contentWindow.focus(); // Set focus.
      objFra.contentWindow.print(); // Print it.
      URL.revokeObjectURL(pdfUrl);
      this.arrayOfIFrames.push(objFra);
    } catch (error) {
      this.loadingPDF = false;
      this.clsUtility.LogError(error);
    }
  }
  OutputStatusResult(evt: boolean) {
    try {
      if (evt) {
        switch (this.confirmationFrom) {
          case "upload":
            $("#fileInput").click();
            break;
          case "reprint":
            this.updateSubStatus(2);
            break;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateSubStatus(evt: number) {
    try {
      // evt 0 : New
      // evt 1 : No click
      // evt 2 : Yes click or reprint
      // evt 3 : print all docs
      let inProcessObj: EncounterSubStatusModel;
      inProcessObj = this.encounterSubStatus.find(
        (ele) => ele.substatusname.toLowerCase() === "in process"
      );
      let newObj: EncounterSubStatusModel;
      newObj = this.encounterSubStatus.find(
        (ele) => ele.substatusname.toLowerCase() === "new"
      );
      var objSubStatus: EncounterSubStatusModel;
      if (evt == 1 || evt == 2 || evt == 3) {
        objSubStatus = Object.assign(inProcessObj);
      } else if (evt == 0) {
        objSubStatus = Object.assign(newObj);
      }
      if (objSubStatus) {
        if (evt == 3 && this.subStatus) {
          this.inputConfirmationTitle = "Print Confirmation";
          this.confirmationMsg =
            "Encounter is already in process. Do you want to continue?";
          this.confirmationFrom = "reprint";
          $("#actionConfirmationModal").modal("show");
          return;
        }
        let reviewObj: any[] = [];
        reviewObj.push({
          currentStatus: this.SelectedOrder.nstatus,
          currentSubStatus: this.currentSubStatus,
          orderqueuegroupid: this.SelectedOrder.orderqueuegroupid,
        });
        this.updateSubStatusObj = new UpdateSubStatusModel();
        this.updateSubStatusObj.modifiedon = this.clsUtility.currentDateTime();
        this.updateSubStatusObj.ordersubstatus = objSubStatus.substatusid;
        this.updateSubStatusObj.ordersubstatusname = objSubStatus.substatusname;
        this.updateSubStatusObj.assignedto = this.dataService.loginGCPUserID.getValue();
        this.updateSubStatusObj.assignedtoname = this.dataService.loginUserName;
        if (evt == 2 || evt == 3) {
          this.updateSubStatusObj.ordernote =
            "Encounter status changed to " +
            this.updateSubStatusObj.ordersubstatusname +
            " & document printed by user: " +
            this.dataService.loginUserName;
        } else {
          this.updateSubStatusObj.ordernote =
            "Encounter status changed to " +
            this.updateSubStatusObj.ordersubstatusname +
            " by user: " +
            this.dataService.loginUserName;
        }
        this.updateSubStatusObj.reviewObj = reviewObj;
        this.loader = true;
        this.subscription.add(
          this.coreService.updateSubStatus(this.updateSubStatusObj).subscribe(
            (data) => {
              this.loader = false;
              if (data) {
                this.dataService.practiceEncounterStatus.next({
                  ordersubstatusname: data.ordersubstatusname,
                  ordersubstatus: data.ordersubstatus,
                });
                if (data.result == 1) {
                  if (evt == 2 || evt == 3) {
                    //came from print
                    this.subStatus = true;
                    this.sendPrintBatch();
                  } else {
                    this.clsUtility.showSuccess("Status updated successfully");
                  }
                  this.writeLog(
                    "Encounter " +
                      this.SelectedOrder.orderqueuegroupcode +
                      " Substatus updated to " +
                      this.updateSubStatusObj.ordersubstatusname,
                    "UPDATE"
                  );
                } else if (data.result == 2) {
                  this.clsUtility.showError(
                    "Encounter details changed! It is not assigned to you."
                  );
                  this.writeLog(
                    "Encounter details changed! It is not assigned to user.",
                    "UPDATE"
                  );
                  this.route.navigate(["/PracticeUserQueue"]);
                } else if (data.result == 3) {
                  this.clsUtility.LogError("Status already changed");
                  this.writeLog("Status already changed", "UPDATE");
                } else if (data.result == 0) {
                  this.clsUtility.LogError("Error while updating status");
                  this.writeLog(
                    "Error wile updating Encounter #" +
                      this.SelectedOrder.orderqueuegroupcode +
                      " Substatus to " +
                      this.updateSubStatusObj.ordersubstatusname,
                    "UPDATE"
                  );
                }
              }
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "Encounter Documents",
      "Qonductor-Biotech"
    );
  }
  inputButtonInfo: ButtonInformation = new ButtonInformation();
  switchChange(evt: any) {
    if (evt) {
      this.inProcessConfirmationTitle = "Update Status Confirmation";
      this.inProcessConfirmationMsg =
        "Encounter status will be updated.<br>Do you want to continue?";
      this.inputButtonInfo.Yes = "Update status & Print document.";
      this.inputButtonInfo.No = "Update Status.";
      this.inputButtonInfo.Cancel = "Do nothing.";
      $("#YesNoCancelModal").modal("show");
    } else {
      this.updateSubStatus(0);
    }
  }
  OutputYesNoCancelResult(evt: number) {
    try {
      $("#YesNoCancelModal").modal("hide");
      switch (evt) {
        case 1: //yes
          this.updateSubStatus(2);
          break;
        case 0: //no
          this.updateSubStatus(1);
          break;
        case 2: //cancel
          this.subStatus = false;
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
