import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreoperationService } from "src/app/Pages/Services/AR/coreoperation.service";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { WorkAuidt } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import {
  patientinfo,
  claiminfo,
} from "src/app/Model/AR Management/Workgroup/viewdetails";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-qualityviewdetails",
  templateUrl: "./qualityviewdetails.component.html",
  styleUrls: ["./qualityviewdetails.component.css"],
})
export class QualityviewdetailsComponent implements OnInit, OnDestroy {
  public IsWorkQueue = false;
  private Errorid: number = 0;
  private Errordetail: any = [];

  public ClaimlinesgridData: {};
  public ClaimlinesgridView: GridDataResult;
  private Claimlinesitems: any[] = [];

  clsWorkgroupdetails: any = null;
  InWorkqueuegroupid: string = "";

  public ViewDetailsData: any = null;

  private clsUtility: Utility;
  public CallingPage: string = "";

  public gcurrentTask: any;
  public taskaction: any;

  public Taskid: any = 0;
  public Workqueuegroupid: any = 0;
  private clsWorkaudit: WorkAuidt;
  private statusid: number = 1;
  private isPass = true;
  private subscription = new SubSink();
  // Loading
  loadingError = true;

  // Send Output to parent component
  @Output() OutputViewDetailsEditResult = new EventEmitter<boolean>();

