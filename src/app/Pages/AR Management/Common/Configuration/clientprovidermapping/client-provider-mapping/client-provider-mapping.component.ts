import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { PageChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { FormBuilder } from "@angular/forms";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
import { AddEditClientProviderMappingComponent } from "../add-edit-client-provider-mapping/add-edit-client-provider-mapping.component";
import { UpdateClientProviderMappingStatus } from "src/app/Model/AR Management/Configuration/client-provider-mapping.model";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
declare var $: any;

@Component({
  selector: "app-client-provider-mapping",
  templateUrl: "./client-provider-mapping.component.html",
  styleUrls: ["./client-provider-mapping.component.css"],
})
export class ClientProviderMappingComponent implements OnInit, OnDestroy {
  private subscription = new SubSink();
  public clsUtility: Utility;

  @ViewChild("AddEditClientProviderMapping", { static: true })
  private AddEditClientProviderMapping: AddEditClientProviderMappingComponent;
  pageSize: number = 0;
  pageSkip: number = 0;
  clientProviderMappingItems: any[] = [];
  clientProviderMappingData: any;
  clientProviderGridView: GridDataResult;
  clientProviderSort: SortDescriptor[] = [
    {
      field: "status",
      dir: "desc",
    },
    // {
    //   field: "modifiedon",
    //   dir: "desc",
    // },
    {
      field: "groupmapping",
      dir: "desc",
    },
    {
      field: "clientcode",
      dir: "asc",
    },
  ];
  public InputEditMessage: string;
  mappingDataItem: any;
  loadingGrid: boolean = false;
  loading: boolean = false;
  Clientdetail: any[] = [];
  Providerdetail: any[] = [];
  // selectedClient: any;
  public ClientDefaultValue = { clientid: 0, client: "All" };
  public ProviderDefaultValue = { npi: 0, provider: "All" };
  AllItem: any[] = [];
  AllClientData: any[] = [];
  AllProviderData: any[] = [];
  confirmationMsg: string = "";
  confirmationFrom: string = "";
  updateStatusDataItem: any;
  page: number = 0;
  clientProviderMappingItem: any = {};
  loadingDetails: boolean;
  GroupMapping: Array<any> = [
    {
      text: "All",
      value: -1,
    },
    {
      text: "Yes",
      value: 1,
    },
    {
      text: "No",
      value: 0,
    },
  ];

  constructor(
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private auditLog: WriteAuditLogService,
    private datatransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
    this.pageSize = this.clsUtility.pagesize;
  }
  formGroup = this.fb.group({
    fcClient: [0],
    fcProvider: [0],
    fcGroupMapping: [-1],
  });
  get fbcClient() {
    return this.formGroup.get("fcClient");
  }
  get fbcProvider() {
    return this.formGroup.get("fcProvider");
  }
  get fbcGroupMapping() {
    return this.formGroup.get("fcGroupMapping");
  }
  ngOnInit() {
    try {
      this.loading = true;
      this.getFiltersData();
      this.getClientProviderMappings();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  selectedClientID: string = "0";
  selectedProviderNPI: string = "0";
  selectedGroupMapping: number = -1;
  formValueChanged() {
    try {
      this.fbcClient.valueChanges.subscribe((clientid) => {
        this.selectedClientID = clientid;
        this.pageSkip = 0;
        this.page = 0;
        this.getClientProviderMappings();
      });
      this.fbcProvider.valueChanges.subscribe((npi) => {
        this.selectedProviderNPI = npi;
        this.pageSkip = 0;
        this.page = 0;
        this.getClientProviderMappings();
      });
      this.fbcGroupMapping.valueChanges.subscribe((mapping) => {
        this.selectedGroupMapping = mapping;
        this.pageSkip = 0;
        this.page = 0;
        this.getClientProviderMappings();
      });
      // this.clientChange(this.selectedClientID, this.selectedProviderNPI);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientProviderMappings() {
    try {
      this.loadingGrid = true;
      this.clientProviderMappingItems = [];
      this.clientProviderGridView = null;
      this.subscription.add(
        this.ConfigurationService.getClientProviderMappings(
          this.selectedClientID,
          this.selectedProviderNPI,
          this.selectedGroupMapping,
          this.page,
          this.pageSize
        ).subscribe(
          (data) => {
            this.loadingGrid = false;
            // console.log(data);
            if (data) {
              this.clientProviderMappingData = data;
              if (data.content) {
                this.clientProviderMappingItems = data.content;
                this.loadItems();
              }
            } else {
              if (data == 0) {
                this.writeLog("Error while getting practice mappings", "READ");
                this.clsUtility.LogError(
                  "Error while getting practice mappings"
                );
              }
            }
          },
          (error) => {
            this.loadingGrid = false;
          }
        )
      );
    } catch (error) {
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  getFiltersData() {
    try {
      this.subscription.add(
        this.ConfigurationService.getPracticeFilterMaster().subscribe(
          async (data) => {
            if (data != null || data != undefined) {
              this.AllClientData = data.practiceclients;
              this.Clientdetail = data.practiceclients;

              this.AllProviderData = data.practiceprovider;
              this.Providerdetail = data.practiceprovider.slice(0, 500);
              this.loading = false;
            }
          },
          (err) => {
            this.loading = false;
          }
        )
      );
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  handleFilter(value, filterfor) {
    switch (filterfor) {
      case 0: //client filter
        this.Clientdetail = this.AllClientData.filter(
          (c) =>
            c.client.toLowerCase().includes(value.toLowerCase().trim()) === true
        );
        break;
      case 1: //provider filter
        this.Providerdetail = this.AllProviderData.filter(
          (s) =>
            s.provider.toLowerCase().includes(value.toLowerCase().trim()) ===
            true
        ).slice(0, 500);
        break;
    }
  }

  private loadItems(): void {
    try {
      this.clientProviderGridView = {
        data: orderBy(this.clientProviderMappingItems, this.clientProviderSort),
        total: this.clientProviderMappingData.totalelements,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortChange(sort: SortDescriptor[]): void {
    try {
      if (this.clientProviderMappingItems != null) {
        this.clientProviderSort = sort;
        this.loadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChange(event: PageChangeEvent): void {
    try {
      this.pageSkip = event.skip;
      this.page = event.skip / event.take;
      this.getClientProviderMappings();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  editClientProviderMapping(evt: any) {
    try {
      this.mappingDataItem = evt.dataItem;
      this.InputEditMessage = "Do you want to edit practice mapping ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  addClientProviderMapping() {
    try {
      this.AddEditClientProviderMapping.onAddClientProviderMapping();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult(event: any) {
    try {
      if (event) {
        this.clsUtility.applyModalOpenClassOnClose("editConfirmationModal");
        // this.ClientId = this.editClientloginid;
        this.AddEditClientProviderMapping.onEditClientProviderMapping(
          this.mappingDataItem
        );
        $("#AddEditClientProviderMappingmodal").modal("show");
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
      let updateStatusObj: UpdateClientProviderMappingStatus = new UpdateClientProviderMappingStatus();
      updateStatusObj.status = !dataItem.status;
      updateStatusObj.userid = this.datatransfer.loginGCPUserID.value;
      updateStatusObj.clientid = dataItem.clientid;
      updateStatusObj.username = this.datatransfer.loginUserName;
      updateStatusObj.modifiedon = this.clsUtility.currentDateTime();
      // this.loadingGrid = true;
      this.subscription.add(
        this.ConfigurationService.updatePracticeClientMasterStatus(
          updateStatusObj
        ).subscribe(
          (data) => {
            // this.loadingGrid = false;
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
              this.getClientProviderMappings();
            } else if (data == 0) {
              this.clsUtility.LogError("Error while updating status");
            }
          },
          (error) => {
            // this.loadingGrid = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }
  onclientprovidermappingsave(evt: boolean) {
    try {
      if (evt) {
        this.getFiltersData();
        this.getClientProviderMappings();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onViewClientProviderMappingDetails(dataItem: any) {
    try {
      this.loadingDetails = true;
      this.subscription.add(
        this.ConfigurationService.getClientProviderMappingsDetails(
          dataItem.clientid,
          this.page,
          this.pageSize
        ).subscribe(
          (data) => {
            if (data) {
              this.clientProviderMappingItem = data;
              this.providersDetails = data.providers;
              this.ProviderLoadItems();
            } else {
              if (data == 0) {
                this.writeLog("Error while getting practice mappings", "READ");
                this.clsUtility.LogError(
                  "Error while getting practice mappings"
                );
              }
            }
            this.loadingDetails = false;
          },
          (error) => {
            this.loadingDetails = false;
          }
        )
      );
    } catch (error) {
      this.loadingDetails = false;
      this.clsUtility.LogError(error);
    }
  }
  providersDetails: any[] = [];
  providersGridView: GridDataResult;
  public providerSort: SortDescriptor[] = [
    {
      field: "status",
      dir: "desc",
    },
  ];
  private ProviderLoadItems(): void {
    try {
      if (this.providersDetails != null) {
        this.providersGridView = {
          data: orderBy(this.providersDetails.slice(), this.providerSort),
          total: this.providersDetails.length,
        };
      }
      // this.getClientProviderMappings(dataItem.clientid,this.selectedProviderNPI);
    } catch (error) {
      this.loadingDetails = false;
      this.clsUtility.LogError(error);
    }
  }

  providerSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.providersDetails != null) {
        this.providerSort = sort;
        this.ProviderLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "Practice Mapping",
      "Qonductor-Configuration"
    );
  }
}
