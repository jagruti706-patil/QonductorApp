import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import {
  GridDataResult,
  SelectableSettings,
} from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import {
  ClientProviderMapping,
  EmailConfig,
  PracticeClientGroupMapping,
  PracticeClientMaster,
  PracticeEmailConfig,
  PracticeProviderDetails,
  UpdateClientProviderMappingStatus,
} from "src/app/Model/AR Management/Configuration/client-provider-mapping.model";
import { GCPUser } from "src/app/Model/Common/login";
import { TabStripComponent } from "@progress/kendo-angular-layout";

declare var $: any;

@Component({
  selector: "app-add-edit-client-provider-mapping",
  templateUrl: "./add-edit-client-provider-mapping.component.html",
  styleUrls: ["./add-edit-client-provider-mapping.component.css"],
})
export class AddEditClientProviderMappingComponent
  implements OnInit, OnDestroy {
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;
  providerSubmitted = false;
  newClientProviderMapping: boolean = true;
  @Output()
  onsaveclientprovidermapping: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  loader: boolean = false;
  providersGridData: PracticeProviderDetails[] = [];
  providersGridView: GridDataResult;
  providersSearchGridData: PracticeProviderDetails[] = [];
  providersSearchGridView: GridDataResult;
  newProvider: boolean = true;
  editRowIndex: number;
  providersort: SortDescriptor[] = [
    {
      field: "status",
      dir: "desc",
    },
  ];
  providersearchsort: SortDescriptor[] = [];
  groupusersort: SortDescriptor[] = [];
  clientProviderMappingItem: any = {};
  groups: any[] = [];
  allGroups: any[] = [];
  providerDataItem: PracticeProviderDetails = new PracticeProviderDetails();
  assignGroupsArray: any[] = [];
  providerGroup: FormGroup;
  addEditClientProviderMappingForm: FormGroup;
  public providerSearchSelectableSetting: SelectableSettings;
  public groupUsersSelectableSettings: SelectableSettings;
  public providerSelected: any = [];
  validateGroupLoader: boolean;
  showProviderSearchGrid: boolean;
  public mask: string = "(999) 000-0000";
  clientid: string = "0";
  groupUsers: any[] = [];
  allGroupUsers: any[] = [];
  assignedGroupUsers: GCPUser[] = [];
  mailConfigForm: FormGroup;
  @ViewChild("kendoTabstripTab", { static: true })
  private kendoTabstripTab: TabStripComponent;
  public groupUserSelected: any[] = [];
  practiceemailconfig: any = {};
  mailConfigLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService,
    private auditLog: WriteAuditLogService,
    private coreAuthService: CoreauthService
  ) {
    this.clsUtility = new Utility(toastr);
    this.addEditClientProviderMappingForm = this.fb.group({
      fcGroup: [""],
      fcClientCode: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
        this.checkDuplicateClientCode.bind(this),
      ],
      fcClientName: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
      ],
      fcUPIN: [""],
      fcNPI: [""],
      fcLookup: [""],
      fcContactName: [""],
      fcContactEmail: ["", Validators.email],
      fcPhone1: [""],
      fcPhone2: [""],
      fcAddress1: [""],
      fcAddress2: [""],
      fcCity: [""],
      fcState: [""],
      fcZip: [""],
    });
    this.providerGroup = this.fb.group({
      fcSearchByNpi: [""],
      fcProviderCode: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
        this.checkDuplicateProviderCode.bind(this),
      ],
      fcProviderName: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
      ],
      fcProviderUPIN: [""],
      fcProviderNPI: [
        "",
        [Validators.required, this.clsUtility.noWhitespaceValidator],
      ],
      fcProviderLookup: [""],
      fcProviderPhone1: [""],
      fcProviderPhone2: [""],
    });
    this.mailConfigForm = this.fb.group({
      fcCustomUser: ["", Validators.email],
    });
    this.setProviderSelectableSettings();
    this.setGroupUsersSelectableSettings();
  }
  public setProviderSelectableSettings(): void {
    this.providerSearchSelectableSetting = {
      checkboxOnly: true,
      mode: "single",
    };
  }
  public setGroupUsersSelectableSettings(): void {
    this.groupUsersSelectableSettings = {
      checkboxOnly: true,
      mode: "multiple",
    };
  }

  get fbcClientCode() {
    return this.addEditClientProviderMappingForm.get("fcClientCode");
  }
  get fbcClientName() {
    return this.addEditClientProviderMappingForm.get("fcClientName");
  }
  get fbcGroup() {
    return this.addEditClientProviderMappingForm.get("fcGroup");
  }
  get fbcUPIN() {
    return this.addEditClientProviderMappingForm.get("fcUPIN");
  }
  get fbcNPI() {
    return this.addEditClientProviderMappingForm.get("fcNPI");
  }
  get fbcLookup() {
    return this.addEditClientProviderMappingForm.get("fcLookup");
  }
  get fbcContactName() {
    return this.addEditClientProviderMappingForm.get("fcContactName");
  }
  get fbcContactEmail() {
    return this.addEditClientProviderMappingForm.get("fcContactEmail");
  }
  get fbcPhone1() {
    return this.addEditClientProviderMappingForm.get("fcPhone1");
  }
  get fbcPhone2() {
    return this.addEditClientProviderMappingForm.get("fcPhone2");
  }
  get fbcAddress1() {
    return this.addEditClientProviderMappingForm.get("fcAddress1");
  }
  get fbcAddress2() {
    return this.addEditClientProviderMappingForm.get("fcAddress2");
  }
  get fbcCity() {
    return this.addEditClientProviderMappingForm.get("fcCity");
  }
  get fbcState() {
    return this.addEditClientProviderMappingForm.get("fcState");
  }
  get fbcZip() {
    return this.addEditClientProviderMappingForm.get("fcZip");
  }

  get fbcSearchByNpi() {
    return this.providerGroup.get("fcSearchByNpi");
  }
  get fbcProviderCode() {
    return this.providerGroup.get("fcProviderCode");
  }
  get fbcProviderName() {
    return this.providerGroup.get("fcProviderName");
  }
  get fbcProviderUPIN() {
    return this.providerGroup.get("fcProviderUPIN");
  }
  get fbcProviderNPI() {
    return this.providerGroup.get("fcProviderNPI");
  }
  get fbcProviderLookup() {
    return this.providerGroup.get("fcProviderLookup");
  }
  get fbcProviderPhone1() {
    return this.providerGroup.get("fcProviderPhone1");
  }
  get fbcProviderPhone2() {
    return this.providerGroup.get("fcProviderPhone2");
  }
  get fbcCustomUser() {
    return this.mailConfigForm.get("fcCustomUser");
  }

  public providerSelectedCallback = (args) => args.dataItem;

  public groupUsersSelectedCallback = (args) => args.dataItem;

  ngOnInit() {
    try {
      this.getAllGroups();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getAllGroups() {
    try {
      this.subscription.add(
        this.coreAuthService.getAllGroups().subscribe(
          (data) => {
            if (data) {
              if (!!data.content) {
                this.allGroups = data.content;
                this.groups = data.content;
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getClientProviderMappingDetails(clientid: string) {
    try {
      this.loader = true;
      this.subscription.add(
        this.ConfigurationService.getClientProviderMappingsDetails(
          clientid,
          0,
          this.clsUtility.configPageSize
        ).subscribe(
          (data) => {
            this.loader = false;
            if (data) {
              this.clientProviderMappingItem = data;
              this.fbcClientCode.setValue(
                this.clientProviderMappingItem.clientcode
              );
              this.fbcClientName.setValue(
                this.clientProviderMappingItem.clientname
              );
              this.fbcUPIN.setValue(this.clientProviderMappingItem.upin);
              this.fbcNPI.setValue(this.clientProviderMappingItem.npi);
              this.fbcLookup.setValue(this.clientProviderMappingItem.lookup);
              this.fbcPhone1.setValue(this.clientProviderMappingItem.phoneno1);
              this.fbcPhone2.setValue(this.clientProviderMappingItem.phoneno2);
              this.fbcAddress1.setValue(
                this.clientProviderMappingItem.address1
              );
              this.fbcAddress2.setValue(
                this.clientProviderMappingItem.address2
              );
              this.fbcCity.setValue(this.clientProviderMappingItem.city);
              this.fbcState.setValue(this.clientProviderMappingItem.state);
              this.fbcZip.setValue(this.clientProviderMappingItem.zip);
              // this.fbcContactName.setValue(
              //   this.clientProviderMappingItem.contactname
              // );
              // this.fbcContactEmail.setValue(
              //   this.clientProviderMappingItem.contactemail
              // );
              let groupItems: any[] = [];
              if (this.clientProviderMappingItem.groups) {
                this.clientProviderMappingItem.groups.forEach((ele) => {
                  let obj = this.allGroups.find(
                    (item) => item.groupid.toString() === ele.groupid
                  );
                  if (obj) {
                    groupItems.push(obj);
                  }
                });
              }
              this.fbcGroup.setValue(groupItems);
              this.assignGroupsArray = groupItems.slice();
              if (this.clientProviderMappingItem.providers) {
                this.providersGridData = this.clientProviderMappingItem.providers;
                this.providerLoadItems();
              } else {
                this.providersGridData = [];
                this.providersGridView = null;
              }
              if (this.clientProviderMappingItem.practiceemailconfig) {
                this.practiceemailconfig = this.clientProviderMappingItem.practiceemailconfig;
              } else {
                this.practiceemailconfig = {};
              }
              this.getGroupUsers();
            } else {
              if (data == 0) {
                this.clsUtility.LogError(
                  "Error while getting practice mappings"
                );
              }
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  onAddClientProviderMapping() {
    try {
      this.newClientProviderMapping = true;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onEditClientProviderMapping(dataItem: any) {
    try {
      this.newClientProviderMapping = false;
      this.clientid = dataItem.clientid;
      this.getClientProviderMappingDetails(dataItem.clientid);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.ResetComponents();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  providerSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.providersGridData != null) {
        this.providersort = sort;
        this.providerLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  providerSearchSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.providersSearchGridData != null) {
        this.providersearchsort = sort;
        this.providerSearchLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  groupUserSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.groupUsers != null) {
        this.groupusersort = sort;
        this.groupUsers = orderBy(this.groupUsers.slice(), this.groupusersort);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private providerLoadItems(): void {
    try {
      if (this.providersGridData != null) {
        this.providersGridView = {
          data: orderBy(this.providersGridData.slice(), this.providersort),
          total: this.providersGridData.length,
        };
        this.providersGridData = this.providersGridView.data;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private providerSearchLoadItems(): void {
    try {
      if (this.providersSearchGridData != null) {
        this.providersSearchGridView = {
          data: orderBy(
            this.providersSearchGridData.slice(),
            this.providersearchsort
          ),
          total: this.providersSearchGridData.length,
        };
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.addEditClientProviderMappingForm.reset();
      this.providersGridData = [];
      this.providersGridView = null;
      this.assignGroupsArray = [];
      this.submitted = false;
      this.clientProviderMappingItem = {};
      this.clientid = "0";
      this.allGroupUsers = [];
      this.groupUsers = [];
      this.assignedGroupUsers = [];
      this.groupUserSelected = [];
      this.practiceemailconfig = {};
      this.kendoTabstripTab.selectTab(0);
      this.groupusersort = [];
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleGroupFilter(value: string) {
    this.groups = this.allGroups.filter((ele) =>
      ele.groupname.toLowerCase().includes(value.toLowerCase())
    );
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  addUpdateProvider() {
    try {
      this.providerSubmitted = true;
      if (this.providerGroup.valid) {
        if (this.newProvider) {
          let providerObj: PracticeProviderDetails = new PracticeProviderDetails();
          providerObj.clientmasterid = this.fbcClientCode.value
            ? this.fbcClientCode.value.trim()
            : this.fbcClientCode.value;
          providerObj.code = this.fbcProviderCode.value
            ? this.fbcProviderCode.value.trim()
            : this.fbcProviderCode.value;
          providerObj.createdon = this.clsUtility.currentDateTime();
          providerObj.lookup = this.fbcProviderLookup.value
            ? this.fbcProviderLookup.value.trim()
            : this.fbcProviderLookup.value;
          providerObj.name = this.fbcProviderName.value
            ? this.fbcProviderName.value.trim()
            : this.fbcProviderName.value;
          providerObj.npi = this.fbcProviderNPI.value
            ? this.fbcProviderNPI.value.trim()
            : this.fbcProviderNPI.value;
          providerObj.phoneno1 = this.fbcProviderPhone1.value
            ? this.fbcProviderPhone1.value.trim()
            : this.fbcProviderPhone1.value;
          providerObj.phoneno2 = this.fbcProviderPhone2.value
            ? this.fbcProviderPhone2.value.trim()
            : this.fbcProviderPhone2.value;
          providerObj.status = true;
          providerObj.upin = this.fbcProviderUPIN.value
            ? this.fbcProviderUPIN.value.trim()
            : this.fbcProviderUPIN.value;
          providerObj.userid = this.datatransfer.loginGCPUserID.value;
          providerObj.username = this.datatransfer.loginUserName;
          this.providersGridData.push(providerObj);
        } else {
          this.providersGridData[
            this.editRowIndex
          ].clientid = this.clientProviderMappingItem.clientid;
          this.providersGridData[this.editRowIndex].clientmasterid = this
            .fbcClientCode.value
            ? this.fbcClientCode.value.trim()
            : this.fbcClientCode.value;
          this.providersGridData[this.editRowIndex].code = this.fbcProviderCode
            .value
            ? this.fbcProviderCode.value.trim()
            : this.fbcProviderCode.value;
          this.providersGridData[this.editRowIndex].lookup = this
            .fbcProviderLookup.value
            ? this.fbcProviderLookup.value.trim()
            : this.fbcProviderLookup.value;
          this.providersGridData[
            this.editRowIndex
          ].modifiedon = this.clsUtility.currentDateTime();
          this.providersGridData[this.editRowIndex].name = this.fbcProviderName
            .value
            ? this.fbcProviderName.value.trim()
            : this.fbcProviderName.value;
          this.providersGridData[this.editRowIndex].npi = this.fbcProviderNPI
            .value
            ? this.fbcProviderNPI.value.trim()
            : this.fbcProviderNPI.value;
          this.providersGridData[this.editRowIndex].phoneno1 = this
            .fbcProviderPhone1.value
            ? this.fbcProviderPhone1.value.trim()
            : this.fbcProviderPhone1.value;
          this.providersGridData[this.editRowIndex].phoneno2 = this
            .fbcProviderPhone2.value
            ? this.fbcProviderPhone2.value.trim()
            : this.fbcProviderPhone2.value;
          this.providersGridData[
            this.editRowIndex
          ].providerid = this.providerDataItem.providerid;
          this.providersGridData[
            this.editRowIndex
          ].status = this.providerDataItem.status;
          this.providersGridData[this.editRowIndex].upin = this.fbcProviderUPIN
            .value
            ? this.fbcProviderUPIN.value.trim()
            : this.fbcProviderUPIN.value;
          this.providersGridData[
            this.editRowIndex
          ].userid = this.datatransfer.loginGCPUserID.value;
          this.providersGridData[
            this.editRowIndex
          ].username = this.datatransfer.loginUserName;
          if (this.providersGridData[this.editRowIndex].providerid)
            this.providersGridData[
              this.editRowIndex
            ].modifiedon = this.clsUtility.currentDateTime();
        }
        this.clsUtility.applyModalOpenClassOnClose("addEditProviderModal");
        $("#addEditProviderModal").modal("hide");
        this.providerGroup.reset();
        this.providersSearchGridData = [];
        this.providersSearchGridView = null;
        this.providerDataItem = new PracticeProviderDetails();
        this.providerSubmitted = false;
        this.showProviderSearchGrid = false;
        this.providerLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onProviderClose() {
    try {
      this.providerGroup.reset();
      this.providerSubmitted = false;
      this.showProviderSearchGrid = false;
      this.providersSearchGridData = [];
      this.providersSearchGridView = null;
      this.providerDataItem = new PracticeProviderDetails();
      this.clsUtility.applyModalOpenClassOnClose("addEditProviderModal");
      $("#addEditProviderModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onUpdateStatus(dataItem: any) {
    try {
      let updateStatusObj: UpdateClientProviderMappingStatus = new UpdateClientProviderMappingStatus();
      updateStatusObj.status = !dataItem.status;
      updateStatusObj.userid = this.datatransfer.loginGCPUserID.value;
      updateStatusObj.providerid = dataItem.providerid;
      updateStatusObj.username = this.datatransfer.loginUserName;
      updateStatusObj.modifiedon = this.clsUtility.currentDateTime();
      this.subscription.add(
        this.ConfigurationService.updatePracticeProviderStatus(
          updateStatusObj
        ).subscribe(
          (data) => {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
              dataItem.status = updateStatusObj.status;
            } else if (data == 0) {
              this.clsUtility.LogError("Error while updating status");
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onEditProvider(evt: any) {
    try {
      this.newProvider = false;
      this.editRowIndex = evt.rowIndex;
      this.providerDataItem = evt.dataItem;
      this.fbcProviderCode.setValue(this.providerDataItem.code);
      this.fbcProviderLookup.setValue(this.providerDataItem.lookup);
      this.fbcProviderName.setValue(this.providerDataItem.name);
      this.fbcProviderNPI.setValue(this.providerDataItem.npi);
      this.fbcProviderPhone1.setValue(this.providerDataItem.phoneno1);
      this.fbcProviderPhone2.setValue(this.providerDataItem.phoneno2);
      this.fbcProviderUPIN.setValue(this.providerDataItem.upin);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onClientProviderMappingSave() {
    try {
      this.submitted = true;
      if (this.groupUserSelected.length > 0) {
        this.savePracticeMapping();
      } else {
        if (this.assignGroupsArray.length == 0) {
          this.savePracticeMapping();
        } else {
          $("#mailConfigConfirmation").modal("show");
        }
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  savePracticeMapping() {
    try {
      if (this.addEditClientProviderMappingForm.valid) {
        let practiceClientMaster: PracticeClientMaster = new PracticeClientMaster();
        practiceClientMaster.address1 = this.fbcAddress1.value
          ? this.fbcAddress1.value.trim()
          : this.fbcAddress1.value;
        practiceClientMaster.address2 = this.fbcAddress2.value
          ? this.fbcAddress2.value.trim()
          : this.fbcAddress2.value;
        practiceClientMaster.city = this.fbcCity.value
          ? this.fbcCity.value.trim()
          : this.fbcCity.value;
        practiceClientMaster.clientcode = this.clsUtility.formatText(
          this.fbcClientCode.value
        );
        practiceClientMaster.clientname = this.clsUtility.formatText(
          this.fbcClientName.value
        );
        practiceClientMaster.lookup = this.fbcLookup.value
          ? this.fbcLookup.value.trim()
          : this.fbcLookup.value;
        practiceClientMaster.npi = this.fbcNPI.value
          ? this.fbcNPI.value.trim()
          : this.fbcNPI.value;
        practiceClientMaster.phoneno1 = this.fbcPhone1.value
          ? this.fbcPhone1.value.trim()
          : this.fbcPhone1.value;
        practiceClientMaster.phoneno2 = this.fbcPhone2.value
          ? this.fbcPhone2.value.trim()
          : this.fbcPhone2.value;
        practiceClientMaster.state = this.fbcState.value
          ? this.fbcState.value.trim()
          : this.fbcState.value;

        practiceClientMaster.upin = this.fbcUPIN.value
          ? this.fbcUPIN.value.trim()
          : this.fbcUPIN.value;
        practiceClientMaster.userid = this.datatransfer.loginGCPUserID.value;
        practiceClientMaster.username = this.datatransfer.loginUserName;
        practiceClientMaster.zip = this.fbcZip.value
          ? this.fbcZip.value.trim()
          : this.fbcZip.value;
        practiceClientMaster.contactname = this.fbcContactName.value
          ? this.fbcContactName.value.trim()
          : this.fbcContactName.value;
        practiceClientMaster.contactemail = this.fbcContactEmail.value
          ? this.fbcContactEmail.value.trim()
          : this.fbcContactEmail.value;
        practiceClientMaster.clientid = this.clientProviderMappingItem.clientid;
        if (this.newClientProviderMapping) {
          practiceClientMaster.status = true;
          practiceClientMaster.createdon = this.clsUtility.currentDateTime();
        } else {
          practiceClientMaster.status = this.clientProviderMappingItem.status;
          practiceClientMaster.modifiedon = this.clsUtility.currentDateTime();
        }
        let inputBody: ClientProviderMapping = new ClientProviderMapping();
        inputBody.practiceProviderDetails = this.providersGridData;
        inputBody.practiceClientMaster = practiceClientMaster;
        inputBody.practiceClientGroupMapping = [];
        this.assignGroupsArray.forEach((element) => {
          let practiceClientGroupMapping = new PracticeClientGroupMapping();
          practiceClientGroupMapping.clientid = this.clientProviderMappingItem.clientid;
          practiceClientGroupMapping.clientmasterid = this.fbcClientCode.value
            ? this.fbcClientCode.value.trim()
            : this.fbcClientCode.value;
          practiceClientGroupMapping.groupid = element.groupid;
          practiceClientGroupMapping.groupname = element.groupname;
          practiceClientGroupMapping.ismappingactive = true;
          let groupItem: any;
          if (this.clientProviderMappingItem.groups) {
            groupItem = this.clientProviderMappingItem.groups.find(
              (item) => item.groupid.toString() === element.groupid.toString()
            );
          }
          if (groupItem) {
            practiceClientGroupMapping.mappingid = groupItem.mappingid;
          }

          if (practiceClientGroupMapping.mappingid)
            practiceClientGroupMapping.modifiedon = this.clsUtility.currentDateTime();
          else
            practiceClientGroupMapping.createdon = this.clsUtility.currentDateTime();
          practiceClientGroupMapping.userid = this.datatransfer.loginGCPUserID.value;
          practiceClientGroupMapping.username = this.datatransfer.loginUserName;
          inputBody.practiceClientGroupMapping.push(practiceClientGroupMapping);
        });

        inputBody.practiceEmailConfig = new PracticeEmailConfig();
        inputBody.practiceEmailConfig.clientcode =
          practiceClientMaster.clientcode;
        inputBody.practiceEmailConfig.clientid = this.clientProviderMappingItem.clientid;

        inputBody.practiceEmailConfig.createdon = this.clsUtility.currentDateTime();
        let emailconfig = new Array<EmailConfig>();
        this.groupUserSelected.forEach((ele) => {
          let objEmailConfig: EmailConfig = new EmailConfig();
          objEmailConfig.email = ele.email;
          objEmailConfig.userid = ele.userid;
          objEmailConfig.username =
            objEmailConfig.userid == "0"
              ? ""
              : ele.username
              ? ele.username
              : ele.firstname + " " + ele.lastname;
          objEmailConfig.groupid = ele.groupid;
          emailconfig.push(objEmailConfig);
          // objEmailConfig.groupid = ele
        });
        inputBody.practiceEmailConfig.emailconfig = emailconfig;
        inputBody.practiceEmailConfig.configid = this.practiceemailconfig.configid;
        inputBody.practiceEmailConfig.modifiedon = this.clsUtility.currentDateTime();
        inputBody.practiceEmailConfig.userid = this.datatransfer.loginGCPUserID.value;
        inputBody.practiceEmailConfig.username = this.datatransfer.loginUserName;
        this.loader = true;
        this.subscription.add(
          this.ConfigurationService.saveClientProviderMappings(
            inputBody
          ).subscribe(
            (data) => {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Practice mapping saved successfully"
                );
                this.ResetComponents();
                $("#AddEditClientProviderMappingmodal").modal("hide");
                this.onsaveclientprovidermapping.next(true);
              } else if (data == 0) {
                this.clsUtility.LogError("Error while saving practice mapping");
              } else if (data == 2) {
                this.clsUtility.showInfo("Practice code already exists");
              } else if (data == 3) {
                this.clsUtility.showInfo(
                  "Provider npi is already registered for this practice"
                );
              } else if (data == 4) {
                this.clsUtility.showInfo(
                  "Group is already registered for this practice"
                );
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
            }
          )
        );
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  assignGroups() {
    try {
      if (this.fbcGroup.value && this.fbcGroup.value.length > 0) {
        let arrayOfGroup: string[] = [];
        this.fbcGroup.value.forEach((element) => {
          arrayOfGroup.push(element.groupid.toString());
        });
        let inputBody: {
          clientid: string;
          groupid: string[];
          validationfor: number;
        } = {
          clientid: this.clientProviderMappingItem.clientid
            ? this.clientProviderMappingItem.clientid.toString()
            : "0",
          groupid: arrayOfGroup,
          validationfor: 3, //3 means validation for group mapping
        };
        this.validateGroupLoader = true;
        this.subscription.add(
          this.ConfigurationService.validateGroupMapping(inputBody).subscribe(
            (data) => {
              this.validateGroupLoader = false;
              // console.log(data);
              if (data) {
                if (data.result == 1) {
                  // if (
                  //   this.fbcGroup.value.length < this.assignGroupsArray.length
                  // ) {
                  //   var groupuser: any[] = [];
                  //   if (this.groupUserSelected.length == 0) {
                  //     this.fbcGroup.value.forEach((element) => {
                  //       groupuser = this.groupUsers.filter(
                  //         (x) => x.groupid == 0 || x.groupid == element.groupid
                  //       );
                  //     });
                  //     this.groupUsers = groupuser;
                  //   } else {
                  //     this.fbcGroup.value.forEach((element) => {
                  //       groupuser = this.groupUserSelected.filter(
                  //         (x) => x.groupid == 0 || x.groupid == element.groupid
                  //       );
                  //     });
                  //     this.groupUsers = groupuser;
                  //     this.groupUserSelected = groupuser;
                  //   }

                  //   this.assignGroupsArray = this.fbcGroup.value.slice();
                  // } else {
                  this.assignGroupsArray = this.fbcGroup.value.slice();
                  this.getGroupUsers();
                  // }
                } else if (data.result == 2) {
                  this.clsUtility.showInfo(
                    "Group: " +
                      data.groupname +
                      " is already mapped with Practice: " +
                      data.clientname
                  );
                }
              } else {
                if (data == 0) {
                  this.clsUtility.LogError(
                    "Error while checking duplicate group"
                  );
                }
              }
            },
            (error) => {
              this.validateGroupLoader = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      } else {
        this.assignGroupsArray = [];
        var groupuser: any[] = [];
        groupuser = this.groupUserSelected.filter((x) => x.groupid == 0);
        this.groupUsers = groupuser;
        this.groupUserSelected = groupuser;
      }
    } catch (error) {
      this.validateGroupLoader = false;
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "Add Edit Practice Mapping",
      "Qonductor-Configuration"
    );
  }
  onSearchByNpi() {
    try {
      if (this.fbcSearchByNpi.value) {
        this.fbcSearchByNpi.setValue(this.fbcSearchByNpi.value.trim());
      }
      this.providersSearchGridData = [];
      this.providersSearchGridView = null;
      this.resetProviderForm();
      // console.log(this.fbcSearchByNpi.value);
      if (this.fbcSearchByNpi.value) {
        this.subscription.add(
          this.coreAuthService
            .getProvidersFromNpiRegistry(this.fbcSearchByNpi.value)
            .subscribe(
              (data) => {
                // console.log(data);
                this.showProviderSearchGrid = true;
                if (data) {
                  this.providersSearchGridData = data.result;
                  this.providerSearchLoadItems();
                } else {
                  if (data == 0) {
                    this.clsUtility.LogError("Error while getting providers");
                  }
                }
              },
              (error) => {
                this.clsUtility.LogError(error);
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  providerSelectionChange(evt: any) {
    try {
      // console.log(evt.selectedRows);
      if (evt.selectedRows.length > 0) {
        let providerDataItem = evt.selectedRows[0].dataItem;
        if (providerDataItem) {
          this.fbcProviderName.setValue(providerDataItem.fullname);
          this.fbcProviderLookup.setValue(providerDataItem.fullname);
          this.fbcProviderNPI.setValue(providerDataItem.npi);
        }
      } else {
        this.resetProviderForm();
      }
      // console.log(this.providerSelected);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  resetProviderForm() {
    try {
      this.fbcProviderCode.setValue("");
      this.fbcProviderNPI.setValue("");
      this.fbcProviderUPIN.setValue("");
      this.fbcProviderName.setValue("");
      this.fbcProviderLookup.setValue("");
      this.fbcProviderPhone1.setValue("");
      this.fbcProviderPhone2.setValue("");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  validatePracticeCode() {
    try {
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  debouncer: any;
  disableSavePracticeBtn: boolean;
  checkDuplicateClientCode(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        const val = control.value ? control.value.trim() : null;
        if (val) {
          let inputBody: {
            clientid: string;
            clientcode: string;
            validationfor: number;
          } = {
            clientid: this.clientid ? this.clientid.toString() : "0",
            clientcode: val,
            validationfor: 1, //1 means validation for practice code
          };
          this.disableSavePracticeBtn = true;
          this.ConfigurationService.validateGroupMapping(inputBody).subscribe(
            (data) => {
              this.disableSavePracticeBtn = false;
              if (data) {
                if (data.result == 1) {
                  resolve(null);
                } else if (data.result == 2) {
                  resolve({ duplicate: true });
                }
              } else {
                if (data == 0) {
                  this.clsUtility.LogError(
                    "Error while checking duplicate practice code"
                  );
                }
              }
            },
            (error) => {
              this.disableSavePracticeBtn = false;
              this.clsUtility.LogError(error);
            }
          );
        }
      }, 700);
    });
  }
  disableAddProviderBtn: boolean;
  checkDuplicateProviderCode(control: FormControl): any {
    clearTimeout(this.debouncer);

    return new Promise((resolve) => {
      this.debouncer = setTimeout(() => {
        const val = control.value ? control.value.trim() : null;
        if (val) {
          let eleInArray = this.providersGridData.find(
            (ele) => ele.code == val
          );
          if (eleInArray) {
            if (this.providerDataItem.code !== eleInArray.code)
              resolve({ duplicate: true });
            else resolve(null);
          } else {
            let inputBody: {
              providerid: string;
              providercode: string;
              validationfor: number;
            } = {
              providerid: this.providerDataItem.providerid
                ? this.providerDataItem.clientid.toString()
                : "0",
              providercode: val,
              validationfor: 2, //2 means validation for provider code
            };
            this.disableAddProviderBtn = true;
            this.ConfigurationService.validateGroupMapping(inputBody).subscribe(
              (data) => {
                this.disableAddProviderBtn = false;
                if (data) {
                  if (data.result == 1) {
                    resolve(null);
                  } else if (data.result == 2) {
                    resolve({ duplicate: true });
                  }
                } else {
                  if (data == 0) {
                    this.clsUtility.LogError(
                      "Error while checking duplicate provider code"
                    );
                  }
                }
              },
              (error) => {
                this.disableAddProviderBtn = false;
                this.clsUtility.LogError(error);
              }
            );
          }
        }
      }, 700);
    });
  }
  tabChange(evt: any) {
    try {
      if (evt.index == 2) {
        // this.getGroupUsers();
      } else {
        // this.groupUsers = [];
        // this.groupUserSelected = [];
      }
      this.fbcCustomUser.setValue("");
      // console.log(evt);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddUser() {
    try {
      // this.assignGroupsArray.push(this.fbcCustomUser.value);
      if (this.mailConfigForm.valid) {
        this.fbcCustomUser.setValue(
          this.fbcCustomUser.value ? this.fbcCustomUser.value.trim() : ""
        );
        if (this.fbcCustomUser.value) {
          if (
            this.groupUsers.findIndex(
              (ele) => this.fbcCustomUser.value == ele.email
            ) == -1
          ) {
            this.groupUsers.push({
              userid: "0",
              username: "",
              email: this.fbcCustomUser.value,
            });
            // this.groupUserSelected.push({
            //   userid: "0",
            //   username: "",
            //   email: this.fbcCustomUser.value,
            // });
            this.fbcCustomUser.setValue("");
          } else {
            this.clsUtility.showWarning("Email address already exists");
          }
        } else {
          this.clsUtility.showInfo("Email address is required");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async getGroupUsers() {
    try {
      this.mailConfigLoader = true;
      this.groupUsers = [];
      this.allGroupUsers = [];
      this.groupUserSelected = [];
      for (let i = 0; i < this.assignGroupsArray.length; i++) {
        await this.coreAuthService
          .getGroupsUser(this.assignGroupsArray[i].groupid)
          .toPromise()
          .then(
            (users) => {
              if (users != null || users != undefined) {
                // this.AllGroupUsers = users;
                // this.GroupUsers = users;
                users.forEach((item) => {
                  let ind: number = this.groupUsers.findIndex(
                    (user) => user.userid == item.userid
                  );
                  if (ind == -1) {
                    item.groupid = this.assignGroupsArray[i].groupid;
                    this.groupUsers.push(item);
                    this.allGroupUsers.push(item);
                  }
                });
              }
            },
            (err) => {
              this.mailConfigLoader = false;
            }
          );
      }
      if (this.practiceemailconfig.emailconfig) {
        this.practiceemailconfig.emailconfig.forEach((item) => {
          let element = this.groupUsers.find(
            (ele) => item.userid !== "0" && ele.userid == item.userid
          );
          // var user = this.groupUserSelected.find((x) => x.email == item.email);
          // if (user) {
          //   // console.log("found");
          // } else {
          // console.log("Not found");
          if (element) {
            this.groupUserSelected.push(element);
          } else {
            if (item.userid == "0") {
              item.groupid = 0;
              this.groupUsers.push(item);
              this.groupUserSelected.push(item);
            }
          }
          // }
        });

        // this.groupUserSelected = this.practiceemailconfig.emailconfig;
      } else {
        this.groupUserSelected = [];
      }
      this.mailConfigLoader = false;
      // this.subscription.add(
    } catch (error) {
      this.mailConfigLoader = false;
      this.clsUtility.LogError(error);
    }
  }
  OutputConfirmationResult(evt: boolean) {
    try {
      $("#mailConfigConfirmation")
        .modal()
        .on("hidden.bs.modal", function (e) {
          $("body").addClass("modal-open");
        });
      $("#mailConfigConfirmation").modal("hide");
      if (evt) {
        this.savePracticeMapping();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
