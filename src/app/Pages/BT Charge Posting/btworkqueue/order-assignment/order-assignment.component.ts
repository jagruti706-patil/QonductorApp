import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { SubSink } from "subsink";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
import { GCPUser } from "src/app/Model/Common/login";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { AssignOrderQueue } from "src/app/Model/BT Charge Posting/Workqueue/assign-order-queue";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import {
  UploadMissingInfoModel,
  IncompleteOrderNote,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { IncompleteOrderActionComponent } from "../../Order Action/incomplete-order-action/incomplete-order-action.component";
import {
  CountModel,
  StatusReportModel,
} from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
import { ButtonInformation } from "src/app/Pages/Common/confirmation/yes-no-cancel-confirmation/yes-no-cancel-confirmation.component";
declare var $: any;
@Component({
  selector: "app-order-assignment",
  templateUrl: "./order-assignment.component.html",
  styleUrls: ["./order-assignment.component.css"],
})
export class OrderAssignmentComponent implements OnInit, OnDestroy {
  clsAuthLogs: AuthLogs;
  loadingData: boolean = false;
  private subscription = new SubSink();
  clsUtility: Utility;
  Agents: GCPUser[];
  loginUserGroup: any;
  allLoginUserGroup: any;
  GroupUsers: any;
  AllGroupUsers: any;
  selectedAgent: GCPUser;
  AgentID = 0;
  SelectedAgentName = "";
  selectedOrders: any[] = [];
  selectedOrdercount = 0;
  orderAssignSource: any;
  orderAssignmentStatus: number;
  public default = { userid: 0, displayname: "Select" };
  public groupDefault = { groupid: 0, groupname: "Select" };
  title: string = "Assign Work";
  @ViewChild("IncompleteOrderAction", { static: true })
  public IncompleteOrderAction: IncompleteOrderActionComponent;
  isPercentLoader: boolean;
  percentage: number;
  accessionInProgress: string = "in progress";
  statusArray: StatusReportModel[] = [];
  countObj: CountModel = new CountModel();
  titleMsg: string = "Encounter";

  constructor(
    private fb: FormBuilder,
    private authService: CoreauthService,
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private docCoreService: CoreOperationService,
    config: NgbRatingConfig,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.clsAuthLogs = new AuthLogs(http);
    this.clsUtility = new Utility(toastr);
    config.max = 5;
    config.readonly = true;
  }

  AssignOrderQueue = this.fb.group({
    fcAgents: ["", Validators.required],
    fcGroup: ["", Validators.required],
    // fcNote: [""],
    // fcPriority: ["", Validators.required],
    // fcDueDate: ["", Validators.required]
  });

  get AgentName() {
    return this.AssignOrderQueue.get("fcAgents");
  }
  get GroupName() {
    return this.AssignOrderQueue.get("fcGroup");
  }
  // get fbcNote() {
  //   return this.AssignOrderQueue.get("fcNote");
  // }

  ngOnInit() {
    this.formValueChanged();
  }
  inputConfirmationMsg: string = "";
  inputButtonInfo: ButtonInformation = new ButtonInformation();
  onOKClick() {
    // if (this.AllGroupUsers) {
    //   this.selectedAgent = this.AllGroupUsers.find(
    //     (x) => x.userid == this.AgentName.value
    //   );
    // }
    // if (this.allLoginUserGroup) {
    //   var selectedGroup = this.allLoginUserGroup.find(
    //     (x) => x.groupid == this.GroupName.value
    //   );
    // }
    // if (
    //   this.orderAssignSource == enumOrderAssignSource.ReadyForPrinting ||
    //   this.orderAssignSource == enumOrderAssignSource.SubmittedAndPrinted
    // )
    //   this.titleMsg = "Order";
    // if (this.selectedOrders.length > 1) {
    //   if (
    //     this.orderAssignSource == enumOrderAssignSource.IncompleteInventory ||
    //     this.orderAssignSource == enumOrderAssignSource.ReadyForPrinting ||
    //     this.orderAssignSource == enumOrderAssignSource.SubmittedAndPrinted
    //   ) {
    //     if (this.isSameProviderOrder && this.GroupName.value == -1) {
    //       this.clsUtility.showInfo(
    //         "Multiple group(s) are associated with provider or provider is not available for selected " +
    //           this.titleMsg.toLowerCase() +
    //           "(s). Please select a group and try again."
    //       );
    //       // if (
    //       //   this.selectedOrders[0].providernpi == null ||
    //       //   this.selectedOrders[0].providernpi == ""
    //       // ) {
    //       //   this.clsUtility.showInfo("Please select a group and try again.");
    //       // }
    //       return;
    //     }
    //     if (this.selectedAgent) {
    //       //encounter will be assigned to "groupname" groups "agentname" user. Do you want to continue?
    //       this.inputConfirmationMsg =
    //         "<p class='mb-1'>" +
    //         this.titleMsg +
    //         " will be assign to -<br>Group : <b>" +
    //         selectedGroup.groupname +
    //         "</b><br>Practice User &nbsp;: <b>" +
    //         this.selectedAgent.displayname +
    //         "</b><br>Do you want to continue ?</p>";

    //       this.inputButtonInfo.Yes =
    //         "Assign " +
    //         this.titleMsg.toLowerCase() +
    //         "(s) to selected group & agent";
    //       this.inputButtonInfo.No =
    //         "Assign " + this.titleMsg.toLowerCase() + "(s) to selected group";
    //       this.inputButtonInfo.Cancel = "Do not assign";

    //       $("#checkConfirmationModal").modal("show");
    //     } else {
    //       if (this.GroupName.value == -1) {
    //         //system will automatically assigned the encounters to respective provider group. Do you want to continue?
    //         this.inputConfirmationMsg =
    //           "System will automatically assigned the " +
    //           this.titleMsg.toLowerCase() +
    //           "(s) to respective provider Group.<br> Do you want to continue ?";
    //         this.inputButtonInfo.Yes = "";
    //         this.inputButtonInfo.No = "";
    //         this.inputButtonInfo.Cancel = "";
    //         $("#checkConfirmationModal").modal("show");
    //       } else {
    //         //encounter will be assigned to "groupname" group. Do you want to continue?
    //         this.inputConfirmationMsg =
    //           "<p class='mb-1'>" +
    //           this.titleMsg +
    //           " will be assign to -<br>Group : <b>" +
    //           selectedGroup.groupname +
    //           "</b><br>Do you want to continue ?</p>";

    //         this.inputButtonInfo.Yes =
    //           "Assign " + this.titleMsg.toLowerCase() + "(s) to selected group";
    //         this.inputButtonInfo.No =
    //           "Assign " +
    //           this.titleMsg.toLowerCase() +
    //           "(s) to respective " +
    //           this.titleMsg.toLowerCase() +
    //           " provider group automatically";

    //         this.inputButtonInfo.Cancel = "Do not assign";

    //         $("#checkConfirmationModal").modal("show");
    //       }
    //     }
    //   } else {
    //     this.GenerateWorkitemAssignment();
    //   }
    // } else {
    //   this.GenerateWorkitemAssignment();
    // }
    this.GenerateWorkitemAssignment(true);
  }
  OutputCheckResult(evt: number) {
    try {
      // $("#checkConfirmationModal")
      //   .modal()
      //   .on("hidden.bs.modal", function (e) {
      //     $("body").addClass("modal-open");
      //   });
      this.clsUtility.applyModalOpenClassOnClose("checkConfirmationModal");

      $("#checkConfirmationModal").modal("hide");
      switch (evt) {
        case 1: //yes
          // alert("yes clicked");
          this.GenerateWorkitemAssignment(true);
          break;
        case 0: //no
          // alert("No clicked");
          if (this.GroupName.value != -1) {
            this.GenerateWorkitemAssignment(false);
          }
          break;
      }
      // if (evt) {
      //   this.GeneratePracticeEncounter();
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async GenerateWorkitemAssignment(AssignedSelectedValue: boolean = false) {
    try {
      const InputWorkGroup: any[] = [];
      const currentDate = this.clsUtility.currentDateTime();

      const clsAssginOrder = new AssignOrderQueue();
      if (this.AllGroupUsers) {
        this.selectedAgent = this.AllGroupUsers.find(
          (x) => x.userid == this.AgentName.value
        );
      }
      if (this.allLoginUserGroup) {
        var selectedGroup = this.allLoginUserGroup.find(
          (x) => x.groupid == this.GroupName.value
        );
      }
      clsAssginOrder.assignedby = this.dataService.loginGCPUserID.getValue(); //String(this.dataService.SelectedGCPUserid);
      clsAssginOrder.assignedbyname = this.dataService.loginUserName;

      clsAssginOrder.assignsource = this.orderAssignSource;
      clsAssginOrder.orderstatus = this.orderAssignmentStatus;
      clsAssginOrder.currentStatus = this.selectedOrders[0].nstatus;
      clsAssginOrder.createdon = currentDate;
      clsAssginOrder.modifiedon = currentDate;
      clsAssginOrder.assignedtogroupid = this.GroupName.value;
      clsAssginOrder.assignedtogroupname = selectedGroup.groupname;

      if (
        this.orderAssignSource == enumOrderAssignSource.IncompleteInventory ||
        this.orderAssignSource == enumOrderAssignSource.ReadyForPrinting ||
        this.orderAssignSource == enumOrderAssignSource.SubmittedAndPrinted
      ) {
        let isMultiple: boolean;
        this.percentage = 0;
        let percentangeIncrease: number = 100 / this.selectedOrders.length;
        this.selectedOrders.length > 1
          ? (isMultiple = true)
          : (isMultiple = false);
        if (isMultiple) {
          this.isPercentLoader = true;
          this.cdr.detectChanges();
          this.countObj = new CountModel();
          this.countObj.total = this.selectedOrders.length;
          this.statusArray = new Array<StatusReportModel>();
        } else this.loadingData = true;
        for (const workgroup of this.selectedOrders) {
          if (this.selectedAgent) {
            //if agent selected order selected
            if (isMultiple) {
              let orderstatus = new StatusReportModel();
              orderstatus.accessionNo = workgroup.orderqueuegroupcode;
              this.accessionInProgress =
                workgroup.orderqueuegroupcode + " in progress";

              if (AssignedSelectedValue) {
                clsAssginOrder.assignedto = String(this.AgentName.value);
                clsAssginOrder.assignedtoname = this.selectedAgent.displayname;
                clsAssginOrder.assignmenttype = 0;
              } else {
                clsAssginOrder.assignedto = String(selectedGroup.groupid);
                clsAssginOrder.assignedtoname = selectedGroup.groupname;
                clsAssginOrder.assignmenttype = 1;
              }
              clsAssginOrder.assignedtogroupid = this.GroupName.value;
              clsAssginOrder.assignedtogroupname = selectedGroup.groupname;
              let res: any;
              if (
                this.orderAssignSource ==
                enumOrderAssignSource.IncompleteInventory
              ) {
                this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
                this.IncompleteOrderAction.IncompleteOrderInfo =
                  workgroup.incompleteorderinfo;
                this.IncompleteOrderAction.isReadonlyCoverpage = true;
                this.IncompleteOrderAction.SetIncompleteOrderGrid();
                if (!this.IncompleteOrderAction.cdr["destroyed"]) {
                  this.IncompleteOrderAction.cdr.detectChanges();
                }

                let body: UploadMissingInfoModel = new UploadMissingInfoModel();
                let covername =
                  workgroup.orderqueuegroupcode + "-000-Cover.pdf";
                body.documentname = covername;
                body.category = workgroup.orderqueuegroupcode;
                body.orderqueueid = workgroup.orderqueuegroupid;
                body.subcategory = workgroup.ordercategory;
                body.sourcetype = "Qonductor";
                body.cabinet = workgroup.orderyear;
                body.folder = workgroup.orderday;
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
                    res = await this.uploadCall(body);
                    if (res == 1) {
                      this.writeLog(
                        "Missing information uploaded successfully",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "SUCCESS"
                      );
                    } else if (res == 0) {
                      this.writeLog(
                        "Error while uploading missing information",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "ERROR"
                      );
                    }
                  },
                  (error) => {
                    res = 0;
                    this.writeLog(
                      "Error while uploading missing information",
                      "UPLOAD",
                      workgroup.orderqueuegroupcode,
                      "ERROR"
                    );
                  }
                );
              } else {
                res = 1;
              }

              let clsOrderAssignment: any = clsAssginOrder;
              clsOrderAssignment.orderqueuegroupid = [
                workgroup.orderqueuegroupid,
              ];
              if (res) {
                await this.docCoreService
                  .AssignOrderInventory(JSON.stringify(clsOrderAssignment))
                  .toPromise()
                  .then(
                    (data) => {
                      if (data == 1) {
                        this.countObj.success++;
                        orderstatus.status = 2;
                        orderstatus.description =
                          this.orderAssignSource ==
                          enumOrderAssignSource.IncompleteInventory
                            ? "Missing information uploaded and encounter sent to practice successfully."
                            : "Order sent to practice successfully";
                        this.statusArray.push(orderstatus);
                      } else if (data == 2) {
                        this.countObj.skipped++;
                        orderstatus.status = 1;
                        orderstatus.description =
                          this.titleMsg + " status already changed.";
                        this.statusArray.push(orderstatus);
                      } else {
                        this.countObj.error++;
                        orderstatus.status = 0;
                        orderstatus.description =
                          "Error while " +
                          this.titleMsg.toLowerCase() +
                          " assignment.";
                        this.statusArray.push(orderstatus);
                      }
                      this.loadingData = false;
                    },
                    (error) => {
                      this.loadingData = false;
                      this.countObj.error++;
                      orderstatus.status = 0;
                      orderstatus.description =
                        "Error while " +
                        this.titleMsg.toLowerCase() +
                        " assignment.";
                      this.statusArray.push(orderstatus);
                    }
                  );
              } else {
                this.countObj.error++;
                orderstatus.status = 0;
                orderstatus.description =
                  "Missing information is not uploaded hence can not send " +
                  this.titleMsg.toLowerCase() +
                  " to practice.";
                this.statusArray.push(orderstatus);
              }
              this.percentage += percentangeIncrease;
              this.cdr.detectChanges();
              this.loadingData = false;
            } else {
              clsAssginOrder.assignedtogroupid = this.GroupName.value;
              clsAssginOrder.assignedtogroupname = selectedGroup.groupname;
              clsAssginOrder.assignedto = String(this.AgentName.value);
              clsAssginOrder.assignedtoname = this.selectedAgent.displayname;
              clsAssginOrder.assignmenttype = 0;
              let res: any;
              if (
                this.orderAssignSource ==
                enumOrderAssignSource.IncompleteInventory
              ) {
                this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
                this.IncompleteOrderAction.IncompleteOrderInfo =
                  workgroup.incompleteorderinfo;
                this.IncompleteOrderAction.isReadonlyCoverpage = true;
                this.IncompleteOrderAction.SetIncompleteOrderGrid();
                if (!this.IncompleteOrderAction.cdr["destroyed"]) {
                  this.IncompleteOrderAction.cdr.detectChanges();
                }
                let body: UploadMissingInfoModel = new UploadMissingInfoModel();
                let covername =
                  workgroup.orderqueuegroupcode + "-000-Cover.pdf";
                body.documentname = covername;
                body.category = workgroup.orderqueuegroupcode;
                body.orderqueueid = workgroup.orderqueuegroupid;
                body.subcategory = workgroup.ordercategory;
                body.sourcetype = "Qonductor";
                body.cabinet = workgroup.orderyear;
                body.folder = workgroup.orderday;
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
                    res = await this.uploadCall(body);
                    if (res == 1) {
                      this.writeLog(
                        "Missing information uploaded successfully",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "SUCCESS"
                      );
                    } else if (res == 0) {
                      this.writeLog(
                        "Error while uploading missing information",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "ERROR"
                      );
                    }
                  },
                  (error) => {
                    res = 0;
                    this.writeLog(
                      "Error while uploading missing information",
                      "UPLOAD",
                      workgroup.orderqueuegroupcode,
                      "ERROR"
                    );
                  }
                );
              } else {
                res = 1;
              }
              let clsOrderAssignment: any = clsAssginOrder;
              clsOrderAssignment.orderqueuegroupid = [
                workgroup.orderqueuegroupid,
              ];
              if (res) {
                await this.docCoreService
                  .AssignOrderInventory(JSON.stringify(clsOrderAssignment))
                  .toPromise()
                  .then(
                    (data) => {
                      if (data == 1) {
                        if (
                          this.orderAssignSource ==
                          enumOrderAssignSource.IncompleteInventory
                        ) {
                          this.clsUtility.showSuccess(
                            "Missing information uploaded and " +
                              this.titleMsg.toLowerCase() +
                              " sent to practice successfully"
                          );
                          this.writeLog(
                            "Missing information uploaded and " +
                              this.titleMsg.toLowerCase() +
                              " sent to practice successfully.",
                            "UPDATE",
                            workgroup.orderqueuegroupcode,
                            "SUCCESS"
                          );
                        } else {
                          this.clsUtility.showSuccess(
                            this.titleMsg + " sent to practice successfully"
                          );
                          this.writeLog(
                            this.titleMsg + " sent to practice successfully.",
                            "UPDATE",
                            workgroup.orderqueuegroupcode,
                            "SUCCESS"
                          );
                        }
                      } else if (data == 2) {
                        this.clsUtility.showWarning(
                          this.titleMsg + " status already changed"
                        );
                        this.writeLog(
                          this.titleMsg + " status already changed.",
                          "UPDATE",
                          workgroup.orderqueuegroupcode,
                          "FAILED"
                        );
                      } else {
                        this.clsUtility.showError(
                          "Error while send to practice"
                        );
                        this.writeLog(
                          "Error while send to practice.",
                          "UPDATE",
                          workgroup.orderqueuegroupcode,
                          "ERROR"
                        );
                      }
                      this.loadingData = false;
                    },
                    (error) => {
                      this.loadingData = false;
                      this.clsUtility.showError("Error while send to practice");
                      this.writeLog(
                        "Error while send to practice.",
                        "UPDATE",
                        workgroup.orderqueuegroupcode,
                        "ERROR"
                      );
                    }
                  );
              }
            }
          } else {
            //if agent not selected order selected
            if (isMultiple) {
              let continueNextWorkgroup: boolean = false;
              let orderstatus = new StatusReportModel();
              orderstatus.accessionNo = workgroup.orderqueuegroupcode;
              this.accessionInProgress =
                workgroup.orderqueuegroupcode + " in progress";
              if (AssignedSelectedValue && this.GroupName.value != -1) {
                clsAssginOrder.assignedtogroupid = String(
                  selectedGroup.groupid
                );
                clsAssginOrder.assignedtogroupname = selectedGroup.groupname;
                clsAssginOrder.assignedto = String(selectedGroup.groupid);
                clsAssginOrder.assignedtoname = selectedGroup.groupname;
                clsAssginOrder.assignmenttype = 1;

                let assignedorderstatus = await this.AssignandUploadIncompleteOrder(
                  orderstatus,
                  workgroup,
                  clsAssginOrder,
                  isMultiple,
                  percentangeIncrease
                );
                this.statusArray.push(assignedorderstatus);
              } else {
                let clientid =
                  workgroup.clientid == null || workgroup.clientid == ""
                    ? "0"
                    : workgroup.clientid;
                let providernpi =
                  workgroup.providernpi == null || workgroup.providernpi == ""
                    ? "0"
                    : workgroup.providernpi;
                await this.authService
                  .getClientGroups(clientid, providernpi)
                  .toPromise()
                  .then(
                    async (data) => {
                      if (data) {
                        if (data.result.length === 0) {
                          this.countObj.error++;
                          orderstatus.status = 0;
                          orderstatus.description = data.message;
                          // "Provider is not register. Please contact system administrator";
                          this.statusArray.push(orderstatus);
                          continueNextWorkgroup = true;
                        }
                        if (data.result.length > 1) {
                          this.countObj.skipped++;
                          orderstatus.status = 1;
                          orderstatus.description = data.message;
                          // "Provider is associated with multiple group.";
                          this.statusArray.push(orderstatus);
                          continueNextWorkgroup = true;
                        }
                        if (data.result.length === 1) {
                          clsAssginOrder.assignedtogroupid =
                            data.result[0].groupid;
                          clsAssginOrder.assignedtogroupname =
                            data.result[0].groupname;
                          clsAssginOrder.assignedto = data.result[0].groupid;
                          clsAssginOrder.assignedtoname =
                            data.result[0].groupname;
                          clsAssginOrder.assignmenttype = 1;

                          let assignedorderstatus = await this.AssignandUploadIncompleteOrder(
                            orderstatus,
                            workgroup,
                            clsAssginOrder,
                            isMultiple,
                            percentangeIncrease
                          );
                          this.statusArray.push(assignedorderstatus);
                          continueNextWorkgroup = false;
                        }
                      } else {
                        this.countObj.error++;
                        orderstatus.status = 0;
                        orderstatus.description = data.message;
                        // "Provider is not register. Please contact system administrator";
                        this.statusArray.push(orderstatus);
                        continueNextWorkgroup = true;
                      }
                    },
                    (error) => {
                      this.loadingData = false;
                      this.clsUtility.LogError(error);
                    }
                  );
              }
              if (continueNextWorkgroup) {
                this.percentage += percentangeIncrease;
                this.cdr.detectChanges();
                continue;
              }
            } else {
              clsAssginOrder.assignedtogroupid = selectedGroup.groupid;
              clsAssginOrder.assignedtogroupname = selectedGroup.groupname;
              clsAssginOrder.assignedto = selectedGroup.groupid;
              clsAssginOrder.assignedtoname = selectedGroup.groupname;
              clsAssginOrder.assignmenttype = 1;

              let res: any;
              if (
                this.orderAssignSource ==
                enumOrderAssignSource.IncompleteInventory
              ) {
                this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
                this.IncompleteOrderAction.IncompleteOrderInfo =
                  workgroup.incompleteorderinfo;
                this.IncompleteOrderAction.isReadonlyCoverpage = true;
                this.IncompleteOrderAction.SetIncompleteOrderGrid();
                if (!this.IncompleteOrderAction.cdr["destroyed"]) {
                  this.IncompleteOrderAction.cdr.detectChanges();
                }
                let body: UploadMissingInfoModel = new UploadMissingInfoModel();
                let covername =
                  workgroup.orderqueuegroupcode + "-000-Cover.pdf";
                body.documentname = covername;
                body.category = workgroup.orderqueuegroupcode;
                body.orderqueueid = workgroup.orderqueuegroupid;
                body.subcategory = workgroup.ordercategory;
                body.sourcetype = "Qonductor";
                body.cabinet = workgroup.orderyear;
                body.folder = workgroup.orderday;
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
                    res = await this.uploadCall(body);
                    if (res == 1) {
                      this.writeLog(
                        "Missing information uploaded successfully",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "SUCCESS"
                      );
                    } else if (res == 0) {
                      this.writeLog(
                        "Error while uploading missing information",
                        "UPLOAD",
                        workgroup.orderqueuegroupcode,
                        "ERROR"
                      );
                    }
                  },
                  (error) => {
                    res = 0;
                    this.writeLog(
                      "Error while uploading missing information",
                      "UPLOAD",
                      workgroup.orderqueuegroupcode,
                      "ERROR"
                    );
                  }
                );
              } else {
                res = 1;
              }
              let clsOrderAssignment: any = clsAssginOrder;
              clsOrderAssignment.orderqueuegroupid = [
                workgroup.orderqueuegroupid,
              ];
              if (res) {
                await this.docCoreService
                  .AssignOrderInventory(JSON.stringify(clsOrderAssignment))
                  .toPromise()
                  .then(
                    (data) => {
                      if (data == 1) {
                        if (
                          this.orderAssignSource ==
                          enumOrderAssignSource.IncompleteInventory
                        ) {
                          this.clsUtility.showSuccess(
                            "Missing information uploaded and " +
                              this.titleMsg.toLowerCase() +
                              " sent to practice successfully"
                          );
                          this.writeLog(
                            "Missing information uploaded and " +
                              this.titleMsg.toLowerCase() +
                              " sent to practice successfully.",
                            "UPDATE",
                            workgroup.orderqueuegroupcode,
                            "SUCCESS"
                          );
                        } else {
                          this.clsUtility.showSuccess(
                            this.titleMsg + " sent to practice successfully"
                          );
                          this.writeLog(
                            this.titleMsg + " sent to practice successfully.",
                            "UPDATE",
                            workgroup.orderqueuegroupcode,
                            "SUCCESS"
                          );
                        }
                      } else if (data == 2) {
                        this.clsUtility.showWarning(
                          this.titleMsg + " status already changed"
                        );
                        this.writeLog(
                          this.titleMsg + " status already changed.",
                          "UPDATE",
                          workgroup.orderqueuegroupcode,
                          "FAILED"
                        );
                      } else {
                        this.clsUtility.showError(
                          "Error while send to practice"
                        );
                        this.writeLog(
                          "Error while send to practice.",
                          "UPDATE",
                          workgroup.orderqueuegroupcode,
                          "ERROR"
                        );
                      }
                      this.loadingData = false;
                    },
                    (error) => {
                      this.loadingData = false;
                      this.clsUtility.showError("Error while send to practice");
                      this.writeLog(
                        "Error while send to practice.",
                        "UPDATE",
                        workgroup.orderqueuegroupcode,
                        "ERROR"
                      );
                    }
                  );
              }
            }
          }
        }
        if (isMultiple) {
          setTimeout(() => {
            this.isPercentLoader = false;
            this.cdr.detectChanges();
            $("#assignOrderModal").modal("hide");
            this.dataService.statusReportData.next({
              countObj: this.countObj,
              orderStatusData: this.statusArray,
            });
            $("#orderStatusReport").modal("show");
            this.dataService.orderAssignmentDone.next(true);
            this.accessionInProgress = "in progress";
          }, 3000);
        } else {
          this.loadingData = false;
          $("#assignOrderModal").modal("hide");
          this.dataService.orderAssignmentDone.next(true);
        }
      } else {
        if (this.selectedAgent) {
          clsAssginOrder.assignedto = String(this.AgentName.value);
          clsAssginOrder.assignedtoname = this.selectedAgent.displayname;
          clsAssginOrder.assignmenttype = 0;
        } else {
          clsAssginOrder.assignedto = String(this.GroupName.value);
          clsAssginOrder.assignedtoname = selectedGroup.groupname;
          clsAssginOrder.assignmenttype = 1;
        }
        for (const workgroup of this.selectedOrders) {
          InputWorkGroup.push(workgroup.orderqueuegroupid);
        }
        clsAssginOrder.orderqueuegroupid = InputWorkGroup;
        this.loadingData = true;
        let accessionnumbers: string = this.selectedOrders
          .map((ele) => ele.orderqueuegroupcode)
          .join(";");
        this.subscription.add(
          this.docCoreService
            .AssignOrderInventory(JSON.stringify(clsAssginOrder))
            .subscribe(
              (data) => {
                if (data == 1) {
                  if (this.orderAssignSource == 0) {
                    this.clsUtility.showSuccess(
                      "Encounter assigned to selected user"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Encounter assigned successfully from encounter inventory.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  } else if (this.orderAssignSource == 5) {
                    this.clsUtility.showSuccess(
                      "Encounter assigned to selected user"
                    );
                    this.dataService.orderReviewAssignmentDone.next(true);
                    this.writeLog(
                      "Encounter assigned for review successfully from pending review.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  } else if (this.orderAssignSource == 4) {
                    this.clsUtility.showSuccess(
                      "Encounter assigned to selected user"
                    );
                    this.dataService.orderReassignmentDone.next(true);
                    this.writeLog(
                      "Encounter reassigned successfully from encounter search.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  } else if (this.orderAssignSource == 17) {
                    this.clsUtility.showSuccess(
                      "Encounter assigned to selected user"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Encounter reassigned successfully from practice completed.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  } else if (this.orderAssignSource == 8) {
                    this.clsUtility.showSuccess(
                      "Encounter sent to practice successfully"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Order assigned successfully from ready for printing.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  } else if (this.orderAssignSource == 10) {
                    this.clsUtility.showSuccess(
                      "Encounter sent to practice successfully"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Order assigned successfully from Biotech - Missing Information Orders In Process.",
                      "UPDATE",
                      accessionnumbers,
                      "SUCCESS"
                    );
                  }
                } else if (data == 2) {
                  if (this.orderAssignSource == 0) {
                    this.clsUtility.showError(
                      "Encounter status is already changed"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "User trying to assign the encounter but status is already changed from encounter inventory.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  } else if (this.orderAssignSource == 5) {
                    this.clsUtility.showError(
                      "Encounter status is already changed"
                    );
                    this.dataService.orderReviewAssignmentDone.next(true);
                    this.writeLog(
                      "User trying to assign the review but status is already changed from pending review.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  } else if (this.orderAssignSource == 4) {
                    this.clsUtility.showError(
                      "Encounter status is already changed"
                    );
                    this.dataService.orderReassignmentDone.next(true);
                    this.writeLog(
                      "User trying to reassign the review but status is already changed from encounter search.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  } else if (this.orderAssignSource == 17) {
                    this.clsUtility.showError(
                      "Encounter status is already changed"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Encounter status is already changed.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  } else if (this.orderAssignSource == 8) {
                    this.clsUtility.showError(
                      "Order status is already changed"
                    );
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Order status is already changed.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  } else if (this.orderAssignSource == 10) {
                    this.dataService.orderAssignmentDone.next(true);
                    this.writeLog(
                      "Order status is already changed.",
                      "UPDATE",
                      accessionnumbers,
                      "FAILED"
                    );
                  }
                } else {
                  if (this.orderAssignSource == 0) {
                    this.clsUtility.showError(
                      "Error while encounter assignment"
                    );
                    this.dataService.orderAssignmentDone.next(false);
                    this.writeLog(
                      "Error while encounter assignment from encounter inventory.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (this.orderAssignSource == 5) {
                    this.clsUtility.showError(
                      "Error while encounter assignment"
                    );
                    this.dataService.orderReviewAssignmentDone.next(false);
                    this.writeLog(
                      "Error while encounter assignment from pending review.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (this.orderAssignSource == 4) {
                    this.clsUtility.showError(
                      "Error while encounter assignment"
                    );
                    this.dataService.orderReassignmentDone.next(false);
                    this.writeLog(
                      "Error while encounter assignment from encounter search.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (this.orderAssignSource == 17) {
                    this.clsUtility.showError(
                      "Error while encounter assignment"
                    );
                    this.dataService.orderAssignmentDone.next(false);
                    this.writeLog(
                      "Error while encounter assignment from practice completed.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (this.orderAssignSource == 8) {
                    this.clsUtility.showError("Error while send to practice");
                    this.dataService.orderAssignmentDone.next(false);
                    this.writeLog(
                      "Error while send to practice from ready from printing.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  } else if (this.orderAssignSource == 10) {
                    this.clsUtility.showError("Error while send to practice");
                    this.dataService.orderAssignmentDone.next(false);
                    this.writeLog(
                      "Error while send to practice from Biotech - Missing Information Orders In Process.",
                      "UPDATE",
                      accessionnumbers,
                      "ERROR"
                    );
                  }
                }
                this.loadingData = false;
                $("#assignOrderModal").modal("hide");
              },
              (error) => {
                this.loadingData = false;
                $("#assignOrderModal").modal("hide");
              }
            )
        );
      }
    } catch (error) {
      // console.log("this.selectedWorkGroup",this.selectedWorkGroup);

      // console.log("inputworkgroup: " + JSON.stringify(InputWorkGroup));
      this.loadingData = false;
      this.isPercentLoader = false;
      this.clsUtility.LogError(error);
    }
  }
  private async AssignandUploadIncompleteOrder(
    orderstatus: StatusReportModel,
    workgroup: any,
    clsAssginOrder: AssignOrderQueue,
    isMultiple: boolean,
    percentangeIncrease: number
  ) {
    let res: any;
    if (this.orderAssignSource == enumOrderAssignSource.IncompleteInventory) {
      this.IncompleteOrderAction.IncompleteOrderInfo = new IncompleteOrderNote();
      this.IncompleteOrderAction.IncompleteOrderInfo =
        workgroup.incompleteorderinfo;
      this.IncompleteOrderAction.isReadonlyCoverpage = true;
      this.IncompleteOrderAction.SetIncompleteOrderGrid();
      if (!this.IncompleteOrderAction.cdr["destroyed"]) {
        this.IncompleteOrderAction.cdr.detectChanges();
      }
      let body: UploadMissingInfoModel = new UploadMissingInfoModel();
      let covername = workgroup.orderqueuegroupcode + "-000-Cover.pdf";
      body.documentname = covername;
      body.category = workgroup.orderqueuegroupcode;
      body.orderqueueid = workgroup.orderqueuegroupid;
      body.subcategory = workgroup.ordercategory;
      body.sourcetype = "Qonductor";
      body.cabinet = workgroup.orderyear;
      body.folder = workgroup.orderday;
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
          res = await this.uploadCall(body);
          if (res == 1) {
            this.writeLog(
              "Missing information uploaded successfully",
              "UPLOAD",
              workgroup.orderqueuegroupcode,
              "SUCCESS"
            );
          } else if (res == 0) {
            this.writeLog(
              "Error while uploading missing information",
              "UPLOAD",
              workgroup.orderqueuegroupcode,
              "ERROR"
            );
          }
        },
        (error) => {
          res = 0;
          this.writeLog(
            "Error while uploading missing information",
            "UPLOAD",
            workgroup.orderqueuegroupcode,
            "ERROR"
          );
        }
      );
    } else {
      res = 1;
    }
    // if (isMultiple) {
    //   var orderstatus = new StatusReportModel();
    //   orderstatus.accessionNo = workgroup.orderqueuegroupcode;
    //   this.accessionInProgress = workgroup.orderqueuegroupcode + " in progress";
    // }
    let clsOrderAssignment: any = clsAssginOrder;
    clsOrderAssignment.orderqueuegroupid = [workgroup.orderqueuegroupid];
    if (res) {
      await this.docCoreService
        .AssignOrderInventory(JSON.stringify(clsOrderAssignment))
        .toPromise()
        .then(
          (data) => {
            if (data == 1) {
              if (isMultiple) {
                this.countObj.success++;
                orderstatus.status = 2;
                orderstatus.description =
                  this.orderAssignSource ==
                  enumOrderAssignSource.IncompleteInventory
                    ? "Missing information uploaded and encounter sent to practice successfully."
                    : "Order sent to practice successfully";
                // this.statusArray.push(orderstatus);
              } else {
                this.clsUtility.showSuccess(
                  "Missing information uploaded and " +
                    this.titleMsg.toLowerCase() +
                    " sent to practice successfully"
                );
                this.writeLog(
                  "Missing information uploaded and " +
                    this.titleMsg.toLowerCase() +
                    " sent to practice successfully.",
                  "UPDATE",
                  workgroup.orderqueuegroupcode,
                  "SUCCESS"
                );
              }
            } else if (data == 2) {
              if (isMultiple) {
                this.countObj.skipped++;
                orderstatus.status = 1;
                orderstatus.description =
                  this.titleMsg + " status already changed.";
                // this.statusArray.push(orderstatus);
              } else {
                this.clsUtility.showWarning(
                  this.titleMsg + " status already changed"
                );
                this.writeLog(
                  this.titleMsg + " status already changed.",
                  "UPDATE",
                  workgroup.orderqueuegroupcode,
                  "FAILED"
                );
              }
            } else {
              if (isMultiple) {
                this.countObj.error++;
                orderstatus.status = 0;
                orderstatus.description =
                  "Error while " + this.titleMsg.toLowerCase() + " assignment.";
                // this.statusArray.push(orderstatus);
              } else {
                this.clsUtility.showError("Error while send to practice");
                this.writeLog(
                  "Error while send to practice.",
                  "UPDATE",
                  workgroup.orderqueuegroupcode,
                  "ERROR"
                );
              }
            }
            this.loadingData = false;
          },
          (error) => {
            this.loadingData = false;
            if (isMultiple) {
              this.countObj.error++;
              orderstatus.status = 0;
              orderstatus.description =
                "Error while " + this.titleMsg.toLowerCase() + " assignment.";
              // this.statusArray.push(orderstatus);
            } else {
              this.clsUtility.showError("Error while send to practice");
              this.writeLog(
                "Error while send to practice.",
                "UPDATE",
                workgroup.orderqueuegroupcode,
                "ERROR"
              );
            }
          }
        );
    } else {
      if (isMultiple) {
        this.countObj.error++;
        orderstatus.status = 0;
        orderstatus.description =
          "Missing information is not uploaded hence can not send " +
          this.titleMsg.toLowerCase() +
          " to practice.";
        // this.statusArray.push(orderstatus);
      } else {
        this.clsUtility.showError(
          "Missing information is not uploaded hence can not send " +
            this.titleMsg.toLowerCase() +
            " to practice"
        );
        this.writeLog(
          "Missing information is not uploaded hence can not send " +
            this.titleMsg.toLowerCase() +
            " to practice",
          "UPDATE",
          workgroup.orderqueuegroupcode,
          "ERROR"
        );
      }
    }
    this.percentage += percentangeIncrease;
    this.cdr.detectChanges();
    return orderstatus;
  }

  close() {
    if (
      this.orderAssignSource == 0 ||
      this.orderAssignSource == 3 ||
      this.orderAssignSource == 17 ||
      this.orderAssignSource == 8 ||
      this.orderAssignSource == 10
    )
      this.dataService.orderAssignmentDone.next(false);
    else if (this.orderAssignSource == 5)
      this.dataService.orderReviewAssignmentDone.next(false);
    else if (this.orderAssignSource == 4)
      this.dataService.orderReassignmentDone.next(false);
  }

  setworkqueueassignment() {
    try {
      if (
        this.selectedOrders != null &&
        this.selectedOrders != undefined &&
        this.selectedOrders != []
      ) {
        this.selectedOrdercount = this.selectedOrders.length;
      }
      this.RetriveMasterData();
      if (
        this.orderAssignSource == enumOrderAssignSource.IncompleteInventory ||
        this.orderAssignSource == enumOrderAssignSource.ReadyForPrinting ||
        this.orderAssignSource == enumOrderAssignSource.SubmittedAndPrinted
      ) {
        this.AgentName.clearValidators();
        this.AgentName.updateValueAndValidity();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  formValueChanged() {
    try {
      // this.subscription.add(
      this.GroupName.valueChanges.subscribe((group) => {
        this.loadingData = true;

        if (group !== null && group > 0) {
          this.AgentName.setValue(null);
          this.subscription.add(
            this.authService.getGroupsUser(group).subscribe(
              (users) => {
                if (users != null || users != undefined) {
                  this.AllGroupUsers = users;
                  this.GroupUsers = users;
                }
                let sgroupname = this.allLoginUserGroup.find(
                  (ele) => ele.groupid == this.GroupName.value
                ).groupname;
                // console.log(
                //   this.allLoginUserGroup.find(
                //     (ele) => ele.groupid == this.GroupName.value
                //   ).groupname
                // );
                this.strAssignmentGroupMessage =
                  this.titleMsg +
                  "(s) will be assigned to group : <b>" +
                  sgroupname +
                  "</b>";

                this.loadingData = false;
              },
              (err) => {
                this.loadingData = false;
              }
            )
          );
        } else {
          this.strAssignmentGroupMessage =
            "System will automatically assigned the " +
            this.titleMsg.toLowerCase() +
            "(s) to respective practice Group";
          this.loadingData = false;
          this.GroupUsers = null;
          this.AgentName.reset();
        }
      });
      // );
      this.AgentName.valueChanges.subscribe((user) => {
        if (user !== null && user != "0") {
          let susername = this.GroupUsers.find(
            (ele) => ele.userid == this.AgentName.value
          ).displayname;
          // console.log(
          //   this.allLoginUserGroup.find(
          //     (ele) => ele.groupid == this.GroupName.value
          //   ).groupname
          // );
          this.strAssignmentAgentMessage = " User : <b>" + susername + "</b>";
        } else {
          this.strAssignmentAgentMessage = "";
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  isSameProviderOrder: boolean = false;
  isSameClientEncounter: boolean = false;
  isSameProviderEncounter: boolean = false;
  isAllOrderWithNoProvider: boolean = false;
  strmessage: string = "";
  strAssignmentGroupMessage: string = "";
  strAssignmentAgentMessage: string = "";
  RetriveMasterData() {
    this.loadingData = true;
    if (
      this.orderAssignSource == enumOrderAssignSource.IncompleteInventory ||
      this.orderAssignSource == enumOrderAssignSource.ReadyForPrinting ||
      this.orderAssignSource == enumOrderAssignSource.SubmittedAndPrinted
    ) {
      var clientid: string = "0";
      var providernpi: string = "0";
      this.strAssignmentGroupMessage = "";
      this.strAssignmentAgentMessage = "";

      if (this.selectedOrders.length == 1) {
        clientid =
          this.selectedOrders[0].clientid == null ||
          this.selectedOrders[0].clientid == ""
            ? "0"
            : this.selectedOrders[0].clientid;
        providernpi =
          this.selectedOrders[0].providernpi == null ||
          this.selectedOrders[0].providernpi == ""
            ? "0"
            : this.selectedOrders[0].providernpi;
      } else {
        this.isSameClientEncounter = this.selectedOrders.every(
          (ele) =>
            ele.clientid === this.selectedOrders[0].clientid &&
            ele.clientid != null &&
            ele.clientid != ""
        );
        this.isSameProviderEncounter = this.selectedOrders.every(
          (ele) =>
            ele.providernpi === this.selectedOrders[0].providernpi &&
            ele.providernpi != null &&
            ele.providernpi != ""
        );

        if (this.isSameClientEncounter) {
          clientid =
            this.selectedOrders[0].clientid == null ||
            this.selectedOrders[0].clientid == ""
              ? "0"
              : this.selectedOrders[0].clientid;
        } else {
          clientid = "0";
        }
        if (this.isSameProviderEncounter) {
          providernpi =
            this.selectedOrders[0].providernpi == null ||
            this.selectedOrders[0].providernpi == ""
              ? "0"
              : this.selectedOrders[0].providernpi;
        } else {
          providernpi = "0";
        }
      }

      this.subscription.add(
        this.authService.getClientGroups(clientid, providernpi).subscribe(
          (clientGroup) => {
            if (clientGroup.result != null) {
              // if (!!data.content) {
              this.allLoginUserGroup = clientGroup.result;
              this.loginUserGroup = clientGroup.result;

              if (clientGroup.result.length == 1) {
                this.GroupName.setValue(clientGroup.result[0].groupid);
              }

              if (
                this.selectedOrders.length > 1 &&
                !(this.isSameClientEncounter || this.isSameProviderEncounter)
              ) {
                this.loginUserGroup.splice(0, 0, {
                  groupid: "-1",
                  groupname: "",
                });
              }

              //  else {
              //   this.GroupName.setValue("-1");
              // }

              if (this.selectedOrders.length == 1) {
                this.strmessage = clientGroup.message;
                // this.strmessage =
                //   "System will automatically assigned the " +
                //   this.titleMsg.toLowerCase() +
                //   "(s) to respective practice Group";
              }
              // else {
              //   this.strmessage = clientGroup.message;
              // }
              // this.isSameProviderOrder = this.selectedOrders.every(
              //   (ele) => ele.providernpi === this.selectedOrders[0].providernpi
              // );
              // if (this.selectedOrders.length > 1) {
              //   this.loginUserGroup.splice(0, 0, {
              //     groupid: "-1",
              //     groupname: "",
              //   });
              // }
              // // alert(this.selectedOrders[0].providernpi);
              // // if (
              // //   this.selectedOrders[0].providernpi &&
              // //   this.isSameProviderOrder
              // // ) {
              // if (this.isSameProviderOrder) {
              //   this.subscription.add(
              //     this.authService
              //       .getUserGroupByNpi(this.selectedOrders[0].providernpi)
              //       .subscribe(
              //         (npiuser) => {
              //           if (npiuser) {
              //             if (npiuser.length === 1)
              //               this.GroupName.setValue(npiuser[0].groupid);
              //             else if (this.selectedOrders.length > 1) {
              //               this.GroupName.setValue("-1");
              //             }
              //           } else {
              //             this.isAllOrderWithNoProvider = true;
              //           }
              //           this.loadingData = false;
              //         },
              //         (error) => {
              //           this.loadingData = false;
              //           this.clsUtility.LogError(error);
              //         }
              //       )
              //   );
              // } else {
              //   if (this.selectedOrders.length > 1) {
              //     this.GroupName.setValue("-1");
              //   }
              // }
              // }
            } else {
              this.allLoginUserGroup = null;
              this.loginUserGroup = null;
            }
            this.loadingData = false;
          },
          (error) => {
            this.loadingData = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } else {
      this.subscription.add(
        this.authService
          .getLoginUserGroups(this.dataService.loginGCPUserID.getValue())
          .subscribe(
            (loginusergroup) => {
              if (loginusergroup != null || loginusergroup != undefined) {
                this.allLoginUserGroup = loginusergroup;
                this.loginUserGroup = loginusergroup;
              }
              this.loadingData = false;
            },
            (err) => {
              this.loadingData = false;
            }
          )
      );
    }
  }
  getAllGroups() {
    try {
      this.subscription.add(
        this.authService.getAllGroups().subscribe(
          (data) => {
            if (data) {
              if (!!data.content) {
                this.allLoginUserGroup = data.content;
                this.loginUserGroup = data.content;
              } else {
                this.allLoginUserGroup = null;
                this.loginUserGroup = null;
              }
              this.loadingData = false;
            }
          },
          (error) => {
            this.loadingData = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loadingData = false;
      this.clsUtility.LogError(error);
    }
  }
  validateAssignOrder() {
    try {
      if (
        (this.orderAssignSource == 3 ||
          this.orderAssignSource == 8 ||
          this.orderAssignSource == 10 ||
          (this.AgentName.valid && this.AgentName.value !== 0)) &&
        this.GroupName.valid &&
        this.GroupName.value !== 0
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ResetComponents() {
    this.AssignOrderQueue.reset();
  }
  handleGroupFilter(value) {
    if (this.allLoginUserGroup) {
      this.loginUserGroup = this.allLoginUserGroup.filter(
        (s) => s.groupname.toLowerCase().includes(value.toLowerCase()) === true
      );
    }
  }
  handleAgentFilter(value) {
    if (this.AllGroupUsers) {
      this.GroupUsers = this.AllGroupUsers.filter(
        (s) =>
          s.displayname.toLowerCase().includes(value.toLowerCase()) === true
      );
    }
  }
  async uploadCall(body: UploadMissingInfoModel) {
    return await this.docCoreService.uploadMissingInfo(body).toPromise();
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
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: "AssignWork",
      message: Message,
      useraction: UserAction,
      transactionid: accessionnumber,
      outcome: outcome,
    };
    this.clsAuthLogs.callApi(para);
  }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
