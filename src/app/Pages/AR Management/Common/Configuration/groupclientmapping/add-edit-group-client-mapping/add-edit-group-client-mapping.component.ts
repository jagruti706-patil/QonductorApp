import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  orderBy,
  CompositeFilterDescriptor,
  filterBy,
} from "@progress/kendo-data-query";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  GroupClientMapping,
  GroupClients,
} from "src/app/Model/AR Management/Configuration/group-client-mapping.model";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
declare var $: any;
@Component({
  selector: "app-add-edit-group-client-mapping",
  templateUrl: "./add-edit-group-client-mapping.component.html",
  styleUrls: ["./add-edit-group-client-mapping.component.css"],
})
export class AddEditGroupClientMappingComponent implements OnInit, OnDestroy {
  loader: boolean;
  loadingClientGrid: boolean;
  groups: any[] = [];
  grouptypes: any[] = [
    {
      mappingtypeid: 0,
      mappingtypename: "Other",
    },
    {
      mappingtypeid: 1,
      mappingtypename: "Practice",
    },
  ];
  allGroups: any[] = [];
  clsUtility: Utility;
  subscription: SubSink = new SubSink();
  clientGridView: GridDataResult;
  pageSize = 0;
  pageSkip = 0;
  sort: SortDescriptor[] = [{ field: "sclientname", dir: "asc" }];
  clientItems: any[] = [];
  allClientItems: any[] = [];
  // selectableSettings: SelectableSettings;
  clientSelected: any[] = [];
  public editGroupId: string;
  public editmappingtypeid: number;
  modalFor: string;
  groupName: string;
  mappingTypeName: string;
  submitted: boolean;
  @Output() OnSaveGroupClientMapping: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  clsAuthLogs: AuthLogs;
  mappingTypeId: number;
  previousMappingType: number = 0;
  filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };

  constructor(
    private fb: FormBuilder,
    private coreAuthService: CoreauthService,
    private toastr: ToastrService,
    private filterService: FilterService,
    private configService: ConfigurationService,
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
    // this.setSelectableSettings("multiple");
    this.pageSize = this.clsUtility.configPageSize;
    this.clsAuthLogs = new AuthLogs(http);
  }
  ngOnInit() {
    this.getAllGroups();
    this.getAllClients();
  }
  addEditMappingForm = this.fb.group({
    fcGroup: ["", Validators.required],
    fcMappingType: [0, Validators.required],
  });

  get fbcGroup() {
    return this.addEditMappingForm.get("fcGroup");
  }
  get fbcMappingType() {
    return this.addEditMappingForm.get("fcMappingType");
  }

  public selectedCallback = (args) => args.dataItem;

  // public setSelectableSettings(mode: SelectableMode): void {
  //   this.selectableSettings = {
  //     checkboxOnly: true,
  //     mode: mode,
  //   };
  // }
  handleFilter(value: string) {
    this.groups = this.allGroups.filter((ele) =>
      ele.groupname.toLowerCase().includes(value.toLowerCase())
    );
  }
  // handleClientFilter(evt: any) {
  //   console.log(evt);
  //   // this.groups = this.allGroups.filter((ele) =>
  //   //   ele.groupname.toLowerCase().includes(value.toLowerCase())
  //   // );
  // }
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
  getAllClients() {
    try {
      this.subscription.add(
        this.filterService.getClients("ENTR", -1).subscribe((data) => {
          if (data != null || data != undefined) {
            this.allClientItems = data.slice(0);
            this.clientItems = data;
            // this.clientSelected=this.clientItems
            this.loadGridView();
          } else {
            this.allClientItems = [];
            this.clientItems = [];
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  addGroupClientMapping() {
    try {
      this.modalFor = "add";
      this.fbcMappingType.setValue(0);
      this.clientItems = this.allClientItems.slice(0);
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  editGroupClientMapping() {
    try {
      this.modalFor = "edit";
      this.clientItems = this.allClientItems.slice(0);
      this.loadGridView();
      this.getGroupClientMappings();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  detailsGroupClientMapping() {
    try {
      this.modalFor = "details";
      this.getGroupClientMappings();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onPageChange(event: PageChangeEvent) {
    try {
      this.pageSkip = event.skip;
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSortChange(sort: SortDescriptor[]): void {
    try {
      this.sort = sort;
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private loadGridView(): void {
    try {
      this.clientGridView = {
        data: orderBy(
          filterBy(
            this.clientItems.slice(
              this.pageSkip,
              this.pageSkip + this.pageSize
            ),
            this.filter
          ),
          this.sort
        ),
        total: 0,
      };
      this.clientGridView.total = this.clientGridView.data.length;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  groupTypeChange(evt: any) {
    try {
      this.previousMappingType = this.fbcMappingType.value;
      if (this.clientSelected.length > 0) {
        $("#selectionConfirmation").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputConfirmationResult(evt: boolean) {
    try {
      $("#selectionConfirmation")
        .modal()
        .on("hidden.bs.modal", function (e) {
          $("body").addClass("modal-open");
        });
      $("#selectionConfirmation").modal("hide");
      if (evt) this.clientSelected = [];
      else this.fbcMappingType.setValue(this.previousMappingType);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getGroupClientMappings() {
    try {
      this.loader = true;
      this.subscription.add(
        this.configService
          .getGroupClientMappings(this.editGroupId, this.editmappingtypeid)
          .subscribe(
            (data) => {
              if (data) {
                this.groupName = data.groupname;
                this.mappingTypeId = data.mappingtypeid;
                this.fbcMappingType.setValue(this.mappingTypeId);
                this.mappingTypeName = data.mappingtypename;
                let mappedClients = [];
                for (let i = 0; i < data.clientdetails.length; i++) {
                  let clientItem = this.allClientItems.find(
                    (ele) =>
                      ele.nclientid.toString() == data.clientdetails[i].clientid
                  );
                  if (clientItem) mappedClients.push(clientItem);
                }
                if (this.modalFor == "details") {
                  this.clientItems = mappedClients;
                  this.loadGridView();
                } else {
                  this.clientSelected = mappedClients;
                }
              } else {
                this.clsUtility.LogError(
                  "Error while getting group client mapping data"
                );
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  saveGroupClientMappings() {
    try {
      let inputBody = new GroupClientMapping();
      inputBody.client = new Array<GroupClients>();
      this.clientSelected.forEach((item) => {
        let clientobj: GroupClients = new GroupClients();
        clientobj.clientid = item.nclientid.toString();
        clientobj.clientname = item.sclientname;
        inputBody.client.push(clientobj);
      });
      inputBody.createdby = this.dataService.loginUserName;
      inputBody.createdon = this.clsUtility.currentDateTime();
      inputBody.groupstatus = true;
      if (this.modalFor == "add") {
        inputBody.groupclientmappingid = "0"; //when adding group client mapping
        var selectedGroupItem = this.groups.find(
          (ele) => ele.groupid == this.fbcGroup.value
        );
        inputBody.groupid = this.fbcGroup.value.toString();
        if (selectedGroupItem)
          inputBody.groupname = selectedGroupItem.groupname;
        var selectedGroupTypeItem = this.grouptypes.find(
          (ele) => ele.mappingtypeid == this.fbcMappingType.value
        );
        inputBody.mappingtypeid = this.fbcMappingType.value;
        inputBody.mappingtypename = selectedGroupTypeItem.mappingtypename;
      } else if (this.modalFor == "edit") {
        inputBody.groupclientmappingid = "1"; //when editing group client mapping
        inputBody.groupid = this.editGroupId;
        inputBody.groupname = this.groupName;
        inputBody.mappingtypeid = this.mappingTypeId;
        inputBody.mappingtypename = this.mappingTypeName;
      }
      this.loader = true;
      this.subscription.add(
        this.configService.saveGroupClientMappings(inputBody).subscribe(
          (data) => {
            if (data == 1) {
              this.writeLog(
                (this.modalFor == "add"
                  ? selectedGroupItem.groupname
                  : this.groupName) +
                  " group client mapping saved successfully.",
                "ADD"
              );
              this.clsUtility.showSuccess(
                "Group client mapping saved successfully"
              );
              this.resetForm();
              $("#addEditGroupClientMappingModal").modal("hide");
              this.OnSaveGroupClientMapping.next(true);
            } else if (data == 2) {
              this.writeLog("Group is getting duplicate.", "UPDATE");
              this.clsUtility.showWarning("Group is getting duplicate");
            } else if (data == 3) {
              this.writeLog(
                "Practice mapping is already exists for selected client.",
                "UPDATE"
              );
              this.clsUtility.showWarning(
                "Practice mapping is already exists for selected client"
              );
            } else if (data == 0) {
              this.writeLog(
                "Error while saving " + this.modalFor == "add"
                  ? selectedGroupItem.groupname
                  : this.groupName + " group client mapping.",
                "UPDATE"
              );
              this.clsUtility.LogError(
                "Error while saving group client mapping"
              );
            }
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSaveClick() {
    try {
      this.submitted = true;
      if (this.clientSelected.length > 0) {
        if (this.modalFor == "add" && this.addEditMappingForm.valid) {
          //when add check dropdown valid
          this.saveGroupClientMappings();
        } else if (this.modalFor == "edit") {
          //when update only check clientselected
          this.saveGroupClientMappings();
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  resetForm() {
    try {
      this.submitted = false;
      this.addEditMappingForm.reset();
      this.clientSelected = [];
      this.sort = [{ field: "sclientname", dir: "asc" }];
      this.filter = {
        logic: "and",
        filters: [],
      };
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseClick() {
    try {
      this.resetForm();
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
  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor-Biotech";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: "AddEditGroupClientMapping",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
  gridFilter(evt: CompositeFilterDescriptor) {
    try {
      this.filter = evt;
      this.filter.filters.forEach(
        (element) => (element["value"] = element["value"].trim())
      );
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
