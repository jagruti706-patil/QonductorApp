import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { AdderrortypeComponent } from "../../error/adderrortype/adderrortype.component";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { AddAutomationComponent } from "../add-automation/add-automation.component";
import { Automation } from "src/app/Model/AR Management/Configuration/automation";
declare var $: any;

@Component({
  selector: "app-automation",
  templateUrl: "./automation.component.html",
  styleUrls: ["./automation.component.css"],
})
export class AutomationComponent implements OnInit, OnDestroy {
  public AutomationgridData: {};
  public AutomationgridView: GridDataResult;
  private Automationitems: any[] = [];
  public Automationskip = 0;
  public AutomationpageSize = 10;
  private statusid: number = 0;

  private Automationid: number = 0;
  public editAutomationid: number = 0;
  private deleteAutomationid: number = 0;
  public EditAutomationid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private clsUtility: Utility;
  private subscription = new SubSink();

  @ViewChild("AddAutomationChild", { static: true })
  private AddAutomationChild: AddAutomationComponent;

  public Automationsort: SortDescriptor[] = [
    {
      field: "serrordescription",
      dir: "desc",
    },
  ];

  constructor(
    private MasterService: MasterdataService,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.AutomationpageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Automationid = 0;
      this.getAutomationById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAutomationById() {
    try {
      this.subscription.add(
        this.MasterService.getAutomationError(
          this.Automationid,
          this.statusid
        ).subscribe((data) => {
          if (data != null || data != undefined) {
            this.AutomationgridData = data;
            this.Automationitems = data;
            this.loadAutomationitems();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadAutomationitems(): void {
    try {
      this.AutomationgridView = {
        data: orderBy(
          this.Automationitems.slice(
            this.Automationskip,
            this.Automationskip + this.AutomationpageSize
          ),
          this.Automationsort
        ),
        total: this.Automationitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortAutomationChange(sort: SortDescriptor[]): void {
    try {
      if (this.Automationitems != null) {
        this.Automationsort = sort;
        this.loadAutomationitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeAutomation(event: PageChangeEvent): void {
    try {
      this.Automationskip = event.skip;
      this.loadAutomationitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditAutomation({ sender, rowIndex, dataItem }) {
    try {
      this.editAutomationid = dataItem.nautomationerrorid;
      this.InputEditMessage = "Do you want to edit Automation error?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateAutomationStatus(Automationid, AutomationError) {
    try {
      const jsonAutomationError = JSON.stringify(AutomationError);

      this.subscription.add(
        this.ConfigurationService.updateAutoamtionErrorStatus(
          Automationid,
          jsonAutomationError
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "Automation Error Status updated successfully"
              );
            } else if (data == 0) {
              this.clsUtility.showError("Automation Error Status not updated");
            } else {
              this.clsUtility.showInfo(
                "Automation Error Status cannot be updated already in use"
              );
            }
            this.getAutomationById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddAutomation() {
    try {
      this.editAutomationid = 0;
      this.EditAutomationid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditAutomationid = this.editAutomationid;
        $("#addAutomationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputAutomationEditResult($event) {
    try {
      this.Automationid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getAutomationById();
      }
      this.AddAutomationChild.ResetComponents();
      this.editAutomationid = null;
      this.EditAutomationid = null;
      $("#addAutomationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnAutomationStatus(Automationid, AutomationStatus) {
    try {
      let objAutomationError = new Automation();
      objAutomationError.nautomationerrorid = Automationid;
      objAutomationError.bisactive = AutomationStatus;
      this.updateAutomationStatus(Automationid, objAutomationError);
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
