import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";
import { MasterdataService } from "../../../Services/AR/masterdata.service";
import { Action } from "src/app/Model/AR Management/Task/action";
import { Claimadjustmentcode } from "src/app/Model/AR Management/Task/claimadjustmentcode";
import { Claimadjustmentremarkcode } from "src/app/Model/AR Management/Task/claimadjustmentremarkcode";
import { Status } from "src/app/Model/AR Management/Task/status";
import { Utility, enumTaskStatus } from "src/app/Model/utility";
import {
  TaskSave,
  Taskaction,
  TaskStatus,
  TaskActioncode,
  TaskSubstatus,
  TaskFollowup,
  TaskAssigned,
  TaskType,
  ScheduleAction,
  TaskLogAction,
  TaskScheduleAction,
  TaskAutomationError,
} from "src/app/Model/AR Management/Task/task";
import { BehaviorSubject } from "rxjs";
import { CoreoperationService } from "../../../Services/AR/coreoperation.service";
import { QcriberComponent } from "../qcriber/qcriber.component";
import { DatePipe } from "@angular/common";
import { GCPUser } from "src/app/Model/Common/login";
import { ToastrService } from "ngx-toastr";
import { CoreauthService } from "../../../Services/Common/coreauth.service";
import { SubSink } from "../../../../../../node_modules/subsink";
import { Substatus } from "src/app/Model/AR Management/Configuration/substatus";
import * as moment from "moment";
import { Automation } from "src/app/Model/AR Management/Configuration/automation";
@Component({
  selector: "app-task-work-pane",
  templateUrl: "./task-work-pane.component.html",
  styleUrls: ["./task-work-pane.component.css"],
})
export class TaskWorkPaneComponent implements OnInit, OnDestroy, OnChanges {
  private subscription = new SubSink();
  // @Input() SelectedTasks: any;
  constructor(
    private data: DataTransferService,
    private route: Router,
    private fb: FormBuilder,
    private masterService: MasterdataService,
    private coreService: CoreoperationService,
    private authService: CoreauthService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  get fbcActionId() {
    return this.ActionFormGroup.get("fcActionID");
  }
  get fbcStatus() {
    return this.ActionFormGroup.get("fcStatus");
  }
  get fbcSubStatus() {
    return this.ActionFormGroup.get("fcSubStatus");
  }
  get fbcAction() {
    return this.ActionFormGroup.get("fcAction");
  }
  get fbcFolloupLogAction() {
    return this.ActionFormGroup.get("fcFolloupLogAction");
  }
  get fbcFolloupLogDate() {
    return this.ActionFormGroup.get("fcFolloupLogDate");
  }
  get fbcFolloupScheduleAction() {
    return this.ActionFormGroup.get("fcFolloupScheduleAction");
  }
  get fbcFolloupScheduleDays() {
    return this.ActionFormGroup.get("fcFolloupScheduleDays");
  }
  get fbcFolloupScheduleDate() {
    return this.ActionFormGroup.get("fcFolloupScheduleDate");
  }
  get fbcReasonCode() {
    return this.ActionFormGroup.get("fcReasonCode");
  }
  get fbcRemarkCode() {
    return this.ActionFormGroup.get("fcRemarkCode");
  }
  get fbcActionNote() {
    return this.ActionFormGroup.get("fcActionNote");
  }
  get fbcTFLFromDOS() {
    return this.ActionFormGroup.get("fcTFLFromDOS");
  }
  get fbcWorkType() {
    return this.ActionFormGroup.get("fcWorkType");
  }
  get fbcAssignTo() {
    return this.ActionFormGroup.get("fcAssignTo");
  }
  get fbcTaskType() {
    return this.ActionFormGroup.get("fcTaskType");
  }
  get fbcDueDate() {
    return this.ActionFormGroup.get("fcDueDate");
  }
  get fbcAssignComment() {
    return this.ActionFormGroup.get("fcAssignComment");
  }
  get fbcAutomationError() {
    return this.ActionFormGroup.get("fcAutomationError");
  }
  get fbcAutomationStatus() {
    return this.ActionFormGroup.get("fcAutomationStatus");
  }
  // get fbcFollowup() {
  //   return this.ActionFormGroup.get("fcFollowup");
  // }
  // get fbcFollowupDate() {
  //   return this.ActionFormGroup.get("fcFollowupDate");
  // }
  // get fbcFollowupNote() {
  //   return this.ActionFormGroup.get("fcFollowupNote");
  // }

  // isSave = new BehaviorSubject<boolean>(false);
  gselectedTasks: any;
  gcurrentTask: any;
  gcurrentIndex: number;
  gtotalSelectedTaskCount: number;
  disableNext: boolean;
  reasoncode: Claimadjustmentcode[];
  remarkcode: Claimadjustmentremarkcode[];
  ActionNote: string;
  Status: Status[];
  SubStatus: Substatus[];
  Agents: GCPUser[];
  TaskType: TaskType[];
  AutomationError: Automation[];
  ScheduledAction: ScheduleAction[];
  LogAction: ScheduleAction[];
  Actions: Action[];
  clsUtility: Utility;
  // clsStatus: Status;
  // clsAction: Action;
  // clsReasonCode: Claimadjustmentcode;
  // clsRemarkCode: Claimadjustmentremarkcode;
  SelectedRSID: any;
  SelectedRMID: any;
  SelectedActionID: any;
  SelectedStatusID: any;
  SelectedSubStatusID: any;
  SelectedAssignTo: any = 0;
  SelectedAssignToUsername: string = "";
  SelectedTaskType: any = 0;
  SelectedAutomationErrorStatusID: any = 0;
  SelectedTaskTypename: string = "";
  SelectedFollowupLogActionID: any;
  SelectedFollowupScheduledActionID: any;
  @ViewChild("Qcriber", { static: true }) private myQcriber: QcriberComponent;
  defaultDays: number = 15;
  ActionFormGroup = this.fb.group({
    fcActionID: [0],
    fcStatus: ["", Validators.required],
    fcSubStatus: ["", Validators.required],
    fcAction: ["", Validators.required],
    fcReasonCode: [""],
    fcRemarkCode: [""],
    fcActionNote: ["", Validators.required],
    fcTFLFromDOS: [""],
    fcWorkType: ["", Validators.required],
    fcAssignTo: [""],
    fcTaskType: ["", Validators.required],
    fcDueDate: ["", Validators.required],
    fcAssignComment: ["", Validators.required],
    fcFolloupLogAction: ["", Validators.required],
    fcFolloupLogDate: [new Date()],
    fcFolloupScheduleAction: [""],
    fcFolloupScheduleDays: [this.defaultDays],
    fcFolloupScheduleDate: [
      new Date(moment().add(this.defaultDays, "day").toDate()),
      Validators.required,
    ],
    fcAutomationError: ["", Validators.required],
    fcAutomationStatus: ["", Validators.required],
    // fcFollowup: [""],
    // fcFollowupDate: [""],
    // fcFollowupNote: [""]
  });
  TaskActionNactionid: number = 0;
  WorkType: string;
  submitted = false;
  public min: Date = new Date(
    new DatePipe("en-US").transform(new Date(), "MM/dd/yyyy")
  );
  public minDueDate: Date;
  public default = { userid: 0, displayname: "Select" };
  loginuserID: number;
  loadingTask: boolean = true;
  showAutomationStatus = false;
  public ddlWorkType: any = [
    { text: "On-Call Payer", value: "On-Call Payer" },
    { text: "IVR Payer", value: "IVR Payer" },
    { text: "Website - Payer", value: "Website - Payer" },
    { text: "Website - Clearinghouse", value: "Website - Clearinghouse" },
    { text: "E-mail", value: "E-mail" },
    { text: "Fax", value: "Fax" },
    { text: "Other", value: "Other" },
  ];
  ngOnInit() {
    try {
      if (this.data.SelectedTasks == null) {
        this.NavigateBack();
      } else {
        this.loadingTask = true;
        // if (this.RetriveMasterData()) {
        //   console.log("all master loaded");
        // }
        this.RetriveMasterData();

        // setTimeout(() => this.toastr.warning("sup"));
        // this.showSuccess();
        // console.log(this.reasoncode);

        this.gselectedTasks = this.data.SelectedTasks;
        this.gcurrentIndex = 0;
        this.gtotalSelectedTaskCount = this.gselectedTasks.length;
        if (this.gtotalSelectedTaskCount == 1) {
          this.disableNext = true;
        } else {
          this.disableNext = false;
        }
        this.ShowTask(this.gcurrentIndex);
        this.formValueChanged();
        // this.data.ActionNote = 'on load';
        this.subscription.add(
          this.data.cascadedNote.subscribe(
            (data) => {
              this.fbcActionNote.setValue(data);
            },
            (err) => {
              this.loadingTask = false;
            }
          )
        );
        this.subscription.add(
          this.data.loginUserID.subscribe(
            (data) => {
              this.loginuserID = data;
            },
            (err) => {
              this.loadingTask = false;
            }
          )
        );
        this.loadingTask = false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.fbcReasonCode.valueChanges.subscribe(
          (data: number) => {
            this.SelectedRSID = data;
            // console.log("RC: " + this.SelectedRSID);
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcRemarkCode.valueChanges.subscribe(
          (data: number) => {
            this.SelectedRMID = data;
            // console.log("RM: " + data);
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcAction.valueChanges.subscribe(
          (data: number) => {
            // console.log(data);
            this.SelectedActionID = data;
            // console.log('Action: ' + data);
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcStatus.valueChanges.subscribe(
          (data: number) => {
            // console.log(data);
            this.SelectedStatusID = data;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcSubStatus.valueChanges.subscribe(
          (data: number) => {
            // console.log(data);
            this.SelectedSubStatusID = data;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcAssignTo.valueChanges.subscribe(
          (data: any) => {
            // console.log(data);
            if (data != null && data != "") {
              // console.log(this.loginuserID);
              if (this.Agents !== undefined) {
                // console.log(this.Agents);
                if (this.loginuserID === data) {
                  this.clsUtility.showWarning(
                    "Task cannot assign to login user"
                  );
                }
                this.SelectedAssignTo = data;
                // const selectedAgent = this.Agents.find(x => x.userid == data);
                // console.log(selectedAgent);
                // this.SelectedAssignToUsername = selectedAgent.displayname;
              }
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcTaskType.valueChanges.subscribe(
          (data: any) => {
            // console.log(data);
            if (data != null && data != "") {
              // console.log(this.loginuserID);
              if (this.TaskType !== undefined) {
                // console.log(this.Agents);
                this.SelectedTaskType = data;
                // const selectedAgent = this.Agents.find(x => x.userid == data);
                // console.log(selectedAgent);
                // this.SelectedAssignToUsername = selectedAgent.displayname;
              }
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcAutomationStatus.valueChanges.subscribe(
          (data: any) => {
            // console.log(data);
            if (data != null && data != "") {
              // console.log(this.loginuserID);
              if (this.AutomationError !== undefined) {
                // console.log(this.Agents);
                this.SelectedAutomationErrorStatusID = data;
                // const selectedAgent = this.Agents.find(x => x.userid == data);
                // console.log(selectedAgent);
                // this.SelectedAssignToUsername = selectedAgent.displayname;
              }
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcFolloupLogAction.valueChanges.subscribe(
          (data: any) => {
            // console.log(data);
            if (data != null && data != "") {
              // console.log(this.loginuserID);
              if (this.ScheduledAction !== undefined) {
                // console.log(this.Agents);
                this.SelectedFollowupLogActionID = data;
                this.fbcFolloupLogDate.setValue(new Date(moment().toDate()));
                // const selectedAgent = this.Agents.find(x => x.userid == data);
                // console.log(selectedAgent);
                // this.SelectedAssignToUsername = selectedAgent.displayname;
              }
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcFolloupScheduleAction.valueChanges.subscribe(
          (data: any) => {
            // console.log(data);
            if (data != null && data != "") {
              // console.log(this.loginuserID);
              if (this.ScheduledAction !== undefined) {
                // console.log(this.Agents);
                this.SelectedFollowupScheduledActionID = data;
                const today = moment().add(this.defaultDays, "day");
                this.fbcFolloupScheduleDate.setValue(new Date(today.toDate()));
                // const selectedAgent = this.Agents.find(x => x.userid == data);
                // console.log(selectedAgent);
                // this.SelectedAssignToUsername = selectedAgent.displayname;
              }
            } else {
              this.SelectedFollowupScheduledActionID = null;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.fbcFolloupScheduleDays.valueChanges.subscribe(
          (data: number) => {
            // console.log(data);
            if (data != null) {
              const today = moment().add(data, "day");
              // console.log(moment().toDate());
              // console.log(today.toDate());
              // console.log(
              //   new DatePipe("en-US").transform(today.toDate(), "MM/dd/yyyy")
              // );
              this.fbcFolloupScheduleDate.setValue(new Date(today.toDate()));
              // this.fbcFolloupScheduleDate.setValue(
              //   new DatePipe("en-US").transform(today.toDate(), "MM/dd/yyyy")
              // );
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      // this.subscription.add(
      //   this.fbcFolloupScheduleAction.valueChanges.subscribe((data: any) => {
      //     console.log(data);
      //     if (data != null && data != "") {
      //       // console.log(this.loginuserID);
      //       if (this.TaskType !== undefined) {
      //         // console.log(this.Agents);
      //         this.SelectedTaskType = data;
      //         // const selectedAgent = this.Agents.find(x => x.userid == data);
      //         // console.log(selectedAgent);
      //         // this.SelectedAssignToUsername = selectedAgent.displayname;
      //       }
      //     }
      //   })
      // );
      this.subscription.add(
        this.fbcWorkType.valueChanges.subscribe(
          (data: any) => {
            if (data != null) {
              // console.log(data);
              this.WorkType = data;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  RetriveMasterData(): any {
    //    this.reasoncode=this.masterService.getResoneCode();
    // var result = false,
    //   resultReasoncode = false,
    //   resultRemarkcode = false,
    //   resultAction = false,
    //   resultStatus = false,
    //   resultSubstatus = false,
    //   resultLogAction = false,
    //   resultScheduledAction = false,
    //   resultTaskType = false,
    //   resultAgent = false;
    try {
      this.subscription.add(
        this.masterService.getReasonCode(0).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.reasoncode = data;
              // resultReasoncode = true;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getRemarkCode(0).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.remarkcode = data;
              // resultRemarkcode = true;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getStatus(0, 1).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.Status = data;
              // resultStatus = true;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getSubStatus(0, 1).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.SubStatus = data;
              // resultSubstatus = true;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getAction(0, 1).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.Actions = data;
              // resultAction = true;
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      // this.masterService.getAgents(0).subscribe(data => {
      //   this.Agents = data;
      // });
      this.subscription.add(
        this.authService.getAllLocalGCPUser().subscribe(
          (data) => {
            // console.log(data);
            this.loadingTask = true;
            if (data != null || data != undefined) {
              this.Agents = data;
              // resultAgent = true;
            }
            this.loadingTask = false;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getTaskType().subscribe(
          (data) => {
            // console.log(data);
            this.loadingTask = true;
            if (data != null || data != undefined) {
              this.TaskType = data;
              // resultTaskType = true;
            }
            this.loadingTask = false;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getAutomationError(0, 1).subscribe(
          (data) => {
            // console.log(data);
            this.loadingTask = true;
            if (data != null || data != undefined) {
              this.AutomationError = data;
              // resultTaskType = true;
            }
            this.loadingTask = false;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      this.subscription.add(
        this.masterService.getScheduleMasterAction(0).subscribe(
          (data) => {
            // console.log(data);
            this.loadingTask = true;
            if (data != null || data != undefined) {
              this.ScheduledAction = data;
              this.LogAction = data;
              // resultLogAction = true;
              // resultScheduledAction = true;
            }
            this.loadingTask = false;
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
      // if (
      //   resultAction &&
      //   resultAgent &&
      //   resultLogAction &&
      //   resultReasoncode &&
      //   resultRemarkcode &&
      //   resultScheduledAction &&
      //   resultStatus &&
      //   resultSubstatus &&
      //   resultTaskType
      // ) {
      //   result = true;
      // } else {
      //   result = false;
      // }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
    // return result;
  }
  ngOnDestroy(): void {
    this.gselectedTasks = null;
    this.gcurrentIndex = 0;
    this.gcurrentTask = null;
    this.gtotalSelectedTaskCount = 0;
    // this.isSave.unsubscribe();
    this.clearControls();
    this.data.editTaskID = 0;
    this.subscription.unsubscribe();
  }

  ShowTask(index) {
    try {
      this.loadingTask = true;
      if (index < this.gtotalSelectedTaskCount) {
        this.gcurrentTask = null;
        this.subscription.add(
          this.masterService
            .getAllTasks(this.gselectedTasks[index].ntaskid)
            .subscribe(
              (data) => {
                if (data != null || data != undefined) {
                  this.gcurrentTask = data;
                  // console.log("data" + JSON.stringify(data));

                  if (
                    this.data.editTaskID === 0 ||
                    this.data.editTaskID === undefined
                  ) {
                    this.gcurrentTask.taskstarttime = this.clsUtility.currentDateTime();
                  } else {
                    this.gcurrentTask.taskstarttime = this.gcurrentTask.taskstarttime;
                  }
                  // console.log(this.gcurrentTask);
                  // console.log('claim info: '+this.gcurrentTask.claiminfo);
                  // console.log('patient info: '+this.gcurrentTask.patientinfo);
                  // console.log('status info: '+this.gcurrentTask.statusinfo);
                  // this.data.SelectedTasksClaimInfo = this.gcurrentTask.claiminfo;
                  // this.data.SelectedTasksClaimInfo.workqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
                  this.data.SelectedTasksworkqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
                  // this.data.SelectedTasksPatientInfo = this.gcurrentTask.patientinfo;
                  // this.data.SelectedTasksStatusInfo = this.gcurrentTask.statusinfo;
                  this.data.SubSelectedTasksClaimInfo.next(
                    this.gcurrentTask.claiminfo
                  );
                  // this.data.SubSelectedTasksClaimInfo.next(
                  //   this.gcurrentTask.claiminfo
                  // );
                  this.data.SubSelectedTasksPatientInfo.next(
                    this.gcurrentTask.patientinfo
                  );
                  this.data.SubSelectedTasksStatusInfo.next(
                    this.gcurrentTask.statusinfo
                  );

                  if (
                    this.data.editTaskID !== 0 &&
                    this.data.editTaskID !== undefined
                  ) {
                    const taskaction: Taskaction = this.gcurrentTask.taskaction;
                    const taskAssign: TaskAssigned = this.gcurrentTask
                      .taskassign;
                    this.FillTaskActions(taskaction, taskAssign);
                  } else {
                    this.minDueDate = new Date(
                      new DatePipe("en-US").transform(new Date(), "MM/dd/yyyy")
                    );
                    this.TaskActionNactionid = 0;
                    this.fbcFolloupScheduleDays.setValue(this.defaultDays);
                  }
                } else {
                  this.gcurrentTask = null;
                }
              },
              (err) => {
                this.loadingTask = false;
              }
            )
        );
      }
      this.loadingTask = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  FillTaskActions(taskAction: any, taskAssigned: any): any {
    // console.log(taskAction);
    this.TaskActionNactionid = taskAction.nactionid;
    this.fbcStatus.setValue(taskAction.status.statusId);
    this.fbcSubStatus.setValue(taskAction.substatus.subStatusId);
    this.fbcAction.setValue(taskAction.action.actionId);
    this.fbcReasonCode.setValue(taskAction.reasoncodes);
    this.fbcRemarkCode.setValue(taskAction.remarkcodes);
    this.fbcActionNote.setValue(taskAction.notes);
    this.fbcTFLFromDOS.setValue(taskAction.tflfromdos);
    this.fbcWorkType.setValue(taskAction.sworktype);
    this.fbcFolloupLogAction.setValue(taskAction.logaction.logactionid);
    if (taskAction.scheduleaction != null) {
      this.fbcFolloupScheduleAction.setValue(
        taskAction.scheduleaction.scheduleactionid
      );
      this.fbcFolloupScheduleDate.setValue(
        new Date(taskAction.scheduleaction.scheduleactiondate)
      );
    }

    if (taskAssigned !== null) {
      this.minDueDate = new Date(
        new DatePipe("en-US").transform(taskAssigned.duedate, "MM/dd/yyyy")
      );
      // var sAssingedID: string = taskAssigned.nassignedtoid;
      this.fbcAssignTo.setValue(taskAssigned.nassignedtoid);
      this.fbcDueDate.setValue(new Date(taskAssigned.duedate));
      this.fbcAssignComment.setValue(taskAssigned.assignmentnote);
      if (taskAssigned.stype !== undefined && taskAssigned.stype != null) {
        var selectedTaskType = this.TaskType.find(
          (x) => x.stype === taskAssigned.stype
        );
        this.fbcTaskType.setValue(selectedTaskType.ntypeid);
      }
    }
    this.fbcAutomationError.setValue(
      taskAction.automationerror.automationstatus
    );
    let autoError: string = "" + taskAction.automationerror.automationstatus;
    if (autoError.toUpperCase() === "NO") {
      this.showAutomationStatus = true;
      this.fbcAutomationStatus.setValue(
        taskAction.automationerror.automationerrorid
      );
    } else {
      this.showAutomationStatus = false;
    }
  }

  btnNext_click() {
    try {
      this.PerformNextTask();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private PerformNextTask() {
    try {
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

  btnSave_Next_click() {
    try {
      this.saveTaskAction(true);
      //   this.PerformNextTask();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  saveTaskAction(isSaveNext: boolean) {
    try {
      // if (this.SelectedStatusID == undefined) {
      //   alert("Status is not selected");
      //   return false;
      // }
      // if (this.SelectedActionID == undefined) {
      //   alert("Action is not selected");
      //   return false;
      // }
      // // console.log(this.fbcActionNote.value);

      // if (this.fbcActionNote.value == "") {
      //   alert("Enter note");
      //   return false;
      // }
      // if (this.fbcWorkType.value == "") {
      //   alert("Select work type");
      //   return false;
      // }
      // if (this.fbcAssignTo.value >= 0) {
      //   if (this.fbcDueDate.value == "") {
      //     alert("Select due date");
      //     return false;
      //   }
      //   if (this.fbcAssignComment.value == "") {
      //     alert("Enter comment");
      //     return false;
      //   }
      // }

      // console.log(this.ActionFormGroup.invalid);
      // console.log(this.SelectedAssignTo);
      // console.log(this.data.SelectedUserid);
      this.submitted = true;
      if (this.SelectedAssignTo == this.loginuserID) {
        this.clsUtility.showWarning("Task cannot assign to login user");
        return;
      }

      if (
        this.fbcActionNote.invalid ||
        this.fbcStatus.invalid ||
        this.fbcSubStatus.invalid ||
        this.fbcAction.invalid ||
        this.fbcWorkType.invalid ||
        (this.fbcAssignTo.value > 0 &&
          (this.fbcDueDate.invalid ||
            this.fbcAssignComment.invalid ||
            this.fbcTaskType.invalid)) ||
        this.fbcFolloupLogAction.invalid ||
        (this.fbcFolloupScheduleAction.value > 0 &&
          this.fbcFolloupScheduleDate.invalid) ||
        this.fbcAutomationError.invalid ||
        (this.fbcAutomationError.value === "No" &&
          this.fbcAutomationStatus.invalid)
      ) {
        // this.clsUtility.showInfo("invalid inputs");
        return;
      }
      this.loadingTask = true;
      var isSave = new BehaviorSubject<boolean>(false);

      const datepipe = new DatePipe("en-US");
      var saveDatatime = this.clsUtility.currentDateTime();
      // console.log(
      //   "this.clsUtility.currentDateTime()" + this.clsUtility.currentDateTime()
      // );
      // console.log(saveDatatime);

      // console.log(this.data.editTaskID);

      if (this.data.editTaskID === 0 || this.data.editTaskID === undefined) {
        this.gcurrentTask.taskendtime = saveDatatime;
      } else {
        this.gcurrentTask.taskendtime = this.gcurrentTask.taskendtime;
      }
      // console.log(this.gcurrentTask.taskendtime);
      // console.log(this.gcurrentTask.taskstarttime);

      this.gcurrentTask.modifiedon = saveDatatime;
      const duedate = datepipe.transform(this.fbcDueDate.value, "yyyy-MM-dd");
      // console.log(duedate);
      // console.log(datepipe.transform(new Date(), ""yyyy-MM-ddTHH:mm:ss.SSSZ""));

      var taskSave = new TaskSave();
      var taskAction = new Taskaction();
      var taskStatus = new TaskStatus();
      var taskActionCode = new TaskActioncode();
      var taskSubStatus = new TaskSubstatus();
      var taskFollowUp = null; //new TaskFollowup();
      var taskAssignment = new TaskAssigned();
      var taskLogAction = new TaskLogAction();
      var taskScheduleAction = new TaskScheduleAction();
      var taskAutomationError = new TaskAutomationError();

      // console.log('status: ' + this.SelectedStatusID);
      // console.log('action: ' + this.SelectedActionID);
      // console.log(taskAction);
      var selectedStatus = this.Status.find(
        (x) => x.nstatusid === this.SelectedStatusID
      );
      var selectedSubStatus = this.SubStatus.find(
        (x) => x.nsubstatusid === this.SelectedSubStatusID
      );
      var selectedAction = this.Actions.find(
        (x) => x.nactionid === this.SelectedActionID
      );
      var selectedlogAction = this.LogAction.find(
        (x) => x.id === this.SelectedFollowupLogActionID
      );
      var selectedscheduleAction = this.ScheduledAction.find(
        (x) => x.id === this.SelectedFollowupScheduledActionID
      );
      console.log(this.fbcAutomationError.value);
      if (this.fbcAutomationError.value === "No") {
        var selectedAutomationError = this.AutomationError.find(
          (x) => x.nautomationerrorid === this.SelectedAutomationErrorStatusID
        );
      }

      if (selectedStatus !== undefined) {
        taskStatus.statusId = selectedStatus.nstatusid;
        taskStatus.statusCode = selectedStatus.sstatuscode;
        taskStatus.statusDescription = selectedStatus.sstatusdescription;
      } else {
        taskStatus = null;
      }
      if (selectedAction !== undefined) {
        taskActionCode.actionId = selectedAction.nactionid;
        taskActionCode.actionCode = selectedAction.sactioncode;
        taskActionCode.actionDescription = selectedAction.sactiondescription;
      } else {
        taskActionCode = null;
      }
      if (selectedSubStatus !== undefined) {
        taskSubStatus.subStatusId = selectedSubStatus.nsubstatusid;
        taskSubStatus.subStatusCode = selectedSubStatus.ssubstatuscode;
        taskSubStatus.subStatusDescription =
          selectedSubStatus.ssubstatusdescription;
      } else {
        taskSubStatus = null;
      }
      if (selectedlogAction !== undefined) {
        taskLogAction.logactionid = selectedlogAction.id;
        taskLogAction.logactioncode = selectedlogAction.actioncode;
        taskLogAction.logactiondescription =
          selectedlogAction.actiondescription;
        taskLogAction.logactiondate = this.fbcFolloupLogDate.value;
        taskLogAction.logclaimactioncode = selectedlogAction.sclaimactioncode;
      } else {
        taskLogAction = null;
      }
      if (selectedscheduleAction !== undefined) {
        taskScheduleAction.scheduleactionid = selectedscheduleAction.id;
        taskScheduleAction.scheduleactioncode =
          selectedscheduleAction.actioncode;
        taskScheduleAction.scheduleactiondescription =
          selectedscheduleAction.actiondescription;
        taskScheduleAction.scheduleactiondate = this.fbcFolloupScheduleDate.value;
      } else {
        taskScheduleAction = null;
      }
      if (selectedAutomationError !== undefined) {
        taskAutomationError.automationerrorid =
          selectedAutomationError.nautomationerrorid;
        taskAutomationError.automationerrordesc =
          selectedAutomationError.sautomationerrordescription;
        taskAutomationError.automationstatus = this.fbcAutomationError.value;
      } else {
        taskAutomationError.automationerrorid = 0;
        taskAutomationError.automationerrordesc = "";
        taskAutomationError.automationstatus = this.fbcAutomationError.value;
        // taskAutomationError = null;
      }

      if (
        taskStatus != null &&
        taskSubStatus != null &&
        taskActionCode != null &&
        taskLogAction != null &&
        taskAutomationError != null
      ) {
        isSave.next(true);
      }

      // console.log("++++selected++++");
      // console.log(this.SelectedStatusID);
      // console.log("selectedStatus: " + JSON.stringify(selectedStatus));
      // console.log(this.SelectedSubStatusID);
      // console.log("selectedSubStatus: " + JSON.stringify(selectedSubStatus));
      // console.log(this.SelectedActionID);
      // console.log("selectedAction: " + JSON.stringify(selectedAction));
      // console.log(this.SelectedFollowupLogActionID);
      // console.log("selectedlogAction: " + JSON.stringify(selectedlogAction));
      // console.log(this.SelectedFollowupScheduledActionID);
      // console.log(
      //   "selectedscheduleAction: " + JSON.stringify(selectedscheduleAction)
      // );
      // console.log(isSave.value);

      // console.log("----selected-----");

      // this.subscription.add(
      //   this.masterService
      //     .getStatus(this.SelectedStatusID)
      //     .subscribe((x: any) => {
      //       // console.log('Status: ' + JSON.stringify(x));
      //       if (x != null || x != undefined) {
      //         taskStatus.statusId = x.nstatusid;
      //         taskStatus.statusCode = x.sstatuscode;
      //         taskStatus.statusDescription = x.sstatusdescription;

      //         this.subscription.add(
      //           this.masterService
      //             .getSubStatus(this.SelectedSubStatusID)
      //             .subscribe((x: any) => {
      //               if (x != null || x != undefined) {
      //                 taskSubStatus.subStatusId = x.nsubstatusid;
      //                 taskSubStatus.subStatusCode = x.ssubstatuscode;
      //                 taskSubStatus.subStatusDescription =
      //                   x.ssubstatusdescription;

      //                 // console.log('Status: ' + JSON.stringify(taskStatus));
      //                 // this.isSave.next({name: 'status', value: true });
      //                 this.subscription.add(
      //                   this.masterService
      //                     .getAction(this.SelectedActionID)
      //                     .subscribe((x: any) => {
      //                       // console.log('Action: ' + JSON.stringify(x));
      //                       if (x != null || x != undefined) {
      //                         taskActionCode.actionId = x.nactionid;
      //                         taskActionCode.actionCode = x.sactioncode;
      //                         taskActionCode.actionDescription =
      //                           x.sactiondescription;
      //                         // console.log('Action: ' + JSON.stringify(taskActionCode));
      //                         this.subscription.add(
      //                           this.masterService
      //                             .getScheduleMasterAction(
      //                               this.SelectedFollowupLogActionID
      //                             )
      //                             .subscribe((x: any) => {
      //                               // console.log('LogAction: ' + JSON.stringify(x));
      //                               if (x != null || x != undefined) {
      //                                 taskLogAction.logactionid = x.id;
      //                                 taskLogAction.logactioncode =
      //                                   x.actioncode;
      //                                 taskLogAction.logactiondescription =
      //                                   x.actiondescription;
      //                                 taskLogAction.logactiondate = this.fbcFolloupLogDate.value;
      //                                 // console.log('Action: ' + JSON.stringify(taskActionCode));
      //                                 if (
      //                                   this
      //                                     .SelectedFollowupScheduledActionID !=
      //                                   undefined
      //                                 ) {
      //                                   this.subscription.add(
      //                                     this.masterService
      //                                       .getScheduleMasterAction(
      //                                         this
      //                                           .SelectedFollowupScheduledActionID
      //                                       )
      //                                       .subscribe((x: any) => {
      //                                         // console.log('Action: ' + JSON.stringify(x));
      //                                         if (x != null || x != undefined) {
      //                                           taskScheduleAction.scheduleactionid =
      //                                             x.id;
      //                                           taskScheduleAction.scheduleactioncode =
      //                                             x.actioncode;
      //                                           taskScheduleAction.scheduleactiondescription =
      //                                             x.actiondescription;
      //                                           taskScheduleAction.scheduleactiondate = this.fbcFolloupScheduleDate.value;
      //                                           // console.log('Action: ' + JSON.stringify(taskActionCode));
      //                                           isSave.next(true);
      //                                         }
      //                                       })
      //                                   );
      //                                 } else {
      //                                   isSave.next(true);
      //                                 }
      //                               }
      //                             })
      //                         );
      //                       }
      //                     })
      //                 );
      //               }
      //             })
      //         );
      //       }
      //     })
      // );
      // console.log("++++Service++++");
      // console.log(this.SelectedStatusID);
      // console.log(taskStatus);
      // console.log(this.SelectedSubStatusID);
      // console.log(taskSubStatus);
      // console.log(this.SelectedActionID);
      // console.log(taskActionCode);
      // console.log(this.SelectedFollowupLogActionID);
      // console.log(taskLogAction);
      // console.log(this.SelectedFollowupScheduledActionID);
      // console.log(taskScheduleAction);
      // console.log("----Service-----");

      // this.masterService.getStatus(this.SelectedStatusID).subscribe((x: any) => {
      //   taskStatus.statusId = x.statusId;
      //   taskStatus.statusCode = x.statusCode;
      //   taskStatus.statusDescription = x.statusDescription;
      //     console.log('Status: ' + JSON.stringify(taskStatus));
      //   });
      this.subscription.add(
        isSave.subscribe(
          (response) => {
            // console.log(response);
            // if ((response.name === 'status' && response.value === true) && (response.name === 'action' && response.value === true)) {
            if (isSave.value) {
              taskAction.nactionid = this.TaskActionNactionid;
              taskAction.ntaskid = this.gcurrentTask.taskid;
              taskAction.nuserid = this.gcurrentTask.nassignedtoid;
              taskAction.createdon = this.gcurrentTask.createdon;
              taskAction.modifiedon = this.gcurrentTask.modifiedon;
              taskAction.notes = this.fbcActionNote.value;
              taskAction.reasoncodes = this.SelectedRSID;
              taskAction.remarkcodes = this.SelectedRMID;
              taskAction.status = taskStatus;
              taskAction.substatus = taskSubStatus;
              taskAction.actioncode = taskActionCode;
              taskAction.tflfromdos = this.fbcTFLFromDOS.value;
              taskAction.sworktype = this.fbcWorkType.value;
              taskAction.logaction = taskLogAction;
              taskAction.scheduleaction = taskScheduleAction;
              taskAction.automationerror = taskAutomationError;

              // taskFollowUp.followupdate =
              //   this.fbcFollowupDate.value === ""
              //     ? null
              //     : this.fbcFollowupDate.value;
              // taskFollowUp.followupnote = this.fbcFollowupNote.value;

              taskAssignment.nassignedtoid = this.SelectedAssignTo;
              taskAssignment.duedate = duedate;

              taskAssignment.assignmentnote = this.fbcAssignComment.value;
              if (this.Agents !== undefined) {
                const selectedAgent = this.Agents.find(
                  (x) => x.ngcpuserid === this.SelectedAssignTo
                );
                // console.log(selectedAgent);

                if (selectedAgent !== undefined) {
                  this.SelectedAssignToUsername = selectedAgent.displayname;
                }
              }

              if (this.TaskType !== undefined) {
                const selectedTaskType = this.TaskType.find(
                  (x) => x.ntypeid === this.SelectedTaskType
                );
                // console.log(selectedTaskType);

                if (selectedTaskType !== undefined) {
                  this.SelectedTaskTypename = selectedTaskType.stype;
                }
                taskAssignment.stype = this.SelectedTaskTypename;
              }
              taskAssignment.sassignedtousername = this.SelectedAssignToUsername;

              taskSave.ntaskid = this.gcurrentTask.taskid;
              taskSave.nuserid = this.gcurrentTask.nuserid;
              taskSave.susername = this.gcurrentTask.susername;
              taskSave.nworkqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
              taskSave.nparenttaskid = this.gcurrentTask.nparenttaskid;
              taskSave.staskcode = this.gcurrentTask.staskcode;
              taskSave.tasktitle = this.gcurrentTask.tasktitle;
              taskSave.taskdeciption = this.gcurrentTask.taskdeciption;
              taskSave.priority = this.gcurrentTask.priority;
              taskSave.createdby = this.gcurrentTask.createdby;
              taskSave.nassignedtoid = this.gcurrentTask.nassignedtoid;
              taskSave.sassignedtousername = this.gcurrentTask.assignedtousername;
              taskSave.updatedby = this.loginuserID; // this.gcurrentTask.updatedby;
              taskSave.nstatus = enumTaskStatus.Closed;
              taskSave.tasktype = this.gcurrentTask.tasktype;
              taskSave.tasknotes = this.gcurrentTask.tasknotes;
              taskSave.taskstarttime = this.gcurrentTask.taskstarttime;
              taskSave.taskendtime = this.gcurrentTask.taskendtime;
              taskSave.createdon = this.gcurrentTask.createdon;
              taskSave.modifiedon = this.gcurrentTask.modifiedon;
              taskSave.taskaction = taskAction;
              taskSave.followup = null;
              //taskFollowUp.followupdate === null ? null : taskFollowUp;
              taskSave.assigned =
                taskAssignment.nassignedtoid === 0 ? null : taskAssignment;
              taskSave.nclientid = this.gcurrentTask.clientinfo.nclientid;
              taskSave.sclientname = this.gcurrentTask.clientinfo.clientname;

              // // // console.log("taskSave : " + JSON.stringify(taskSave));
              // // // this.clsUtility.showSuccess("Task is save");
              // // // // alert("Task is save");
              // // // // console.log(isSaveNext);
              // // // isSave.unsubscribe();
              // // // this.clearControls();
              // // // taskAction = null;
              // // // taskStatus = null;
              // // // taskActionCode = null;
              // // // taskSubStatus = null;
              // // // taskFollowUp = null;
              // // // taskAssignment = null;
              // // // taskAutomationError = null;
              // // // taskSave = null;

              // // // this.loadingTask = false;
              // // // if (isSaveNext) {
              // // //   this.PerformNextTask();
              // // // } else {
              // // //   this.NavigateBack();
              // // // }
              this.subscription.add(
                this.coreService.saveTask(taskSave).subscribe(
                  (data: number) => {
                    if (data != null || data != undefined) {
                      if (data === 1) {
                        this.clsUtility.showSuccess("Task is save");
                        // alert("Task is save");
                        // console.log(isSaveNext);
                        isSave.unsubscribe();
                        this.clearControls();
                        taskAction = null;
                        taskStatus = null;
                        taskActionCode = null;
                        taskSubStatus = null;
                        taskFollowUp = null;
                        taskAssignment = null;
                        taskSave = null;

                        this.loadingTask = false;
                        if (isSaveNext) {
                          this.PerformNextTask();
                        } else {
                          this.NavigateBack();
                        }
                      } else {
                        this.clsUtility.showError("Error for task save");
                        // alert("Error for task save");
                      }
                    }
                  },
                  (err) => {
                    this.loadingTask = false;
                  }
                )
              );
            }
          },
          (err) => {
            this.loadingTask = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
      return false;
    } finally {
    }
  }
  clearControls(): any {
    this.ActionFormGroup.reset();
    this.myQcriber.ClearComponent();
    // this.fbcAction.setValue('');
    // this.fbcStatus.setValue('');
    // this.fbcReasonCode.setValue('');
    // this.fbcRemarkCode.setValue('');
    // this.fbcActionNote.setValue('');
    // this.fbcTFLFromDOS.setValue('');
    // this.fbcAssignTo.setValue('');
    // this.fbcAssignComment.setValue('');
    // this.fbcFollowup.setValue(false);
    // this.fbcFollowupNote.setValue('');
    // this.isSave.next(false);
  }

  btnSave_Close_click() {
    try {
      this.saveTaskAction(false);
      // this.NavigateBack();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  NavigateBack() {
    try {
      // console.log('task calling'+this.data.TaskCallingForm);

      switch (this.data.TaskCallingForm) {
        case 1:
          this.route.navigate(["/MyTask"]);
          break;
        case 2:
          this.route.navigate(["/CompletedTask"]);
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  btnClose_click() {
    this.NavigateBack();
  }

  ngOnChanges(): void {
    // console.log("in on change");
    // console.log('task pane: '+this.ActionNote);
    // this.data.currentMessage.subscribe(message => this.ActionNote ='test');
    // console.log('task pane: '+this.ActionNote);
  }

  NoteChanged($event: any) {
    try {
      // console.log($event);
      // // let newNote = this.ActionNote == undefined ? '' + $event : this.ActionNote + $event;
      // this.ActionNote = $event;
      // this.data.cascadedNote = this.ActionNote;
      // // console.log(this.ActionNote);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  copyInputMessage(actionNote) {
    actionNote.select();
    document.execCommand("copy");
    actionNote.setSelectionRange(0, 0);
  }
  onCancelReasonRemarkCode(input: string) {
    if (input === "cancel") {
      this.SelectedRSID = null;
      this.SelectedRMID = null;
    }
  }
  OnAutomationErrorClick(value: string) {
    // console.log(value);
    switch (value) {
      case "YES":
        this.showAutomationStatus = false;
        break;
      case "NO":
        this.showAutomationStatus = true;
        break;
      case "N/A":
        this.showAutomationStatus = false;
        break;
    }
  }
}
