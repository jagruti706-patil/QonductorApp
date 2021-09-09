import { Component, OnInit, ViewChild } from "@angular/core";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { AddEditInterfaceComponent } from "../add-edit-interface/add-edit-interface.component";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { FormBuilder } from "@angular/forms";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-interface-details",
  templateUrl: "./interface-details.component.html",
  styleUrls: ["./interface-details.component.css"],
})
export class InterfaceDetailsComponent implements OnInit {
  private subscription = new SubSink();
  public clsUtility: Utility;

  @ViewChild("AddEditInterface", { static: true })
  private AddEditInterface: AddEditInterfaceComponent;
  pageSize: number = 0;
  clientid: number = 0;
  pageSkip: number = 0;
  InterfaceItems: any[] = [];
  interfacesGridView: GridDataResult;
  interfaceSort: SortDescriptor[] = [
    {
      field: "isactive",
      dir: "desc",
    },
    {
      field: "clientname",
      dir: "asc",
    },
    {
      field: "interfacename",
      dir: "asc",
    },
  ];
  public InputEditMessage: string;
  interfaceDataItem: any;
  loadingGrid: boolean = false;
  Clientdetail: any[] = [];
  // selectedClient: any;
  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  AllItem: any[] = [];
  AllClientData: any[] = [];
  confirmationMsg: string = "";
  confirmationFrom: string = "";
  updateStatusDataItem: any;

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService,
    private filterService: FilterService,
    private fb: FormBuilder,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pageSize = this.clsUtility.configPageSize;
  }
  formGroup = this.fb.group({
    fcClient: [0],
  });
  get fbcClient() {
    return this.formGroup.get("fcClient");
  }
  ngOnInit() {
    try {
      this.getInterfaces();
      this.getClients();
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
        this.InterfaceItems = this.AllItem;
      } else {
        this.InterfaceItems = this.AllItem.filter(
          (ele) => ele.clientid === nclientid.toString()
        );
      }
      this.pageSkip = 0;
      this.loadItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getInterfaces() {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.ConfigurationService.getInterfaces().subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.AllItem = data;
              this.InterfaceItems = data;
              this.clientChange(this.fbcClient.value);
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

  getClients() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientConfigurationById(0).subscribe(
          async (data) => {
            if (data != null || data != undefined) {
              this.AllClientData = data;
              this.Clientdetail = data;
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  handleFilter(value) {
    this.Clientdetail = this.AllClientData.filter(
      (s) =>
        s.clientcodename.toLowerCase().includes(value.toLowerCase()) === true
    );
  }

  private loadItems(): void {
    try {
      this.interfacesGridView = {
        data: orderBy(
          this.InterfaceItems.slice(
            this.pageSkip,
            this.pageSkip + this.pageSize
          ),
          this.interfaceSort
        ),
        total: this.InterfaceItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortChange(sort: SortDescriptor[]): void {
    try {
      if (this.InterfaceItems != null) {
        this.interfaceSort = sort;
        this.loadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    try {
      this.pageSkip = event.skip;
      this.loadItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  editInterface(evt: any) {
    try {
      // console.log(evt);
      this.clientid = evt.dataItem.clientid;
      this.interfaceDataItem = evt.dataItem;
      this.InputEditMessage = "Do you want to edit interface ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  AddInterface() {
    try {
      // this.AddEditInterface.clientid = 0;
      this.AddEditInterface.onAddInterface();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult(event: any) {
    try {
      if (event) {
        // this.ClientId = this.editClientloginid;
        this.AddEditInterface.onEditInterface(this.interfaceDataItem);
        $("#addeditinterfacemodal").modal("show");
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
  onUpdateStatus(dataItem: any) {
    try {
      this.updateStatusDataItem = dataItem;
      if (dataItem.isactive == false) {
        this.loadingGrid = true;
        this.subscription.add(
          this.ConfigurationService.getClientDetailsById(
            dataItem.clientid
          ).subscribe(
            (data) => {
              if (data) {
                let clientServices: any[] = data.clientServices;
                let element = clientServices.find(
                  (ele) => ele.servicecode === "ENTR"
                );
                if (element) {
                  if (dataItem.interfacecode == "SFTP") {
                    this.confirmationFrom = "activate";
                    this.confirmationMsg =
                      "All SFTP folders will be activated. Do you want to continue ?";
                    $("#confirmationModal").modal("show");
                  } else {
                    this.updateInterfaceStatus(
                      dataItem.accountid,
                      true,
                      dataItem.interfacecode
                    );
                  }
                } else {
                  this.clsUtility.showInfo(
                    "Please activate ENTR" +
                      " service for \nclient: " +
                      dataItem.clientname +
                      " and then try again."
                  );
                }
              }
              this.loadingGrid = false;
            },
            (error) => {
              this.loadingGrid = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      } else {
        if (dataItem.interfacecode == "SFTP") {
          this.confirmationFrom = "deactivate";
          this.confirmationMsg =
            "All SFTP folders will be deactivated. Do you want to continue ?";
          $("#confirmationModal").modal("show");
        } else {
          this.updateInterfaceStatus(
            dataItem.accountid,
            false,
            dataItem.interfacecode
          );
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateInterfaceStatus(
    accountid: string,
    status: boolean,
    interfacecode: string
  ) {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.ConfigurationService.updateInterfaceStatus(
          accountid,
          status,
          interfacecode,
          this.updateStatusDataItem
        ).subscribe(
          (data) => {
            if (data) {
              this.clsUtility.showSuccess("Status updated successfully");
              this.getInterfaces();
              if (status) {
                this.writeLog(
                  "Status for interface accountid: " +
                    accountid +
                    " activated successfully.",
                  "ACTIVATE"
                );
              } else {
                this.writeLog(
                  "Status for interface accountid: " +
                    accountid +
                    " deactivated successfully.",
                  "DEACTIVATE"
                );
              }
            }
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  oninterfacesave(evt: boolean) {
    try {
      if (evt) {
        this.getInterfaces();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputStatusResult(evt: boolean) {
    try {
      if (evt) {
        switch (this.confirmationFrom) {
          case "activate":
            this.updateInterfaceStatus(
              this.updateStatusDataItem.accountid,
              true,
              this.updateStatusDataItem.interfacecode
            );
            break;
          case "deactivate":
            this.updateInterfaceStatus(
              this.updateStatusDataItem.accountid,
              false,
              this.updateStatusDataItem.interfacecode
            );
            break;
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  interFaceMasterDetails: any;
  interfaceFolderDetails: any = [];
  interfacesFolderGridView: GridDataResult;
  loadingDetails: boolean = false;
  public foldersort: SortDescriptor[] = [
    {
      field: "isactive",
      dir: "desc",
    },
  ];
  onViewInterface(dataItem: any) {
    try {
      this.loadingDetails = true;
      this.subscription.add(
        this.ConfigurationService.getInterfaceDetails(
          dataItem.clientid,
          dataItem.interfacecode,
          dataItem.loginid,
          dataItem.rootfolder
        ).subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.interFaceMasterDetails = data[0];
              this.interfaceFolderDetails = data[0].interfacedetails;
              this.writeLog("View interface details", "READ");
            } else {
              this.interFaceMasterDetails = null;
              this.interfaceFolderDetails = [];
            }
            this.FolderLoadItems();
            this.loadingDetails = false;
          },
          (error) => {
            this.loadingDetails = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loadingDetails = false;
      this.clsUtility.LogError(error);
    }
  }
  private FolderLoadItems(): void {
    try {
      this.interfacesFolderGridView = {
        data: orderBy(
          this.interfaceFolderDetails.slice(
            this.pageSkip,
            this.pageSkip + this.pageSize
          ),
          this.foldersort
        ),
        total: this.InterfaceItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  folderSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.interfaceFolderDetails != null) {
        this.foldersort = sort;
        this.FolderLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "Client Interface",
      "Qonductor-Configuration"
    );
  }
}
