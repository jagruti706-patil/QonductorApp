import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import {
  Filter,
  OutputFilter,
  OutputEncounterDocCategory,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { InterfaceModel } from "src/app/Model/AR Management/Configuration/interface-model.model";
import { Ftpdetails } from "src/app/Model/AR Management/Configuration/ftpdetails";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-add-edit-interface",
  templateUrl: "./add-edit-interface.component.html",
  styleUrls: ["./add-edit-interface.component.css"],
})
export class AddEditInterfaceComponent implements OnInit {
  private clsUtility: Utility;
  private subscription = new SubSink();
  public submitted = false;
  categorySubmitted = false;
  Clientdetail: any[] = [];
  InterfaceForData: any[] = [
    {
      displayname: "DocsVault",
      value: "DV",
    },
    {
      displayname: "WebChart",
      value: "WC",
    },
    {
      displayname: "E-Clinical",
      value: "EC",
    },
    {
      displayname: "SFTP",
      value: "SFTP",
    },
    // {
    //   displayname: "HL7(SFTP)",
    //   value: "HL7"
    // }
  ];
  @Input() InputClientId: any;
  // public clientid: number = 0;
  clientServices: any[] = [];
  newInterface: boolean = true;
  selectedClient: any;
  interFaceMasterDetails: any;
  @Output() onsaveinterface: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  loader: boolean = false;
  hide: boolean = true;
  categoryGridData: any[] = [];
  categoryOriginalData: any[] = [];
  categoryGridView: GridDataResult;
  categoryMaster: OutputEncounterDocCategory[] = [];
  newCategory: boolean = true;
  editRowIndex: number;
  loadingCategoryGrid: boolean = false;
  disableModal: boolean = false;
  interfaceDataItem: any;
  // interfaceDetails: any[] = [];
  interfaceName: string = "";
  updateStatusDataItem: any;
  AllClientData: any[] = [];
  foldersort: SortDescriptor[] = [
    {
      field: "isactive",
      dir: "desc",
    },
  ];
  sourceprocessfolder: number;

