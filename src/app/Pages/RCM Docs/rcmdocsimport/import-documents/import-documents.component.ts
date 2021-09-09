import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SubSink } from "subsink";
import { FliterClient } from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
import {
  CountModel,
  StatusReportModel,
} from "src/app/Model/BT Charge Posting/Workqueue/status-report.model";
declare var $: any;

@Component({
  selector: "app-import-documents",
  templateUrl: "./import-documents.component.html",
  styleUrls: ["./import-documents.component.css"],
})
export class ImportDocumentsComponent implements OnInit {
  clsUtility: Utility;
  files: any[] = [];
  clients: any[] = [];
  allClients: any[] = [];
  categories: any[] = [];
  allCategories: any[] = [];
  subscription: SubSink = new SubSink();
  percentageLoader: boolean = false;
  kendoLoader: boolean;
  @Output() onSubmitDocuments: EventEmitter<boolean> = new EventEmitter();
  percentage: number = 0;
  countObj: CountModel = new CountModel();
  statusArray: StatusReportModel[] = [];

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private coreops: CoreOperationService,
    private dataService: DataTransferService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    // this.getFilterMaster();
  }
  importFormGroup: FormGroup = this.fb.group({
    fcCategory: [null, Validators.required],
    fcClient: [null, Validators.required],
  });
  get fbcCategory() {
    return this.importFormGroup.get("fcCategory");
  }
  get fbcClient() {
    return this.importFormGroup.get("fcClient");
  }

  clientChange(evt: any) {
    try {
      let client = [];
      let filterclient = new FliterClient();
      filterclient.clientname = evt.clientcodename;
      filterclient.clientid = evt.nclientid;
      client.push(filterclient);
      this.getRCMCategories(client);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getRCMCategories(client: any[]) {
    try {
      this.fbcCategory.reset();
      let inputJson = {
        cabinet: "0",
        category: "0",
        client: client,
        folder: "0",
        isacknowledged: false,
        month: 0,
      };
      this.subscription.add(
        this.filterService.retrieveEncounterMaster(inputJson).subscribe(
          (queue) => {
            if (queue != null) {
              if (queue["categorylist"] != null) {
                this.categories = queue["categorylist"];
                this.allCategories = queue["categorylist"];
              } else {
                this.clsUtility.showInfo("No categories available");
                this.categories = [];
                this.allCategories = [];
              }
            }
          },
          (err) => {
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getFilterMaster(
    yearDefault: string = "0",
    statusid: string = "0",
    clientid: string = "0"
  ) {
    try {
      this.kendoLoader = true;
      this.subscription.add(
        this.filterService
          .getFolderCategoryAndYear(yearDefault, statusid, clientid)
          .subscribe(
            (response) => {
              this.kendoLoader = false;
              if (response) {
                if (response.client == null) {
                  this.clsUtility.showInfo(
                    "Login user is not associated with client"
                  );
                  this.clients = [];
                  this.allClients = [];
                  return;
                } else {
                  this.clients = response.client;
                  this.allClients = response.client;
                  if (this.clients.length == 1) {
                    this.fbcClient.setValue(this.clients[0].nclientid);
                    let client = [];
                    let filterclient = new FliterClient();
                    filterclient.clientname = this.clients[0].clientcodename;
                    filterclient.clientid = this.clients[0].nclientid;
                    client.push(filterclient);
                    this.getRCMCategories(client);
                  }
                }
              }
            },
            (error) => {
              this.kendoLoader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.kendoLoader = false;
      this.clsUtility.LogError(error);
    }
  }

  onClose() {
    try {
      this.resetForm();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  resetForm() {
    try {
      // if (this.clients && this.clients.length == 1) {
      //   this.fbcCategory.reset();
      // } else {
      //   this.categories = [];
      //   this.allCategories = [];
      //   this.importFormGroup.reset();
      // }
      this.importFormGroup.reset();
      this.categories = [];
      this.allCategories = [];
      this.files = [];
      this.percentage = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleClientFilter(value: string) {
    try {
      this.clients = this.allClients.filter((ele) =>
        ele.clientcodename.toLowerCase().includes(value.toLowerCase())
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleCategoryFilter(value: string) {
    try {
      this.categories = this.allCategories.filter((ele) =>
        ele.category.toLowerCase().includes(value.toLowerCase())
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async onSaveImportDocuments() {
    try {
      // this.loader = true;
      // let percentIncrease = 100 / this.files.length;
      // for (let index = 0; index < this.files.length; index++) {
      //   var base64data = await this.getFile(this.files[index].file);
      //   let obj = {
      //     clientid: this.fbcClient.value.toString(),
      //     category: this.fbcCategory.value,
      //     createdon: this.clsUtility.currentDateTime(),
      //     uplodedby: this.dataService.loginUserName,
      //     uplodedbyid: this.dataService.loginGCPUserID.getValue(),
      //     filename: this.files[index].file.name,
      //     size: this.files[index].size,
      //     data: base64data,
      //   };
      //   await this.coreops
      //     .saveImportDocuments(obj)
      //     .toPromise()
      //     .then(
      //       (data) => {},
      //       (error) => {
      //         this.clsUtility.LogError(error);
      //       }
      //     );
      let obj = {
        clientid: this.fbcClient.value.toString(),
        category: this.fbcCategory.value,
        createdon: this.clsUtility.currentDateTime(),
        uplodedby: this.dataService.loginUserName,
        uplodedbyid: this.dataService.loginGCPUserID.getValue(),
      };
      let totalFiles = this.files.length;
      let percentIncrease = 100 / totalFiles;
      if (totalFiles > 1) this.percentageLoader = true;
      else this.kendoLoader = true;
      this.countObj = new CountModel();
      this.statusArray = new Array<StatusReportModel>();
      this.countObj.total = totalFiles;
      for (let index = 0; index < totalFiles; index++) {
        let statusModel: StatusReportModel = new StatusReportModel();
        await this.coreops
          .saveImportDocumentList(
            this.files[index].file,
            obj,
            this.files[index].size
          )
          .toPromise()
          .then(
            (data) => {
              // console.log(data);
              if (data) {
                statusModel.documentname = this.files[index].file.name;
                statusModel.documentsize = this.files[index].size;
                if (
                  data.servicestatus == 1 &&
                  data.ftpuploadstatus == 1 &&
                  data.dbstatus == 1
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.showSuccess(
                      "Document uploaded & imported successfully"
                    );
                  } else {
                    statusModel.status = 2;
                    statusModel.description =
                      "Document uploaded & imported successfully.";
                    this.countObj.success++;
                  }
                } else if (
                  data.servicestatus == 0 &&
                  data.ftpuploadstatus == 0 &&
                  data.dbstatus == 0
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.LogError(
                      "Error while importing and uploading document"
                    );
                  } else {
                    statusModel.status = 0;
                    statusModel.description =
                      "Error while importing and uploading document.";
                    this.countObj.error++;
                  }
                } else if (
                  data.servicestatus == 1 &&
                  data.ftpuploadstatus == 0 &&
                  data.dbstatus == 0
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.LogError(
                      "Error while importing and uploading document"
                    );
                  } else {
                    statusModel.status = 0;
                    statusModel.description =
                      "Error while importing and uploading document.";
                    this.countObj.error++;
                  }
                } else if (
                  data.servicestatus == 1 &&
                  data.ftpuploadstatus == 0 &&
                  data.dbstatus == 1
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.LogError(
                      "Document imported but error while uploading on ftp"
                    );
                  } else {
                    statusModel.status = 0;
                    statusModel.description =
                      "Document imported but error while uploading on ftp.";
                    this.countObj.error++;
                  }
                } else if (
                  data.servicestatus == 1 &&
                  data.ftpuploadstatus == 1 &&
                  data.dbstatus == 0
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.LogError(
                      "Document uploaded but error while importing"
                    );
                  } else {
                    statusModel.status = 0;
                    statusModel.description =
                      "Document uploaded but error while importing.";
                    this.countObj.error++;
                  }
                } else if (
                  data.ftpuploadstatus == 0 &&
                  data.dbstatus == 2 &&
                  data.servicestatus == 2
                ) {
                  if (totalFiles === 1) {
                    this.clsUtility.showWarning("Document getting duplicate");
                  } else {
                    statusModel.status = 1;
                    statusModel.description = "Document getting duplicate.";
                    this.countObj.skipped++;
                  }
                }
                this.statusArray.push(statusModel);
              }
              // objResponse.ftpuploadstatus =
              //   data.ftpuploadstatus + objResponse.ftpuploadstatus;
              // objResponse.dbstatus = data.dbstatus + objResponse.dbstatus;
              // objResponse.servicestatus =
              //   data.servicestatus + objResponse.servicestatus;
            },
            (error) => {
              if (totalFiles === 1) {
                this.clsUtility.LogError(error);
              } else {
                statusModel.status = 0;
                statusModel.description =
                  "Error while importing and uploading document.";
                this.countObj.error++;
              }
            }
          );
        this.percentage = this.percentage + percentIncrease;
      }
      this.writeLog(
        "Documents submitted for import :" + JSON.stringify(this.statusArray),
        "ADD"
      );
      if (totalFiles === 1) {
        this.kendoLoader = false;
        this.resetForm();
        this.onSubmitDocuments.next(true);
      } else {
        setTimeout(() => {
          this.resetForm();
          this.percentageLoader = false;
          this.onSubmitDocuments.next(true);
          if (totalFiles > 1) {
            this.dataService.statusReportData.next({
              countObj: this.countObj,
              orderStatusData: this.statusArray,
              isFrom: "importdocuments",
            });
            $("#docStatusReport").modal("show");
          }
          // this.clsUtility.showSuccess("Document(s) imported successfully");
        }, 3000);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // upload event on file seleced
  uploadFile(event: any) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      if (element.size > 30000000) {
        this.clsUtility.showInfo("Document size should be less than 30 MB");
        continue;
      }
      let item = this.files.find((ele) => ele.file.name == element.name);
      if (item) {
        this.clsUtility.showWarning("Document getting duplicate");
        continue;
      }
      var obj = {
        file: element,
        // status: "",
        // action: "",
        size: element.size ? this.formatBytes(element.size) : "",
      };
      // this.validateDoc().subscribe((response) => {
      //   obj.status = response.status;
      //   obj.action = response.action;
      // });
      this.files.push(obj);
    }
  }

  // func to validate document
  // validateDoc(): BehaviorSubject<{ status: string; action: string }> {
  //   let result = new BehaviorSubject<{ status: string; action: string }>({
  //     status: "validating",
  //     action: "",
  //   });
  //   setTimeout(() => {
  //     result.next({ status: "", action: "import" });
  //   }, 2000);
  //   return result;
  // }
  // func to calculate file size
  formatBytes(bytes, decimals: number = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  // async getFile(data: any) {
  //   return new Promise<any>((resolve, reject) => {
  //     var reader = new FileReader();
  //     reader.readAsDataURL(data);
  //     var base64data: any;
  //     reader.onloadend = function () {
  //       base64data = reader.result;
  //       base64data = base64data.replace("data:application/pdf;base64,", "");
  //       resolve(base64data);
  //     };
  //   });
  // }
  writeLog(msg: string, useraction: string) {
    try {
      this.auditLog.writeLog(msg, useraction, "Import Documents", "Documents");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
