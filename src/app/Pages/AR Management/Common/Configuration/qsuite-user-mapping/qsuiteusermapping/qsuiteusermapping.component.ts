import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Qsuiteusermapping } from "src/app/Model/AR Management/Configuration/qsuiteusermapping";
import { AddqsuiteusermappingComponent } from "src/app/Pages/AR Management/Common/Configuration/qsuite-user-mapping/addqsuiteusermapping/addqsuiteusermapping.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";

declare var $: any;

@Component({
  selector: "app-qsuiteusermapping",
  templateUrl: "./qsuiteusermapping.component.html",
  styleUrls: ["./qsuiteusermapping.component.css"],
})
export class QsuiteusermappingComponent implements OnInit {
  public QsuiteUserMappinggridData: {};
  public QsuiteUserMappinggridView: GridDataResult;
  private QsuiteUserMappingitems: any[] = [];
  public QsuiteUserMappingskip = 0;
  public QsuiteUserMappingpageSize = 10;

  private QsuiteUserMappingConfiguration: any;
  private qsuiteUserMappingid: number = 0;
  public editQsuiteUserMappingid: number = 0;
  public EditQsuiteUserMappingid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddQsuiteUserMappingChild", { static: true })
  private AddQsuiteUserMappingChild: AddqsuiteusermappingComponent;

  public QsuiteUserMappingsort: SortDescriptor[] = [
    {
      field: "sclientname",
      dir: "desc",
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.QsuiteUserMappingpageSize = this.clsUtility.configPageSize;
  }

  OutputQsuiteUserMappingEditResult($event) {
    try {
      this.qsuiteUserMappingid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getQsuiteUserMappingById();
      }

      this.AddQsuiteUserMappingChild.ResetComponents();
      this.editQsuiteUserMappingid = null;
      this.EditQsuiteUserMappingid = null;
      $("#addqsuiteusermappingModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.qsuiteUserMappingid = 0;
      this.getQsuiteUserMappingById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getQsuiteUserMappingById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getQsuiteUserMappingById(
          this.qsuiteUserMappingid
        ).subscribe(async (data) => {
          if (data != null || data != undefined) {
            this.QsuiteUserMappinggridData = data;
            this.QsuiteUserMappingitems = data;
            this.loadItemsQsuiteUserMapping();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsQsuiteUserMapping(): void {
    try {
      this.QsuiteUserMappinggridView = {
        data: orderBy(
          this.QsuiteUserMappingitems.slice(
            this.QsuiteUserMappingskip,
            this.QsuiteUserMappingskip + this.QsuiteUserMappingpageSize
          ),
          this.QsuiteUserMappingsort
        ),
        total: this.QsuiteUserMappingitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortQsuiteUserMappingChange(sort: SortDescriptor[]): void {
    try {
      if (this.QsuiteUserMappingitems != null) {
        this.QsuiteUserMappingsort = sort;
        this.loadItemsQsuiteUserMapping();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeQsuiteUserMapping(event: PageChangeEvent): void {
    try {
      this.QsuiteUserMappingskip = event.skip;
      this.loadItemsQsuiteUserMapping();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditQsuiteUserMappingTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editQsuiteUserMappingid = dataItem.nmappingid;
      this.InputEditMessage = "Do you want to edit qsuite user mapping ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateQsuiteUserMappingStatus(QsuiteUserMappingid, QsuiteUserMapping) {
    try {
      // const jsonqsuiteUserMapping = JSON.stringify(QsuiteUserMapping);
      // this.subscription.add(
      //   this.ConfigurationService.updateQsuiteUserMappingStatus(
      //     jsonqsuiteUserMapping
      //   ).subscribe((data: {}) => {
      //     if (data != null || data != undefined) {
      //       if (data == 1) {
      //         this.clsUtility.showSuccess("Status updated successfully");
      //       } else if (data == 0) {
      //         this.clsUtility.showError("Status not updated");
      //       } else {
      //         this.clsUtility.showInfo(
      //           "Status cannot be updated already in use"
      //         );
      //       }
      //       this.getQsuiteUserMappingById();
      //     }
      //   })
      // );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddQsuiteUserMapping() {
    try {
      this.editQsuiteUserMappingid = 0;
      this.EditQsuiteUserMappingid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditQsuiteUserMappingid = this.editQsuiteUserMappingid;
        $("#addqsuiteusermappingModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnQsuiteUserMappingStatus(QsuiteUserMappingid, QsuiteUserMappingStatus) {
    try {
      let objQsuiteUserMapping: Qsuiteusermapping;
      objQsuiteUserMapping = new Qsuiteusermapping();
      // objQsuiteUserMapping.nmappingid = QsuiteUserMappingid;
      // objQsuiteUserMapping.status = QsuiteUserMappingStatus;

      this.updateQsuiteUserMappingStatus(
        QsuiteUserMappingid,
        objQsuiteUserMapping
      );
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
