import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { DatePipe } from "@angular/common";
import { SubSink } from "../../../../../node_modules/subsink";
import { Utility } from "src/app/Model/utility";
@Component({
  selector: "app-status-banner",
  templateUrl: "./status-banner.component.html",
  styleUrls: ["./status-banner.component.css"],
})
export class StatusBannerComponent implements OnInit, OnDestroy {
  StatusInfo: any;
  auto_status: string;
  auto_reasonCode: string;
  rep_status: string;
  rep_lastNote: string;
  private clsUtility: Utility;
  private subscription = new SubSink();
  constructor(private data: DataTransferService, private datePipe: DatePipe) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    this.subscription.add(
      this.data.SubSelectedTasksStatusInfo.subscribe((data) => {
        this.StatusInfo = data;
        if (
          (this.StatusInfo.auto_lastworked !== null ||
            this.StatusInfo.auto_laststatus !== null) &&
          this.StatusInfo.auto_laststatus !== ""
        ) {
          this.auto_status =
            this.StatusInfo.auto_laststatus +
            " on " +
            this.datePipe.transform(
              this.StatusInfo.auto_lastworked,
              "MM-dd-yyyy"
            );
        } else {
          this.auto_status = "";
        }
        if (
          this.StatusInfo.lastworkedstatus !== null ||
          this.StatusInfo.lastworked !== null ||
          this.StatusInfo.lastworkedby !== null
        ) {
          this.rep_status =
            this.StatusInfo.lastworkedstatus +
            " on " +
            this.datePipe.transform(this.StatusInfo.lastworked, "MM-dd-yyyy") +
            " by " +
            this.StatusInfo.lastworkedbyusername;
        } else {
          this.rep_status = "";
        }
      })
    );
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
