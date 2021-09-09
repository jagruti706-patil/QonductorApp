import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Qsuiteusermapping } from "src/app/Model/AR Management/Configuration/qsuiteusermapping";
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
  selector: "app-addqsuiteusermapping",
  templateUrl: "./addqsuiteusermapping.component.html",
  styleUrls: ["./addqsuiteusermapping.component.css"],
})
export class AddqsuiteusermappingComponent implements OnInit, OnChanges {
  private Clientid: number = 0;
  public selectedClientValue: number;
  public Clientdetail: any = [];

  private Agentid: number = 0;
  public selectedAgentValue: number;
  public Agentdetail: any = [];

  public newQsuiteUserMapping = true;
  private QsuiteUserMappingdetail: any = [];
  public QsuiteUserMappingEditid: any;
  public selectedQsuiteUserMappingValue: string;
  private clsQsuiteUserMapping: Qsuiteusermapping;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  // Loading
  loadingQsuiteUserMapping = true;

  // Received Input from parent component
  @Input() InputQsuiteUserMappingEditid: any;

  // Send Output to parent component
  @Output() OutputQsuiteUserMappingEditResult = new EventEmitter<boolean>();

  OutputqsuiteusermappingEditResult(data: any) {
    let outQsuiteUserMappingEditResult = data;
    this.OutputQsuiteUserMappingEditResult.emit(outQsuiteUserMappingEditResult);
  }

