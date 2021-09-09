import {
  Component,
  OnInit,
  Input,
  Pipe,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MasterdataService } from "../../Services/AR/masterdata.service";
import { Assignworkgroup } from "src/app/Model/AR Management/Workgroup/assignworkgroup";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { CoreoperationService } from "../../Services/AR/coreoperation.service";
import { Utility, enumTaskStatus } from "src/app/Model/utility";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { User, GCPUser } from "src/app/Model/Common/login";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  Filter,
  OutputFilter,
  OutputAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../Services/Common/filter.service";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../node_modules/subsink";
import { dateFieldName } from "@telerik/kendo-intl";

@Component({
  selector: "app-workqueueassignment",
  templateUrl: "./workqueueassignment.component.html",
  styleUrls: ["./workqueueassignment.component.css"],
  providers: [NgbRatingConfig],
})
export class WorkqueueassignmentComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  // public opened= false;
  constructor(
    private fb: FormBuilder,
    private authService: CoreauthService,
    private CoreService: CoreoperationService,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService,
    config: NgbRatingConfig
  ) {
    this.clsUtility = new Utility(toastr);
    config.max = 5;
    config.readonly = true;
  }

  clsUtility: Utility;
  Agents: GCPUser[];
  Priority: any = [
    { id: 1, displayname: "High" },
    { id: 2, displayname: "Medium" },
    { id: 3, displayname: "Low" },
  ];
  // @Input() workGroup: any = [];
  public workGroup: any = [];
  @Output() TaskAssigned = new EventEmitter<boolean>();
  selectedAgent: GCPUser;
  public default = { userid: 0, displayname: "Select" };
  AgentID = 0;
  SelectedAgentName = "";
  SelectedAgentInitials = "";
  TaskPriority = 0;
  selectedWorkGroup: Workgroup[] = [];
  selectedWorkGroupcount = 0;
  rating: any = 3;
  public min: Date = new Date(
    new DatePipe("en-US").transform(new Date(), "MM/dd/yyyy")
  );
  AssignWorkGroup = this.fb.group({
    fcAgents: ["", Validators.required],
    fcPriority: ["", Validators.required],
    fcDueDate: ["", Validators.required],
  });

  get AgentName() {
    return this.AssignWorkGroup.get("fcAgents");
  }

  get PriorityName() {
    return this.AssignWorkGroup.get("fcPriority");
  }
  get DueDate() {
    return this.AssignWorkGroup.get("fcDueDate");
  }
  agentNameSub: Subscription;
  PriorityNameSub: Subscription;
  postSub: Subscription;
  loadingData = true;
  RetriveMasterData(): any {
    // const filterinput = new Filter();
    // filterinput.client = false;
    // filterinput.agingbucket = false;
    // filterinput.arrepresentative = true;
    // filterinput.automationstatus = false;
    // filterinput.billingprovider = false;
    // filterinput.insurance = false;
    // filterinput.renderingprovider = false;
    // let AllFilterJSON = new OutputFilter();
    // this.filterService
    //   .getAllFilterList(JSON.stringify(filterinput))
    //   .subscribe(data => {
    //     AllFilterJSON = data;
    //     this.Agents = AllFilterJSON.arrepresentative;
    //   });
    this.subscription.add(
      // this.authService.getAllUsers().subscribe(data => {
      //   if (data != null || data != undefined) {
      //     this.Agents = data;
      //   }
      //   // console.log(this.Agents);
      // })
      this.authService.getAllLocalGCPUser().subscribe((data) => {
        if (data != null || data != undefined) {
          this.Agents = data;
        }
        // console.log(this.Agents);
      })
    );
  }

  ngOnInit() {
    try {
      this.setworkqueueassignment();
      this.loadingData = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
    // if (this.selectedWorkGroup != null && this.selectedWorkGroup != undefined && this.selectedWorkGroup != []) {
    //   this.selectedWorkGroupcount = this.selectedWorkGroup.length;
    // }
    // this.RetriveMasterData();
    // // this.selectedWorkGroup = this.workGroup;
    // this.formValueChanged();
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.AgentName.valueChanges.subscribe(
          (data: any) => {
            if (data !== null && data > 0) {
              this.selectedAgent = this.Agents.find(
                (x) => x.ngcpuserid == data
              );
              if (this.selectedAgent !== undefined) {
                this.subscription.add(
                  this.authService
                    .getUserWorkDetails(data)
                    .subscribe((Workdetails) => {
                      this.selectedAgent.initials =
                        this.selectedAgent.firstname
                          .substr(0, 1)
                          .toUpperCase() +
                        this.selectedAgent.lastname.substr(0, 1).toUpperCase();
                      this.selectedAgent.pendingtask = Workdetails.pending_task;
                      this.selectedAgent.workavg = Workdetails.work_avg;
                      this.selectedAgent.errorrate = Workdetails.error_rate;

                      if (
                        Workdetails.work_avg >= 0 &&
                        Workdetails.work_avg <= 5
                      ) {
                        this.selectedAgent.rating = 1;
                      }
                      if (
                        Workdetails.work_avg >= 6 &&
                        Workdetails.work_avg <= 15
                      ) {
                        this.selectedAgent.rating = 2;
                      }
                      if (
                        Workdetails.work_avg >= 16 &&
                        Workdetails.work_avg <= 25
                      ) {
                        this.selectedAgent.rating = 3;
                      }
                      if (
                        Workdetails.work_avg >= 26 &&
                        Workdetails.work_avg <= 35
                      ) {
                        this.selectedAgent.rating = 1;
                      }
                      if (Workdetails.work_avg >= 36) {
                        this.selectedAgent.rating = 1;
                      }
                      this.AgentID = data;
                      this.SelectedAgentName = this.selectedAgent.displayname;
                    })
                );

                // console.log(this.selectedAgent);
                // console.log(this.AgentID);
              }
            } else {
              this.AgentID = data;
            }
          },
          (err) => {
            this.clsUtility.LogError(err);
          }
        )
      );
      this.subscription.add(
        this.PriorityName.valueChanges.subscribe(
          (data: any) => {
            if (data !== null) {
              this.TaskPriority = data;
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

  // TaskAssingmentDone(value:boolean) {
  //   console.log('in TaskAssingmentDone assignment: '+value);
  //   this.TaskAssigned.emit(value);
  // }
  public selectionChange($event, source: string): void {
    const selectedValue = $event;
    switch (source.toLocaleLowerCase()) {
      case "agent":
        this.selectedAgent = selectedValue;
        this.AgentID = selectedValue.nuserid;
        // console.log(
        //   "selectionChange() : " + JSON.stringify(this.selectedAgent)
        // );
        break;
      case "priority":
        this.TaskPriority = selectedValue.id;
        break;
    }
  }
  GenerateWorkitemAssignment() {
    // console.log('GenerateWorkitemAssignment', this.AgentID);
    // console.log('GenerateWorkitemAssignment', this.TaskPriority);
    //  console.log('date: '+ new Date().toUTCString());

    // alert('in assignment click');
    try {
      const datepipe = new DatePipe("en-US");
      const InputWorkGroup: Workgroup[] = [];

      for (const workgroup of this.selectedWorkGroup) {
        // console.log("workgroup" + JSON.stringify(workgroup));
        const currentworkgroup = new Workgroup();
        currentworkgroup.nworkqueuegroupid = workgroup.nworkqueuegroupid;
        currentworkgroup.sworkqueuegroupcode = workgroup.sworkqueuegroupcode;
        currentworkgroup.nclientid = workgroup.nclientid;
        currentworkgroup.sclientname = workgroup.sclientname;
        InputWorkGroup.push(currentworkgroup);
      }
      // console.log('inputworkgroup: '+ JSON.stringify(InputWorkGroup));
      const currentDate = this.clsUtility.currentDateTime();
      const duedate = datepipe.transform(this.DueDate.value, "yyyy-MM-dd");
      // const duedate = datepipe.transform(
      //   this.DueDate.value,
      //   "yyyy-MM-ddTHH:mm:ss.SSSZ"
      // );
      // console.log(duedate);
      // console.log(this.DueDate.value);
      // console.log(datepipe.transform(new Date(), ""yyyy-MM-ddTHH:mm:ss.SSSZ""));

      const clsAssign = new Assignworkgroup();
      clsAssign.createdon = currentDate;
      clsAssign.modifiedon = currentDate;
      clsAssign.nassignedtoid = this.AgentID;
      clsAssign.nstatus = enumTaskStatus.Open;
      clsAssign.nuserid = this.dataService.SelectedGCPUserid;
      clsAssign.nworkqueuegroupid = InputWorkGroup;
      clsAssign.priority = this.TaskPriority;
      clsAssign.staskcode = "";
      clsAssign.tasknotes = "";
      clsAssign.taskstarttime = null;
      clsAssign.taskendtime = null;
      clsAssign.duedate = duedate;
      clsAssign.sassignedtousername = this.SelectedAgentName;
      clsAssign.screatedusername = this.dataService.loginUserName;
      clsAssign.susername = this.dataService.loginUserName;
      // console.log(JSON.stringify(clsAssign));
      // console.log(datepipe.transform(this.DueDate.value, 'yyyy-MM-ddThh:mm:ss.SSS'));

      this.subscription.add(
        this.CoreService.assignedWorkQueue(clsAssign).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Task(s) created for selected workitem"
                );
                this.dataService.isTaskAssignmentDone = true;
                // this.TaskAssingmentDone(true);
                this.TaskAssigned.emit(true);
              } else {
                this.clsUtility.showError(
                  "Error for creating task of selected workitem"
                );
                this.dataService.isTaskAssignmentDone = false;
                // this.TaskAssingmentDone(false);
                this.TaskAssigned.emit(false);
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

  close() {
    this.TaskAssigned.emit(false);
    // this.close();
    // this.opened = false;
  }

  validateAssignwork() {
    try {
      const datepipe = new DatePipe("en-US");
      if (
        this.AgentName.valid &&
        this.AgentName.value > 0 &&
        this.PriorityName.valid &&
        this.DueDate.value != null &&
        datepipe.transform(this.DueDate.value, "yyyyMMdd") >=
          datepipe.transform(this.min, "yyyyMMdd") &&
        this.AgentID > 0 &&
        this.SelectedAgentName != ""
      ) {
        return true;
      } else {
        return false;
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

  ResetComponents() {
    try {
      this.AgentID = 0;
      this.selectedWorkGroupcount = 0;
      this.selectedAgent = null;
      this.selectedWorkGroup = null;
      this.AssignWorkGroup.reset();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setworkqueueassignment() {
    try {
      if (
        this.selectedWorkGroup != null &&
        this.selectedWorkGroup != undefined &&
        this.selectedWorkGroup != []
      ) {
        this.selectedWorkGroupcount = this.selectedWorkGroup.length;
      }
      this.RetriveMasterData();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
