import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Substatus } from "src/app/Model/AR Management/Configuration/substatus";
import { AddsubstatusComponent } from "src/app/Pages/AR Management/Common/Configuration/sub-status/addsubstatus/addsubstatus.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;
@Component({
  selector: "app-substatus",
  templateUrl: "./substatus.component.html",
  styleUrls: ["./substatus.component.css"],
})
export class SubstatusComponent implements OnInit, OnDestroy {
  public SubStatusgridData: {};
  public SubStatusgridView: GridDataResult;
  private SubStatusitems: any[] = [];
  public SubStatusskip = 0;
  public SubStatuspageSize = 10;

  private SubStatusid: number = 0;
  public editSubStatusid: number = 0;
  private deleteSubStatusid: number = 0;
  public EditSubStatusid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddSubstatusChild", { static: true })
  private AddSubstatusChild: AddsubstatusComponent;

  public SubStatussort: SortDescriptor[] = [
    {
      field: "ssubstatuscode",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.SubStatuspageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.SubStatusid = 0;
      this.getSubStatusById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getSubStatusById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getSubStatusById(this.SubStatusid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.SubStatusgridData = data;
              this.SubStatusitems = data;
              this.loadSubStatusitems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadSubStatusitems(): void {
    try {
      this.SubStatusgridView = {
        data: orderBy(
          this.SubStatusitems.slice(
            this.SubStatusskip,
            this.SubStatusskip + this.SubStatuspageSize
          ),
          this.SubStatussort
        ),
        total: this.SubStatusitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortSubStatusChange(sort: SortDescriptor[]): void {
    try {
      if (this.SubStatusitems != null) {
        this.SubStatussort = sort;
        this.loadSubStatusitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeSubStatus(event: PageChangeEvent): void {
    try {
      this.SubStatusskip = event.skip;
      this.loadSubStatusitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditSubStatus({ sender, rowIndex, dataItem }) {
    try {
      this.editSubStatusid = dataItem.nsubstatusid;
      this.InputEditMessage = "Do you want to edit sub-status?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeleteSubStatus({ sender, rowIndex, dataItem }) {
    try {
      this.deleteSubStatusid = dataItem.nsubstatusid;
      this.InputDeleteMessage = "Do you want to delete substatus?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deleteSubStatus() {
    try {
      this.subscription.add(
        this.ConfigurationService.deleteSubStatus(
          this.deleteSubStatusid
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              alert("Substatus deleted successfully");
            } else {
              alert("Substatus not deleted");
            }
            this.SubStatusid = 0;
            this.getSubStatusById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateSubStatusStatus(SubStatusid, Status) {
    try {
      const jsonsubstatus = JSON.stringify(Status);
      this.subscription.add(
        this.ConfigurationService.updateSubStatusStatus(
          SubStatusid,
          jsonsubstatus
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
            this.getSubStatusById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddSubstatus() {
    try {
      this.editSubStatusid = 0;
      this.EditSubStatusid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditSubStatusid = this.editSubStatusid;
        $("#addsubstatusModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deleteSubStatus();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputSubStatusEditResult($event) {
    try {
      this.SubStatusid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getSubStatusById();
      }
      this.AddSubstatusChild.ResetComponents();
      this.editSubStatusid = null;
      this.EditSubStatusid = null;
      $("#addsubstatusModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnSubStatusStatus(SubStatusid, SubStatusStatus) {
    try {
      let objSubStatus: Substatus;
      objSubStatus = new Substatus();
      objSubStatus.nsubstatusid = SubStatusid;
      objSubStatus.bisactive = SubStatusStatus;
      this.updateSubStatusStatus(SubStatusid, objSubStatus);
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
