import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Clientusermapping } from "src/app/Model/AR Management/Configuration/clientusermapping";
import {
  Filter,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { Utility } from "src/app/Model/utility";
import { GCPUser } from "src/app/Model/Common/login";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-addclientusermapping",
  templateUrl: "./addclientusermapping.component.html",
  styleUrls: ["./addclientusermapping.component.css"],
})
export class AddclientusermappingComponent implements OnInit, OnChanges {
  private Clientid: number = 0;
  public selectedClientValue: number;
  public Clientdetail: any = [];

  private Agentid: number = 0;
  public selectedAgentValue: number;
  public Agentdetail: any = [];

  public newClientUserMapping = true;
  private ClientUserMappingdetail: any = [];
  public ClientUserMappingEditid: any;
  public selectedClientUserMappingValue: string;
  private clsClientUserMapping: Clientusermapping;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Loading
  loadingClientUserMapping = true;

  // Received Input from parent component
  @Input() InputClientUserMappingEditid: any;

  // Send Output to parent component
  @Output() OutputClientUserMappingEditResult = new EventEmitter<boolean>();

  OutputclientusermappingEditResult(data: any) {
    let outClientUserMappingEditResult = data;
    this.OutputClientUserMappingEditResult.emit(outClientUserMappingEditResult);
  }

