import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Clientusermapping } from "src/app/Model/AR Management/Configuration/clientusermapping";
import { AddclientusermappingComponent } from "src/app/Pages/AR Management/Common/Configuration/client-user-mapping/addclientusermapping/addclientusermapping.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";

declare var $: any;

@Component({
  selector: "app-clientusermapping",
  templateUrl: "./clientusermapping.component.html",
  styleUrls: ["./clientusermapping.component.css"],
})
export class ClientusermappingComponent implements OnInit, OnDestroy {
  public ClientUserMappinggridData: {};
  public ClientUserMappinggridView: GridDataResult;
  private ClientUserMappingitems: any[] = [];
  public ClientUserMappingskip = 0;
  public ClientUserMappingpageSize = 10;

  private ClientUserMappingConfiguration: any;
  private clientUserMappingid: number = 0;
  public editClientUserMappingid: number = 0;
  public EditClientUserMappingid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddClientUserMappingChild", { static: true })
  private AddClientUserMappingChild: AddclientusermappingComponent;

  public ClientUserMappingsort: SortDescriptor[] = [
    {
      field: "sclientname",
      dir: "desc",
    },
  ];

  constructor(
    private route: Router,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.ClientUserMappingpageSize = this.clsUtility.configPageSize;
  }

  OutputClientUserMappingEditResult($event) {
    try {
      this.clientUserMappingid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getClientUserMappingById();
      }

      this.AddClientUserMappingChild.ResetComponents();
      this.editClientUserMappingid = null;
      this.EditClientUserMappingid = null;
      $("#addclientusermappingModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.clientUserMappingid = 0;
      this.getClientUserMappingById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientUserMappingById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientUserMappingById(
          this.clientUserMappingid
        ).subscribe(async (data) => {
          if (data != null || data != undefined) {
            this.ClientUserMappinggridData = data;
            this.ClientUserMappingitems = data;
            this.loadItemsClientUserMapping();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsClientUserMapping(): void {
    try {
      this.ClientUserMappinggridView = {
        data: orderBy(
          this.ClientUserMappingitems.slice(
            this.ClientUserMappingskip,
            this.ClientUserMappingskip + this.ClientUserMappingpageSize
          ),
          this.ClientUserMappingsort
        ),
        total: this.ClientUserMappingitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortClientUserMappingChange(sort: SortDescriptor[]): void {
    try {
      if (this.ClientUserMappingitems != null) {
        this.ClientUserMappingsort = sort;
        this.loadItemsClientUserMapping();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeClientUserMapping(event: PageChangeEvent): void {
    try {
      this.ClientUserMappingskip = event.skip;
      this.loadItemsClientUserMapping();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditClientUserMappingTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editClientUserMappingid = dataItem.nmappingid;
      this.InputEditMessage = "Do you want to edit client user mapping ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateClientUserMappingStatus(ClientUserMappingid, ClientUserMapping) {
    try {
      const jsonclientUserMapping = JSON.stringify(ClientUserMapping);
      this.subscription.add(
        this.ConfigurationService.updateClientUserMappingStatus(
          ClientUserMappingid,
          jsonclientUserMapping
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
            this.getClientUserMappingById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddClientUserMapping() {
    try {
      this.editClientUserMappingid = 0;
      this.EditClientUserMappingid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditClientUserMappingid = this.editClientUserMappingid;
        $("#addclientusermappingModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClientUserMappingStatus(ClientUserMappingid, ClientUserMappingStatus) {
    try {
      let objClientUserMapping: Clientusermapping;
      objClientUserMapping = new Clientusermapping();
      objClientUserMapping.nmappingid = ClientUserMappingid;
      objClientUserMapping.status = ClientUserMappingStatus;

      this.updateClientUserMappingStatus(
        ClientUserMappingid,
        objClientUserMapping
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
