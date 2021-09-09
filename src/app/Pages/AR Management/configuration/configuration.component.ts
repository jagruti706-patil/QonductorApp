import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { SubSink } from "subsink";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { Utility } from "src/app/Model/utility";
@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.css"],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
  }
  clsUtility: Utility;
  private subscription = new SubSink();
  ShowClientConfiguration = false;
  ShowInterfaceConfiguration = false;
  ShowClientLoginsConfiguration = false;
  ShowPayerConfiguration = false;
  ShowPayerCrosswalkConfiguration = false;
  ShowNoteTemplateConfiguration = false;
  ShowStatusConfiguration = false;
  ShowSubStatusConfiguration = false;
  ShowActionConfiguration = false;
  ShowErrorTypeConfiguration = false;
  ShowAutomationErrorConfiguration = false;
  ShowClientUserMappingConfiguration = false;
  ShowQsuiteUserMappingConfiguration = false;
  ShowFTPDetailsConfiguration = false;
  ShowFollowupActionConfiguration = false;
  ShowMailConfigurationConfiguration = false;
  ShowInventoryRuleConfiguration = false;
  ShowEdocsManagerConfiguration = false;
  ShowOrderSubStatusConfiguration = false;
  ShowOrderNoteConfiguration = false;
  ShowGroupClientMapping = false;
  ShowClientProviderMapping = false;
  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          // console.log("Data in ar-cards: " + JSON.stringify(data));
          // console.log(
          //   "Data.dashboardAccess in ar-cards: " +
          //     JSON.stringify(data.dashboardAccess)
          // );
          if (data.configurationAccess != undefined) {
            // console.log("data.dashboardAccess is not undefined. ");
            this.ShowClientConfiguration =
              data.configurationAccess.ClientConfiguration;
            this.ShowInterfaceConfiguration =
              data.configurationAccess.InterfaceConfiguration;
            this.ShowClientLoginsConfiguration =
              data.configurationAccess.ClientLoginsConfiguration;
            this.ShowPayerConfiguration =
              data.configurationAccess.PayerConfiguration;
            this.ShowPayerCrosswalkConfiguration =
              data.configurationAccess.PayerCrosswalkConfiguration;
            this.ShowNoteTemplateConfiguration =
              data.configurationAccess.NoteTemplateConfiguration;
            this.ShowStatusConfiguration =
              data.configurationAccess.StatusConfiguration;
            this.ShowSubStatusConfiguration =
              data.configurationAccess.SubStatusConfiguration;
            this.ShowActionConfiguration =
              data.configurationAccess.ActionConfiguration;
            this.ShowErrorTypeConfiguration =
              data.configurationAccess.ErrorTypeConfiguration;
            this.ShowAutomationErrorConfiguration =
              data.configurationAccess.AutomationErrorConfiguration;
            this.ShowClientUserMappingConfiguration =
              data.configurationAccess.ClientUserMappingConfiguration;
            this.ShowQsuiteUserMappingConfiguration =
              data.configurationAccess.QsuiteUserMappingConfiguration;
            this.ShowFTPDetailsConfiguration =
              data.configurationAccess.FTPDetailsConfiguration;
            this.ShowFollowupActionConfiguration =
              data.configurationAccess.FollowupActionConfiguration;
            this.ShowMailConfigurationConfiguration =
              data.configurationAccess.MailConfigurationConfiguration;
            this.ShowInventoryRuleConfiguration =
              data.configurationAccess.InventoryRuleConfiguration;
            this.ShowEdocsManagerConfiguration =
              data.configurationAccess.EdocsManagerConfiguration;
            this.ShowOrderSubStatusConfiguration =
              data.configurationAccess.OrderSubStatusConfiguration;
            this.ShowOrderNoteConfiguration =
              data.configurationAccess.OrderNoteConfiguration;
            this.ShowGroupClientMapping =
              data.configurationAccess.GroupClientMapping;
            this.ShowClientProviderMapping =
              data.configurationAccess.ClientProviderMapping;
          }
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