  ClientUserMappingGroup = this.fb.group({
    fcClient: ["", Validators.required],
    fcAgent: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private filterService: FilterService,
    private toastr: ToastrService,
    private authService: CoreauthService,
    private datatransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  get ClientName() {
    return this.ClientUserMappingGroup.get("fcClient");
  }

  get AgentName() {
    return this.ClientUserMappingGroup.get("fcAgent");
  }

  ngOnInit() {
    try {
      this.clsClientUserMapping = new Clientusermapping();
      this.loadingClientUserMapping = true;
      this.getClientConfigurationById(this.Clientid);
      this.formValueChanged();

      if (
        this.InputClientUserMappingEditid != null &&
        this.InputClientUserMappingEditid != 0
      ) {
        this.newClientUserMapping = false;
        this.ClientUserMappingEditid = this.InputClientUserMappingEditid;
        this.getClientUserMappingById(this.ClientUserMappingEditid);
      } else {
        this.newClientUserMapping = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.clsClientUserMapping = new Clientusermapping();
      this.loadingClientUserMapping = true;
      this.getClientConfigurationById(this.Clientid);
      if (
        this.InputClientUserMappingEditid != null &&
        this.InputClientUserMappingEditid != 0
      ) {
        this.newClientUserMapping = false;
        this.ClientUserMappingEditid = this.InputClientUserMappingEditid;
        this.getClientUserMappingById(this.ClientUserMappingEditid);
      } else {
        this.newClientUserMapping = true;
      }
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientUserMappingById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientUserMappingById(id).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.ClientUserMappingdetail = data;
              this.FillClientUserMappingGroup();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getClientConfigurationById(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe((data) => {
            if (data != null || data != undefined) {
              AllFilterJSON = data;
              this.Clientdetail = AllFilterJSON.client;
              this.Clientdetail.length > 0
                ? this.getAgentById(this.Agentid)
                : (this.loadingClientUserMapping = false); //saurabh shelar
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAgentById(id: number) {
    try {
      this.subscription.add(
        this.authService.getAllLocalGCPUserByRoleid(14).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Agentdetail = data;
            this.loadingClientUserMapping = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  /////////////////////////////////////////
  selectedclient: any;
  formValueChanged(): any {
    try {
      if (this.Clientdetail != null) {
        this.subscription.add(
          this.ClientName.valueChanges.subscribe((data: any) => {
            if (data !== null && data > 0) {
              console.log("in ddl client" + this.Clientdetail); //saurabh shelar

              this.getClientConfigurationById(data);
              this.selectedclient = this.Clientdetail.find(
                (x) => x.nclientid === data
              );
              console.log("New Log ->", this.selectedclient);
            }
          })
        );
      } //if condition
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ////////////////////////////////////////
  validateClientUserMapping() {
    try {
      if (
        this.Clientdetail.length != 0 &&
        this.ClientName.valid &&
        this.AgentName.valid &&
        this.ClientName.value != 0 &&
        this.AgentName.value != 0 &&
        this.ClientName.value != null &&
        this.AgentName.value != null &&
        this.ClientName.value != undefined &&
        this.AgentName.value != undefined
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postClientUserMapping() {
    try {
      const jsonclient = JSON.stringify(this.clsClientUserMapping);
      this.subscription.add(
        this.ConfigurationService.saveClientUserMapping(jsonclient).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "ClientUserMapping added successfully"
                );
                this.OutputclientusermappingEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("ClientUserMapping not added");
                this.OutputclientusermappingEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Client User Mapping already registered"
                );
              }
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateClientUserMapping() {
    try {
      const jsonclient = JSON.stringify(this.clsClientUserMapping);
      this.subscription.add(
        this.ConfigurationService.updateClientUserMapping(
          this.ClientUserMappingEditid,
          jsonclient
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess(
                "ClientUserMapping updated successfully"
              );
              this.OutputclientusermappingEditResult(true);
            } else if (data == 0) {
              this.clsUtility.showError("ClientUserMapping not added");
              this.OutputclientusermappingEditResult(false);
            } else {
              this.clsUtility.showInfo(
                "Client User Mapping already registered"
              );
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveClientUserMapping() {
    try {
      this.submitted = true;
      if (this.validateClientUserMapping()) {
        let SelectedUserid = 0;
        let currentDateTime = this.clsUtility.currentDateTime();
        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;
        // let agentname;
        // const indexagent = this.Agentdetail.findIndex(x => x.npayerid == this.AgentName.value);
        // if (indexagent >= 0) {
        //   agentname = this.Agentdetail[indexagent]['spayername'];
        // }
        if (this.newClientUserMapping) {
          this.clsClientUserMapping.nmappingid = 0;
          this.clsClientUserMapping.nclientid = this.ClientName.value;
          this.clsClientUserMapping.nuserid = this.AgentName.value;
          this.clsClientUserMapping.status = true;
          this.clsClientUserMapping.createdby = SelectedUserid;
          this.clsClientUserMapping.createdon = currentDateTime;
          this.clsClientUserMapping.modifiedon = currentDateTime;
          this.postClientUserMapping();
        } else if (
          this.ClientUserMappingdetail.nclientid != this.ClientName.value ||
          this.ClientUserMappingdetail.nuserid != this.AgentName.value
        ) {
          this.clsClientUserMapping.nmappingid = this.InputClientUserMappingEditid;
          this.clsClientUserMapping.nclientid = this.ClientName.value;
          this.clsClientUserMapping.nuserid = this.AgentName.value;
          this.clsClientUserMapping.status = this.ClientUserMappingdetail.status;
          this.clsClientUserMapping.createdby = SelectedUserid;
          this.clsClientUserMapping.modifiedon = currentDateTime;
          this.updateClientUserMapping();
        } else {
          this.OutputclientusermappingEditResult(false);
          $("#addClientUserMappingModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillClientUserMappingGroup() {
    try {
      let ClientUserMapping: Clientusermapping;
      ClientUserMapping = this.ClientUserMappingdetail;
      this.ClientName.setValue(ClientUserMapping.nclientid);
      this.AgentName.setValue(ClientUserMapping.nuserid);
      if (this.selectedclient == undefined) {
        this.ClientName.setValue(null);
      }

      // this.selectedClientValue = ClientUserMapping.nclientid;   //selected client value is ngmodel entity
      // this.selectedAgentValue = ClientUserMapping.nuserid;
      // // this.AgentName.setValue(ClientUserMapping.nuserid.toString);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputclientusermappingEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.ClientUserMappingGroup.reset();
      this.submitted = false;
      this.InputClientUserMappingEditid = null;
      this.clsClientUserMapping = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
