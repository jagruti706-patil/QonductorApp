import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Status } from "src/app/Model/AR Management/Configuration/status";
import { AddstatusComponent } from "src/app/Pages/AR Management/Common/Configuration/status/addstatus/addstatus.component";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;
@Component({
  selector: "app-status",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.css"],
})
export class StatusComponent implements OnInit, OnDestroy {
  public StatusgridData: {};
  public StatusgridView: GridDataResult;
  private Statusitems: any[] = [];
  public Statusskip = 0;
  public StatuspageSize = 10;

  private Statusid: number = 0;
  public editStatusid: number = 0;
  private deleteStatusid: number = 0;
  public EditStatusid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddStatusChild", { static: true }) private AddStatusChild: AddstatusComponent;

  public Statussort: SortDescriptor[] = [
    {
      field: "sstatuscode",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.StatuspageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Statusid = 0;
      this.getStatusById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getStatusById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getStatusById(this.Statusid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.StatusgridData = data;
              this.Statusitems = data;
              this.loadStatusitems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadStatusitems(): void {
    try {
      this.StatusgridView = {
        data: orderBy(
          this.Statusitems.slice(
            this.Statusskip,
            this.Statusskip + this.StatuspageSize
          ),
          this.Statussort
        ),
        total: this.Statusitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortStatusChange(sort: SortDescriptor[]): void {
    try {
      if (this.Statusitems != null) {
        this.Statussort = sort;
        this.loadStatusitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeStatus(event: PageChangeEvent): void {
    try {
      this.Statusskip = event.skip;
      this.loadStatusitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditStatus({ sender, rowIndex, dataItem }) {
    try {
      this.editStatusid = dataItem.nstatusid;
      this.InputEditMessage = "Do you want to edit status?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeleteStatus({ sender, rowIndex, dataItem }) {
    try {
      this.deleteStatusid = dataItem.nstatusid;
      this.InputDeleteMessage = "Do you want to delete status?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deleteStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.deleteStatus(this.deleteStatusid).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                alert("Status deleted successfully");
              } else {
                alert("Status not deleted");
              }
              this.Statusid = 0;
              this.getStatusById();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateStatusStatus(Statusid, Status) {
    try {
      const jsonstatus = JSON.stringify(Status);
      this.subscription.add(
        this.ConfigurationService.updateStatusStatus(
          Statusid,
          jsonstatus
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else if (data == 0) {
              this.clsUtility.showError("Status not updated");
            } else {
              this.clsUtility.showInfo(
                "Status cannot be updated already in use"
              );
            }
            this.getStatusById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddStatus() {
    try {
      this.editStatusid = 0;
      this.EditStatusid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditStatusid = this.editStatusid;
        $("#addstatusModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deleteStatus();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputStatusEditResult($event) {
    try {
      this.Statusid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getStatusById();
      }
      this.AddStatusChild.ResetComponents();
      this.editStatusid = null;
      this.EditStatusid = null;
      $("#addstatusModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnStatusStatus(Statusid, StatusStatus) {
    try {
      let objStatus: Status;
      objStatus = new Status();
      objStatus.nstatusid = Statusid;
      objStatus.bisactive = StatusStatus;
      this.updateStatusStatus(Statusid, objStatus);
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
