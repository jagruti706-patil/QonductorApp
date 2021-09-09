import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { Utility } from "src/app/Model/utility";
import { Client } from "src/app/Model/AR Management/Configuration/client";
import { AddclientComponent } from "src/app/Pages/AR Management/Common/Configuration/client-configuration/addclient/addclient.component";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { FormBuilder } from "@angular/forms";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.css"],
})
export class ClientComponent implements OnInit, OnDestroy {
  public ClientgridView: GridDataResult;
  private Clientitems: any[] = [];
  public Clientskip = 0;
  public ClientpageSize = 10;

  private ClientConfiguration: any;
  private clientid: number = 0;
  public editClientid: number = 0;
  private deleteClientid: number = 0;
  public EditClientid: number = 0;

  public InputEditMessage: string;
  public OutEditResult: boolean;
  public InputDeleteMessage: string;
  public OutDeleteResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddClientChild", { static: true }) private AddClientChild: AddclientComponent;

  public Clientsort: SortDescriptor[] = [
    {
      field: "nstatus",
      dir: "desc",
    },
    {
      field: "sclientname",
      dir: "asc",
    },
  ];
  showInterfaceConfirmation: boolean = false;
  confirmationMsg: string = "Do you want to add interface for ENTR Service ?";
  confirmationFrom: string = "";
  inputConfirmationTitle: string = "Confirmation";
  objClient: Client = new Client();
  loadingGrid: boolean = false;
  Clientdetail: any[] = [];
  AllClientData: any[] = [];
  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };

  constructor(
    private route: Router,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private fb: FormBuilder,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
    this.ClientpageSize = this.clsUtility.configPageSize;
  }
  formGroup = this.fb.group({
    fcClient: [0],
  });

  get fbcClient() {
    return this.formGroup.get("fcClient");
  }

  handleFilter(value) {
    this.Clientdetail = this.AllClientData.filter(
      (s) =>
        s.clientcodename.toLowerCase().includes(value.toLowerCase()) === true
    );
  }

  OutputClientConfigurationEditResult($event) {
    try {
      this.clientid = 0;
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getClientConfigurationById();
      }

      this.AddClientChild.ResetComponents();
      this.editClientid = null;
      this.EditClientid = null;
      $("#addclientModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.subscription.add(
        this.dataService.navSubject.subscribe((data) => {
          if (data != null || data != undefined) {
            if (data.configurationAccess != undefined) {
              this.showInterfaceConfirmation =
                data.configurationAccess.InterfaceConfiguration;
            }
          }
        })
      );
      this.clientid = 0;
      this.getClientConfigurationById();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  formValueChanged() {
    try {
      this.fbcClient.valueChanges.subscribe((clientid) => {
        this.clientChange(clientid);
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  clientChange(nclientid: any) {
    try {
      // this.selectedClient = evt;
      if (nclientid.toString() === "0") {
        this.Clientitems = this.AllClientData;
      } else {
        this.Clientitems = this.AllClientData.filter(
          (ele) => ele.nclientid === nclientid.toString()
        );
      }
      this.Clientskip = 0;
      this.loadItemsClient();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getClientConfigurationById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientConfigurationById(
          this.clientid
        ).subscribe(async (data) => {
          if (data != null || data != undefined) {
            this.AllClientData = data;
            this.Clientdetail = data;
            this.Clientitems = data;
            // this.loadItemsClient();
            this.clientChange(this.fbcClient.value);
          }
        })
      );
      // this.itemsClient = this.MasterService.getClientConfiguration();
      // this.loadItemsClient();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsClient(): void {
    try {
      this.ClientgridView = {
        data: orderBy(
          this.Clientitems.slice(
            this.Clientskip,
            this.Clientskip + this.ClientpageSize
          ),
          this.Clientsort
        ),
        total: this.Clientitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortClientChange(sort: SortDescriptor[]): void {
    try {
      if (this.Clientitems != null) {
        this.Clientsort = sort;
        this.loadItemsClient();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeClient(event: PageChangeEvent): void {
    try {
      this.Clientskip = event.skip;
      this.loadItemsClient();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditClientTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.editClientid = dataItem.nclientid;
      this.InputEditMessage =
        "Do you want to edit client " + dataItem.clientcode + "?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  DeleteClientTemplate({ sender, rowIndex, dataItem }) {
    try {
      this.deleteClientid = dataItem.nclientid;
      this.InputDeleteMessage =
        "Do you want to delete Client " + dataItem.clientcode + "?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  deleteClientConfiguration() {
    try {
      this.subscription.add(
        this.ConfigurationService.deleteClientConfiguration(
          this.deleteClientid
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              alert("Client deleted successfully");
            } else {
              alert("Client not deleted");
            }
            this.clientid = 0;
            this.getClientConfigurationById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateClientStatus(Clientid, Client) {
    try {
      const jsonclient = JSON.stringify(Client);
      this.loadingGrid = true;
      this.subscription.add(
        this.ConfigurationService.updateClientStatus(
          Clientid,
          jsonclient
        ).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                if (Client.nstatus == 1) {
                  //if activating client
                  this.inputConfirmationTitle = "Alert";
                  this.confirmationFrom = "alertinterface";
                  this.confirmationMsg =
                    "Please activate respective client interface(s).";
                  this.clsUtility.showSuccess("Status updated successfully");
                  $("#confirmationModal").modal("show");
                  this.writeLog(
                    "Client: " +
                      Client.clientcodename +
                      " activated successfully.",
                    "ACTIVATE"
                  );
                } else if (Client.nstatus == 0) {
                  this.subscription.add(
                    this.ConfigurationService.deactivateInterface(
                      Clientid,
                      false
                    ).subscribe(
                      (data) => {
                        if (data == 1) {
                          this.clsUtility.showSuccess(
                            "Status updated successfully"
                          );
                          this.writeLog(
                            "Client: " +
                              Client.clientcodename +
                              " deactivated successfully.",
                            "DEACTIVATE"
                          );
                        } else {
                          this.clsUtility.LogError(
                            "Status updated but error while deactivating interface"
                          );
                          this.writeLog(
                            "Client: " +
                              Client.clientcodename +
                              " deactivated successfully but error while deactivating interface.",
                            "DEACTIVATE"
                          );
                        }
                      },
                      (error) => {
                        this.clsUtility.LogError(
                          "Status updated but error while deactivating interface"
                        );
                        this.writeLog(
                          "Client: " +
                            Client.clientcodename +
                            " deactivated successfully but error while deactivating interface.",
                          "DEACTIVATE"
                        );
                      }
                    )
                  );
                }
              } else {
                this.clsUtility.showError("Status not updated");
                this.writeLog(
                  "Client: " +
                    Client.clientcodename +
                    " Error while status update.",
                  "UPDATE"
                );
              }
              this.getClientConfigurationById();
            }
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddClient() {
    try {
      this.confirmationMsg = "Do you want to add interface for ENTR Service ?";
      this.confirmationFrom = "addinterfaceconfirmation";
      this.inputConfirmationTitle = "Confirmation";
      this.editClientid = 0;
      this.EditClientid = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditClientid = this.editClientid;
        $("#addclientModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputDeleteResult($event) {
    try {
      this.OutDeleteResult = $event;
      if (this.OutDeleteResult == true) {
        this.deleteClientConfiguration();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClientStatus(Clientid, ClientStatus) {
    try {
      let objClient: Client;
      objClient = new Client();
      objClient.nclientid = Clientid;
      objClient.nstatus = ClientStatus;
      this.objClient = objClient;
      if (ClientStatus == 0) {
        this.loadingGrid = true;
        this.subscription.add(
          this.ConfigurationService.getInterfacesByClient(Clientid).subscribe(
            (data) => {
              if (data) {
                if (data.length > 0) {
                  let element = data.find((ele) => ele.isactive === true);
                  if (element) {
                    this.confirmationMsg =
                      "Respective Interface(s) will be deactivate. Do you want to continue ?";
                    this.inputConfirmationTitle = "Confirmation";
                    this.confirmationFrom = "deactiveinterfaceconfirmation";
                    $("#confirmationModal").modal("show");
                  } else {
                    this.updateClientStatus(Clientid, objClient);
                  }
                } else {
                  this.updateClientStatus(Clientid, objClient);
                }
              } else {
                this.clsUtility.LogError(
                  "Error while getting interaces by client"
                );
                this.writeLog(
                  "Error while getting interaces by client: " +
                    objClient.clientcode,
                  "UPDATE"
                );
              }
              this.loadingGrid = false;
            },
            (error) => {
              this.loadingGrid = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      } else if (ClientStatus == 1) {
        this.updateClientStatus(Clientid, objClient);
      }
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
  OutputStatusResult(evt: boolean) {
    try {
      if (evt) {
        switch (this.confirmationFrom) {
          case "addinterfaceconfirmation":
            this.route.navigateByUrl("Configuration/interfaces");
            break;
          case "deactiveinterfaceconfirmation":
            this.updateClientStatus(this.objClient.nclientid, this.objClient);
            break;
          case "alertinterface":
            break;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "Client",
      "Qonductor-Configuration"
    );
  }
}
