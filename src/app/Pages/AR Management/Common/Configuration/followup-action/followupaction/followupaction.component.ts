import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Followup } from "src/app/Model/AR Management/Configuration/followup";
import { AddfollowupactionComponent } from "src/app/Pages/AR Management/Common/Configuration/followup-action/addfollowupaction/addfollowupaction.component";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-followupaction",
  templateUrl: "./followupaction.component.html",
  styleUrls: ["./followupaction.component.css"],
})
export class FollowupactionComponent implements OnInit {
  public FollowupgridData: {};
  public FollowupgridView: GridDataResult;
  private Followupitems: any[] = [];
  public Followupskip = 0;
  public FollowuppageSize = 10;

  private Followupid: number = 0;
  public editFollowupid: number = 0;
  public EditFollowupid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddFollowupChild", { static: true })
  private AddFollowupChild: AddfollowupactionComponent;

  public Followupsort: SortDescriptor[] = [
    {
      field: "actioncode",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.FollowuppageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Followupid = 0;
      this.getFollowupById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getFollowupById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getFollowupById(this.Followupid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.FollowupgridData = data;
              this.Followupitems = data;
              this.loadFollowupitems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadFollowupitems(): void {
    try {
      this.FollowupgridView = {
        data: orderBy(
          this.Followupitems.slice(
            this.Followupskip,
            this.Followupskip + this.FollowuppageSize
          ),
          this.Followupsort
        ),
        total: this.Followupitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortFollowupChange(sort: SortDescriptor[]): void {
    try {
      if (this.Followupitems != null) {
        this.Followupsort = sort;
        this.loadFollowupitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeFollowup(event: PageChangeEvent): void {
    try {
      this.Followupskip = event.skip;
      this.loadFollowupitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditFollowup({ sender, rowIndex, dataItem }) {
    try {
      this.editFollowupid = dataItem.id;
      this.InputEditMessage = "Do you want to edit follow-up actions?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateFollowupStatus(Followupid, Status) {
    try {
      const jsonstatus = JSON.stringify(Status);
      this.subscription.add(
        this.ConfigurationService.updateFollowupStatus(
          Followupid,
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
            this.getFollowupById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddFollowup() {
    try {
      this.editFollowupid = 0;
      this.EditFollowupid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditFollowupid = this.editFollowupid;
        $("#addfollowupModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputFollowupEditResult($event) {
    try {
      this.Followupid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getFollowupById();
      }
      this.AddFollowupChild.ResetComponents();
      this.editFollowupid = null;
      this.EditFollowupid = null;
      $("#addfollowupModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnFollowupStatus(Statusid, StatusStatus) {
    try {
      let objStatus: Followup;
      objStatus = new Followup();
      objStatus.id = Statusid;
      objStatus.bisactive = StatusStatus;
      this.updateFollowupStatus(Statusid, objStatus);
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
