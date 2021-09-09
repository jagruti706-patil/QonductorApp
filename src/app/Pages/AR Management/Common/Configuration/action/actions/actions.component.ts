import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Actions } from "src/app/Model/AR Management/Configuration/actions";
import { AddactionsComponent } from "src/app/Pages/AR Management/Common/Configuration/action/addactions/addactions.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;
@Component({
  selector: "app-actions",
  templateUrl: "./actions.component.html",
  styleUrls: ["./actions.component.css"],
})
export class ActionsComponent implements OnInit, OnDestroy {
  public ActionsgridData: {};
  public ActionsgridView: GridDataResult;
  private Actionsitems: any[] = [];
  public Actionsskip = 0;
  public ActionspageSize = 10;

  private Actionsid: number = 0;
  public editActionsid: number = 0;
  private deleteActionsid: number = 0;
  public EditActionsid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddActionsChild", { static: true }) private AddActionsChild: AddactionsComponent;

  public Actionssort: SortDescriptor[] = [
    {
      field: "sactioncode",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.ActionspageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Actionsid = 0;
      this.getActionsById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getActionsById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getActionsById(this.Actionsid).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.ActionsgridData = data;
              this.Actionsitems = data;
              this.loadActionsitems();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadActionsitems(): void {
    try {
      this.ActionsgridView = {
        data: orderBy(
          this.Actionsitems.slice(
            this.Actionsskip,
            this.Actionsskip + this.ActionspageSize
          ),
          this.Actionssort
        ),
        total: this.Actionsitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortActionsChange(sort: SortDescriptor[]): void {
    try {
      if (this.Actionsitems != null) {
        this.Actionssort = sort;
        this.loadActionsitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeActions(event: PageChangeEvent): void {
    try {
      this.Actionsskip = event.skip;
      this.loadActionsitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditActions({ sender, rowIndex, dataItem }) {
    try {
      this.editActionsid = dataItem.nactionid;
      this.InputEditMessage = "Do you want to edit actions?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeleteActions({ sender, rowIndex, dataItem }) {
    try {
      this.deleteActionsid = dataItem.nactionid;
      this.InputDeleteMessage = "Do you want to delete actions?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deleteActions() {
    try {
      this.subscription.add(
        this.ConfigurationService.deleteActions(this.deleteActionsid).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                alert("Action deleted successfully");
              } else {
                alert("Action not deleted");
              }
              this.Actionsid = 0;
              this.getActionsById();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateActionsStatus(Actionsid, Actions) {
    try {
      const jsonactions = JSON.stringify(Actions);
      this.subscription.add(
        this.ConfigurationService.updateActionsStatus(
          Actionsid,
          jsonactions
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
            this.getActionsById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddActions() {
    try {
      this.editActionsid = 0;
      this.EditActionsid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditActionsid = this.editActionsid;
        $("#addactionsModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deleteActions();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputActionsEditResult($event) {
    try {
      this.Actionsid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getActionsById();
      }
      this.AddActionsChild.ResetComponents();
      this.editActionsid = null;
      this.EditActionsid = null;
      $("#addactionsModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnActionsStatus(Actionsid, ActionsStatus) {
    try {
      let objActions: Actions;
      objActions = new Actions();
      objActions.nactionid = Actionsid;
      objActions.bisactive = ActionsStatus;
      this.updateActionsStatus(Actionsid, objActions);
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