  constructor(
    private fb: FormBuilder,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService,
    private filterService: FilterService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  InterfaceGroup = this.fb.group({
    fcClient: ["", Validators.required],
    // fcClientService: ["", Validators.required],
    fcInterfaceFor: ["", Validators.required],
    fcUrl: ["", Validators.required],
    fcUsername: ["", Validators.required],
    fcPassword: ["", Validators.required],
    fcRootFolder: [""],
    fcPort: [""],
    fcSrcProcessFolder: [null],
    // fcIsSplitFile:[false, Validators.required]
  });
  categoryGroup = this.fb.group({
    fcCategory: ["", Validators.required],
    fcType: ["", Validators.required],
    fcPath: ["", Validators.required],
    fcIsGenerateEntrPerPage: [0, Validators.required],
    fcPagesPerEntr: [null],
  });

  get fbcClient() {
    return this.InterfaceGroup.get("fcClient");
  }
  get fbcInterfaceFor() {
    return this.InterfaceGroup.get("fcInterfaceFor");
  }
  // get fbcClientService() {
  //   return this.InterfaceGroup.get("fcClientService");
  // }
  get fbcUrl() {
    return this.InterfaceGroup.get("fcUrl");
  }
  get fbcUsername() {
    return this.InterfaceGroup.get("fcUsername");
  }
  get fbcPassword() {
    return this.InterfaceGroup.get("fcPassword");
  }
  get fbcRootFolder() {
    return this.InterfaceGroup.get("fcRootFolder");
  }
  get fbcPort() {
    return this.InterfaceGroup.get("fcPort");
  }
  get fbcSrcProcessFolder() {
    return this.InterfaceGroup.get("fcSrcProcessFolder");
  }
  // get fbcIsSplitFile() {
  //   return this.InterfaceGroup.get("fcIsSplitFile");
  // }
  get fbcIsGenerateEntrPerPage() {
    return this.categoryGroup.get("fcIsGenerateEntrPerPage");
  }
  get fbcCategory() {
    return this.categoryGroup.get("fcCategory");
  }
  get fbcType() {
    return this.categoryGroup.get("fcType");
  }
  get fbcPath() {
    return this.categoryGroup.get("fcPath");
  }
  get fbcPagesPerEntr() {
    return this.categoryGroup.get("fcPagesPerEntr");
  }

  ngOnInit() {
    try {
      this.getClients();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddInterface() {
    try {
      this.newInterface = true;
      this.hide = true;
      this.categoryGridData = [];
      this.categoryGridView = null;
      // this.fbcIsSplitFile.setValue(false);
      this.enableValidators();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onEditInterface(interfaceDataItem: any) {
    try {
      this.newInterface = false;
      this.hide = true;
      this.categoryGridData = [];
      this.categoryGridView = null;
      // this.getClientDetails(interfaceDataItem.clientid);
      this.interfaceDataItem = interfaceDataItem;
      this.getInterfaceDetails();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  formValueChanged() {
    try {
      this.fbcInterfaceFor.valueChanges.subscribe((data) => {
        if (data == "SFTP") {
          this.fbcRootFolder.setValidators(Validators.required);
          this.fbcPort.setValidators(Validators.required);
          this.fbcSrcProcessFolder.setValidators(Validators.required);
        } else {
          this.fbcRootFolder.clearValidators();
          this.fbcPort.clearValidators();
          this.fbcSrcProcessFolder.clearValidators();
        }
        this.fbcUrl.setValue("");
        this.fbcUsername.setValue("");
        this.fbcPassword.setValue("");
        this.fbcRootFolder.setValue("");
        this.fbcPort.setValue("");
        this.fbcSrcProcessFolder.setValue(null);
        this.categoryGridData = [];
        this.categoryGridView = null;
      });
      this.fbcIsGenerateEntrPerPage.valueChanges.subscribe((data) => {
        if (data == 1) {
          this.fbcPagesPerEntr.setValue(1);
          this.fbcPagesPerEntr.setValidators(Validators.required);
        } else {
          this.fbcPagesPerEntr.setValue(null);
          this.fbcPagesPerEntr.clearValidators();
        }
        this.fbcPagesPerEntr.updateValueAndValidity();
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getClients() {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      filterinput.defercategory = false;
      filterinput.servicecode = "ENTR";
      filterinput.entrdoccategory = true;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe((data) => {
            if (data != null || data != undefined) {
              AllFilterJSON = data;
              this.Clientdetail = AllFilterJSON.client;
              this.AllClientData = AllFilterJSON.client;
              this.categoryMaster = data.entrdoccategory;
              // this.getPayerById(this.Payerid);
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // getClientDetails(clientid: any) {
  //   try {
  //     this.subscription.add(
  //       this.ConfigurationService.getClientDetailsById(clientid).subscribe(
  //         data => {
  //           if (data) {
  //             this.clientServices = data.clientServices;
  //             if (this.clientServices.length == 0) {
  //               this.clsUtility.showWarning(
  //                 "No client services found.\n Please update client service for selected client."
  //               );
  //             }
  //             this.selectedClient = data.client;
  //           }
  //         },
  //         error => {
  //           this.clsUtility.LogError(error);
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  clientChange(evt: any) {
    try {
      // console.log(evt);
      this.selectedClient = evt;
      // this.getClientDetails(evt.nclientid);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getInterfaceDetails(calledFrom: string = "") {
    try {
      if (!this.newInterface) {
        this.fbcClient.clearValidators();
        // this.fbcClientService.clearValidators();
        this.fbcClient.updateValueAndValidity();
        // this.fbcClientService.updateValueAndValidity();
      }
      // this.subscription.add(
      //   this.ConfigurationService.getInterfaces(
      //     accountId,
      //     interfacecode
      //   ).subscribe(data => {
      //     // console.log(data);
      //     if (data != null || data != undefined) {
      //       this.interFaceDetails = data;
      //       this.fbcClient.setValue(+data.clientid);
      //       // this.fbcClientService.setValue(data.clientservicecode);
      //       this.fillInterfaceForm();
      //     }
      //   })
      // );
      this.subscription.add(
        this.ConfigurationService.getInterfaceDetails(
          this.interfaceDataItem.clientid,
          this.interfaceDataItem.interfacecode,
          this.interfaceDataItem.loginid,
          this.interfaceDataItem.rootfolder
        ).subscribe(
          (data) => {
            if (data && data.length > 0) {
              if (calledFrom == "updatestatus") {
                //added condition to check whether call comes from update status or not.. if from update status then append only grid
                this.categoryGridData = data[0].interfacedetails;
                // this.categoryOriginalData = this.categoryGridData.slice(0);
                this.categoryOriginalData = [];
                this.categoryGridData.forEach((ele) => {
                  const item = Object.assign({}, ele);
                  this.categoryOriginalData.push(item);
                });
                this.FolderLoadItems();
                return;
              }
              this.interFaceMasterDetails = data[0];
              this.sourceprocessfolder = this.interFaceMasterDetails.sourceprocessfolder;
              let selectedItem = this.InterfaceForData.find(
                (ele) => ele.value === this.interFaceMasterDetails.interfacecode
              );
              if (selectedItem) this.interfaceName = selectedItem.displayname;
              this.fbcClient.setValue(+data.clientid);
              this.fillInterfaceForm();
            } else {
              this.clsUtility.showWarning("No information found");
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
  enableValidators() {
    try {
      this.fbcClient.setValidators(Validators.required);
      // this.fbcClientService.setValidators(Validators.required);
      this.fbcClient.updateValueAndValidity();
      // this.fbcClientService.updateValueAndValidity();
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
  folderSortChange(sort: SortDescriptor[]): void {
    try {
      if (this.categoryGridData != null) {
        this.foldersort = sort;
        this.FolderLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private FolderLoadItems(): void {
    try {
      if (this.categoryGridData != null) {
        this.categoryGridView = {
          data: orderBy(this.categoryGridData.slice(0), this.foldersort),
          total: this.categoryGridData.length,
        };
        this.categoryGridData = this.categoryGridView.data;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  fillInterfaceForm() {
    try {
      this.fbcInterfaceFor.setValue(this.interFaceMasterDetails.interfacecode);
      this.fbcUrl.setValue(this.interFaceMasterDetails.ftpurl);
      var pass = "";
      if (this.fbcInterfaceFor.value == "DV") {
        let uname = this.clsUtility.decryptAESForDocsvault(
          this.interFaceMasterDetails.username
        );
        this.fbcUsername.setValue(uname);
        pass = this.clsUtility.decryptAESForDocsvault(
          this.interFaceMasterDetails.loginkey
        );
      } else {
        this.fbcUsername.setValue(this.interFaceMasterDetails.username);
        pass = this.clsUtility.decryptAES(this.interFaceMasterDetails.loginkey);
      }
      this.fbcPassword.setValue(pass);
      this.fbcRootFolder.setValue(this.interFaceMasterDetails.rootfolder);
      this.fbcPort.setValue(this.interFaceMasterDetails.portno);
      this.fbcSrcProcessFolder.setValue(
        this.interFaceMasterDetails.sourceprocessfolder
      );
      // this.fbcIsSplitFile.setValue(this.interFaceDetails.issplitfile);
      this.categoryGridData = this.interFaceMasterDetails.interfacedetails;
      // this.categoryOriginalData = this.categoryGridData.slice(0);
      this.categoryOriginalData = [];
      this.categoryGridData.forEach((ele) => {
        const item = Object.assign({}, ele);
        this.categoryOriginalData.push(item);
      });
      this.FolderLoadItems();
      // this.interfaceDetails = this.interFaceMasterDetails.interfacedetails;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ResetComponents() {
    try {
      this.InterfaceGroup.reset();
      this.clientServices = [];
      this.submitted = false;
      this.subscription.unsubscribe();
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
  saveInterface() {
    try {
      this.submitted = true;
      if (this.fbcUrl.value) {
        this.fbcUrl.setValue(this.fbcUrl.value.trim());
      }
      if (this.fbcUsername.value) {
        this.fbcUsername.setValue(this.fbcUsername.value.trim());
      }
      if (this.fbcPassword.value) {
        this.fbcPassword.setValue(this.fbcPassword.value.trim());
      }
      if (this.fbcRootFolder.value) {
        this.fbcRootFolder.setValue(this.fbcRootFolder.value.trim());
      }
      if (this.fbcPort.value) {
        this.fbcPort.setValue(this.fbcPort.value.trim());
      }
      if (this.validateFormFields()) {
        let body: InterfaceModel = new InterfaceModel();

        body.createdon = this.clsUtility.currentDateTime();
        body.interfacecode = this.fbcInterfaceFor.value;
        let interfaceForItem = this.InterfaceForData.find(
          (ele) => ele.value === body.interfacecode
        );
        body.interfacename = interfaceForItem.displayname;
        body.isactive = true;

        // body.loginkey = this.fbcPassword.value;
        if (this.fbcInterfaceFor.value == "DV") {
          body.loginid = this.clsUtility
            .encryptAESForDocsvault(this.fbcUsername.value)
            .toString();
          body.loginkey = this.clsUtility
            .encryptAESForDocsvault(this.fbcPassword.value)
            .toString();
        } else {
          body.loginid = this.fbcUsername.value;
          body.loginkey = this.clsUtility
            .encryptAES(this.fbcPassword.value)
            .toString();
        }
        body.modifiedon = this.clsUtility.currentDateTime();
        body.serviceurl = this.fbcUrl.value;
        body.userid = this.datatransfer.SelectedGCPUserid.toString();
        body.username = this.datatransfer.loginUserName;
        body.generateencounterperpage = false;
        body.sourceprocessfolder =
          this.fbcSrcProcessFolder.value == null
            ? 0
            : this.fbcSrcProcessFolder.value;

        if (this.newInterface) {
          body.clientid = this.selectedClient.nclientid;
          body.clientname = this.selectedClient.sclientname;
          // body.clientservicecode = this.fbcClientService.value;
          body.clientservicecode = "ENTR";
          // let selectedService = this.clientServices.find(
          //   ele => ele.servicecode === body.clientservicecode
          // );
          // if (selectedService) {
          body.clientservicename = "Encounter Tracking";
          // }
        } else {
          body.clientservicecode = "ENTR";
          body.clientservicename = "Encounter Tracking";
          body.clientid = this.interFaceMasterDetails.clientid;
          body.clientname = this.interFaceMasterDetails.clientname;
        }
        let inputBody: InterfaceModel[] = [];
        if (body.interfacecode.toUpperCase() == "SFTP") {
          body.rootfolder = this.fbcRootFolder.value;
          body.portno = this.fbcPort.value;
          for (let i = 0; i < this.categoryGridData.length; i++) {
            let obj: InterfaceModel = new InterfaceModel();
            obj.serviceurl = body.serviceurl;
            obj.loginid = body.loginid;
            obj.loginkey = body.loginkey;
            obj.isactive = body.isactive;
            obj.createdon = body.createdon;
            obj.modifiedon = body.modifiedon;
            obj.clientid = body.clientid;
            obj.clientname = body.clientname;
            obj.interfacecode = body.interfacecode;
            obj.interfacename = body.interfacename;
            obj.clientservicecode = body.clientservicecode;
            obj.clientservicename = body.clientservicename;
            obj.userid = body.userid;
            obj.username = body.username;
            obj.accountid = body.accountid;
            obj.portno = body.portno;
            obj.rootfolder = body.rootfolder;
            obj.doctype = this.categoryGridData[i].doctype;
            obj.categorycode = this.categoryGridData[i].categorycode;
            obj.categoryname = this.categoryGridData[i].categoryname;
            obj.path = this.categoryGridData[i].path;
            obj.generateencounterperpage = this.categoryGridData[
              i
            ].generateencounterperpage;
            obj.encounterpage = this.categoryGridData[i].encounterpage;
            obj.folderlocation =
              this.fbcRootFolder.value + this.categoryGridData[i].path;
            obj.sourceprocessfolder = body.sourceprocessfolder;
            if (!this.newInterface) {
              obj.createdon = this.categoryGridData[i].createdon;
              obj.accountid = this.categoryGridData[i].accountid;
              obj.isactive = this.categoryGridData[i].isactive;
            }
            inputBody.push(obj);
          }
        } else {
          body.folderlocation = "";
          body.rootfolder = "";
          body.portno = "";
          body.doctype = "";
          body.categorycode = "";
          body.categoryname = "";
          body.path = "";
          body.generateencounterperpage = false;
          if (!this.newInterface) {
            body.createdon = this.categoryGridData[0].createdon;
            body.accountid = this.categoryGridData[0].accountid;
            body.isactive = this.categoryGridData[0].isactive;
          }
          inputBody.push(body);
        }

        this.loader = true;
        if (this.newInterface) {
          this.subscription.add(
            this.ConfigurationService.saveInterface(inputBody).subscribe(
              (data) => {
                if (data) {
                  if (data == 1) {
                    $("#addeditinterfacemodal").modal("hide");
                    this.ResetComponents();
                    this.onsaveinterface.emit(true);
                    this.clsUtility.showSuccess("Interface saved successfully");
                    this.writeLog(
                      "Interface: " +
                        JSON.stringify(inputBody) +
                        " added sucessfully.",
                      "ADD"
                    );
                  } else if (data == 2) {
                    this.clsUtility.showWarning(
                      "Client Interface getting duplicate"
                    );
                    this.writeLog(
                      "Interface: " +
                        JSON.stringify(inputBody) +
                        " getting duplicate.",
                      "ADD"
                    );
                  }
                } else {
                  this.clsUtility.showError(
                    "Error while saving client interface"
                  );
                  this.writeLog(
                    "Error while saving client interface: " +
                      JSON.stringify(inputBody),
                    "ERROR"
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
        } else {
          this.subscription.add(
            this.ConfigurationService.updateInterface(inputBody).subscribe(
              (data) => {
                if (data) {
                  if (data == 1) {
                    $("#addeditinterfacemodal").modal("hide");
                    this.ResetComponents();
                    this.onsaveinterface.emit(true);
                    this.clsUtility.showSuccess(
                      "Interface updated successfully"
                    );
                    this.writeLog(
                      "Interface: " +
                        JSON.stringify(inputBody) +
                        " updated sucessfully.",
                      "UPDATE"
                    );
                  } else if (data == 2) {
                    this.clsUtility.showWarning(
                      "Client Interface getting duplicate"
                    );
                    this.writeLog(
                      "Interface: " +
                        JSON.stringify(inputBody) +
                        " getting duplicate.",
                      "UPDATE"
                    );
                  }
                } else {
                  this.clsUtility.showError(
                    "Error while updating client interface"
                  );
                  this.writeLog(
                    "Error while updating client interface: " +
                      JSON.stringify(inputBody),
                    "ERROR"
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
        }
      }
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  validateFormFields(): boolean {
    try {
      let isvalid = false;
      if (this.InterfaceGroup.valid) {
        isvalid = true;
        if (this.fbcInterfaceFor.value == "SFTP") {
          if (this.categoryGridData.length > 0) {
            isvalid = true;
          } else {
            isvalid = false;
          }
        }
      }
      return isvalid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnCheckFTPConnection() {
    try {
      var strHost: string = this.fbcUrl.value;
      var strPort: string = this.fbcPort.value;
      var strUserName: string = this.fbcUsername.value;
      // var strPassword: string = this.Password.value;
      var strPassword: string = this.clsUtility
        .encryptAES(this.fbcPassword.value)
        .toString();
      var strWorkingdirectory: string = this.fbcRootFolder.value;
      // var strFTPName: string = this.FTPName.value;
      let currentDateTime = this.clsUtility.currentDateTime();
      var clsFtpdetails: Ftpdetails = new Ftpdetails();
      // console.log(clsFtpdetails);
      // clsFtpdetails.nsfptid = this.InputFtpdetailsEditid;
      clsFtpdetails.sftphost = strHost.trim();
      clsFtpdetails.sftpport = Number(strPort.trim());
      clsFtpdetails.sftpuser = strUserName.trim();
      clsFtpdetails.sftppass = strPassword.trim();
      clsFtpdetails.sftpworkingdir = strWorkingdirectory.trim();
      // clsFtpdetails.sftpname = strFTPName.trim();
      // clsFtpdetails.status = this.Ftpdetailsdetail.status;
      clsFtpdetails.modifiedon = currentDateTime;
      const jsonqsuite = JSON.stringify(clsFtpdetails);
      // console.log(jsonqsuite);

      this.subscription.add(
        this.ConfigurationService.CheckFtpExists(jsonqsuite).subscribe(
          (data: {}) => {
            if (data != null || data != undefined) {
              if (data == true) {
                this.clsUtility.showSuccess("SFTP Connection established.");
                this.writeLog(
                  "SFTP Connection established for " + jsonqsuite,
                  "CHECKFTPCONNECTION"
                );
              } else {
                this.clsUtility.showError(
                  "Unable to establish SFTP connection."
                );
                this.writeLog(
                  "Unable to establish SFTP connection for " + jsonqsuite,
                  "CHECKFTPCONNECTION"
                );
              }
            } else {
              this.clsUtility.showError("Unable to establish SFTP connection.");
              this.writeLog(
                "Unable to establish SFTP connection for " + jsonqsuite,
                "CHECKFTPCONNECTION"
              );
            }
          },
          (err) => {
            this.clsUtility.showError("Unable to establish SFTP connection.");
            this.writeLog(
              "Unable to establish SFTP connection for " + jsonqsuite,
              "CHECKFTPCONNECTION"
            );
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    } finally {
      clsFtpdetails = null;
    }
  }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  addUpdateCategory() {
    try {
      this.categorySubmitted = true;
      if (this.fbcCategory.value) {
        this.fbcCategory.setValue(this.fbcCategory.value.trim());
      }
      if (this.fbcType.value) {
        this.fbcType.setValue(this.fbcType.value.trim());
      }
      if (this.fbcPath.value) {
        this.fbcPath.setValue(this.fbcPath.value.trim());
      }
      if (this.categoryGroup.valid) {
        let selectedCategory = this.categoryMaster.find(
          (ele) => ele.categorycode === this.fbcCategory.value
        );
        let path: string = this.fbcPath.value;
        if (path.startsWith("/") == false) {
          this.fbcPath.setValue("/" + path);
        }
        if (this.newCategory) {
          let categoryObj: {
            categorycode: string;
            categoryname: string;
            doctype: string;
            path: string;
            generateencounterperpage: boolean;
            encounterpage: number;
            isactive: boolean;
            createdon: string;
          } = {
            categorycode: this.fbcCategory.value,
            categoryname: selectedCategory
              ? selectedCategory.description
              : null,
            doctype: this.fbcType.value,
            path: this.fbcPath.value,
            generateencounterperpage:
              this.fbcIsGenerateEntrPerPage.value == 1 ? true : false,
            encounterpage:
              this.fbcIsGenerateEntrPerPage.value == 1
                ? this.fbcPagesPerEntr.value
                : this.fbcIsGenerateEntrPerPage.value == 0
                ? 0
                : -1,
            isactive: true,
            createdon: this.clsUtility.currentDateTime(),
          };
          this.categoryGridData.push(categoryObj);
        } else {
          this.categoryGridData[
            this.editRowIndex
          ].categorycode = this.fbcCategory.value;
          this.categoryGridData[
            this.editRowIndex
          ].categoryname = selectedCategory
            ? selectedCategory.description
            : null;
          this.categoryGridData[this.editRowIndex].doctype = this.fbcType.value;
          this.categoryGridData[this.editRowIndex].path = this.fbcPath.value;
          this.categoryGridData[this.editRowIndex].generateencounterperpage =
            this.fbcIsGenerateEntrPerPage.value == 1 ? true : false;
          this.categoryGridData[this.editRowIndex].encounterpage =
            this.fbcIsGenerateEntrPerPage.value == 1
              ? this.fbcPagesPerEntr.value
              : this.fbcIsGenerateEntrPerPage.value == 0
              ? 0
              : -1;
        }
        this.disableModal = false;
        $("#addcategory").modal("hide");
        this.FolderLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCategoryClose() {
    try {
      this.disableModal = false;
      $("#addcategory").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddCategory() {
    try {
      this.disableModal = true;
      this.newCategory = true;
      this.categoryGroup.reset();
      this.fbcIsGenerateEntrPerPage.setValue(0); //default value Per Document
      this.categorySubmitted = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onUpdateStatus(dataItem: any) {
    try {
      this.updateStatusDataItem = dataItem;
      if (this.isArrayChanged() === true) {
        $("#confirmationStatusModal").modal("show");
        this.disableModal = true;
      } else {
        this.updateStatus();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateStatus() {
    try {
      if (this.updateStatusDataItem.isactive == false) {
        this.subscription.add(
          this.ConfigurationService.getClientDetailsById(
            this.interfaceDataItem.clientid
          ).subscribe(
            (data) => {
              if (data) {
                let clientServices: any[] = data.clientServices;
                let element = clientServices.find(
                  (ele) => ele.servicecode === "ENTR"
                );
                if (element) {
                  this.updateInterfaceStatus(
                    this.updateStatusDataItem.accountid,
                    true,
                    this.updateStatusDataItem.interfacecode
                  );
                } else {
                  this.clsUtility.showInfo(
                    "Please activate " +
                      "ENTR" +
                      " service for \nclient: " +
                      this.interfaceDataItem.clientname +
                      " and then try again."
                  );
                  this.loadingCategoryGrid = false;
                }
              }
            },
            (error) => {
              this.loadingCategoryGrid = false;
              this.clsUtility.LogError(error);
            }
          )
        );
      } else {
        this.updateInterfaceStatus(
          this.updateStatusDataItem.accountid,
          false,
          this.updateStatusDataItem.interfacecode
        );
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
      this.loadingCategoryGrid = true;
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
              this.getInterfaceDetails("updatestatus");
              if (status) {
                this.writeLog(
                  "Status for interface accountid: " +
                    accountid +
                    " activated successfully",
                  "ACTIVATE"
                );
              } else {
                this.writeLog(
                  "Status for interface accountid: " +
                    accountid +
                    " deactivated successfully",
                  "DEACTIVATE"
                );
              }
            }
            this.loadingCategoryGrid = false;
          },
          (error) => {
            this.loadingCategoryGrid = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  editCategory(evt: any) {
    try {
      // console.log(evt);
      // this.clientid = evt.dataItem.clientid;
      // this.interfaceDataItem = evt.dataItem;
      // this.InputEditMessage = "Do you want to edit interface ?";
      this.newCategory = false;
      this.disableModal = true;
      // console.log(evt);
      // console.log(this.categoryGridData);
      this.categoryGroup.reset();
      this.editRowIndex = evt.rowIndex;
      this.fbcCategory.setValue(
        this.categoryGridData[this.editRowIndex].categorycode
      );
      this.fbcType.setValue(this.categoryGridData[this.editRowIndex].doctype);
      this.fbcPath.setValue(this.categoryGridData[this.editRowIndex].path);
      // this.fbcIsGenerateEntrPerPage.setValue(
      //   this.categoryGridData[this.editRowIndex].generateencounterperpage
      // );
      this.fbcIsGenerateEntrPerPage.setValue(
        this.categoryGridData[this.editRowIndex].encounterpage == 0
          ? 0
          : this.categoryGridData[this.editRowIndex].encounterpage == -1
          ? -1
          : 1
      );
      this.fbcPagesPerEntr.setValue(
        this.categoryGridData[this.editRowIndex].encounterpage
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  isArrayChanged(): boolean {
    try {
      let isChanged: boolean = false;
      if (this.categoryGridData.length == this.categoryOriginalData.length) {
        //if matches objects then return element else undefined or null
        let ele = this.categoryGridData.filter((item) =>
          this.diffcheck(item, this)
        ); //ele contains changed array elements
        if (ele && ele.length > 0) {
          isChanged = true;
        } else {
          isChanged = false;
        }
      } else {
        isChanged = true;
      }
      return isChanged;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  diffcheck(item, thisvar) {
    try {
      let ispassed = true;
      for (let i = 0; i < thisvar.categoryOriginalData.length; i++) {
        let res = thisvar.clsUtility.jsondiff(
          item,
          thisvar.categoryOriginalData[i]
        );
        if (res == undefined || Object.keys(res).length == 0) {
          ispassed = false;
          break;
        } else {
          continue;
        }
      }
      return ispassed;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseClick() {
    try {
      $("#confirmationStatusModal").modal("hide");
      this.disableModal = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onYesClick() {
    try {
      this.updateStatus();
      $("#confirmationStatusModal").modal("hide");
      this.disableModal = false;
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
