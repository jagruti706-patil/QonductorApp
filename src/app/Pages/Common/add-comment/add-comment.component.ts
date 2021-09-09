import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import {
  TriarqNoteModel,
  RcmDocsNoteModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { CoreOperationService } from "../../Services/BT/core-operation.service";
declare var $: any;
@Component({
  selector: "app-add-comment",
  templateUrl: "./add-comment.component.html",
  styleUrls: ["./add-comment.component.css"],
})
export class AddCommentComponent implements OnInit {
  private subscription = new SubSink();
  private clsUtility: Utility;
  documentList: any[] = [];
  supplementaryDocumentList: Array<supplementaryPages> = [];
  AllSupplementaryDocumentList: Array<supplementaryPages> = [];
  AllDocumentList: any[] = [];
  PageDefaultValue = { docid: "0", filedisplayname: "" };
  cmtTypeDefaultValue = { id: "0", commenttype: "" };
  commentTypeList: any[] = [];
  SelectedOrder: any;
  orderDetailsForm: FormGroup;
  @Output() iscommentsaved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() isFromRcmDocs: boolean = false;
  @Input() isAnswerNote: boolean = false;
  @Input() commentTitle: string = "";
  masterdocid: string = "";
  @Input() questionDataItem: any = {};
  @Input() accessionreferenceno: number = 0;
  isAcknowledgeDocument: boolean = false;
  loader: boolean;
  showIncompleteWarning: boolean;
  currentindex: number = 0;
  isComment: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private coreService: CoreOperationService
  ) {
    this.clsUtility = new Utility(toastr);
    this.orderDetailsForm = this.fb.group({
      fcTriarqNote: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
      ],
      fcPage: ["0"],
      fcCmtType: ["0"],
      fcAddsupplementaryPages: false,
      fcsupplementaryPages: [],
    });
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.documentList.subscribe((data) => {
        if (data) {
          this.documentList = data;
          this.AllDocumentList = data;
          var pagelist = data;
        }
      })
    );
    this.subscription.add(
      this.dataService.SelectedMasterDocId.subscribe((data) => {
        if (data) {
          this.masterdocid = data;
        }
      })
    );
    this.formValueChanged();
  }

  get fbcTriarqNote() {
    return this.orderDetailsForm.get("fcTriarqNote");
  }
  get fbcPage() {
    return this.orderDetailsForm.get("fcPage");
  }
  get fbcCmtType() {
    return this.orderDetailsForm.get("fcCmtType");
  }
  get fbcAddsupplementaryPages() {
    return this.orderDetailsForm.get("fcAddsupplementaryPages");
  }
  get fbcsupplementaryPages() {
    return this.orderDetailsForm.get("fcsupplementaryPages");
  }

  clearCommentControls() {
    this.isAcknowledgeDocument = false;
    this.orderDetailsForm.reset();
    this.fbcAddsupplementaryPages.setValue(false);
  }
  onCancelClick() {
    try {
      this.iscommentsaved.next(false);
      if (this.isAnswerNote) {
        this.questionDataItem.isExpand = false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  saveTriarqNote() {
    try {
      if (this.orderDetailsForm.invalid) {
        return;
      }
      var selectedDocItem = this.documentList.find(
        (item) => item.docid == this.fbcPage.value
      );
      var selectedCmtTypeItem = this.commentTypeList.find(
        (item) => item.id == this.fbcCmtType.value
      );
      if (this.isFromRcmDocs) {
        let objRcmNote = new RcmDocsNoteModel();
        objRcmNote.createdby = this.dataService.SelectedGCPUserid.toString();
        let localStorageValues = localStorage.getItem("currentUser");
        if (localStorageValues != undefined && localStorageValues != null) {
          let currentUser = JSON.parse(localStorageValues);
          objRcmNote.createdbyfirstname = currentUser.firstname;
          objRcmNote.createdbylastname = currentUser.lastname;
        }
        objRcmNote.createdbyusername = this.dataService.loginUserName;
        objRcmNote.createdon = this.clsUtility.currentDateTime();
        objRcmNote.notestatus = true;
        objRcmNote.masterdocid = this.masterdocid;
        objRcmNote.note = this.fbcTriarqNote.value.trim();
        if (this.isAcknowledgeDocument) {
          objRcmNote.notetype = 1;
          objRcmNote.docid = "0";
          objRcmNote.pagenumber = "";
          objRcmNote.commenttype = "Acknowledgment";
          objRcmNote.commentcode = "ackw";
          objRcmNote.supplementarypages = "";
        } else {
          objRcmNote.notetype = 0;
          if (this.isAnswerNote) {
            objRcmNote.docid = this.questionDataItem.docid;
            objRcmNote.referenceid = this.questionDataItem.noteid;
            objRcmNote.pagenumber = this.questionDataItem.pagenumber;
            objRcmNote.accessionreferenceno = this.questionDataItem
              .accessionreferenceno
              ? this.questionDataItem.accessionreferenceno
              : 0;
            objRcmNote.commenttype = "Answer";
            objRcmNote.commentcode = "ans";
            objRcmNote.supplementarypages = "";
          } else {
            objRcmNote.docid = this.fbcPage.value;
            if (this.fbcsupplementaryPages.value.length > 0) {
              objRcmNote.supplementarypages = this.fbcsupplementaryPages.value.join(
                ","
              );
            } else {
              objRcmNote.supplementarypages = "";
            }

            if (selectedCmtTypeItem) {
              objRcmNote.commenttype = selectedCmtTypeItem.commenttype;
              objRcmNote.commentcode = selectedCmtTypeItem.commentcode;
            } else {
              objRcmNote.commenttype = "";
              objRcmNote.commentcode = "";
            }
            if (selectedDocItem) {
              objRcmNote.pagenumber = selectedDocItem.filedisplayname;
            }
            objRcmNote.accessionreferenceno = this.accessionreferenceno
              ? this.accessionreferenceno
              : 0;
          }
        }
        this.loader = true;
        this.subscription.add(
          this.coreService.SaveNote(objRcmNote).subscribe(
            (data) => {
              if (data == 1) {
                if (this.isAcknowledgeDocument) {
                  //if acknowledgement note
                  this.clsUtility.showSuccess(
                    "Document acknowledged successfully."
                  );
                  this.dataService.isMarkedAcknowledged.next(true);
                } else if (this.isAnswerNote) {
                  this.questionDataItem.isExpand = false;
                  this.clsUtility.showSuccess("Answer saved successfully.");
                } else {
                  this.clsUtility.showSuccess("Note saved successfully.");
                  // this.dataService.doRefreshGrid.next(true);
                  // this.retriveOrderHistory();
                }
                this.iscommentsaved.next(true);
                this.clearCommentControls();
              } else if (data == 2) {
                if (this.isAnswerNote)
                  this.clsUtility.showWarning("Answer is duplicate.");
                else this.clsUtility.showWarning("Note is duplicate.");
              } else {
                if (this.isAnswerNote)
                  this.clsUtility.LogError("Error while saving answer.");
                else this.clsUtility.LogError("Error while saving note.");
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      } else {
        let objTriarqNote = new TriarqNoteModel();
        objTriarqNote.accessionnumber = this.SelectedOrder.orderqueuegroupcode;
        objTriarqNote.createdbyuserid = this.dataService.loginGCPUserID.getValue();
        objTriarqNote.createdbyusername = this.dataService.loginUserName;
        objTriarqNote.createdon = this.clsUtility.currentDateTime();
        objTriarqNote.orderqueuemodifiedon = this.SelectedOrder.modifiedon;
        objTriarqNote.ordernote = this.fbcTriarqNote.value.trim();
        objTriarqNote.orderstatus = this.SelectedOrder.nstatus;
        objTriarqNote.docid = this.fbcPage.value;
        objTriarqNote.orderqueueid = this.SelectedOrder.orderqueuegroupid;

        if (selectedDocItem) {
          objTriarqNote.page = selectedDocItem.filedisplayname;
        } else {
          objTriarqNote.page = "Encounter";
          objTriarqNote.docid = "";
        }
        if (selectedCmtTypeItem) {
          objTriarqNote.commenttype = selectedCmtTypeItem.commenttype;
          objTriarqNote.commentcode = selectedCmtTypeItem.commentcode;
        } else {
          objTriarqNote.commenttype = "";
          objTriarqNote.commentcode = "";
        }
        if (
          this.fbcsupplementaryPages.value != null &&
          this.fbcsupplementaryPages.value.length > 0
        ) {
          objTriarqNote.supplementarypages = this.fbcsupplementaryPages.value.join(
            ","
          );
        } else {
          objTriarqNote.supplementarypages = "";
        }
        this.loader = true;
        this.subscription.add(
          this.coreService.saveTriarqNote(objTriarqNote).subscribe(
            (data) => {
              if (data == 1) {
                this.clsUtility.showSuccess("Comment saved successfully.");
                this.dataService.doRefreshGrid.next(true);
                // this.retriveOrderHistory();
                this.iscommentsaved.next(true);
                this.clearCommentControls();
              } else if (data == 2) {
                this.clsUtility.showWarning("Comment is duplicate.");
              } else {
                this.clsUtility.LogError("Error while saving Comment.");
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // validateOrderDetails(): boolean {
  //   let isValid: boolean = false;
  //   if (
  //     this.orderDetailsForm.valid &&
  //     this.fbcTriarqNote.value &&
  //     this.fbcTriarqNote.value.trim()
  //   ) {
  //     isValid = true;
  //   }
  //   return isValid;
  // }
  handleFilter(value) {
    this.documentList = this.AllDocumentList.filter(
      (s) =>
        s.filedisplayname.toLowerCase().includes(value.toLowerCase()) === true
    );
  }

  handlesupplementaryPageFilter(value) {
    this.supplementaryDocumentList = this.AllSupplementaryDocumentList.filter(
      (s) =>
        s.filedisplayname.toLowerCase().includes(value.toLowerCase()) === true
    );
  }
  getCommentTypes() {
    try {
      this.subscription.add(
        this.coreService.GetCommentTypes().subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.commentTypeList = data;
            } else {
              if (data == 0) {
                this.clsUtility.LogError("Error while getting comment types");
              } else {
                this.clsUtility.showWarning("No comment types found");
              }
            }
          },
          (err) => {
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.pdfViewerNote.pdfSrc = "";
    this.fbcAddsupplementaryPages.setValue(false);
  }
  showPdfViewer: boolean = false;
  @ViewChild("pdfViewerNote", { static: true }) pdfViewerNote;
  loadingPDF = false;
  doclookuppreference: string = "";
  // displayDocumentID: string = "";
  formValueChanged() {
    this.fbcAddsupplementaryPages.valueChanges.subscribe((data: any) => {
      if (data != null || data != undefined) {
        if (data) {
          this.showPdfViewer = data;
          this.AllSupplementaryDocumentList = this.AllDocumentList.slice(0);
          // console.log(this.supplementaryDocumentList);
          var index = this.AllSupplementaryDocumentList.findIndex(
            (x) => x.docid == this.fbcPage.value
          );

          if (index !== -1) {
            this.AllSupplementaryDocumentList.splice(index, 1);
          }
          this.supplementaryDocumentList = this.AllSupplementaryDocumentList.slice(
            0
          );
          // console.log(this.supplementaryDocumentList);
        } else {
          this.showPdfViewer = data;
          this.fbcsupplementaryPages.setValue("");
          this.showDocumentByDocid("");
        }
      }
    });

    this.fbcsupplementaryPages.valueChanges.subscribe((data: any) => {
      if (data != null || data != undefined) {
        var displayDocumentID = data[data.length - 1];
        this.showDocumentByDocid(displayDocumentID);
        // console.log(this.fbcsupplementaryPages.value);
        // console.log(data);
      }
    });
  }
  showDocumentByDocid(displayDocumentID: string) {
    try {
      this.pdfViewerNote.pdfSrc = "";
      this.pdfViewerNote.refresh();
      this.loadingPDF = true;

      if (displayDocumentID != "" && displayDocumentID != undefined) {
        this.subscription.add(
          this.coreService
            .DownloadDocsFromGCPOrDocsVault(undefined, displayDocumentID)
            .subscribe(
              (res) => {
                if (res) {
                  if (res.data) {
                    const blobltext = this.b64toBlob(
                      res.data,
                      "application/pdf"
                    );
                    var file = new Blob([blobltext], {
                      type: "application/pdf",
                    });

                    this.pdfViewerNote.pdfSrc = file;
                  } else {
                    this.pdfViewerNote.pdfSrc = "";
                  }
                } else {
                  this.pdfViewerNote.pdfSrc = "";
                  this.clsUtility.showWarning(
                    "Unable to get encounter document.\nPlease contact system administrator."
                  );
                }
                this.pdfViewerNote.refresh();
                this.loadingPDF = false;
              },
              (err) => {
                this.loadingPDF = false;
                this.clsUtility.LogError(err);
              }
            )
        );
      } else {
        this.loadingPDF = false;
      }
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
  noteTypeChanged(evt: any) {
    try {
      this.showIncompleteWarning = false;
      if (evt.commentcode == "que") {
        if (this.documentList[this.currentindex]["statustype"] == "Completed") {
          this.showIncompleteWarning = true;
        }
        // let ele = this.documentList.find(
        //   (ele) => ele.docid == this.fbcPage.value
        // );
        // if (ele) {
        //   if (ele.iscompleted) {
        //     this.showIncompleteWarning = true;
        //     let thisvar = this;
        //     // setTimeout(function () {
        //     //   // $("#incompleteWarning").fadeOut("fast");
        //     //   thisvar.showIncompleteWarning = false;
        //     // }, 4000);
        //   }
        // }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}

export class supplementaryPages {
  createdon: string;
  docid: string;
  doctype: string;
  ffid: string;
  filedisplayname: string;
  iscompleted: boolean;
  masterdocid: string;
  note: string;
  pagenotes: [];
  statustype: string;
  username: string;
}
