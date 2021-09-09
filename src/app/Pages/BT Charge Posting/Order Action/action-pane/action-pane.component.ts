import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
} from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { SubSink } from "subsink";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  OrderDetails,
  AssistanceInformationJson,
  MiscInformationJson,
  SelectionJson,
  ProcedureDiagnosisJson,
  CompletedInfoJson,
  RcmDocsNoteModel,
  IncompleteOrderNote,
  UploadMissingInfoModel,
  EncounterSubStatusModel,
  EncounterNoteModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { OrderDocumentsComponent } from "../order-documents/order-documents.component";
import { Router } from "@angular/router";
import { IncompleteOrderActionComponent } from "../incomplete-order-action/incomplete-order-action.component";
import { ButtonInformation } from "src/app/Pages/Common/confirmation/yes-no-cancel-confirmation/yes-no-cancel-confirmation.component";
declare var $: any;

@Component({
  selector: "app-action-pane",
  templateUrl: "./action-pane.component.html",
  styleUrls: ["./action-pane.component.css"],
})
export class ActionPaneComponent implements OnInit, OnDestroy {
  orderStatus: any[] = [];
  orderSubStatus: EncounterSubStatusModel[] = [];
  orderNotes: EncounterNoteModel[] = [];
  private subscription = new SubSink();
  sourceOrderStatus: any;
  clsUtility: Utility;
  submitted: boolean = false;
  gselectedTasks: any;
  gcurrentIndex: number;
  loadingTask: boolean = true;
  gcurrentTask: any;
  assistanceInformation: AssistanceInformationJson;
  disableNext: boolean = false;
  gtotalSelectedTaskCount: number;
  @ViewChild("OrderDocumentsComponent")
  private ViewOrderDocumentComponent: OrderDocumentsComponent;
  @Output() onclose = new EventEmitter<string>();
  inputConfirmationTitle: string;
  confirmationMsg: string;
  issavenext: boolean;
  confirmationfrom: string;
  // loader: boolean;
  loader: boolean;
  @Input() encountersource: string = "";
  rcmStatuses: any[] = [];
  @ViewChild("ActionPaneIncompleteInfoOrder", { static: true })
  private ViewActionPaneIncompleteInfoOrder: IncompleteOrderActionComponent;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private coreService: CoreOperationService,
    private toaster: ToastrService,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility(toaster);
  }

  OrderActionFormGroup = this.fb.group({
    fcActionID: [0],
    fcStatus: ["", Validators.required],
    fcActionNote: [""], //, Validators.required   Removed by harish
    fcClaimReferenceNumber: [""], //, Validators.required   Removed by harish
    fcAssignSource: ["", Validators.required],
    fcSubStatus: [""],
    fcOrderNote: [""],
  });

  ngOnInit() {
    try {
      this.gselectedTasks = this.dataService.SelectedOrders;
      if (!this.gselectedTasks) {
        return;
      }
      this.RetriveMasterData(); //for binding status dropdown
      this.gcurrentIndex = 0;
      this.gtotalSelectedTaskCount = this.gselectedTasks.length;
      if (this.gtotalSelectedTaskCount == 1) {
        this.disableNext = true;
      } else {
        this.disableNext = false;
      }
      // this.ShowTask(this.gcurrentIndex);
      this.gcurrentTask = null;
      this.gcurrentTask = this.gselectedTasks[this.gcurrentIndex];
      this.checkIsPracticeAssigned();
      if (
        this.gcurrentTask.nstatus == 16 &&
        this.encountersource.toLowerCase() == "biotech encounter"
      ) {
        this.getIncompleteInfo();
      }
      this.fbcClaimReferenceNumber.setValue(
        this.gcurrentTask.claimreferencenumber
      );
      this.subscription.add(
        this.dataService.SubmitIncompleteOrderInfo.subscribe(
          (incompletinfo) => {
            if (incompletinfo) {
              // console.log(JSON.stringify(incompletinfo));
              // this.ViewActionPaneIncompleteInfoOrder.IncompleteOrderInfo = new IncompleteOrderNote();
              this.ViewActionPaneIncompleteInfoOrder.IncompleteOrderInfo = incompletinfo;
              this.ViewActionPaneIncompleteInfoOrder.isReadonlyCoverpage = true;
              this.ViewActionPaneIncompleteInfoOrder.isSubmittingAnswer = false;
              this.ViewActionPaneIncompleteInfoOrder.SetIncompleteOrderGrid();
              if (!this.ViewActionPaneIncompleteInfoOrder.cdr["destroyed"]) {
                this.ViewActionPaneIncompleteInfoOrder.cdr.detectChanges();
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  get fbcActionID() {
    return this.OrderActionFormGroup.get("fcActionID");
  }
  get fbcStatus() {
    return this.OrderActionFormGroup.get("fcStatus");
  }
  get fbcSubStatus() {
    return this.OrderActionFormGroup.get("fcSubStatus");
  }
  get fbcOrderNote() {
    return this.OrderActionFormGroup.get("fcOrderNote");
  }
  get fbcActionNote() {
    return this.OrderActionFormGroup.get("fcActionNote");
  }
  get fbcClaimReferenceNumber() {
    return this.OrderActionFormGroup.get("fcClaimReferenceNumber");
  }
  get fbcAssignSource() {
    return this.OrderActionFormGroup.get("fcAssignSource");
  }

  RetriveMasterData() {
    try {
      this.subscription.add(
        this.coreService.OrderInventoryStatus("1").subscribe(
          (data) => {
            // console.log("Master Data");
            // console.log(data);
            if (data != null || data != undefined) {
              // console.log(data);
              this.sourceOrderStatus = data;
              this.orderStatus = this.sourceOrderStatus;
              this.rcmStatuses = this.orderStatus.slice(0);
              let index = this.orderStatus.findIndex(
                (ele) => ele.statuscode == 4
              ); //delete pending review status for rcm encounters
              if (index != -1) this.rcmStatuses.splice(index, 1);

              // var comstatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 2
              // );
              // this.orderStatus.push(comstatus);
              // var nastatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 3
              // );
              // this.orderStatus.push(nastatus);
              // var pendingstatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 4
              // );
              // this.orderStatus.push(pendingstatus);
              // var voidstatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 5
              // );
              // this.orderStatus.push(voidstatus);
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  handleFilter(value: any) {
    this.orderStatus = this.sourceOrderStatus.filter(
      (s: any) =>
        s.statusdescribtion.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  ShowTask(index: number) {
    try {
      // this.loadingTask = true;
      if (index < this.gtotalSelectedTaskCount) {
        this.gcurrentTask = null;
        // console.log(this.gselectedTasks[index]);

        this.gcurrentTask = this.gselectedTasks[index];
        // this.encountersource = this.gcurrentTask.encountersource;

        this.dataService.SelectedOrderInfo.next(this.gcurrentTask);
        this.checkIsPracticeAssigned();

        this.dataService.SelectedOrderQueueGroupCode.next(
          this.gcurrentTask.orderqueuegroupcode
        );
        this.dataService.CollapsePatientInfoBanner.next(true);
        if (
          this.gcurrentTask.nstatus == 16 &&
          this.encountersource.toLowerCase() == "biotech encounter"
        ) {
          this.getIncompleteInfo();
          this.dataService.practiceEncounterStatus.next(null);
        }
        this.fbcClaimReferenceNumber.setValue(
          this.gcurrentTask.claimreferencenumber
        );

        this.loadingTask = false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  checkIsPracticeAssigned() {
    try {
      if (this.gcurrentTask) {
        if (this.gcurrentTask.nstatus == 16) {
          //Set validator for note and clear all other validators
          this.fbcStatus.clearValidators();
          this.fbcClaimReferenceNumber.clearValidators();
          this.fbcSubStatus.clearValidators();
          this.fbcStatus.updateValueAndValidity();
          this.fbcClaimReferenceNumber.updateValueAndValidity();
          this.fbcSubStatus.updateValueAndValidity();
          if (this.encountersource.toLowerCase() == "rcm encounter") {
            this.fbcActionNote.setValidators([
              Validators.required,
              this.clsUtility.noWhitespaceValidator,
            ]);
            this.fbcActionNote.updateValueAndValidity();
          } else {
            this.fbcActionNote.clearValidators();
            this.fbcActionNote.updateValueAndValidity();
          }
        } else {
          this.fbcStatus.setValidators([Validators.required]);
          this.fbcStatus.updateValueAndValidity();
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getOrderSubStatusAndNotes(statuscode: string) {
    try {
      this.subscription.add(
        this.coreService.getOrderSubStatusAndNotes(statuscode).subscribe(
          (data) => {
            // console.log(data);
            if (data) {
              this.orderSubStatus = data.substatus;
              this.orderNotes = data.ordernotes;
              if (this.orderNotes) {
                this.fbcOrderNote.reset();
                this.fbcActionNote.setValue("");
                // this.fbcOrderNote.setValidators(Validators.required);
              } else {
                this.fbcActionNote.setValue("");
                this.fbcOrderNote.reset();
                // this.fbcOrderNote.clearValidators();
              }
              if (this.orderSubStatus) {
                this.fbcSubStatus.reset();
                this.fbcSubStatus.setValidators(Validators.required);
              } else {
                this.fbcSubStatus.reset();
                this.fbcSubStatus.clearValidators();
              }
            } else {
              this.orderSubStatus = [];
              this.orderNotes = [];
              // this.fbcOrderNote.clearValidators();
              this.fbcSubStatus.clearValidators();
              this.fbcSubStatus.setValue("");
              this.fbcOrderNote.setValue("");
              this.fbcActionNote.setValue("");
            }
            this.fbcSubStatus.updateValueAndValidity();
            this.fbcOrderNote.updateValueAndValidity();
            this.fbcActionNote.updateValueAndValidity();
            // this.OrderActionFormGroup.updateValueAndValidity();
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  statusChanged(evt: any) {
    if (evt) {
      if (this.encountersource != "rcm encounter") {
        this.getOrderSubStatusAndNotes(evt.statuscode);
        if (evt.statuscode == 2 || evt.statuscode == 4) {
          //claim required
          this.fbcActionNote.clearValidators();
          this.fbcClaimReferenceNumber.setValidators([
            Validators.required,
            this.clsUtility.noWhitespaceValidator,
          ]);
        } else if (evt.statuscode == 3 || evt.statuscode == 5) {
          //note required
          this.fbcClaimReferenceNumber.clearValidators();
          this.fbcActionNote.setValidators([
            Validators.required,
            this.clsUtility.noWhitespaceValidator,
          ]);
        } else {
          //note and claim# required
          this.fbcClaimReferenceNumber.clearValidators();
          this.fbcActionNote.clearValidators();
          this.fbcActionNote.setValidators([
            Validators.required,
            this.clsUtility.noWhitespaceValidator,
          ]);
          this.fbcClaimReferenceNumber.setValidators([
            Validators.required,
            this.clsUtility.noWhitespaceValidator,
          ]);
        }
        this.fbcClaimReferenceNumber.updateValueAndValidity();
        this.fbcActionNote.updateValueAndValidity();
      } else {
        this.fbcClaimReferenceNumber.clearValidators();
        this.fbcSubStatus.clearValidators();
        this.fbcClaimReferenceNumber.updateValueAndValidity();
        this.fbcSubStatus.updateValueAndValidity();
        this.fbcActionNote.clearValidators();
        if (evt.statuscode != 2) {
          //if completed status not selected
          this.fbcActionNote.setValidators([
            Validators.required,
            this.clsUtility.noWhitespaceValidator,
          ]);
        }
        this.fbcActionNote.updateValueAndValidity();
      }
    } else {
      this.fbcClaimReferenceNumber.clearValidators();
      this.fbcActionNote.clearValidators();
      this.fbcClaimReferenceNumber.updateValueAndValidity();
      this.fbcActionNote.updateValueAndValidity();
    }
  }
  orderNoteChanged(evt: any) {
    // console.log(evt);
    this.fbcActionNote.setValue(evt.note);
    this.fbcActionNote.updateValueAndValidity();
  }

  async saveTaskAction(isSaveNext: boolean) {
    try {
      this.submitted = true;
      if (
        this.fbcActionNote.invalid ||
        this.fbcStatus.invalid ||
        this.fbcClaimReferenceNumber.invalid ||
        this.fbcSubStatus.invalid
        // (this.fbcStatus.value == 7 &&
        //   (this.clsUtility.CheckEmptyString(
        //     this.fbcClaimReferenceNumber.value
        //   ) ||
        //     this.clsUtility.CheckEmptyString(this.fbcActionNote.value)))
      ) {
        return;
      }
      this.issavenext = isSaveNext;
      if (
        this.gcurrentTask.encountersource &&
        this.gcurrentTask.encountersource.toLowerCase() == "rcm encounter"
      ) {
        if (this.fbcStatus.value == 2 || this.gcurrentTask.nstatus == 16) {
          this.loader = true;
          this.subscription.add(
            this.coreService
              .GetPendingQueCount(
                this.dataService.SelectedMasterDocId.getValue(),
                this.gcurrentTask.orderqueuegroupcode
              )
              .subscribe(
                (data) => {
                  this.loader = false;
                  if (this.gcurrentTask.nstatus == 16) {
                    if (data.accessionPendingQueCount > 0)
                      this.clsUtility.showInfo(
                        "Please add answer to all questions"
                      );
                    else this.updateEncounterStatus();
                  } else {
                    if (data.masterFilePendingQueCount == 0) {
                      this.inputConfirmationTitle = "Acknowledge Confirmation";
                      this.confirmationMsg =
                        "Selected document contains no question(s) or all question(s) are answered or all encounter(s) are completed.<br>Do you want to acknowledge the document?";
                      this.confirmationfrom = "acknowledged";
                      $("#confirmationModal").modal("show");
                    } else if (data.accessionPendingQueCount > 0) {
                      this.inputConfirmationTitle = "Complete Confirmation";
                      this.confirmationMsg =
                        "Encounter contains unanswered question(s). Do you want to continue?";
                      this.confirmationfrom = "completed";
                      $("#confirmationModal").modal("show");
                    } else {
                      this.updateEncounterStatus();
                    }
                  }
                },
                (error) => {
                  this.loader = false;
                  this.clsUtility.LogError(error);
                }
              )
          );
        } else {
          this.updateEncounterStatus();
        }
      } else {
        if (
          this.gcurrentTask.nstatus == 16 &&
          this.gcurrentTask.encountersource.toLowerCase() == "biotech encounter"
        ) {
          this.loader = true;
          this.subscription.add(
            this.coreService
              .GetOrderqueueIsanswered(this.gcurrentTask.orderqueuegroupid)
              .subscribe(
                (data) => {
                  this.loader = false;
                  this.gcurrentTask.isanswered = data;
                  if (this.gcurrentTask.isanswered) {
                    if (this.getAnswerGiven()) {
                      if (
                        this.ViewActionPaneIncompleteInfoOrder.submitAnswerValid()
                      ) {
                        this.showUpdateConfirmation();
                      } else {
                        this.clsUtility.showInfo("Please fill answer response");
                      }
                    } else this.updateEncounterStatus();
                  } else {
                    if (
                      !this.ViewActionPaneIncompleteInfoOrder.submitAnswerValid()
                    ) {
                      this.clsUtility.showInfo(
                        "Please upload or fill answer response"
                      );
                    } else {
                      this.uploadDocumentAndUpdateStatus();
                    }
                  }
                },
                (error) => {
                  this.loader = false;
                  this.clsUtility.LogError(error);
                  return;
                }
              )
          );
          // console.log(this.gcurrentTask.incompleteorderinfo);
        } else {
          this.updateEncounterStatus();
        }
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  inputButtonInfo: ButtonInformation = new ButtonInformation();
  showUpdateConfirmation() {
    try {
      this.inputConfirmationTitle = "Update Document Confirmation";
      this.confirmationMsg =
        "Previously uploaded Answer Response document will be updated.<br>Do you want to continue?";
      this.inputButtonInfo.Yes =
        "Upload Answer Response document & complete encounter.";
      this.inputButtonInfo.No = "Complete encounter.";
      this.inputButtonInfo.Cancel = "Do nothing.";
      $("#YesNoCancelModal").modal("show");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async updateEncounterStatus(
    acknowledgedRespose: number = 0,
    isCompletedConfirmationYes: boolean = false,
    updateIncompleteInfo: boolean = false
  ) {
    try {
      // var incompleteinfoUploadedSave = false;
      var orderSave = new OrderDetails();
      this.loadingTask = true;
      if (
        updateIncompleteInfo &&
        this.gcurrentTask.nstatus == 16 &&
        this.gcurrentTask.encountersource.toLowerCase() == "biotech encounter"
      ) {
        if (!this.ViewActionPaneIncompleteInfoOrder.submitAnswerValid()) {
          this.clsUtility.showInfo("Please upload or fill answer response");
          return;
        }
        orderSave.incompleteorderinfo = this.ViewActionPaneIncompleteInfoOrder.IncompleteOrderInfo;
        orderSave.isanswered = true;
      }
      var saveDatatime = this.clsUtility.currentDateTime();
      this.gcurrentTask.modifiedon = saveDatatime;
      orderSave.assignedid = this.dataService.loginGCPUserID.getValue();
      orderSave.assignsource = this.fbcAssignSource.value;
      orderSave.assigneduser = this.dataService.loginUserName;
      // switch (this.fbcStatus.value) {
      //   case 2:
      //   case 4:
      //     orderSave.claimreferencenumber = this.fbcClaimReferenceNumber.value;
      //     break;
      //   case 3:
      //   case 5:
      //     orderSave.claimreferencenumber = "";
      //     break;
      //   default:
      //     orderSave.claimreferencenumber = this.fbcClaimReferenceNumber.value;
      //     break;
      // }
      orderSave.claimreferencenumber = this.fbcClaimReferenceNumber.value;
      orderSave.assistanceinfo = this.assistanceInformation;
      orderSave.modifiedon = this.gcurrentTask.modifiedon;
      orderSave.currentStatus = this.gcurrentTask.nstatus;
      if (this.gcurrentTask.nstatus == 16) {
        orderSave.nstatus = 17;
      } else {
        orderSave.nstatus = this.fbcStatus.value;
      }
      orderSave.ordernote = this.fbcActionNote.value
        ? this.fbcActionNote.value.trim()
        : "";
      if (
        this.encountersource == "rcm encounter" &&
        this.fbcStatus.value == 2 &&
        orderSave.ordernote.length == 0
      ) {
        if (isCompletedConfirmationYes) {
          orderSave.ordernote =
            "Encounter contains active questions still user marked it as completed";
        } else {
          orderSave.ordernote = "Completed";
        }
        if (acknowledgedRespose == 1) {
          orderSave.ordernote =
            "No active questions, No unanswered questions & Document is acknowledged";
        } else if (acknowledgedRespose == 2) {
          orderSave.ordernote =
            "No active questions, No unanswered questions & Document is not acknowledged";
        }
      }
      orderSave.orderqueuegroupid = this.gcurrentTask.orderqueuegroupid;

      if (this.fbcSubStatus.value) {
        orderSave.ordersubstatus = this.fbcSubStatus.value;
        let objOrderSubStatus = this.orderSubStatus.find(
          (ele) => ele.substatusid == this.fbcSubStatus.value
        );
        orderSave.ordersubstatusname = objOrderSubStatus.substatusname;
      } else {
        orderSave.ordersubstatus = "";
        orderSave.ordersubstatusname = "";
      }
      this.loader = true;
      this.subscription.add(
        this.coreService.SaveOrderAction(orderSave).subscribe(
          (data: number) => {
            this.loader = false;
            if (data != null || data != undefined) {
              if (data === 1) {
                if (acknowledgedRespose == 1)
                  this.clsUtility.showSuccess(
                    "Document acknowledged & Encounter action saved successfully"
                  );
                else
                  this.clsUtility.showSuccess(
                    "Encounter action saved successfully"
                  );
                this.orderSubStatus = [];
                this.orderNotes = [];
                this.clearControls();
                orderSave = null;
                this.loadingTask = false;
                if (this.issavenext) {
                  this.onclose.next("");
                  this.PerformNextTask();
                } else {
                  this.NavigateBack();
                }
              } else if (data === 2) {
                this.clsUtility.showError(
                  "Encounter details changed! It is not assigned to you."
                );
                this.loadingTask = false;
                this.clearControls();
                this.NavigateBack();
              } else if (data === 3) {
                this.clsUtility.showError("Encounter status already changed");
                this.loadingTask = false;
                this.clearControls();
                this.NavigateBack();
              } else {
                this.clsUtility.showError("Error for encounter action save");
                this.loadingTask = false;
                this.NavigateBack();
              }
            }
          },
          (err) => {
            this.loader = false;
            this.loadingTask = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  async uploadCall(body: UploadMissingInfoModel) {
    return await this.coreService.uploadMissingInfo(body).toPromise();
  }
  async uploadDocumentAndUpdateStatus() {
    try {
      this.loader = true;
      this.gcurrentTask.incompleteorderinfo = this.ViewActionPaneIncompleteInfoOrder.IncompleteOrderInfo;
      // this.updateMissinginfo();
      let body: UploadMissingInfoModel = new UploadMissingInfoModel();
      let covername = this.gcurrentTask.orderqueuegroupcode + "-000-Cover.pdf";
      body.documentname = covername;
      body.category = this.gcurrentTask.orderqueuegroupcode;
      body.orderqueueid = this.gcurrentTask.orderqueuegroupid;
      body.subcategory = this.gcurrentTask.ordercategory;
      body.sourcetype = "Qonductor";
      body.cabinet = this.gcurrentTask.orderyear;
      body.folder = this.gcurrentTask.orderday;
      body.externalcategoryid = "";
      body.createdon = this.clsUtility.currentDateTime();
      body.modifiedon = this.clsUtility.currentDateTime();
      body.actionfrom = "Assigned";
      let base64data: any;
      let res: any;
      await this.ViewActionPaneIncompleteInfoOrder.exportGrids(covername).then(
        async (data) => {
          base64data = await this.clsUtility.blobToBytes(data);
          body.data = base64data;
          // console.log(body);
          res = await this.uploadCall(body);
          if (res === 1) {
            this.updateEncounterStatus(0, false, true);
          } else {
            this.loader = false;
            this.clsUtility.LogError("Error while uploading missing info");
          }
        },
        (error) => {
          this.loader = false;
          this.clsUtility.LogError("Error while uploading missing info");
          return;
        }
      );
      if (res == 0) {
        this.loader = false;
        this.clsUtility.LogError("Error while uploading missing info");
        return;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateMissinginfo() {
    try {
      var updatedInfoJson: {
        incompleteorderinfo: {};
        modifiedon: string;
        orderqueuegroupid: string;
      } = {
        incompleteorderinfo: this.ViewActionPaneIncompleteInfoOrder.SaveIncompleteOrderActionDetails(),
        modifiedon: this.clsUtility.currentDateTime(),
        orderqueuegroupid: this.gcurrentTask.orderqueuegroupid,
      };
      this.subscription.add(
        this.coreService
          .UpdateMissingInfo(updatedInfoJson)
          .subscribe((data) => {
            if (data == 1) {
              return true;
            } else if (data == 2) {
              return true;
            } else {
              this.clsUtility.showError("Failed to update missing information");
              return false;
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  pushProcedure() {
    this.assistanceInformation.medicarePatients.procedure.push("");
  }
  onInfoModalOpen() {
    this.assistanceInformation = new AssistanceInformationJson();
    this.assistanceInformation.requestedDate = this.clsUtility.currentDateTime();
    this.assistanceInformation.miscInfo = new MiscInformationJson();
    this.assistanceInformation.noOfDiagnosis = new SelectionJson();
    this.assistanceInformation.medicarePatients = new ProcedureDiagnosisJson();
    this.assistanceInformation.additionalDiagnosis = new ProcedureDiagnosisJson();
    this.assistanceInformation.doctorsCheck = new SelectionJson();
    this.assistanceInformation.completedInfo = new CompletedInfoJson();
  }

  validateOrderAction() {
    try {
      var bIsValid: Boolean = false;
      if (this.fbcStatus.value != "") {
        switch (this.fbcStatus.value) {
          case 2:
          case 4:
            if (
              this.fbcClaimReferenceNumber.value &&
              this.clsUtility.CheckEmptyString(
                this.fbcClaimReferenceNumber.value
              )
            ) {
              bIsValid = true;
            }
            break;
          case 3:
          case 5:
            if (
              this.fbcActionNote.value &&
              this.clsUtility.CheckEmptyString(this.fbcActionNote.value)
            ) {
              bIsValid = true;
            }
            break;
          default:
            if (
              this.fbcActionNote.value &&
              this.clsUtility.CheckEmptyString(this.fbcActionNote.value) &&
              this.fbcClaimReferenceNumber.value &&
              this.clsUtility.CheckEmptyString(
                this.fbcClaimReferenceNumber.value
              )
            ) {
              bIsValid = true;
            }
            break;
        }
      }

      return bIsValid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
      this.dataService.SelectedOrderInfo.next(null);
      this.dataService.CollapsePatientInfoBanner.next(false);
      this.dataService.SelectedOrderQueueGroupCode.next("");
      this.dataService.showActionPane.next(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  btnSave_Next_click() {
    try {
      this.saveTaskAction(true);
      // this.ViewOrderDocumentComponent.OnClose();
      //   this.PerformNextTask();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  btnSave_Close_click() {
    try {
      this.saveTaskAction(false);
      // this.NavigateBack();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  btnNext_click() {
    try {
      this.orderSubStatus = [];
      this.orderNotes = [];
      this.clearControls();
      this.onclose.next("");
      this.PerformNextTask();
      // this.ViewOrderDocumentComponent.OnClose();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  btnClose_click() {
    this.NavigateBack();
  }
  clearControls(): any {
    this.OrderActionFormGroup.reset();
  }
  PerformNextTask() {
    try {
      this.dataService.SubmitIncompleteOrderInfo.next(null);
      if (this.gtotalSelectedTaskCount > 1) {
        var tempNextIndex = this.gcurrentIndex + 1;
        if (tempNextIndex < this.gtotalSelectedTaskCount) {
          this.gcurrentIndex = tempNextIndex;
          this.ShowTask(this.gcurrentIndex);
          if (this.gcurrentIndex == this.gtotalSelectedTaskCount - 1) {
            this.disableNext = true;
          }
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  NavigateBack() {
    try {
      // console.log('task calling'+this.data.TaskCallingForm);
      // this.route.navigate(["/MyOrderInventory"]);
      switch (this.gcurrentTask.nstatus) {
        case 1:
          this.route.navigate(["/MyOrderInventory"]);
          break;
        case 16:
          this.route.navigate(["/PracticeUserQueue"]);
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputStatusResult(evt: boolean) {
    try {
      if (this.confirmationfrom == "acknowledged") {
        if (evt) {
          let objRcmNote = new RcmDocsNoteModel();
          objRcmNote.notestatus = true;
          objRcmNote.createdby = this.dataService.SelectedGCPUserid.toString();
          let localStorageValues = localStorage.getItem("currentUser");
          if (localStorageValues != undefined && localStorageValues != null) {
            let currentUser = JSON.parse(localStorageValues);
            objRcmNote.createdbyfirstname = currentUser.firstname;
            objRcmNote.createdbylastname = currentUser.lastname;
          }
          objRcmNote.createdbyusername = this.dataService.loginUserName;
          objRcmNote.createdon = this.clsUtility.currentDateTime();
          objRcmNote.masterdocid = this.dataService.SelectedMasterDocId.getValue();
          objRcmNote.notetype = 1;
          objRcmNote.docid = "0";
          objRcmNote.pagenumber = "";
          objRcmNote.commenttype = "Acknowledgment";
          objRcmNote.commentcode = "ackw";
          objRcmNote.supplementarypages = "";
          objRcmNote.note =
            "All the encounters against this document are completed";

          this.subscription.add(
            this.coreService.SaveNote(objRcmNote).subscribe(
              (data) => {
                if (data == 1) {
                  this.updateEncounterStatus(1);
                  // this.clsUtility.showSuccess(
                  //   "Document acknowledged successfully"
                  // );
                } else {
                  this.clsUtility.showError(
                    "Error while acknowledging document"
                  );
                }
              },
              (error) => {
                this.clsUtility.LogError(error);
              }
            )
          );
        } else {
          this.updateEncounterStatus(2);
        }
      } else if (this.confirmationfrom === "completed") {
        if (evt) {
          //if completed confirmation yes
          this.updateEncounterStatus(0, true);
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputYesNoCancelResult(evt: number) {
    try {
      $("#YesNoCancelModal").modal("hide");
      switch (evt) {
        case 1: //yes
          this.uploadDocumentAndUpdateStatus();
          break;
        case 0: //no
          this.updateEncounterStatus();
          break;
      }
      // if (evt) {
      //   this.uploadDocumentAndUpdateStatus();
      // } else {
      //   this.updateEncounterStatus();
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private getIncompleteInfo() {
    try {
      this.subscription.add(
        this.coreService
          .getMissingInfo(this.gcurrentTask.orderqueuegroupid)
          .subscribe(
            (data) => {
              if (data != null) {
                this.gcurrentTask.incompleteorderinfo = JSON.parse(
                  data.incompleteorderinfo
                );
                this.gcurrentTask.isanswered = data.isanswered;
                this.gcurrentTask.isSubmittingAnswer = true;
                let selectedIncompleteOrder: any = [];
                selectedIncompleteOrder.push(this.gcurrentTask);
                this.dataService.IncompleteOrderInfo.next(
                  selectedIncompleteOrder
                );
              } else {
                this.gcurrentTask.isSubmittingAnswer = true;
                this.gcurrentTask.incompleteorderinfo = null;
                let selectedIncompleteOrder: any = [];
                selectedIncompleteOrder.push(this.gcurrentTask);
                this.dataService.IncompleteOrderInfo.next(
                  selectedIncompleteOrder
                );
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
  getAnswerGiven(): boolean {
    try {
      let isAnswerGiven: boolean = false;
      if (
        (this.ViewActionPaneIncompleteInfoOrder.fbcIsMiscInfo.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcMiscInfoAnswer.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcMiscInfoAnswer.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcIsInsuranceInfo.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcInsurancePlanName.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcInsurancePlanName.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberID.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberID.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcIsSubscriberInfo.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberName.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberName.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberDOB.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberDOB.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberRelationToPatient
          .value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcSubscriberRelationToPatient.value.trim()) ||
        (this.ViewActionPaneIncompleteInfoOrder.fbcIsNoDiagnosis.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcNoDXGivenAnswer.value &&
          this.ViewActionPaneIncompleteInfoOrder.fbcNoDXGivenAnswer.value.trim())
      ) {
        isAnswerGiven = true;
      }
      return isAnswerGiven;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
