import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import {
  Client,
  ClientSaveUpdateModel,
  ClientServiceModel,
} from "src/app/Model/AR Management/Configuration/client";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "../../../../../../../../node_modules/subsink";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-addclient",
  templateUrl: "./addclient.component.html",
  styleUrls: ["./addclient.component.css"],
})
export class AddclientComponent implements OnInit, OnChanges {
  public qliveDate: Date = new Date(2000, 2, 10);
  public arstartDate: Date = new Date(2000, 2, 10);
  public newClientConfiguration = true;
  public ClientEditid: any;
  private Clientdetail: any = [];
  private clsClient: Client;
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;
  // Loading
  loadingClient = true;

  // Received Input from parent component
  @Input() InputClientEditid: any;

  // Send Output to parent component
  @Output() OutputClientEditResult = new EventEmitter<boolean>();
  interfaceGridView: GridDataResult;
  clientServiceData: any[] = [];
  loadingGrid: boolean = false;

  OutputClientConfigurationEditResult(data: any) {
    let outClientEditResult = data;
    this.OutputClientEditResult.emit(outClientEditResult);
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
  }
  // Send Output to parent component
  @Output() outClient = new EventEmitter<string>();

  OutputClient(data: any) {
    try {
      let outclient = data;
      this.outClient.emit(outclient);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  AddClientGroup = this.fb.group({
    fcQlivedate: [new Date()],
    fcStartdate: [new Date()],
    fcClientCode: ["", Validators.required],
    fcClientName: ["", [Validators.required, Validators.maxLength(100)]],
    fcClientAddress: ["", [Validators.required, Validators.maxLength(100)]],
    fcAUSID: ["", [Validators.required, Validators.maxLength(10)]],
    fcDatabaseName: ["", [Validators.required, Validators.maxLength(50)]],
    fcTIN: [""],
    fcNPI: [""],
  });

  get StartDate() {
    return this.AddClientGroup.get("fcQlivedate");
  }

  get EndDate() {
    return this.AddClientGroup.get("fcStartdate");
  }

  get clientCode() {
    return this.AddClientGroup.get("fcClientCode");
  }

  get clientName() {
    return this.AddClientGroup.get("fcClientName");
  }

  get clientAddress() {
    return this.AddClientGroup.get("fcClientAddress");
  }

  get AUSID() {
    return this.AddClientGroup.get("fcAUSID");
  }

  get DatabaseName() {
    return this.AddClientGroup.get("fcDatabaseName");
  }

  get TIN() {
    return this.AddClientGroup.get("fcTIN");
  }

  get NPI() {
    return this.AddClientGroup.get("fcNPI");
  }

  ngOnInit() {
    try {
      this.clsClient = new Client();
      if (this.InputClientEditid != null && this.InputClientEditid != 0) {
        this.newClientConfiguration = false;
        this.ClientEditid = this.InputClientEditid;
        this.getClientConfigurationById(this.ClientEditid);
      } else {
        this.newClientConfiguration = true;
        this.qliveDate = new Date();
        this.arstartDate = new Date();
        this.loadingClient = true;
        this.FetchClientID();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getClientServiceMaster() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientServiceMaster().subscribe(
          (data) => {
            if (data) {
              this.clientServiceData = data;
              this.clientServiceData.forEach((item) => {
                item.clientservicestatus = false;
              });
            } else {
              this.clientServiceData = [];
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
  ngOnChanges() {
    try {
      this.clsClient = new Client();
      this.loadingClient = true;
      if (this.InputClientEditid != null && this.InputClientEditid != 0) {
        this.newClientConfiguration = false;
        this.ClientEditid = this.InputClientEditid;
        this.getClientConfigurationById(this.ClientEditid);
      } else {
        this.newClientConfiguration = true;
        this.qliveDate = new Date();
        this.arstartDate = new Date();
        this.getClientServiceMaster();
        this.FetchClientID();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  async getClientConfigurationById(id: number) {
    try {
      // this.subscription.add(
      //   this.ConfigurationService.getClientConfigurationById(id).subscribe(
      //     data => {
      //       if (data != null || data != undefined) {
      //         this.Clientdetail = data;
      //         if (
      //           this.InputClientEditid != null &&
      //           this.InputClientEditid != 0
      //         ) {
      //           this.FillClientConfigurationGroup();
      //         }
      //       }
      //     }
      //   )
      // );
      await this.ConfigurationService.getClientServiceMaster()
        .toPromise()
        .then(
          (data) => {
            if (data) {
              this.clientServiceData = data;
              this.clientServiceData.forEach((item) => {
                item.clientservicestatus = false;
              });
            } else {
              this.clientServiceData = [];
            }
          },
          (error) => {
            this.clsUtility.LogError(error);
            this.loadingClient = false;
          }
        );
      this.subscription.add(
        this.ConfigurationService.getClientDetailsById(id).subscribe((data) => {
          if (data != null || data != undefined) {
            this.Clientdetail = data.client;
            if (this.InputClientEditid != null && this.InputClientEditid != 0) {
              this.FillClientConfigurationGroup();
            }
            if (data.clientServices) {
              // data.clientServices.forEach(item => {
              //   this.clientServiceData.forEach(ele => {
              //     if (item.serviceid === ele.serviceid) {
              //       ele.clientserviceid = item.clientserviceid;
              //       ele.clientid = item.clientid;
              //       ele.clientservicestatus = item.clientservicestatus;
              //       ele.createdon = item.createdon;
              //     }
              //   });
              // });

              for (let i = 0; i < this.clientServiceData.length; i++) {
                for (let j = 0; j < data.clientServices.length; j++) {
                  if (
                    this.clientServiceData[i].serviceid ===
                    data.clientServices[j].serviceid
                  ) {
                    this.clientServiceData[i].clientserviceid =
                      data.clientServices[j].clientserviceid;
                    this.clientServiceData[i].clientid =
                      data.clientServices[j].clientid;
                    this.clientServiceData[i].clientservicestatus =
                      data.clientServices[j].clientservicestatus;
                    this.clientServiceData[i].createdon =
                      data.clientServices[j].createdon;
                    break;
                  } else {
                    this.clientServiceData[i].clientserviceid = "";
                    this.clientServiceData[i].clientid = this.InputClientEditid;
                    this.clientServiceData[i].clientservicestatus = false;
                    this.clientServiceData[
                      i
                    ].createdon = this.clsUtility.currentDateTime();
                  }
                }
              }
              this.loadingClient = false;
              // for (let i = 0; i < this.clientServiceData.length; i++) {
              //   if (
              //     this.clientServiceData[j].clientservicestatus == undefined ||
              //     this.clientServiceData[j].clientservicestatus == null
              //   ) {
              //     this.clientServiceData[j].clientid = this.ClientEditid;
              //   }
              // }
            }
          }
        })
      );
    } catch (error) {
      this.loadingClient = false;
      this.clsUtility.LogError(error);
    }
  }

  FetchClientID() {
    try {
      this.subscription.add(
        this.ConfigurationService.getClientID().subscribe((data) => {
          if (data != null || data != undefined) {
            this.SetClientID(data);
            this.loadingClient = false;
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  SetClientID(data: number): any {
    try {
      if (data == null) {
        this.clientCode.setValue("THC" + 1);
      } else {
        this.clientCode.setValue("THC" + data);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onDateChange(value: Date) {
    try {
      if (value == null) {
        this.clsUtility.showInfo("Select valid date");
        // alert("Select valid date");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  validateClientServices(): boolean {
    try {
      let isValid = false;
      for (let i = 0; i < this.clientServiceData.length; i++) {
        if (this.clientServiceData[i].clientservicestatus == true) {
          isValid = true;
          break;
        }
      }
      return isValid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateClient() {
    try {
      if (
        this.datePipe.transform(this.qliveDate, "yyyyMMdd") != null &&
        this.datePipe.transform(this.arstartDate, "yyyyMMdd") != null &&
        this.clientName.valid &&
        this.clientAddress.valid &&
        this.AUSID.valid &&
        this.DatabaseName.valid &&
        !this.clsUtility.CheckEmptyString(this.clientName.value) &&
        !this.clsUtility.CheckEmptyString(this.clientAddress.value) &&
        !this.clsUtility.CheckEmptyString(this.AUSID.value) &&
        !this.clsUtility.CheckEmptyString(this.DatabaseName.value) &&
        this.validateClientServices()
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postClientConfigurations() {
    try {
      // const jsonclient = JSON.stringify(this.clsClient);
      // this.subscription.add(
      //   this.ConfigurationService.saveClientConfiguration(jsonclient).subscribe(
      //     (data: {}) => {
      //       if (data != null || data != undefined) {
      //         if (data == 1) {
      //           // alert("Client added successfully");
      //           this.clsUtility.showSuccess("Client added successfully");
      //           this.OutputClientConfigurationEditResult(true);
      //         } else if (data == 0) {
      //           this.clsUtility.showError("Client not added");
      //           // alert("Client not added");
      //           this.OutputClientConfigurationEditResult(false);
      //         } else {
      //           this.clsUtility.showInfo(
      //             "Client already registered with this database"
      //           );
      //         }
      //       }
      //     }
      //   )
      // );
      let clientObj = new ClientSaveUpdateModel();
      clientObj.client = this.clsClient;

      let clientServicesArray: ClientServiceModel[] = [];
      var isIncludeEntr: boolean = false;
      this.clientServiceData.forEach((ele) => {
        let clientServiceObj = new ClientServiceModel();
        clientServiceObj.serviceid = ele.serviceid;
        clientServiceObj.clientservicestatus = ele.clientservicestatus;
        clientServiceObj.servicecode = ele.servicecode;
        if (
          clientServiceObj.servicecode.toUpperCase() == "ENTR" &&
          clientServiceObj.clientservicestatus
        ) {
          isIncludeEntr = true;
        }
        clientServiceObj.servicename = ele.servicename;
        clientServiceObj.userid = this.datatransfer.SelectedGCPUserid.toString();
        clientServiceObj.username = this.datatransfer.loginUserName;
        clientServicesArray.push(clientServiceObj);
      });
      clientObj.clientServices = clientServicesArray;
      // clientObj.clientServices = this.clsClient;

      this.subscription.add(
        this.ConfigurationService.saveClientDetails(clientObj).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                // alert("Client added successfully");
                this.clsUtility.showSuccess("Client added successfully");
                if (isIncludeEntr) {
                  $("#confirmationModal").modal("show");
                }
                this.writeLog(
                  "Client:" +
                    clientObj.client.sclientname +
                    " added successfully",
                  "ADD"
                );
                this.OutputClientConfigurationEditResult(true);
              } else if (data == 0) {
                this.clsUtility.showError("Client not added");
                // alert("Client not added");
                this.writeLog(
                  "Error while adding Client: " + clientObj.client.sclientname,
                  "ERROR"
                );
                this.OutputClientConfigurationEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Client already registered with this database"
                );
                this.writeLog(
                  "User is trying to add Client: " +
                    clientObj.client.sclientname +
                    " which is already registered with " +
                    clientObj.client.sdatabasename +
                    " database",
                  "ADD"
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

  updateClientConfigurations() {
    try {
      // const jsonclient = JSON.stringify(this.clsClient);
      // this.subscription.add(
      //   this.ConfigurationService.updateClientConfiguration(
      //     this.ClientEditid,
      //     jsonclient
      //   ).subscribe((data: {}) => {
      //     if (data != null || data != undefined) {
      //       if (data == 1) {
      //         // alert("Client updated successfully");
      //         this.clsUtility.showSuccess("Client updated successfully");
      //         this.OutputClientConfigurationEditResult(true);
      //       } else if (data == 0) {
      //         // alert("Client not updated");
      //         this.clsUtility.showError("Client not updated");
      //         this.OutputClientConfigurationEditResult(false);
      //       } else {
      //         this.clsUtility.showInfo(
      //           "Client already registered with this database"
      //         );
      //       }
      //     }
      //   })
      // );
      let clientObj = new ClientSaveUpdateModel();
      clientObj.client = this.clsClient;

      let clientServicesArray: ClientServiceModel[] = [];
      this.clientServiceData.forEach((ele) => {
        let clientServiceObj = new ClientServiceModel();
        clientServiceObj.serviceid = ele.serviceid;
        clientServiceObj.clientservicestatus = ele.clientservicestatus;
        clientServiceObj.servicecode = ele.servicecode;
        clientServiceObj.servicename = ele.servicename;
        clientServiceObj.userid = this.datatransfer.SelectedGCPUserid.toString();
        clientServiceObj.username = this.datatransfer.loginUserName;
        clientServiceObj.clientserviceid = ele.clientserviceid;
        clientServiceObj.clientid = this.ClientEditid;
        clientServiceObj.createdon = ele.createdon;
        clientServiceObj.modifiedon = this.clsUtility.currentDateTime();
        clientServicesArray.push(clientServiceObj);
      });
      clientObj.clientServices = clientServicesArray;
      this.subscription.add(
        this.ConfigurationService.updateClientDetails(clientObj).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == 1) {
                // alert("Client updated successfully");
                this.clsUtility.showSuccess("Client updated successfully");
                this.writeLog(
                  "Client:" +
                    clientObj.client.sclientname +
                    " updated successfully",
                  "UPDATE"
                );
                this.OutputClientConfigurationEditResult(true);
              } else if (data == 0) {
                // alert("Client not updated");
                this.clsUtility.showError("Client not updated");
                this.writeLog(
                  "Error while adding Client:" + clientObj.client.sclientname,
                  "ERROR"
                );
                this.OutputClientConfigurationEditResult(false);
              } else {
                this.clsUtility.showInfo(
                  "Client already registered with this database"
                );
                this.writeLog(
                  "User is trying to update Client: " +
                    clientObj.client.sclientname +
                    " which is already registered with " +
                    clientObj.client.sdatabasename +
                    " database",
                  "UPDATE"
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

  saveClient() {
    try {
      this.submitted = true;
      if (this.validateClient()) {
        let currentDateTime = this.clsUtility.currentDateTime();
        var strclientname: string = this.clientName.value;
        var straddress: string = this.clientAddress.value;
        var strDatabaseName: string = this.DatabaseName.value;
        var strAUSID: string = this.AUSID.value;
        var strTIN: string = this.TIN.value;
        var strNPI: string = this.NPI.value;
        if (strTIN == null) strTIN = "";
        if (strNPI == null) strNPI = "";

        if (this.newClientConfiguration) {
          this.clsClient.nclientid = 0;
          this.clsClient.clientcode = this.clientCode.value;
          this.clsClient.qlivedt = this.datePipe.transform(
            this.qliveDate,
            "yyyy-MM-dd"
          );
          this.clsClient.arstartdt = this.datePipe.transform(
            this.arstartDate,
            "yyyy-MM-dd"
          );
          this.clsClient.sclientname = strclientname.trim();
          this.clsClient.address = straddress.trim();
          this.clsClient.sdatabasename = strDatabaseName.trim();
          this.clsClient.sausid = strAUSID.trim();
          this.clsClient.stin = strTIN.trim();
          this.clsClient.snpi = strNPI.trim();
          this.clsClient.nstatus = 1;
          this.clsClient.dtstatusdate = this.datePipe.transform(
            new Date(),
            "yyyy-MM-dd"
          );
          this.clsClient.createdon = currentDateTime;
          this.clsClient.modifiedon = currentDateTime;
          // this.clsClient.clientservice = clientservice;
          this.postClientConfigurations();
        }
        // if (
        // this.Clientdetail.qlivedt !=
        //   this.datePipe.transform(this.qliveDate, "yyyy-MM-dd") ||
        // this.Clientdetail.arstartdt !=
        //   this.datePipe.transform(this.arstartDate, "yyyy-MM-dd") ||
        // this.Clientdetail.sclientname != strclientname.trim() ||
        // this.Clientdetail.address != straddress.trim() ||
        // this.Clientdetail.sdatabasename != strDatabaseName.trim() ||
        // this.Clientdetail.sausid != strAUSID.trim() ||
        // this.Clientdetail.stin != strTIN.trim() ||
        // this.Clientdetail.snpi != strNPI.trim()
        // ||
        // this.Clientdetail.clientservice != clientservice
        else {
          this.clsClient.nclientid = this.ClientEditid;
          this.clsClient.clientcode = this.clientCode.value;
          this.clsClient.qlivedt = this.datePipe.transform(
            this.qliveDate,
            "yyyy-MM-dd"
          );
          this.clsClient.arstartdt = this.datePipe.transform(
            this.arstartDate,
            "yyyy-MM-dd"
          );
          this.clsClient.sclientname = strclientname.trim();
          this.clsClient.address = straddress.trim();
          this.clsClient.sdatabasename = strDatabaseName.trim();
          this.clsClient.sausid = strAUSID.trim();
          this.clsClient.stin = strTIN.trim();
          this.clsClient.snpi = strNPI.trim();
          this.clsClient.nstatus = this.Clientdetail.nstatus;
          this.clsClient.dtstatusdate = this.datePipe.transform(
            new Date(),
            "yyyy-MM-dd"
          );
          // this.clsClient.createdon = currentDateTime;
          this.clsClient.modifiedon = currentDateTime;
          // this.clsClient.clientservice = clientservice;
          this.updateClientConfigurations();
        }
        // else {
        //   this.OutputClientConfigurationEditResult(false);
        //   $("#addclientModal").modal("hide");
        // }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillClientConfigurationGroup() {
    try {
      let ClientConfiguration: Client;
      ClientConfiguration = this.Clientdetail;

      this.clientCode.setValue(ClientConfiguration.clientcode);
      this.qliveDate = new Date(
        this.datePipe.transform(ClientConfiguration.qlivedt, "yyyy-MM-dd")
      );
      this.arstartDate = new Date(
        this.datePipe.transform(ClientConfiguration.arstartdt, "yyyy-MM-dd")
      );
      // this.qliveDate.setValue(this.datePipe.transform(ClientConfiguration.qlivedt, 'yyyy-MM-dd'));
      // this.arstartDate.setValue(this.datePipe.transform(ClientConfiguration.arstartdt, 'yyyy-MM-dd'));
      this.clientName.setValue(ClientConfiguration.sclientname);
      this.clientAddress.setValue(ClientConfiguration.address);
      this.AUSID.setValue(ClientConfiguration.sausid);
      this.DatabaseName.setValue(ClientConfiguration.sdatabasename);
      this.TIN.setValue(ClientConfiguration.stin);
      this.NPI.setValue(ClientConfiguration.snpi);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputClientConfigurationEditResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.AddClientGroup.reset();
      this.submitted = false;
      this.InputClientEditid = null;
      this.clsClient = null;
      this.clientServiceData = [];
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onInterfaceClose() {
    try {
      $("#InterfaceModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onInterfaceOk() {
    try {
      $("#InterfaceModal").modal("hide");
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
  switchChange(event: boolean, dataItem: any) {
    // console.log(dataItem);
    try {
      if (
        event == false &&
        !this.newClientConfiguration &&
        dataItem.servicecode == "ENTR"
      ) {
        this.loadingGrid = true;
        this.subscription.add(
          this.ConfigurationService.checkIsInterfaceActive(
            this.ClientEditid,
            dataItem.servicecode
          ).subscribe(
            (interfaceRes) => {
              this.ConfigurationService.checkIsClientMappedToGroup(
                this.ClientEditid
              ).subscribe(
                (clientMappingRes) => {
                  if (interfaceRes == true && clientMappingRes == true) {
                    this.clsUtility.showInfo(
                      "Please deactivate interface and remove group client mapping to deactivate ENTR service"
                    );
                    dataItem.clientservicestatus = true;
                  } else if (
                    interfaceRes == true &&
                    clientMappingRes == false
                  ) {
                    this.clsUtility.showInfo(
                      "Please deactivate interface to deactivate ENTR service"
                    );
                    dataItem.clientservicestatus = true;
                  } else if (
                    interfaceRes == false &&
                    clientMappingRes == true
                  ) {
                    this.clsUtility.showInfo(
                      "Please remove group client mapping to deactivate ENTR service"
                    );
                    dataItem.clientservicestatus = true;
                  }
                  this.loadingGrid = false;
                },
                (error) => {
                  this.loadingGrid = false;
                  this.clsUtility.LogError(error);
                }
              );
            },
            (error) => {
              this.loadingGrid = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      }
    } catch (error) {
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    this.auditLog.writeLog(
      msg,
      useraction,
      "AddEditClient",
      "Qonductor-Configuration"
    );
  }
}
