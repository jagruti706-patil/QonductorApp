import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Client } from "src/app/Model/AR Management/Configuration/client";
import { AddmailconfigurationComponent } from "src/app/Pages/AR Management/Common/Configuration/mail-configuration/addmailconfiguration/addmailconfiguration.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-mailconfiguration",
  templateUrl: "./mailconfiguration.component.html",
  styleUrls: ["./mailconfiguration.component.css"],
})
export class MailconfigurationComponent implements OnInit, OnDestroy {
  public MailConfigurationgridData: {};
  public MailConfigurationgridView: GridDataResult;
  private MailConfigurationitems: any[] = [];
  public MailConfigurationskip = 0;
  public MailConfigurationpageSize = 10;

  private mailconfigurationid: number = 0;
  public editMailConfigurationid: number = 0;
  public EditMailConfigurationid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddMailConfigurationChild", { static: true })
  private AddMailConfigurationChild: AddmailconfigurationComponent;

  public MailConfigurationsort: SortDescriptor[] = [
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
    this.MailConfigurationpageSize = this.clsUtility.configPageSize;
  }

  OutputMailConfigurationEditResult($event) {
    try {
      this.mailconfigurationid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getMailConfigurationById();
      }

      this.AddMailConfigurationChild.ResetComponents();
      this.editMailConfigurationid = null;
      this.EditMailConfigurationid = null;
      $("#addmailconfigurationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.mailconfigurationid = 0;
      this.getMailConfigurationById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getMailConfigurationById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getMailByid(
          this.mailconfigurationid
        ).subscribe((data) => {
          if (data != null || data != undefined) {
            this.MailConfigurationgridData = data;
            this.MailConfigurationitems = data;
            this.loadItemsMailConfiguration();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsMailConfiguration(): void {
    try {
      this.MailConfigurationgridView = {
        data: orderBy(
          this.MailConfigurationitems.slice(
            this.MailConfigurationskip,
            this.MailConfigurationskip + this.MailConfigurationpageSize
          ),
          this.MailConfigurationsort
        ),
        total: this.MailConfigurationitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortMailConfigurationChange(sort: SortDescriptor[]): void {
    try {
      if (this.MailConfigurationitems != null) {
        this.MailConfigurationsort = sort;
        this.loadItemsMailConfiguration();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeMailConfiguration(event: PageChangeEvent): void {
    try {
      this.MailConfigurationskip = event.skip;
      this.loadItemsMailConfiguration();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditMailConfigurationTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editMailConfigurationid = Number(dataItem.configid);

      this.InputEditMessage = "Do you want to edit mail configuration ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateMailConfigurationStatus(Clientid, Client) {
    try {
      const jsonmail = JSON.stringify(Client);
      this.subscription.add(
        this.ConfigurationService.updateClientStatus(
          Clientid,
          jsonmail
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else {
              this.clsUtility.showError("Status not updated");
            }
            this.getMailConfigurationById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddMailConfiguration() {
    try {
      this.editMailConfigurationid = 0;
      this.EditMailConfigurationid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditMailConfigurationid = this.editMailConfigurationid;
        $("#addmailconfigurationModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnMailConfigurationStatus(Clientid, ClientStatus) {
    try {
      let objClient: Client;
      objClient = new Client();
      objClient.nclientid = Clientid;
      objClient.nstatus = ClientStatus;
      this.updateMailConfigurationStatus(Clientid, objClient);
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
