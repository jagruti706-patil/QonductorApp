import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { MasterdataService } from "src/app/Pages/Services/AR/masterdata.service";
import { Utility } from "src/app/Model/utility";
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { AdderrortypeComponent } from "src/app/Pages/AR Management/Common/Configuration/error/adderrortype/adderrortype.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-errortype",
  templateUrl: "./errortype.component.html",
  styleUrls: ["./errortype.component.css"],
})
export class ErrortypeComponent implements OnInit, OnDestroy {
  public ErrortypegridData: {};
  public ErrortypegridView: GridDataResult;
  private Errortypeitems: any[] = [];
  public Errortypeskip = 0;
  public ErrortypepageSize = 10;
  private statusid: number = 0;

  private Errortypeid: number = 0;
  public editErrortypeid: number = 0;
  private deleteErrortypeid: number = 0;
  public EditErrortypeid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private clsUtility: Utility;
  private subscription = new SubSink();

  @ViewChild("AddErrortypeChild", { static: true })
  private AddErrortypeChild: AdderrortypeComponent;

  public Errortypesort: SortDescriptor[] = [
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
    this.ErrortypepageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    try {
      this.Errortypeid = 0;
      this.getErrortypeById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getErrortypeById() {
    try {
      this.subscription.add(
        this.MasterService.getErrorCode(
          this.Errortypeid,
          this.statusid
        ).subscribe((data) => {
          if (data != null || data != undefined) {
            this.ErrortypegridData = data;
            this.Errortypeitems = data;
            this.loadErrortypeitems();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadErrortypeitems(): void {
    try {
      this.ErrortypegridView = {
        data: orderBy(
          this.Errortypeitems.slice(
            this.Errortypeskip,
            this.Errortypeskip + this.ErrortypepageSize
          ),
          this.Errortypesort
        ),
        total: this.Errortypeitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortErrortypeChange(sort: SortDescriptor[]): void {
    try {
      if (this.Errortypeitems != null) {
        this.Errortypesort = sort;
        this.loadErrortypeitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeErrortype(event: PageChangeEvent): void {
    try {
      this.Errortypeskip = event.skip;
      this.loadErrortypeitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditErrortype({ sender, rowIndex, dataItem }) {
    try {
      this.editErrortypeid = dataItem.nerrorid;
      this.InputEditMessage = "Do you want to edit error?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateErrortypeStatus(Errortypeid, Errortype) {
    try {
      const jsonErrortype = JSON.stringify(Errortype);
      this.subscription.add(
        this.ConfigurationService.updateErrortypeStatus(
          Errortypeid,
          jsonErrortype
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
            this.getErrortypeById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddErrortype() {
    try {
      this.editErrortypeid = 0;
      this.EditErrortypeid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditErrortypeid = this.editErrortypeid;
        $("#adderrortypeModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputErrortypeEditResult($event) {
    try {
      this.Errortypeid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getErrortypeById();
      }
      this.AddErrortypeChild.ResetComponents();
      this.editErrortypeid = null;
      this.EditErrortypeid = null;
      $("#adderrortypeModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnErrortypeStatus(Errortypeid, ErrortypeStatus) {
    try {
      let objErrortype: Errorcode;
      objErrortype = new Errorcode();
      objErrortype.nerrorid = Errortypeid;
      objErrortype.bisactive = ErrortypeStatus;
      this.updateErrortypeStatus(Errortypeid, objErrortype);
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