  public Claimlinessort: SortDescriptor[] = [
    {
      field: "dos",
      dir: "desc",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private DataService: DataTransferService,
    private CoreService: CoreoperationService,
    private MasterService: MasterdataService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  AddErrorGroup = this.fb.group({
    fcErrorCode: ["", Validators.required],
    fcOverallstatus: ["", Validators.required],
    fcReworkrequired: ["", Validators.required],
  });

  get ErrorCode() {
    return this.AddErrorGroup.get("fcErrorCode");
  }

  get OverallStatus() {
    return this.AddErrorGroup.get("fcOverallstatus");
  }

  get ReworkRequired() {
    return this.AddErrorGroup.get("fcReworkrequired");
  }

  ngOnInit() {
    try {
      this.clsWorkaudit = new WorkAuidt();
      this.loadingError = true;
      this.setTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // ngOnChanges() {
  //   try {
  //     this.DataService.isTaskViewDetails = true;
  //     if (this.Taskid != null && this.Taskid != undefined && this.Taskid != 0
  //       && this.Workqueuegroupid != null && this.Workqueuegroupid != undefined && this.Workqueuegroupid != 0) {
  //       this.getTaskbyid();
  //     }
  //     // this.setTaskDetails();

  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  private loadClaimlinesitems(): void {
    try {
      this.ClaimlinesgridView = {
        data: orderBy(this.Claimlinesitems, this.Claimlinessort),
        total: this.Claimlinesitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortClaimlinesChange(sort: SortDescriptor[]): void {
    try {
      if (this.Claimlinesitems != null) {
        this.Claimlinessort = sort;
        this.loadClaimlinesitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getTaskbyid() {
    try {
      this.subscription.add(
        this.CoreService.getTaskDetails(
          this.Taskid,
          this.Workqueuegroupid
        ).subscribe((data: any = {}) => {
          // if (this.CallingPage == 'QualityReview') {
          //   const ReworkrequiredYes = document.getElementById("fcReworkrequiredYes") as HTMLInputElement;
          //   const ReworkrequiredNo = document.getElementById("fcReworkrequiredNo") as HTMLInputElement;
          //   ReworkrequiredNo.checked = true;
          //   ReworkrequiredYes.checked = false;
          // }

          this.gcurrentTask = null;
          if (data != null || data != undefined) {
            this.gcurrentTask = data;
            // this.DataService.SelectedTasksPatientInfo = this.gcurrentTask.patientinfo;
            // this.DataService.SelectedTasksStatusInfo = this.gcurrentTask.statusinfo;
            // this.DataService.SelectedTasksClaimInfo = this.gcurrentTask.claiminfo;
            this.DataService.SubSelectedTasksClaimInfo.next(
              this.gcurrentTask.claiminfo
            );
            this.DataService.SubSelectedTasksPatientInfo.next(
              this.gcurrentTask.patientinfo
            );
            this.DataService.SubSelectedTasksStatusInfo.next(
              this.gcurrentTask.statusinfo
            );
            // this.DataService.SelectedTasksClaimInfo.workqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
            this.DataService.SelectedTasksworkqueuegroupid = this.gcurrentTask.nworkqueuegroupid;
            if (
              this.gcurrentTask.taskaction.status != [] &&
              this.gcurrentTask.taskaction.status != undefined &&
              this.gcurrentTask.taskaction.status != null
            )
              this.taskaction = this.gcurrentTask.taskaction;

            if (this.gcurrentTask.reasoncodes != null)
              this.taskaction.reasoncodes;

            if (
              this.gcurrentTask.workQueueDetails != [] &&
              this.gcurrentTask.workQueueDetails != undefined &&
              this.gcurrentTask.workQueueDetails != null
            ) {
              this.Claimlinesitems = this.gcurrentTask.workQueueDetails;
              this.loadClaimlinesitems();
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getErrorCode() {
    try {
      this.subscription.add(
        this.MasterService.getErrorCode(this.Errorid, this.statusid).subscribe(
          async (data) => {
            if (data != null || data != undefined) {
              this.Errordetail = data;
              await this.clsUtility.delay(1000);
            }
            this.loadingError = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  setTaskDetails() {
    try {
      this.getErrorCode();
      if (
        this.Taskid != null &&
        this.Taskid != undefined &&
        this.Taskid != 0 &&
        this.Workqueuegroupid != null &&
        this.Workqueuegroupid != undefined &&
        this.Workqueuegroupid != 0
      ) {
        this.DataService.isTaskViewDetails = true;

        this.getTaskbyid();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateErrorCode() {
    try {
      if (this.OverallStatus.valid && this.ReworkRequired.valid) {
        if (this.OverallStatus.value == "Pass") return true;
        else if (this.ErrorCode.valid) return true;
        else return false;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postTaskDetails() {
    try {
      const jsonworkaudit = JSON.stringify(this.clsWorkaudit);
      this.subscription.add(
        this.CoreService.saveTaskDetails(jsonworkaudit).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess("Workaudit added successfully");
              } else {
                this.clsUtility.showError("Workaudit not added");
              }
              this.OutputViewDetailsEditResult.emit(true);
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveError() {
    try {
      let Errorid = 0;
      let SelectedUserid = 0;
      let LoginUsername = null;
      let bauditstatus = false;
      let breworkrequired = false;
      let currentDateTime = this.clsUtility.currentDateTime();
      let Errordescription = "";
      if (this.DataService.SelectedGCPUserid != undefined)
        SelectedUserid = this.DataService.SelectedGCPUserid;

      if (this.DataService.loginUserName != undefined)
        LoginUsername = this.DataService.loginUserName;

      const indexerror = this.Errordetail.findIndex(
        (x) => x.nerrorid == this.ErrorCode.value
      );
      if (indexerror >= 0) {
        Errorid = this.ErrorCode.value;
        Errordescription = this.Errordetail[indexerror]["serrordescription"];
      }
      if (this.OverallStatus.value == "Pass") bauditstatus = true;

      if (this.ReworkRequired.value == "Yes") breworkrequired = true;

      this.clsWorkaudit.nworkauditid = 0;
      this.clsWorkaudit.nworkqueueid = 0;
      this.clsWorkaudit.ntaskid = this.Taskid;
      this.clsWorkaudit.nworkqueuegroupid = this.Workqueuegroupid;
      this.clsWorkaudit.bauditstatus = bauditstatus;
      this.clsWorkaudit.breworkrequired = breworkrequired;
      this.clsWorkaudit.nerrorid = Errorid;
      this.clsWorkaudit.serrordescription = Errordescription;
      this.clsWorkaudit.userid = SelectedUserid;
      this.clsWorkaudit.susername = LoginUsername;
      this.clsWorkaudit.modifiedon = currentDateTime;
      this.clsWorkaudit.createdon = currentDateTime;
      this.postTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.Taskid = 0;
      this.Workqueuegroupid = 0;
      this.Claimlinesitems = null;
      this.ClaimlinesgridView = null;
      this.ViewDetailsData = null;
      this.DataService.isCallingWorkQueue = false;
      this.DataService.isTaskViewDetails = false;
      this.AddErrorGroup.reset();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      // this.ResetComponents();
      this.OutputViewDetailsEditResult.emit(true);
      // this.Taskid = 0;
      // this.Workqueuegroupid = 0;
      // this.Claimlinesitems = null;
      // this.ClaimlinesgridView = null;
      // this.ViewDetailsData = null;
      // this.DataService.isCallingWorkQueue = false;
      // this.DataService.isTaskViewDetails = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnStatusChange(Status: string) {
    try {
      if (Status == "Pass") {
        this.isPass = true;
        this.ErrorCode.reset();
      } else if (Status == "Fail") {
        this.isPass = false;
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
}
