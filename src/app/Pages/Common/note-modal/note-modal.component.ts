import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { ConfigurationService } from "../../Services/Common/configuration.service";
import { SubSink } from "subsink";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreoperationService } from "../../Services/AR/coreoperation.service";
import { DeferUndefer } from "src/app/Model/AR Management/Configuration/rule";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { CoreOperationService } from "../../Services/BT/core-operation.service";
import {
  OrderNote,
  OrderDetails,
  OrderReviewDetails,
  allOrders,
  ReviewObj,
  OrderSearchStatusModel,
  SendToBiotechModel,
  IncompleteOrderNote,
  UploadMissingInfoModel,
  OrderReleaseDetails,
  ReleaseObj,
  EncounterSubStatusModel,
  EncounterNoteModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { OrderActionComponent } from "../../BT Charge Posting/Order Action/order-action/order-action.component";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { IncompleteOrderActionComponent } from "../../BT Charge Posting/Order Action/incomplete-order-action/incomplete-order-action.component";
import {
  StatusReportModel,
  CountModel,
} from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
import * as moment from "moment";
declare var $: any;
@Component({
  selector: "app-note-modal",
  templateUrl: "./note-modal.component.html",
  styleUrls: ["./note-modal.component.css"],
})
export class NoteModalComponent implements OnInit, OnDestroy {
  accessionInProgress: string = "progress";
  isPercentLoader: boolean = false;
  percentage: number = 0;
  orderSubStatus: EncounterSubStatusModel[] = [];
  orderNotes: EncounterNoteModel[] = [];
  clsAuthLogs: AuthLogs;
  SelectedWorkItemCount: number;
  NoteText: string;
  NoteTitle: string;
  // showNote: string; //saurabh shelar
  HideNoteCategory: boolean;
  HideOrderStatus: boolean;
  private clsUtility: Utility;
  public ddlNoteCategory: any = [];
  private subscription = new SubSink();
  @Output() boolok: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshgrid: EventEmitter<boolean> = new EventEmitter<boolean>();
  sourceOrderStatus: any = [];
  ddlOrderStatus: any = [];
  statusAlreadyCalled: boolean = false;
  DefaultStatus: number;
  @ViewChild("IncompleteOrderAction")
  public IncompleteOrderAction: IncompleteOrderActionComponent;
  showTopSection: boolean = false;
  statusArray: StatusReportModel[] = [];
  countObj: CountModel = new CountModel();
  statusname: string = "";
  title: string = "Encounter";
  NoteGroup: FormGroup;
  // currentStatus: any;
  constructor(
    private fb: FormBuilder,
    private dataservice: DataTransferService,
    private ConfigurationService: ConfigurationService,
    private CoreService: CoreoperationService,
    private coreops: CoreOperationService,
    private toastr: ToastrService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.clsUtility = new Utility(toastr);
    this.clsAuthLogs = new AuthLogs(http);
    this.NoteGroup = this.fb.group({
      fcNote: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
      ],
      fcNoteCategory: ["", Validators.required],
      fcOrderStatus: ["", Validators.required],
      fcSubStatus: [""],
      fcOrderNote: [""],
    });
  }

  get fbcNote() {
    return this.NoteGroup.get("fcNote");
  }

  get fbcNoteCategory() {
    return this.NoteGroup.get("fcNoteCategory");
  }

  get fbcSubStatus() {
    return this.NoteGroup.get("fcSubStatus");
  }
  get fbcOrderNote() {
    return this.NoteGroup.get("fcOrderNote");
  }

  get fbcOrderStatus() {
    return this.NoteGroup.get("fcOrderStatus");
  }
  selectedOrderReviewGroup: allOrders[] = []; //saurabh shelar
  isMarkIncomplete: boolean = false;
  isMarkComplete: boolean = false;
  isSendToBiotech: boolean = false;
  isUpdateMissingInfo: boolean = false;
  isFromSubmittedAndPrinted: boolean = false;
  buttonClicked: string = "";
  isDownloadAndSendToBT: boolean = false;
  selecteddocumentid: string; //saurabh shelar
  selectedWorkGroup: Workgroup[] = [];
  noteCalledFrom: enumFilterCallingpage;
  loadingNote: boolean = false;
  ngOnInit() {
    // $(document).ready(function() {
    //   $("#btnCancel, #btnSave").click(function() {
    //     $("#Ordernote, #undeferredModal, #deferredModal, #revieworders").modal(
    //       "hide"
    //     );
    //   });
    // });

    //, "#undeferredModal", "#deferredModal"

    // console.log("in ngOnInit note ");
    this.dataservice.NoteCalledFrom.subscribe((data) => {
      if (data != null) {
        this.noteCalledFrom = data;
      }
    });

    this.dataservice.NoteWorkItemCount.subscribe((data) => {
      this.SelectedWorkItemCount = data;
      // console.log(this.SelectedWorkItemCount);
    });
    this.dataservice.NoteTitle.subscribe((data) => {
      this.NoteTitle = data;
      // console.log(this.NoteTitle);
    });
    this.dataservice.ShowNoteCategory.subscribe((data) => {
      this.HideNoteCategory = data;
      if (this.HideNoteCategory) {
        this.getCategory();
      }
    });
    this.subscription.add(
      this.dataservice.ShowOrderStatus.subscribe((data) => {
        this.HideOrderStatus = data;
        if (
          this.noteCalledFrom &&
          !this.statusAlreadyCalled &&
          this.HideOrderStatus
        ) {
          switch (
            this.noteCalledFrom.toLowerCase()
            // case enumFilterCallingpage.MyReview:
            //   this.getOrderStatus("6");
            //   break;
            // case enumFilterCallingpage.OrderReview:
            //   this.getOrderStatus("4");
            //   break;
            // case enumFilterCallingpage.OrderAssistance:
            //   this.getOrderStatus("7");
            //   break;
            // case enumFilterCallingpage.OrderAssistanceWorkqueue:
            //   this.getOrderStatus("3");
            //   break;
            // case enumFilterCallingpage.OrderSearchOrder:
            //   this.getOrderStatus("-1");
            //   this.showTopSection = true;
            //   break;
            // case enumFilterCallingpage.OrderSearchMultiple:
            //   this.getOrderStatus("-2");
            //   this.showTopSection = true;
            //   break;
          ) {
          }
        }
      })
    );

    this.formValueChanged();
  }
  validate() {
    let isvalid: boolean = false;

    if (
      this.fbcNote.valid &&
      !this.clsUtility.CheckEmptyString(this.fbcNote.value) &&
      !this.isUpdateMissingInfo //added by harish on 19/12/2019
    ) {
      switch (this.noteCalledFrom) {
        case enumFilterCallingpage.WorkInventory:
          if (this.fbcNoteCategory.valid) {
            isvalid = true;
          }
          break;
        case enumFilterCallingpage.DeferWorkInventory:
          isvalid = true;
          break;
        case enumFilterCallingpage.OrderDetails: //saurabh shelar
          isvalid = true;
          break;
        case enumFilterCallingpage.OrderReview:
        case enumFilterCallingpage.OrderAssistance:
        case enumFilterCallingpage.MyReview:
        case enumFilterCallingpage.OrderAssistanceWorkqueue:
        case enumFilterCallingpage.SubmittedAndPrinted:
          if (
            (this.isMarkIncomplete ||
              this.isMarkComplete ||
              this.isSendToBiotech ||
              this.isDownloadAndSendToBT ||
              this.isFromSubmittedAndPrinted ||
              this.fbcOrderStatus.valid) &&
            this.fbcSubStatus.valid
          ) {
            isvalid = true;
          }
          break;
        case enumFilterCallingpage.OrderSearchOrder:
        case enumFilterCallingpage.UniversalUpdateOrderStatus:
          if (this.fbcOrderStatus.valid && this.fbcSubStatus.valid) {
            isvalid = true;
          } //saurabh shelar
          break;
        case enumFilterCallingpage.PracticeAssigned:
          if (this.fbcNote.valid) {
            isvalid = true;
          }
          break;
      }
      return isvalid;
    } else if (this.isUpdateMissingInfo) {
      return true;
    }
  }
  showIncompleteComponent: boolean;
  formValueChanged() {
    // try {
    //   // this.subscription.add
    //   this.fbcOrderStatus.valueChanges.subscribe((data: number) => {
    //     if (data != null || data != undefined) {
    //       if (data == 3) {
    //         this.showIncompleteComponent = true;
    //         this.dataservice.IncompleteOrderInfo.next(
    //           this.selectedOrderReviewGroup
    //         );
    //       } else {
    //         this.showIncompleteComponent = false;
    //         this.dataservice.IncompleteOrderInfo.next(null);
    //       }
    //     }
    //     // this.SelectedRSID = data;
    //   });
    // } catch (error) {
    //   this.clsUtility.LogError(error);
    // }
  }
  getCategory() {
    try {
      // this.ddlRuleCategory = this.ConfigurationService.getRuleCategory();
      this.subscription.add(
        this.ConfigurationService.getRuleCategory().subscribe((data) => {
          if (data != null || data != undefined) {
            this.ddlNoteCategory = data;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getOrderStatus(
    status: string,
    encountersource: string = "BIOTECH Encounter"
  ) {
    try {
      this.statusAlreadyCalled = true;
      this.loadingNote = true;
      this.subscription.add(
        this.coreops.OrderInventoryStatus(status, encountersource).subscribe(
          (data) => {
            // console.log("Master Data");
            // console.log(data);
            if (data != null || data != undefined) {
              // this.statusAlreadyCalled = false;
              // this.ddlOrderStatus.splice(0);
              this.sourceOrderStatus = data;
              this.ddlOrderStatus = data;
              this.loadingNote = false;
              // var comstatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 2
              // );
              // this.ddlOrderStatus.push(comstatus);
              // var nastatus = this.sourceOrderStatus.find(
              //   x => x.statuscode == 3
              // );
              // this.ddlOrderStatus.push(nastatus);

              // if (
              //   enumFilterCallingpage.OrderAssistance != this.noteCalledFrom
              // ) {
              //   var asstancestatus = this.sourceOrderStatus.find(
              //     x => x.statuscode == 7
              //   );
              //   this.ddlOrderStatus.push(asstancestatus);
              // }

              // this.orderStatus = this.sourceOrderStatus.slice();
            }
          },
          (error) => {
            this.clsUtility.showError(error);
            this.loadingNote = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  async onOkClick() {
    try {
      // this.ddlRuleCategory = this.ConfigurationService.getRuleCategory();
      $("#Ordernote, #undeferredModal, #deferredModal").modal("hide");
      // , #revieworders
      let currentDateTime = this.clsUtility.currentDateTime();
      let SelectedUserid = "0";
      let LoginUsername = null;
      let LoginUserid = null;
      var accessionnumbers: string = this.selectedOrderReviewGroup
        .map((ele) => ele.orderqueuegroupcode)
        .join(";");

      switch (this.noteCalledFrom) {
        case enumFilterCallingpage.WorkInventory:
          var deferworkitems = new DeferUndefer();

          // let currentDateTime = this.clsUtility.currentDateTime();
          // let SelectedUserid = "0";
          // let LoginUsername = null;
          if (this.dataservice.SelectedGCPUserid != undefined)
            SelectedUserid = String(this.dataservice.SelectedGCPUserid);
          const InputWorkGroup: Workgroup[] = [];
          if (this.dataservice.loginUserName != undefined)
            LoginUsername = this.dataservice.loginUserName;
          // clsRule.userid = SelectedUserid;
          //   clsRule.susername = LoginUsername;
          //   clsRule.createdon = currentDateTime;
          //   clsRule.modifiedon = currentDateTime;
          for (const workgroup of this.selectedWorkGroup) {
            // console.log("workgroup" + JSON.stringify(workgroup));
            const currentworkgroup = new Workgroup();
            currentworkgroup.nworkqueuegroupid = workgroup.nworkqueuegroupid;
            currentworkgroup.sworkqueuegroupcode =
              workgroup.sworkqueuegroupcode;
            InputWorkGroup.push(currentworkgroup);
          }

          deferworkitems.createdon = currentDateTime;
          deferworkitems.modifiedon = currentDateTime;
          deferworkitems.nuserid = SelectedUserid;
          deferworkitems.dtdate = currentDateTime;
          deferworkitems.sdusername = LoginUsername;
          deferworkitems.sdefercategory = String(this.fbcNoteCategory.value);
          deferworkitems.snote = this.fbcNote.value;
          deferworkitems.nworkqueuegroupid = InputWorkGroup;
          deferworkitems.callfor = 1;
          // deferworkitems.defertype="Manual"
          // console.log(deferworkitems);

          break;

        case enumFilterCallingpage.DeferWorkInventory:
          var deferworkitems = new DeferUndefer();
          const UndeferInputWorkGroup: Workgroup[] = [];

          if (this.dataservice.SelectedGCPUserid != undefined)
            SelectedUserid = String(this.dataservice.SelectedGCPUserid);

          if (this.dataservice.loginUserName != undefined)
            LoginUsername = this.dataservice.loginUserName;
          // clsRule.userid = SelectedUserid;
          //   clsRule.susername = LoginUsername;
          //   clsRule.createdon = currentDateTime;
          //   clsRule.modifiedon = currentDateTime;
          for (const workgroup of this.selectedWorkGroup) {
            // console.log("workgroup" + JSON.stringify(workgroup));
            const currentworkgroup = new Workgroup();
            currentworkgroup.nworkqueuegroupid = workgroup.nworkqueuegroupid;
            currentworkgroup.sworkqueuegroupcode =
              workgroup.sworkqueuegroupcode;
            UndeferInputWorkGroup.push(currentworkgroup);
          }

          deferworkitems.createdon = currentDateTime;
          deferworkitems.modifiedon = currentDateTime;
          deferworkitems.nuserid = SelectedUserid;
          deferworkitems.dtdate = currentDateTime;
          deferworkitems.sdusername = LoginUsername;
          deferworkitems.sdefercategory = String(this.fbcNoteCategory.value);
          deferworkitems.snote = this.fbcNote.value;
          deferworkitems.nworkqueuegroupid = UndeferInputWorkGroup;
          deferworkitems.callfor = 2;
          // deferworkitems.defertype="Manual"
          // console.log(deferworkitems);

          break;

        case enumFilterCallingpage.OrderDetails:
          // createdby: string;
          // createdbyfirstname: string;
          // createdbylastname: string;
          // createdbyusername: string;
          // createdon: string;
          // docid: string;
          // note: string;
          // noteid: string;
          // notestatus: boolean;
          // notetype: 0;
          // pagenumber: 0;
          var ordernote = new OrderNote();
          if (this.dataservice.loginUserName != undefined)
            LoginUsername = this.dataservice.loginUserName;
          var splitted = LoginUsername.split(" ", 2);
          ordernote.createdbyfirstname = splitted[0];
          ordernote.createdbylastname = splitted[1];
          ordernote.docid = this.selecteddocumentid;
          ordernote.createdon = currentDateTime;
          ordernote.note = this.fbcNote.value;
          this.subscription.add(
            this.dataservice.loginUserID.subscribe((loginID) => {
              ordernote.createdby = String(loginID);
            })
          );
          // orderdetails.createdby = LoginUserid;
          ordernote.createdbyusername = LoginUsername;
          // orderdetails.noteid = " ";
          ordernote.notestatus = true;
          ordernote.notetype = 0;
          ordernote.pagenumber = 0;

          break; //saurabh shelar

        case enumFilterCallingpage.OrderReview:
        case enumFilterCallingpage.OrderAssistance:
        case enumFilterCallingpage.MyReview:
        case enumFilterCallingpage.OrderAssistanceWorkqueue:
          var orderreviewdetails = new OrderReviewDetails();
          for (const order of this.selectedOrderReviewGroup) {
            var reviewObj = new ReviewObj();
            reviewObj.orderqueuegroupid = order.orderqueuegroupid;
            reviewObj.claimreferencenumber = order.claimreferencenumber;
            reviewObj.currentStatus = order.nstatus;
            orderreviewdetails.reviewObj.push(reviewObj);
          }
          // this.subscription.add(
          //   this.dataservice.loginUserID.subscribe(loginID => {
          //     orderreviewdetails.assignedto = String(loginID);
          //   })
          // );
          orderreviewdetails.assignedto = this.dataservice.loginGCPUserID.getValue(); //to get alphaneumeric value
          if (this.dataservice.loginUserName != undefined)
            LoginUsername = this.dataservice.loginUserName;
          orderreviewdetails.assignedtoname = LoginUsername;
          orderreviewdetails.modifiedon = currentDateTime;
          ///////////////////////////////
          orderreviewdetails.nstatus = this.fbcOrderStatus.value; //new change
          //////////////////////////////
          orderreviewdetails.ordernote = this.fbcNote.value;
          if (this.fbcSubStatus.value) {
            orderreviewdetails.ordersubstatus = this.fbcSubStatus.value;
            let objOrderSubStatus = this.orderSubStatus.find(
              (ele) => ele.substatusid == this.fbcSubStatus.value
            );
            orderreviewdetails.ordersubstatusname =
              objOrderSubStatus.substatusname;
          } else {
            orderreviewdetails.ordersubstatus = "";
            orderreviewdetails.ordersubstatusname = "";
          }
          // console.log(orderreviewdetails);
          // if (enumFilterCallingpage.OrderAssistance == this.noteCalledFrom) {
          //   orderreviewdetails.incompleteorderinfo = this.IncompleteOrderAction.SaveIncompleteOrderActionDetails();
          // } else {
          //   orderreviewdetails.incompleteorderinfo = "";
          // }
          if (this.isMarkIncomplete) {
            orderreviewdetails.nstatus = 3;
            orderreviewdetails.incompleteorderinfo = this.IncompleteOrderAction.SaveIncompleteOrderActionDetails();
          } else if (this.isUpdateMissingInfo) {
            var updatedInfoJson: {
              incompleteorderinfo: {};
              modifiedon: string;
              orderqueuegroupid: string;
            } = {
              incompleteorderinfo: this.IncompleteOrderAction.SaveIncompleteOrderActionDetails(),
              modifiedon: this.clsUtility.currentDateTime(),
              orderqueuegroupid: reviewObj.orderqueuegroupid,
            };
          } else {
            if (this.isMarkComplete) {
              //for my-review
              orderreviewdetails.nstatus = 2;
            } else if (this.isSendToBiotech) {
              orderreviewdetails.nstatus = 8;
            }
            orderreviewdetails.incompleteorderinfo = null;
          }

          break;

        case enumFilterCallingpage.OrderSearchOrder:
        case enumFilterCallingpage.UniversalUpdateOrderStatus:
        case enumFilterCallingpage.SubmittedAndPrinted:
          var jsonArray: OrderSearchStatusModel[] = [];
          for (let i = 0; i < this.selectedOrderReviewGroup.length; i++) {
            var json = new OrderSearchStatusModel();
            json.currentStatus = this.selectedOrderReviewGroup[i].nstatus;
            json.orderqueuegroupid = this.selectedOrderReviewGroup[
              i
            ].orderqueuegroupid;
            json.assignedto = this.dataservice.loginGCPUserID.getValue(); //to get alphaneumeric value
            if (this.dataservice.loginUserName != undefined)
              LoginUsername = this.dataservice.loginUserName;
            json.assignedtoname = LoginUsername;
            json.modifiedon = currentDateTime;
            json.nstatus = this.fbcOrderStatus.value;
            if (this.fbcSubStatus.value) {
              json.ordersubstatus = this.fbcSubStatus.value;
              let objOrderSubStatus = this.orderSubStatus.find(
                (ele) => ele.substatusid == this.fbcSubStatus.value
              );
              json.ordersubstatusname = objOrderSubStatus.substatusname;
            } else {
              json.ordersubstatus = "";
              json.ordersubstatusname = "";
            }
            if (json.nstatus == 3) {
              json.incompleteorderinfo = this.IncompleteOrderAction.SaveIncompleteOrderActionDetails();
            } else {
              if (this.isFromSubmittedAndPrinted) {
                switch (this.buttonClicked.toLowerCase()) {
                  case "finishedandreturned":
                    json.nstatus = 11;
                    break;
                  case "failedandreturned":
                    json.nstatus = 12;
                    break;
                  case "returnedwithoutworking":
                    json.nstatus = 13;
                    break;
                  case "returnedtoreadyforprinting":
                    json.nstatus = 8;
                    break;
                }
              }
              json.incompleteorderinfo = null;
            }
            json.ordernote = this.fbcNote.value;
            jsonArray.push(json);
          }
          break;
        case enumFilterCallingpage.PracticeAssigned:
          var orderreleasedetails = new OrderReleaseDetails();
          for (const order of this.selectedOrderReviewGroup) {
            let reviewObject = new ReleaseObj();
            reviewObject.orderqueuegroupid = order.orderqueuegroupid;
            reviewObject.claimreferencenumber = order.claimreferencenumber;
            orderreleasedetails.reviewObj.push(reviewObject);
          }

          orderreleasedetails.assignedto = this.dataservice.loginGCPUserID.getValue(); //to get alphaneumeric value
          if (this.dataservice.loginUserName != undefined)
            LoginUsername = this.dataservice.loginUserName;
          orderreleasedetails.assignedtoname = LoginUsername;
          orderreleasedetails.modifiedon = currentDateTime;
          orderreleasedetails.nstatus = 3; //send to incomplete
          orderreleasedetails.ordernote =
            "Note: " +
            this.fbcNote.value +
            ". Released by: " +
            LoginUsername +
            " on " +
            moment(currentDateTime).format("MM-DD-YYYY hh:mm:ss A");
          // console.log(orderreleasedetails);
          this.loadingNote = true;

          this.subscription.add(
            this.coreops.releaseOrderAssignment(orderreleasedetails).subscribe(
              (data) => {
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    "Encounter assignment released successfully"
                  );
                  this.writeLog(
                    "Practice Assigned: Encounter assignment released successfully.",
                    "UPDATE",
                    accessionnumbers,
                    "SUCCESS"
                  );
                  this.dataservice.OrderUpdateDone.next(true);
                  $("#releaseAssignmentModal").modal("hide");
                } else if (data == 2) {
                  this.clsUtility.showInfo(
                    "Encounter(s) skipped for release assignment due to status mismatch."
                  );

                  this.writeLog(
                    "Practice Assigned: Encounter(s) skipped for release assignment due to status mismatch.",
                    "UPDATE",
                    accessionnumbers,
                    "SKIPPED"
                  );
                  this.dataservice.OrderUpdateDone.next(true);
                  $("#releaseAssignmentModal").modal("hide");
                } else {
                  this.clsUtility.showError(
                    "Failed to release encounter assignment"
                  );
                  this.writeLog(
                    "Practice Assigned: Failed to release encounter assignment.",
                    "UPDATE",
                    accessionnumbers,
                    "ERROR"
                  );
                  this.dataservice.OrderUpdateDone.next(false);
                }
                this.loadingNote = false;
              },
              (error) => {
                this.loadingNote = false;
              }
            )
          );
          break;
      }
      switch (this.noteCalledFrom) {
        case enumFilterCallingpage.WorkInventory:
        case enumFilterCallingpage.DeferWorkInventory:
          this.subscription.add(
            this.CoreService.saveDeferAndUndeferTask(deferworkitems).subscribe(
              (data) => {
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    this.noteCalledFrom == enumFilterCallingpage.WorkInventory
                      ? "Selected workitem(s) marked as defer"
                      : "Selected workitem(s) marked as undefer"
                  );
                  this.dataservice.isTaskAssignmentDone = true;
                  this.noteCalledFrom == enumFilterCallingpage.WorkInventory
                    ? this.dataservice.DeferWorkqueueDone.next(true)
                    : this.dataservice.UndeferWorkqueueDone.next(true);
                  // this.TaskAssingmentDone(true);
                  // this.TaskAssigned.emit(true);
                } else {
                  this.clsUtility.showError(
                    this.noteCalledFrom == enumFilterCallingpage.WorkInventory
                      ? "Error while marking workitem(s) as defer"
                      : "Error while marking workitem(s) as undefer"
                  );
                  this.noteCalledFrom == enumFilterCallingpage.WorkInventory
                    ? this.dataservice.DeferWorkqueueDone.next(false)
                    : this.dataservice.UndeferWorkqueueDone.next(false);
                  this.dataservice.isTaskAssignmentDone = false;
                  // this.TaskAssingmentDone(false);
                  // this.TaskAssigned.emit(false);
                }
              }
            )
          );
          break;

        case enumFilterCallingpage.OrderDetails:
          ///////////////////////

          // console.log(ordernote);
          // console.log(JSON.stringify(orderdetails));

          this.subscription.add(
            this.coreops.SaveNote(ordernote).subscribe((data) => {
              if (data == 1) {
                this.boolok.emit(true);
                this.clsUtility.showSuccess(
                  "Note added to respective document"
                );
                this.dataservice.OrderDetailsDone.next(true);
              } else {
                this.clsUtility.showError(
                  "Error while adding Note to the document"
                );
                this.dataservice.OrderDetailsDone.next(false);
              }
            })
          );

          break;
        case enumFilterCallingpage.OrderReview:
        case enumFilterCallingpage.OrderAssistance:
          // case enumFilterCallingpage.MyReview:
          // console.log(orderreviewdetails);
          // console.log(JSON.stringify(orderdetails));
          this.loadingNote = true;
          this.subscription.add(
            this.coreops.UpdateOrderReview(orderreviewdetails).subscribe(
              (data) => {
                if (data == 1) {
                  if (
                    enumFilterCallingpage.OrderReview == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showSuccess(
                      "Encounter status updated successfully"
                    );
                    this.writeLog(
                      "Encounter Review: Encounter status updated successfully.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  } else if (
                    enumFilterCallingpage.MyReview == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showSuccess(
                      "Encounter status updated successfully"
                    );
                    this.writeLog(
                      "My Review: Encounter status updated successfully.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  } else if (
                    enumFilterCallingpage.OrderAssistance == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showSuccess(
                      "Encounter status updated successfully"
                    );
                    this.writeLog(
                      "Assistance: Encounter status updated successfully.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                    this.dataservice.OrderAssistanceDone.next(true);
                  }
                } else if (data == 2) {
                  if (
                    enumFilterCallingpage.OrderReview == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showInfo(
                      "Encounter status already updated"
                    );
                    this.writeLog(
                      "Encounter Review: Encounter status already updated.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  } else if (
                    enumFilterCallingpage.MyReview == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showInfo(
                      "Encounter status already updated"
                    );
                    this.writeLog(
                      "My Review: Encounter status already updated.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  } else if (
                    enumFilterCallingpage.OrderAssistance == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showInfo(
                      "Encounter status already updated"
                    );
                    this.writeLog(
                      "Assistance: Encounter status already updated.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                    this.dataservice.OrderAssistanceDone.next(true);
                  }
                  // this.clsUtility.showError("Encounter status already updated");
                  // this.dataservice.OrderReviewDone.next(true);
                } else {
                  if (
                    enumFilterCallingpage.OrderReview == this.noteCalledFrom
                  ) {
                    this.clsUtility.showError(
                      "Failed to update encounter status"
                    );
                    this.dataservice.OrderReviewDone.next(false);
                    this.writeLog(
                      "Encounter Review: Failed to update encounter status.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (
                    enumFilterCallingpage.MyReview == this.noteCalledFrom
                  ) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showError(
                      "Failed to update encounter status"
                    );
                    this.writeLog(
                      "My Review: Failed to update encounter status.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  } else if (
                    enumFilterCallingpage.OrderAssistance == this.noteCalledFrom
                  ) {
                    this.clsUtility.showError(
                      "Failed to update encounter status"
                    );
                    this.dataservice.OrderAssistanceDone.next(false);
                    this.writeLog(
                      "Assistance: Failed to update encounter status.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                    //   this.refreshgrid.emit(true);
                    //   this.clsUtility.showInfo("Order status already updated");
                    //   this.writeLog("Assistance: Order status already updated.", "UPDATE");
                    // this.dataservice.orderAssignmentDone.next(true);
                  }
                }
                $("#noteModalReview").modal("hide");
                this.loadingNote = false;
              },
              (error) => {
                this.loadingNote = false;
                this.clsUtility.LogError(error);
              }
            )
          );

          break;

        case enumFilterCallingpage.MyReview:
          // console.log(orderreviewdetails);
          // console.log(JSON.stringify(orderdetails));
          this.loadingNote = true;
          this.subscription.add(
            this.coreops.UpdateMyOrderReview(orderreviewdetails).subscribe(
              (data) => {
                if (data == 1) {
                  if (enumFilterCallingpage.MyReview == this.noteCalledFrom) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showSuccess(
                      "Encounter status updated successfully"
                    );
                    this.writeLog(
                      "My Review: Encounter status updated successfully.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  }
                } else if (data == 2) {
                  if (enumFilterCallingpage.MyReview == this.noteCalledFrom) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showInfo(
                      "Encounter status already updated"
                    );
                    this.writeLog(
                      "My Review: Encounter status already updated.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  }
                  // this.clsUtility.showError("Order status already updated");
                  // this.dataservice.OrderReviewDone.next(true);
                } else {
                  if (enumFilterCallingpage.MyReview == this.noteCalledFrom) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showError(
                      "Failed to update encounter status"
                    );
                    this.writeLog(
                      "My Review: Failed to update encounter status.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                    this.dataservice.OrderReviewDone.next(true);
                  }
                }
                $("#revieworders").modal("hide");
                this.loadingNote = false;
              },
              (error) => {
                this.loadingNote = false;
              }
            )
          );

          break;

        case enumFilterCallingpage.OrderAssistanceWorkqueue:
          if (this.isSendToBiotech) {
            var isMultiple: boolean = false;
            this.percentage = 0;
            this.cdr.detectChanges();
            if (this.selectedOrderReviewGroup.length > 1) {
              isMultiple = true;
              this.isPercentLoader = true;
              this.cdr.detectChanges();
            } else {
              this.loadingNote = true;
            }

            var percentIncrease = 100 / this.selectedOrderReviewGroup.length;
            this.countObj = new CountModel();
            this.statusArray = new Array<StatusReportModel>();
            for (let i = 0; i < orderreviewdetails.reviewObj.length; i++) {
              let accessionnumber = this.selectedOrderReviewGroup[i]
                .orderqueuegroupcode;
              if (!this.selectedOrderReviewGroup[i].incompleteorderinfo) {
                if (isMultiple) {
                  let orderstatus = new StatusReportModel();
                  orderstatus.currentStatus = this.selectedOrderReviewGroup[
                    i
                  ].status;
                  orderstatus.updatedStatus = "-";
                  orderstatus.accessionNo = accessionnumber;
                  orderstatus.status = 1;
                  orderstatus.description =
                    "Missing information not available.";
                  this.countObj.skipped++;
                  this.statusArray.push(orderstatus);
                  this.percentage = this.percentage + percentIncrease;
                } else {
                  this.clsUtility.showWarning(
                    "Missing information not available."
                  );
                }
                continue;
              }

              /////////////////////////////////////////

              this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
              this.IncompleteOrderAction.IncompleteOrderInfo = this.selectedOrderReviewGroup[
                i
              ].incompleteorderinfo;
              this.IncompleteOrderAction.isReadonlyCoverpage = true;
              this.IncompleteOrderAction.SetIncompleteOrderGrid();
              if (!this.IncompleteOrderAction.cdr["destroyed"]) {
                this.IncompleteOrderAction.cdr.detectChanges();
              }
              // console.log(this.OrderSelected);
              let body: UploadMissingInfoModel = new UploadMissingInfoModel();
              let covername =
                this.selectedOrderReviewGroup[i].orderqueuegroupcode +
                "-000-Cover.pdf";
              body.documentname = covername;
              body.category = this.selectedOrderReviewGroup[
                i
              ].orderqueuegroupcode;
              body.orderqueueid = this.selectedOrderReviewGroup[
                i
              ].orderqueuegroupid;
              body.subcategory = this.selectedOrderReviewGroup[i].ordercategory;
              body.sourcetype = "Qonductor";
              body.cabinet = this.selectedOrderReviewGroup[i].orderyear;
              body.folder = this.selectedOrderReviewGroup[i].orderday;
              body.externalcategoryid = "";
              body.createdon = this.clsUtility.currentDateTime();
              body.modifiedon = this.clsUtility.currentDateTime();
              body.actionfrom = "Incomplete";
              let base64data: any;
              await this.IncompleteOrderAction.exportGrids(covername).then(
                async (data) => {
                  base64data = await this.clsUtility.blobToBytes(data);
                  body.data = base64data;
                  // console.log(body);
                  let res = await this.uploadCall(body);
                  // console.log(res);
                  if (res == 1) {
                    // this.refreshgrid.emit(true);
                    let inputSendToBiotech: OrderReviewDetails = new OrderReviewDetails();
                    inputSendToBiotech.reviewObj.push(
                      orderreviewdetails.reviewObj[i]
                    );
                    inputSendToBiotech.assignedto =
                      orderreviewdetails.assignedto;
                    inputSendToBiotech.assignedtoname =
                      orderreviewdetails.assignedtoname;
                    inputSendToBiotech.nstatus = orderreviewdetails.nstatus;
                    inputSendToBiotech.modifiedon =
                      orderreviewdetails.modifiedon;
                    inputSendToBiotech.ordernote = orderreviewdetails.ordernote;
                    inputSendToBiotech.incompleteorderinfo =
                      orderreviewdetails.incompleteorderinfo;
                    inputSendToBiotech.ordersubstatus =
                      orderreviewdetails.ordersubstatus;
                    inputSendToBiotech.ordersubstatusname =
                      orderreviewdetails.ordersubstatusname;
                    // this.subscription.add(
                    await this.coreops
                      .SendToBiotech(inputSendToBiotech)
                      .toPromise()
                      .then(async (data) => {
                        if (data) {
                          if (data == 1) {
                            if (isMultiple) {
                              let orderstatus = new StatusReportModel();
                              orderstatus.accessionNo = accessionnumber;
                              orderstatus.status = 2;
                              orderstatus.description =
                                "Missing information uploaded and Encounter status updated successfully.";
                              this.countObj.success++;
                              this.statusArray.push(orderstatus);
                              this.percentage =
                                this.percentage + percentIncrease;
                              this.cdr.detectChanges();
                            } else {
                              this.clsUtility.showSuccess(
                                "Missing information uploaded and Encounter status updated successfully."
                              );
                              this.writeLog(
                                "Incomplete Encounters: Missing information uploaded and Encounter status updated successfully.",
                                "UPDATE",
                                accessionnumbers,
                                "SUCCESS"
                              );
                              this.dataservice.IncompleteDone.next(true);
                            }
                          } else if (data == 2) {
                            if (isMultiple) {
                              let orderstatus = new StatusReportModel();
                              orderstatus.accessionNo = accessionnumber;
                              orderstatus.status = 1;
                              orderstatus.description =
                                "Encounter status already updated.";
                              this.countObj.skipped++;
                              this.statusArray.push(orderstatus);
                              this.percentage =
                                this.percentage + percentIncrease;
                              this.cdr.detectChanges();
                            } else {
                              if (
                                enumFilterCallingpage.OrderAssistanceWorkqueue ==
                                this.noteCalledFrom
                              ) {
                                this.refreshgrid.emit(true);
                                this.clsUtility.showInfo(
                                  "Encounter status already updated"
                                );
                                this.writeLog(
                                  "Incomplete Encounters: Encounter status already updated.",
                                  "UPDATE",
                                  accessionnumbers,
                                  "FAILED"
                                );
                                this.dataservice.IncompleteDone.next(true);
                              }
                            }
                            // this.clsUtility.showError("Encounter status already updated");
                            // this.dataservice.IncompleteDone.next(true);
                          } else {
                            if (isMultiple) {
                              let orderstatus = new StatusReportModel();
                              orderstatus.accessionNo = accessionnumber;
                              orderstatus.status = 0;
                              orderstatus.description =
                                "Failed to update encounter status.";
                              this.countObj.error++;
                              this.statusArray.push(orderstatus);
                              this.percentage =
                                this.percentage + percentIncrease;
                              this.cdr.detectChanges();
                            } else {
                              this.clsUtility.showError(
                                "Failed to update encounter status"
                              );
                              this.writeLog(
                                "Incomplete Encounters: Failed to update encounter status.",
                                "UPDATE",
                                accessionnumbers,
                                "ERROR"
                              );
                              this.dataservice.IncompleteDone.next(false);
                            }
                          }
                        } else {
                          if (isMultiple) {
                            let orderstatus = new StatusReportModel();
                            orderstatus.accessionNo = accessionnumber;
                            orderstatus.status = 0;
                            orderstatus.description =
                              "Failed to update encounter status.";
                            this.countObj.error++;
                            this.statusArray.push(orderstatus);
                            this.percentage = this.percentage + percentIncrease;
                            this.cdr.detectChanges();
                          } else {
                            this.clsUtility.showError(
                              "Failed to update encounter status"
                            );
                            this.writeLog(
                              "Incomplete Encounters: Failed to update encounter status.",
                              "UPDATE",
                              accessionnumbers,
                              "ERROR"
                            );
                            this.dataservice.IncompleteDone.next(false);
                          }
                        }
                      });
                  } else {
                    if (isMultiple) {
                      let orderstatus = new StatusReportModel();
                      orderstatus.accessionNo = accessionnumber;
                      orderstatus.status = 1;
                      orderstatus.description =
                        "Missing information not uploaded hence Encounter status is not updated.";
                      this.countObj.skipped++;
                      this.statusArray.push(orderstatus);
                      this.percentage = this.percentage + percentIncrease;
                      this.cdr.detectChanges();
                    } else {
                      this.clsUtility.showWarning(
                        "Missing information not uploaded hence Encounter status is not updated."
                      );
                      this.writeLog(
                        "Incomplete Encounters: Missing information not uploaded hence Encounter status is not updated.",
                        "UPDATE",
                        accessionnumbers,
                        "ERROR"
                      );
                      this.dataservice.IncompleteDone.next(true);
                    }
                  }
                }
              );

              ////////////////////////////////////////

              // );
            }
            this.cdr.detectChanges();
            if (isMultiple) {
              setTimeout(() => {
                this.isPercentLoader = false;
                this.percentage = 0;
                $("#updateStatusModal").modal("hide");
                this.cdr.detectChanges();
                this.countObj.total = this.statusArray.length;
                // this.OrderStatusloadItems();
                this.dataservice.IncompleteDone.next(true);
                this.dataservice.statusReportData.next({
                  countObj: this.countObj,
                  orderStatusData: this.statusArray,
                });
                $("#orderStatusReport").modal("show");
              }, 3000);
            } else {
              $("#updateStatusModal").modal("hide");
              this.loadingNote = false;
            }
            // this.refreshgrid.emit(true);
            // this.clsUtility.showSuccess(
            //   "Order status updated and missing information uploaded successfully."
            // );
            // this.writeLog(
            //   "Incomplete Encounters: Order status updated and missing information uploaded successfully.",
            //   "UPDATE"
            // );
            // this.dataservice.IncompleteDone.next(true);
          } else if (this.isUpdateMissingInfo) {
            this.subscription.add(
              this.coreops
                .UpdateMissingInfo(updatedInfoJson)
                .subscribe((data) => {
                  if (data == 1) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showSuccess(
                      "Missing information updated successfully"
                    );
                    this.writeLog(
                      "Incomplete Encounters: Missing information updated successfully.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                    this.dataservice.IncompleteDone.next(true);
                  } else if (data == 2) {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showInfo(
                      "Encounter status already updated"
                    );
                    this.writeLog(
                      "Incomplete Encounters: Encounter status already updated.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                    this.dataservice.IncompleteDone.next(true);
                  } else {
                    this.refreshgrid.emit(true);
                    this.clsUtility.showError(
                      "Failed to update missing information"
                    );
                    this.writeLog(
                      "Incomplete Encounters: Failed to update missing information.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                    this.dataservice.IncompleteDone.next(false);
                  }
                  $("#updateStatusModal").modal("hide");
                })
            );
          } else if (this.isDownloadAndSendToBT) {
            let ordersubstatus = "";
            let ordersubstatusname = "";
            if (this.fbcSubStatus.value) {
              ordersubstatus = this.fbcSubStatus.value;
              let objOrderSubStatus = this.orderSubStatus.find(
                (ele) => ele.substatusid == this.fbcSubStatus.value
              );
              ordersubstatusname = objOrderSubStatus.substatusname;
            } else {
              ordersubstatus = "";
              ordersubstatusname = "";
            }
            let sendToBiotechJson: SendToBiotechModel = new SendToBiotechModel();
            sendToBiotechJson.ordernote = this.fbcNote.value;
            sendToBiotechJson.ordersubstatus = ordersubstatus;
            sendToBiotechJson.ordersubstatusname = ordersubstatusname;
            this.dataservice.sendToBiotechJson.next(sendToBiotechJson);
            $("#updateStatusModal").modal("hide");
          }

          break;

        case enumFilterCallingpage.OrderSearchOrder:
        case enumFilterCallingpage.UniversalUpdateOrderStatus:
          var isMultiple: boolean = false;
          this.percentage = 0;
          this.cdr.detectChanges();
          if (this.selectedOrderReviewGroup.length > 1) {
            isMultiple = true;
            this.isPercentLoader = true;
            this.cdr.detectChanges();
          } else {
            this.loadingNote = true;
          }

          var percentIncrease = 100 / this.selectedOrderReviewGroup.length;
          this.countObj = new CountModel();
          this.statusArray = new Array<StatusReportModel>();
          for (let i = 0; i < jsonArray.length; i++) {
            let accessionnumber = this.selectedOrderReviewGroup[i]
              .orderqueuegroupcode;
            if (
              jsonArray[i].currentStatus == 2 ||
              jsonArray[i].currentStatus == 3 ||
              jsonArray[i].currentStatus == 4 ||
              jsonArray[i].currentStatus == 5 ||
              jsonArray[i].currentStatus == 7 ||
              jsonArray[i].currentStatus == 8 ||
              // jsonArray[i].currentStatus == 9 ||
              jsonArray[i].currentStatus == 10 ||
              jsonArray[i].currentStatus == 11 ||
              jsonArray[i].currentStatus == 12 ||
              jsonArray[i].currentStatus == 13
            ) {
              if (jsonArray[i].nstatus == 8) {
                //if missing info not available then skipped
                if (!this.selectedOrderReviewGroup[i].incompleteorderinfo) {
                  if (isMultiple) {
                    let orderstatus = new StatusReportModel();
                    orderstatus.currentStatus = this.selectedOrderReviewGroup[
                      i
                    ].status;
                    orderstatus.updatedStatus = "-";
                    orderstatus.accessionNo = accessionnumber;
                    orderstatus.status = 1;
                    orderstatus.description =
                      "Missing information not available.";
                    this.countObj.skipped++;
                    this.statusArray.push(orderstatus);
                    this.percentage = this.percentage + percentIncrease;
                  } else {
                    this.clsUtility.showWarning(
                      "Missing information not available."
                    );
                    if (
                      enumFilterCallingpage.OrderSearchOrder ==
                      this.noteCalledFrom
                    ) {
                      this.dataservice.OrderUpdateDone.next(true);
                    }
                  }
                  continue;
                }
              }
              this.accessionInProgress = accessionnumber + " in progress";

              ////////////////////////////////////////////////////////////////

              if (jsonArray[i].nstatus == 8) {
                this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
                this.IncompleteOrderAction.IncompleteOrderInfo = this.selectedOrderReviewGroup[
                  i
                ].incompleteorderinfo;
                this.IncompleteOrderAction.isReadonlyCoverpage = true;
                this.IncompleteOrderAction.SetIncompleteOrderGrid();
                if (!this.IncompleteOrderAction.cdr["destroyed"]) {
                  this.IncompleteOrderAction.cdr.detectChanges();
                }
                // console.log(this.OrderSelected);
                let body: UploadMissingInfoModel = new UploadMissingInfoModel();
                let covername =
                  this.selectedOrderReviewGroup[i].orderqueuegroupcode +
                  "-000-Cover.pdf";
                body.documentname = covername;
                body.category = this.selectedOrderReviewGroup[
                  i
                ].orderqueuegroupcode;
                body.orderqueueid = this.selectedOrderReviewGroup[
                  i
                ].orderqueuegroupid;
                body.subcategory = this.selectedOrderReviewGroup[
                  i
                ].ordercategory;
                body.sourcetype = "Qonductor";
                body.cabinet = this.selectedOrderReviewGroup[i].orderyear;
                body.folder = this.selectedOrderReviewGroup[i].orderday;
                body.externalcategoryid = "";
                body.createdon = this.clsUtility.currentDateTime();
                body.modifiedon = this.clsUtility.currentDateTime();
                let base64data: any;
                await this.IncompleteOrderAction.exportGrids(covername).then(
                  async (data) => {
                    // var reader = new FileReader();
                    // reader.readAsDataURL(data);
                    // let thisvar = this;
                    // reader.onloadend = function() {
                    //   base64data = reader.result;
                    //   base64data = base64data.replace("data:application/pdf;base64,", "");
                    //   body.data = base64data;
                    //   console.log(body);
                    //   thisvar.uploadCall(body);
                    // };
                    base64data = await this.clsUtility.blobToBytes(data);
                    body.data = base64data;
                    body.actionfrom = "UniversalUpdateStatus";
                    // console.log(body);
                    let res = await this.uploadCall(body);
                    // console.log(res);
                    if (res == 1) {
                      await this.coreops
                        .UpdateOrderSearchStatus(jsonArray[i])
                        .toPromise()
                        .then(async (data) => {
                          if (data == 1) {
                            if (isMultiple) {
                              this.percentage =
                                this.percentage + percentIncrease;
                              this.cdr.detectChanges();
                              let orderstatus = new StatusReportModel();
                              orderstatus.currentStatus = this.selectedOrderReviewGroup[
                                i
                              ].status;
                              orderstatus.updatedStatus = this.statusname;
                              orderstatus.accessionNo = accessionnumber;
                              orderstatus.status = 2;
                              orderstatus.description =
                                "Missing information uploaded and " +
                                this.title +
                                " status updated successfully.";
                              this.countObj.success++;
                              this.statusArray.push(orderstatus);
                            } else {
                              this.clsUtility.showSuccess(
                                "Missing information uploaded and " +
                                  this.title +
                                  " status updated successfully."
                              );
                            }
                          } else if (data == 2) {
                            if (
                              enumFilterCallingpage.OrderSearchOrder ==
                                this.noteCalledFrom ||
                              enumFilterCallingpage.UniversalUpdateOrderStatus ==
                                this.noteCalledFrom
                            ) {
                              // this.refreshgrid.emit(true);
                              if (isMultiple) {
                                this.percentage =
                                  this.percentage + percentIncrease;
                                this.cdr.detectChanges();
                                let orderstatus = new StatusReportModel();
                                orderstatus.currentStatus = this.selectedOrderReviewGroup[
                                  i
                                ].status;
                                orderstatus.updatedStatus = "-";
                                orderstatus.accessionNo = accessionnumber;
                                orderstatus.status = 1;
                                orderstatus.description =
                                  this.title + " status already updated.";
                                this.countObj.skipped++;
                                this.statusArray.push(orderstatus);
                              } else {
                                this.clsUtility.showInfo(
                                  this.title + " status already updated"
                                );
                                if (
                                  enumFilterCallingpage.OrderSearchOrder ==
                                  this.noteCalledFrom
                                ) {
                                  this.writeLog(
                                    this.title +
                                      " Search: " +
                                      this.title +
                                      " status already updated.",
                                    "UPDATE",
                                    accessionnumbers,
                                    "FAILED"
                                  );
                                  this.dataservice.OrderUpdateDone.next(true);
                                } else if (
                                  enumFilterCallingpage.UniversalUpdateOrderStatus ==
                                  this.noteCalledFrom
                                ) {
                                  this.writeLog(
                                    this.title +
                                      " History: " +
                                      this.title +
                                      " status already updated.",
                                    "UPDATE",
                                    accessionnumbers,
                                    "FAILED"
                                  );
                                }
                              }
                            }
                            // this.clsUtility.showError("Order status already updated");
                            // this.dataservice.OrderUpdateDone.next(true);
                          } else {
                            if (
                              enumFilterCallingpage.OrderSearchOrder ==
                                this.noteCalledFrom ||
                              enumFilterCallingpage.UniversalUpdateOrderStatus ==
                                this.noteCalledFrom
                            ) {
                              if (isMultiple) {
                                this.percentage =
                                  this.percentage + percentIncrease;
                                this.cdr.detectChanges();
                                let orderstatus = new StatusReportModel();
                                orderstatus.currentStatus = this.selectedOrderReviewGroup[
                                  i
                                ].status;
                                orderstatus.updatedStatus = "-";
                                orderstatus.accessionNo = accessionnumber;
                                orderstatus.status = 0;
                                orderstatus.description =
                                  "Failed to update " +
                                  this.title.toLowerCase() +
                                  " status.";
                                this.countObj.error++;
                                this.statusArray.push(orderstatus);
                              } else {
                                // this.refreshgrid.emit(true);
                                this.clsUtility.showError(
                                  "Failed to update " +
                                    this.title.toLowerCase() +
                                    " status"
                                );
                                this.writeLog(
                                  this.title +
                                    " Search: Failed to update " +
                                    this.title.toLowerCase() +
                                    " status.",
                                  "UPDATE",
                                  accessionnumbers,
                                  "ERROR"
                                );
                                this.dataservice.OrderUpdateDone.next(true);
                              }
                            }
                          }
                        });
                    } else {
                      if (isMultiple) {
                        this.percentage = this.percentage + percentIncrease;
                        this.cdr.detectChanges();
                        let orderstatus = new StatusReportModel();
                        orderstatus.currentStatus = this.selectedOrderReviewGroup[
                          i
                        ].status;
                        orderstatus.updatedStatus = this.statusname;
                        orderstatus.accessionNo = accessionnumber;
                        orderstatus.status = 2;
                        orderstatus.description =
                          "Missing information not uploaded hence " +
                          this.title +
                          " status is not updated.";
                        this.countObj.skipped++;
                        this.statusArray.push(orderstatus);
                      } else {
                        this.clsUtility.showWarning(
                          "Missing information not uploaded hence " +
                            this.title +
                            " status is not updated."
                        );
                      }
                    }
                  }
                );
              } else {
                await this.coreops
                  .UpdateOrderSearchStatus(jsonArray[i])
                  .toPromise()
                  .then(async (data) => {
                    if (data == 1) {
                      if (
                        (jsonArray[i].nstatus != 8 &&
                          enumFilterCallingpage.OrderSearchOrder ==
                            this.noteCalledFrom) ||
                        (jsonArray[i].nstatus != 8 &&
                          enumFilterCallingpage.UniversalUpdateOrderStatus ==
                            this.noteCalledFrom)
                      ) {
                        // this.refreshgrid.emit(true);
                        if (isMultiple) {
                          this.percentage = this.percentage + percentIncrease;
                          this.cdr.detectChanges();
                          let orderstatus = new StatusReportModel();
                          orderstatus.currentStatus = this.selectedOrderReviewGroup[
                            i
                          ].status;
                          orderstatus.updatedStatus = this.statusname;
                          orderstatus.accessionNo = accessionnumber;
                          orderstatus.status = 2;
                          orderstatus.description =
                            this.title + " status updated successfully.";
                          this.countObj.success++;
                          this.statusArray.push(orderstatus);
                        } else {
                          this.clsUtility.showSuccess(
                            this.title + " status updated successfully"
                          );
                          if (
                            enumFilterCallingpage.OrderSearchOrder ==
                            this.noteCalledFrom
                          ) {
                            this.writeLog(
                              this.title +
                                " Search: " +
                                this.title +
                                " status updated successfully.",
                              "UPDATE",
                              accessionnumbers,
                              "SUCCESS"
                            );
                            this.dataservice.OrderUpdateDone.next(true);
                          } else if (
                            enumFilterCallingpage.UniversalUpdateOrderStatus ==
                            this.noteCalledFrom
                          ) {
                            this.writeLog(
                              this.title +
                                " History: " +
                                this.title +
                                " status updated successfully.",
                              "UPDATE",
                              accessionnumbers,
                              "SUCCESS"
                            );
                          }
                        }
                      }
                    } else if (data == 2) {
                      if (
                        enumFilterCallingpage.OrderSearchOrder ==
                          this.noteCalledFrom ||
                        enumFilterCallingpage.UniversalUpdateOrderStatus ==
                          this.noteCalledFrom
                      ) {
                        // this.refreshgrid.emit(true);
                        if (isMultiple) {
                          this.percentage = this.percentage + percentIncrease;
                          this.cdr.detectChanges();
                          let orderstatus = new StatusReportModel();
                          orderstatus.currentStatus = this.selectedOrderReviewGroup[
                            i
                          ].status;
                          orderstatus.updatedStatus = "-";
                          orderstatus.accessionNo = accessionnumber;
                          orderstatus.status = 1;
                          orderstatus.description =
                            this.title + " status already updated.";
                          this.countObj.skipped++;
                          this.statusArray.push(orderstatus);
                        } else {
                          this.clsUtility.showInfo(
                            this.title + " status already updated"
                          );
                          if (
                            enumFilterCallingpage.OrderSearchOrder ==
                            this.noteCalledFrom
                          ) {
                            this.writeLog(
                              this.title +
                                " Search: " +
                                this.title +
                                " status already updated.",
                              "UPDATE",
                              accessionnumbers,
                              "FAILED"
                            );
                            this.dataservice.OrderUpdateDone.next(true);
                          } else if (
                            enumFilterCallingpage.UniversalUpdateOrderStatus ==
                            this.noteCalledFrom
                          ) {
                            this.writeLog(
                              this.title +
                                " History: " +
                                this.title +
                                " status already updated.",
                              "UPDATE",
                              accessionnumbers,
                              "FAILED"
                            );
                          }
                        }
                      }
                      // this.clsUtility.showError("Encounter status already updated");
                      // this.dataservice.OrderUpdateDone.next(true);
                    } else {
                      if (
                        enumFilterCallingpage.OrderSearchOrder ==
                          this.noteCalledFrom ||
                        enumFilterCallingpage.UniversalUpdateOrderStatus ==
                          this.noteCalledFrom
                      ) {
                        if (isMultiple) {
                          this.percentage = this.percentage + percentIncrease;
                          this.cdr.detectChanges();
                          let orderstatus = new StatusReportModel();
                          orderstatus.currentStatus = this.selectedOrderReviewGroup[
                            i
                          ].status;
                          orderstatus.updatedStatus = "-";
                          orderstatus.accessionNo = accessionnumber;
                          orderstatus.status = 0;
                          orderstatus.description =
                            "Failed to update " +
                            this.title.toLowerCase() +
                            " status.";
                          this.countObj.error++;
                          this.statusArray.push(orderstatus);
                        } else {
                          // this.refreshgrid.emit(true);
                          this.clsUtility.showError(
                            "Failed to update " +
                              this.title.toLowerCase() +
                              " status"
                          );
                          this.writeLog(
                            this.title +
                              " Search: Failed to update " +
                              this.title.toLowerCase() +
                              " status.",
                            "UPDATE",
                            accessionnumbers,
                            "ERROR"
                          );
                          this.dataservice.OrderUpdateDone.next(true);
                        }
                      }
                    }
                  });
              }

              ///////////////////////////////////////////////////////////////
            } else {
              let orderstatus = new StatusReportModel();
              orderstatus.currentStatus = this.selectedOrderReviewGroup[
                i
              ].status;
              orderstatus.updatedStatus = "N/A";
              orderstatus.accessionNo = accessionnumber;
              orderstatus.status = 1;
              orderstatus.description =
                this.title + " status can not be change.";
              this.countObj.skipped++;
              this.statusArray.push(orderstatus);
              this.percentage = this.percentage + percentIncrease;
              // this.cdr.detectChanges();
            }
          }
          if (
            enumFilterCallingpage.OrderSearchOrder == this.noteCalledFrom &&
            !isMultiple
          ) {
            this.dataservice.OrderUpdateDone.next(true);
          } else if (
            enumFilterCallingpage.UniversalUpdateOrderStatus ==
            this.noteCalledFrom
          ) {
            this.dataservice.resetOrderDetails.next(true);
            $("#viewdetailsModal").modal("hide");
            this.dataservice.doRefreshGrid.next(true);
          }
          this.cdr.detectChanges();
          if (isMultiple) {
            setTimeout(() => {
              this.isPercentLoader = false;
              this.percentage = 0;
              this.cdr.detectChanges();
              this.countObj.total = this.statusArray.length;
              // this.OrderStatusloadItems();
              $("#updateStatusModal").modal("hide");
              this.dataservice.OrderUpdateDone.next(true);
              this.dataservice.statusReportData.next({
                countObj: this.countObj,
                orderStatusData: this.statusArray,
                isFrom: "ordersearch",
              });
              $("#orderStatusReport").modal("show");
            }, 3000);
          } else {
            $("#updateStatusModal").modal("hide");
            this.loadingNote = false;
          }
          break;

        case enumFilterCallingpage.SubmittedAndPrinted: //single selection
          var isMultiple: boolean = false;
          this.percentage = 0;
          this.cdr.detectChanges();
          if (jsonArray.length > 1) {
            isMultiple = true;
            this.isPercentLoader = true;
            this.cdr.detectChanges();
          } else {
            this.loadingNote = true;
          }

          var percentIncrease = 100 / jsonArray.length;
          this.countObj = new CountModel();
          this.statusArray = new Array<StatusReportModel>();
          for (let i = 0; i < jsonArray.length; i++) {
            this.accessionInProgress = this.selectedOrderReviewGroup[
              i
            ].orderqueuegroupcode;
            await this.coreops
              .UpdateOrderSearchStatus(jsonArray[i])
              .toPromise()
              .then(
                (data) => {
                  if (data == 1) {
                    if (isMultiple) {
                      let orderstatus = new StatusReportModel();
                      orderstatus.accessionNo = this.accessionInProgress;
                      orderstatus.status = 2;
                      orderstatus.description =
                        this.title + " status updated successfully";
                      this.countObj.success++;
                      this.statusArray.push(orderstatus);
                      this.percentage = this.percentage + percentIncrease;
                      this.writeLog(
                        "Submitted & Printed: " +
                          this.title +
                          " status updated successfully.",
                        "UPDATE",
                        accessionnumbers,
                        "SUCCESS"
                      );
                    } else {
                      this.clsUtility.showSuccess(
                        this.title + " status updated successfully"
                      );
                      this.writeLog(
                        "Submitted & Printed: " +
                          this.title +
                          " status updated successfully.",
                        "UPDATE",
                        accessionnumbers,
                        "SUCCESS"
                      );
                    }
                  } else if (data == 2) {
                    if (isMultiple) {
                      let orderstatus = new StatusReportModel();
                      orderstatus.accessionNo = this.accessionInProgress;
                      orderstatus.status = 1;
                      orderstatus.description =
                        this.title + " status already updated";
                      this.countObj.skipped++;
                      this.statusArray.push(orderstatus);
                      this.percentage = this.percentage + percentIncrease;
                      this.writeLog(
                        "Submitted & Printed: " +
                          this.title +
                          " status already updated.",
                        "UPDATE",
                        accessionnumbers,
                        "FAILED"
                      );
                    } else {
                      this.clsUtility.showInfo(
                        this.title + " status already updated"
                      );
                      this.writeLog(
                        "Submitted & Printed: " +
                          this.title +
                          " status already updated.",
                        "UPDATE",
                        accessionnumbers,
                        "FAILED"
                      );
                    }
                  } else {
                    if (isMultiple) {
                      let orderstatus = new StatusReportModel();
                      orderstatus.accessionNo = this.accessionInProgress;
                      orderstatus.status = 0;
                      orderstatus.description =
                        this.title + " status already updated";
                      this.countObj.skipped++;
                      this.statusArray.push(orderstatus);
                      this.percentage = this.percentage + percentIncrease;
                      this.writeLog(
                        "Submitted & Printed: Failed to update " +
                          this.title.toLowerCase +
                          " status.",
                        "UPDATE",
                        accessionnumbers,
                        "ERROR"
                      );
                    } else {
                      this.clsUtility.showError(
                        "Failed to update " +
                          this.title.toLowerCase() +
                          " status"
                      );
                      this.writeLog(
                        "Submitted & Printed: Failed to update " +
                          this.title.toLowerCase +
                          " status.",
                        "UPDATE",
                        accessionnumbers,
                        "ERROR"
                      );
                    }
                  }
                  this.loadingNote = false;
                },
                (error) => {
                  this.loadingNote = false;
                }
              );
          }
          if (isMultiple) {
            setTimeout(() => {
              this.isPercentLoader = false;
              this.percentage = 0;
              this.cdr.detectChanges();
              this.countObj.total = this.statusArray.length;
              this.dataservice.doRefreshGrid.next(true);
              $("#revieworders").modal("hide");
              this.dataservice.statusReportData.next({
                countObj: this.countObj,
                orderStatusData: this.statusArray,
              });
              $("#orderStatusReport").modal("show");
            }, 3000);
          } else {
            this.dataservice.doRefreshGrid.next(true);
            $("#revieworders").modal("hide");
            this.loadingNote = false;
          }
          break;
      } //switch block
    } catch (error) {
      $("#updateStatusModal").modal("hide");
      this.isPercentLoader = false;
      this.percentage = 0;
      this.loadingNote = false;
      this.clsUtility.LogError(error);
    }
  }
  onCloseClick() {
    this.noteCalledFrom == enumFilterCallingpage.WorkInventory
      ? this.dataservice.DeferWorkqueueDone.next(false)
      : this.dataservice.UndeferWorkqueueDone.next(false);
    if (this.noteCalledFrom == enumFilterCallingpage.OrderDetails) {
      this.dataservice.OrderDetailsDone.next(false); ///saurabh shelar
    }
    if (
      this.noteCalledFrom == enumFilterCallingpage.OrderReview ||
      this.noteCalledFrom == enumFilterCallingpage.MyReview
    ) {
      this.dataservice.OrderReviewDone.next(false); ///saurabh shelar
    }
    if (this.noteCalledFrom == enumFilterCallingpage.OrderAssistance) {
      this.dataservice.OrderAssistanceDone.next(false); ///saurabh shelar
    }
    if (this.noteCalledFrom == enumFilterCallingpage.OrderAssistanceWorkqueue) {
      this.dataservice.IncompleteDone.next(false);
    }
    if (
      this.noteCalledFrom == enumFilterCallingpage.OrderSearchOrder ||
      this.noteCalledFrom == enumFilterCallingpage.PracticeAssigned
    ) {
      this.dataservice.OrderUpdateDone.next(false);
      // $("#updateStatusModal").modal("hide");
    }
    if (
      this.noteCalledFrom == enumFilterCallingpage.UniversalUpdateOrderStatus
    ) {
      this.dataservice.doExpandUpdateStatus.next(false);
    }
    if (this.noteCalledFrom == enumFilterCallingpage.SubmittedAndPrinted) {
      this.dataservice.doRefreshGrid.next(false);
    }
    if (this.IncompleteOrderAction) {
      this.IncompleteOrderAction.IncompleteInfoGroup.reset();
    }
    this.orderSubStatus = [];
    this.orderNotes = [];
    // this.dataservice.NoteCalledFrom.next(null);
    this.cdr.detectChanges();
  }
  ResetComponents() {
    try {
      this.NoteText = "";
      this.NoteTitle = "";
      this.selectedWorkGroup = null;
      this.NoteGroup.reset();
      // this.dataservice.NoteCalledFrom.next(null);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  writeLog(
    Message: string,
    UserAction: string,
    accessionnumber: string,
    outcome: string
  ) {
    let ModuleName = "Qonductor-Biotech";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
      outcome: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataservice.loginUserName,
      module: ModuleName,
      screen: "Encounter Review",
      message: Message,
      useraction: UserAction,
      transactionid: accessionnumber,
      outcome: outcome,
    };
    this.clsAuthLogs.callApi(para);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
    // if (
    //   this.noteCalledFrom == enumFilterCallingpage.UniversalUpdateOrderStatus
    // ) {
    //   this.dataservice.doExpandUpdateStatus.next(false);
    // }
  }
  getOrderSubStatusAndNotes(statuscode: string) {
    try {
      if (
        this.selectedOrderReviewGroup[0] &&
        this.selectedOrderReviewGroup[0].encountersource.toLowerCase() ==
          "biotech encounter"
      ) {
        this.subscription.add(
          this.coreops.getOrderSubStatusAndNotes(statuscode).subscribe(
            (data) => {
              // console.log(data);
              if (data) {
                this.orderSubStatus = data.substatus;
                this.orderNotes = data.ordernotes;
                if (this.orderNotes) {
                  this.fbcOrderNote.reset();
                  // this.fbcOrderNote.setValidators(Validators.required);
                } else {
                  this.fbcNote.setValue("");
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
                this.fbcNote.setValue("");
              }
              this.fbcSubStatus.updateValueAndValidity();
              this.fbcOrderNote.updateValueAndValidity();
              this.fbcNote.updateValueAndValidity();
            },
            (error) => {
              this.clsUtility.showError(error);
            }
          )
        );
      } else {
        this.fbcSubStatus.clearValidators();
        this.fbcSubStatus.setValue("");
        this.fbcOrderNote.setValue("");
        this.fbcNote.setValue("");
        this.fbcSubStatus.updateValueAndValidity();
        this.fbcOrderNote.updateValueAndValidity();
        this.fbcNote.updateValueAndValidity();
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  statusChanged(evt: any) {
    if (evt) {
      this.statusname = evt.status;
      if (evt.statuscode === 3 || evt.statuscode === 8) {
        this.dataservice.IncompleteOrderInfo.next(
          this.selectedOrderReviewGroup
        );
      }
      this.getOrderSubStatusAndNotes(evt.statuscode);
    }
  }
  orderNoteChanged(evt: any) {
    // console.log(evt);
    this.fbcNote.setValue(evt.note);
    this.fbcNote.updateValueAndValidity();
  }
  async uploadCall(body: UploadMissingInfoModel) {
    return await this.coreops.uploadMissingInfo(body).toPromise();
  }
}
