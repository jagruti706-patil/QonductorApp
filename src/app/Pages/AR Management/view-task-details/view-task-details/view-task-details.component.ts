import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreoperationService } from "src/app/Pages/Services/AR/coreoperation.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-view-task-details",
  templateUrl: "./view-task-details.component.html",
  styleUrls: ["./view-task-details.component.css"],
})
export class ViewTaskDetailsComponent implements OnInit {
  public IsWorkQueue = false;

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
  private subscription = new SubSink();
  // Loading
  loadingViewTaskDetails = true;

  // Send Output to parent component
  @Output() OutputViewTaskDetailResult = new EventEmitter<boolean>();

  public Claimlinessort: SortDescriptor[] = [
    {
      field: "dos",
      dir: "desc",
    },
  ];

  constructor(
    private DataService: DataTransferService,
    private CoreService: CoreoperationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    try {
      this.loadingViewTaskDetails = true;
      this.setTaskDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

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
          this.gcurrentTask = null;
          if (data != null || data != undefined) {
            this.loadingViewTaskDetails = false;
            this.gcurrentTask = data;

            this.DataService.SubSelectedTasksClaimInfo.next(
              this.gcurrentTask.claiminfo
            );
            this.DataService.SubSelectedTasksPatientInfo.next(
              this.gcurrentTask.patientinfo
            );
            this.DataService.SubSelectedTasksStatusInfo.next(
              this.gcurrentTask.statusinfo
            );

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

  setTaskDetails() {
    try {
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

  ResetComponents() {
    try {
      this.Taskid = 0;
      this.Workqueuegroupid = 0;
      this.Claimlinesitems = null;
      this.ClaimlinesgridView = null;
      this.ViewDetailsData = null;
      this.DataService.isCallingWorkQueue = false;
      this.DataService.isTaskViewDetails = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputViewTaskDetailResult.emit(true);
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