  QsuiteUserMappingGroup = this.fb.group({
    fcClient: ["", Validators.required],
    fcAgent: ["", Validators.required],
    fcAUSID: [""],
    fcDatabaseName: [""],
    fcQsuiteUserName: ["", [Validators.required, Validators.maxLength(50)]],
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
    return this.QsuiteUserMappingGroup.get("fcClient");
  }

  get AgentName() {
    return this.QsuiteUserMappingGroup.get("fcAgent");
  }

  get AUSID() {
    return this.QsuiteUserMappingGroup.get("fcAUSID");
  }

  get DatabaseName() {
    return this.QsuiteUserMappingGroup.get("fcDatabaseName");
  }

  get QsuiteUserName() {
    return this.QsuiteUserMappingGroup.get("fcQsuiteUserName");
  }

  ngOnInit() {
    try {
      this.formValueChanged();
      this.clsQsuiteUserMapping = new Qsuiteusermapping();
      this.loadingQsuiteUserMapping = true;
      this.getQsuiteConfigurationById(this.Clientid);

      if (
        this.InputQsuiteUserMappingEditid != null &&
        this.InputQsuiteUserMappingEditid != 0
      ) {
        this.newQsuiteUserMapping = false;
        this.QsuiteUserMappingEditid = this.InputQsuiteUserMappingEditid;
        this.getQsuiteUserMappingById(this.QsuiteUserMappingEditid);
      } else {
        this.newQsuiteUserMapping = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      this.formValueChanged();
      this.clsQsuiteUserMapping = new Qsuiteusermapping();
      this.loadingQsuiteUserMapping = true;
      this.getQsuiteConfigurationById(this.Clientid);
      if (
        this.InputQsuiteUserMappingEditid != null &&
        this.InputQsuiteUserMappingEditid != 0
      ) {
        this.newQsuiteUserMapping = false;
        this.QsuiteUserMappingEditid = this.InputQsuiteUserMappingEditid;
        this.getQsuiteUserMappingById(this.QsuiteUserMappingEditid);
      } else {
        this.newQsuiteUserMapping = true;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.ClientName.valueChanges.subscribe((data: number) => {
          if (data != null && data != undefined && data != 0) {
            const SelectedClient = this.Clientdetail.find(
              (x) => x.nclientid === data
            );
            this.AUSID.setValue(SelectedClient.sausid);
            this.DatabaseName.setValue(SelectedClient.sdatabasename);
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getQsuiteUserMappingById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getQsuiteUserMappingById(id).subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.QsuiteUserMappingdetail = data;
              this.FillQsuiteUserMappingGroup();
            }
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getQsuiteConfigurationById(id: number) {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientConfigurationById(
          this.Clientid
        ).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Clientdetail = data;
            this.getAgentById(this.Agentid);
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
        this.authService.getAllLocalGCPUser().subscribe((data) => {
          if (data != null || data != undefined) {
            this.Agentdetail = data;
            this.loadingQsuiteUserMapping = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateQsuiteUserMapping() {
    try {
      if (
        this.ClientName.valid &&
        this.AgentName.valid &&
        this.ClientName.value != 0 &&
        this.AgentName.value != 0 &&
        this.ClientName.value != null &&
        this.AgentName.value != null &&
        this.ClientName.value != undefined &&
        this.AgentName.value != undefined &&
        this.QsuiteUserName.valid &&
        !this.clsUtility.CheckEmptyString(this.QsuiteUserName.value)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postQsuiteUserMapping() {
    try {
      const jsonqsuite = JSON.stringify(this.clsQsuiteUserMapping);
      this.subscription.add(
        this.ConfigurationService.saveQsuiteUserMapping(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Qsuite User Mapping added successfully"
                );
                this.OutputqsuiteusermappingEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Qsuite User Mapping not added");
                this.OutputqsuiteusermappingEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Qsuite User Mapping already registered"
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

  updateQsuiteUserMapping() {
    try {
      const jsonqsuite = JSON.stringify(this.clsQsuiteUserMapping);
      this.subscription.add(
        this.ConfigurationService.updateQsuiteUserMapping(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Qsuite User Mapping updated successfully"
                );
                this.OutputqsuiteusermappingEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Qsuite User Mapping not added");
                this.OutputqsuiteusermappingEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Qsuite User Mapping already registered"
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

  saveQsuiteUserMapping() {
    try {
      this.submitted = true;
      if (this.validateQsuiteUserMapping()) {
        var strQsuiteUserName: string = this.QsuiteUserName.value;

        let SelectedUserid = 0;
        let currentDateTime = this.clsUtility.currentDateTime();
        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = this.datatransfer.SelectedGCPUserid;
        let agentname;
        const indexagent = this.Agentdetail.findIndex(
          (x) => x.ngcpuserid == this.AgentName.value
        );
        if (indexagent >= 0) {
          agentname = this.Agentdetail[indexagent]["displayname"];
        }
        let clientname;
        const indexclient = this.Clientdetail.findIndex(
          (x) => x.nclientid == this.ClientName.value
        );
        if (indexclient >= 0) {
          clientname = this.Clientdetail[indexclient]["sclientname"];
        }
        if (this.newQsuiteUserMapping) {
          this.clsQsuiteUserMapping.nmappingid = 0;
          this.clsQsuiteUserMapping.nclientid = this.ClientName.value;
          this.clsQsuiteUserMapping.userid = this.AgentName.value;
          // this.clsQsuiteUserMapping.clientname = clientname;
          // this.clsQsuiteUserMapping.gcpusername = agentname;
          this.clsQsuiteUserMapping.sausid = this.AUSID.value;
          this.clsQsuiteUserMapping.sdatabasename = this.DatabaseName.value;
          this.clsQsuiteUserMapping.qsuiteloginname = strQsuiteUserName.trim();
          this.clsQsuiteUserMapping.createdon = currentDateTime;
          this.postQsuiteUserMapping();
        } else if (
          this.QsuiteUserMappingdetail.nclientid != this.ClientName.value ||
          this.QsuiteUserMappingdetail.userid != this.AgentName.value ||
          this.QsuiteUserMappingdetail.qsuiteloginname !=
            strQsuiteUserName.trim()
        ) {
          this.clsQsuiteUserMapping.nmappingid = this.InputQsuiteUserMappingEditid;
          this.clsQsuiteUserMapping.nclientid = this.ClientName.value;
          this.clsQsuiteUserMapping.userid = this.AgentName.value;
          this.clsQsuiteUserMapping.sausid = this.AUSID.value;
          this.clsQsuiteUserMapping.sdatabasename = this.DatabaseName.value;
          this.clsQsuiteUserMapping.qsuiteloginname = strQsuiteUserName.trim();
          // this.clsQsuiteUserMapping.clientname = clientname;
          // this.clsQsuiteUserMapping.gcpusername = agentname;
          this.updateQsuiteUserMapping();
        } else {
          this.OutputqsuiteusermappingEditResult(false);
          $("#addQsuiteUserMappingModal").modal("hide");
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillQsuiteUserMappingGroup() {
    try {
      let QsuiteUserMapping: Qsuiteusermapping;
      QsuiteUserMapping = this.QsuiteUserMappingdetail;
      this.selectedClientValue = QsuiteUserMapping.nclientid;
      this.selectedAgentValue = QsuiteUserMapping.userid;
      this.QsuiteUserName.setValue(QsuiteUserMapping.qsuiteloginname);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputqsuiteusermappingEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.QsuiteUserMappingGroup.reset();
      this.submitted = false;
      this.InputQsuiteUserMappingEditid = null;
      this.clsQsuiteUserMapping = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
