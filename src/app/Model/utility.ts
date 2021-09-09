import { DatePipe } from "@angular/common";
import * as CryptoJS from "crypto-js";
import { Global } from "../Model/global";
import { ToastrService } from "ngx-toastr";
import { Optional } from "@angular/core";
import { Application, Roles } from "./Common/login";
import { OrderAssistanceWorkqueueComponent } from "../Pages/BT Charge Posting/btworkqueue/order-assistance-workqueue/order-assistance-workqueue.component";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";
declare var $: any;

export enum enumFilterCallingpage {
  WorkInventory = "workqueue",
  DeferWorkInventory = "deferworkqueue",
  MyTask = "mytask",
  CompletedTask = "completedtask",
  Production = "production",
  File = "file",
  Automation = "automation", //saurabh shelar
  OrderDetails = "orderdetails", //saurabh shelar
  OrderAssistanceWorkqueue = "orderassistanceworkqueue",
  OrderWorkqueue = "orderworkqueue",
  MyEncounters = "myencounters",
  OrderReview = "orderreview",
  MyReview = "myreview",
  OrderCompletedWorkqueue = "ordercompletedworkqueue",
  OrderMyOrder = "ordermyorder",
  OrderPendingOrder = "orderpendingorder",
  OrderSearchOrder = "ordersearchorder",
  UniversalUpdateOrderStatus = "universalupdateorderstatus",
  // OrderSearchMultiple = "ordersearchmultiple",
  OrderDocumentSearch = "orderdocumentsearch",
  OrderAssistance = "orderassistance",
  OrderUpload = "orderupload",
  OrderExport = "orderexport",
  ReadyForPrinting = "readyforprinting",
  SubmittedAndPrinted = "submittedandprinted",
  PendingAdditionalInfo = "pendingadditionalinfo",
  RcmDocsView = "rcmdocsview",
  DocumentCount = "documentcount",
  AdvanceSearchOrder = "advancesearchorder",
  PracticeAssigned = "practiceassigned",
  PracticeCompleted = "practicecompleted",
  PracticeUserEncounter = "practiceuserencounter",
  PracticeAssistanceCompleted = "practiceassistancecompleted",
  ArchivedEncounters = "archivedencounters",
}

export enum enumTaskStatus {
  Open = 1,
  Closed = 2,
  Cancel = 3,
}

export enum enumOrderAssignSource {
  OrderInventory = 0,
  MyOrders = 1,
  CompletedInventory = 2,
  IncompleteInventory = 3,
  Reassignment = 4,
  PendingReview = 5,
  PracticeCompleted = 17,
  ReadyForPrinting = 8,
  SubmittedAndPrinted = 10,
}

export enum enumNavbarLinks {
  //#region Qonductor Menu
  Dashboard = "2.16.P1",
  EncounterTracking = "2.16.P2",
  ARTracking = "2.16.P3",
  Documents = "2.16.P4",
  Printing = "2.16.P5",
  Report = "2.16.P6",
  Configuration = "2.16.P7",
  ServiceController = "2.16.P8",
  //#endregion
  //#region Dashboard
  ARDashboard = "2.1.P1",
  OrderStatus = "2.1.P2",
  RCMDocsDashboard = "2.1.P3",
  PracticeDashboard = "2.1.P4",
  ARDashboardMyTaskCard = "2.1.P1.1",
  ARDashboardClientFilter = "2.1.P1.2",
  ARDashboardManagerCard = "2.1.P1.3",
  ARDashboardAgingBucket = "2.1.P1.4",
  ARDashboardStatusCard = "2.1.P1.5",
  ShowAllGroupDataFilter = "2.1.P4.1",
  GroupWiseCards = "2.1.P4.2",
  PracticeAssignedAgingBucket = "2.1.P4.3",
  ExecutiveDashboard = "2.1.P5",
  ShowAllPractice = "2.1.P5.1",
  //#endregion
  //#region AR Tracking
  ARInventory = "2.2.P1",
  DeferARInventory = "2.2.P2",
  AssignWorkitem = "2.2.P1.1",
  DeferWorkitem = "2.2.P1.2",
  UndeferWorkitem = "2.2.P2.1",
  MyTask = "2.2.P3",
  CompletedTask = "2.2.P4",
  CanceledTask = "2.2.P5",
  ViewTask = "2.2.P6",
  ARReview = "2.2.P7",
  ARCompletedReview = "2.2.P8",
  ProductionDailyClose = "2.2.P9",
  Agents = "2.2.P10",
  Assistant = "2.4.P1",
  Annoucement = "2.8.P1",
  //#endregion
  //#region Configuration
  ClientConfiguration = "2.9.P2",
  ClientLoginsConfiguration = "2.9.P3",
  PayerConfiguration = "2.9.P4",
  PayerCrosswalkConfiguration = "2.9.P5",
  NoteTemplateConfiguration = "2.9.P6",
  StatusConfiguration = "2.9.P7",
  SubStatusConfiguration = "2.9.P8",
  ActionConfiguration = "2.9.P9",
  ErrorTypeConfiguration = "2.9.P10",
  AutomationErrorConfiguration = "2.9.P11",
  ClientUserMappingConfiguration = "2.9.P12",
  QsuiteUserMappingConfiguration = "2.9.P13",
  FTPDetailsConfiguration = "2.9.P14",
  FollowupActionConfiguration = "2.9.P15",
  MailConfigurationConfiguration = "2.9.P16",
  InventoryRuleConfiguration = "2.9.P17",
  EdocsManagerConfiguration = "2.9.P18",
  AddCabinets = "2.9.P18.1",
  ProcessFolders = "2.9.P18.2",
  OrderSubStatusConfiguration = "2.9.P19",
  OrderNoteConfiguration = "2.9.P20",
  InterfaceConfiguration = "2.9.P21",
  GroupClientMapping = "2.9.P22",
  ClientProviderMapping = "2.9.P23",
  //#endregion
  //#region Document
  RCMDocsView = "2.17.P1",
  RCMDocsImport = "2.17.P2",
  ImportDocsBtn = "2.17.P2.1",
  AddOns = "2.17.P3",
  DocumentSearch = "2.17.P4",
  MoveDocsBtn = "2.17.P1.1",
  DeleteDocsBtn = "2.17.P1.2",
  DeleteRcmDocNoteBtn = "2.17.P1.3",
  DeleteRcmDocAnswerBtn = "2.17.P1.4",
  //#endregion
  //#region Printing
  ReadyForPrinting = "2.18.P1",
  SubmittedAndPrinted = "2.18.P2",
  PrintBtn = "2.18.P1.1",
  PrintAllBtn = "2.18.P1.2",
  ReadyForPrintSendToPracticeBtn = "2.18.P1.3",
  RePrintBtn = "2.18.P2.1",
  FinishedAndReturnedBtn = "2.18.P2.2",
  FailedAndReturnedBtn = "2.18.P2.3",
  ReturnedWithoutWorkingBtn = "2.18.P2.4",
  SubmittedAndPrintedSendToPractice = "2.18.P2.5",
  //#endregion
  //#region Report
  File = "2.14.P2",
  Production = "2.14.P3",
  AutomationAccuracy = "2.14.P4",
  //#endregion
  //#region Encounter Tracking
  OrderInventory = "2.15.P1",
  AssignOrder = "2.15.P2",
  MyOrders = "2.15.P3",
  CompletedInventory = "2.15.P4",
  AssistanceInventory = "2.15.P5",
  MissingCharges = "2.15.P6",
  ReviewOrder = "2.15.P7",
  UpdateEntrStatusOnPendingReview = "2.15.P8",
  MyReview = "2.15.P9",
  AssignReview = "2.15.P10",
  ExportGrid = "2.15.P11",
  OrderSearch = "2.15.P12",
  ReassignOrder = "2.15.P14",

  OrderAssistance = "2.15.P17",
  ReleaseAssignment = "2.15.P18",
  ReleaseAssignedReview = "2.15.P19",
  SendToBT = "2.15.P21",
  BiotechOrders = "2.15.P22",
  OrderSearchUpdateBtn = "2.15.P23",
  UploadToDocsvaultBtn = "2.15.P24",
  UpdateMissingInfoBtn = "2.15.P25",
  AllowMultiple = "2.15.P27",
  ReprocessFolder = "2.15.P28",
  DownloadOnIncomplete = "2.15.P29",
  DownloadAndSendToBiotech = "2.15.P30",
  ViewMissingInfo = "2.15.P31",
  DownloadOnBiotechOrders = "2.15.P32",
  UpdateInfoOnBiotechOrders = "2.15.P33",
  EncounterHistoryAddCommentBtn = "2.15.P34",
  UpdateOnHistory = "2.15.P35",
  OrderExport = "2.15.P36",
  MarkIncompleteOnPendingReview = "2.15.P45",
  UpdateEntrStatusOnMyReview = "2.15.P46",
  MarkIncompleteOnMyReview = "2.15.P47",
  MarkCompleteOnAssistance = "2.15.P48",
  MarkIncompleteOnAssistance = "2.15.P49",
  PendingAdditionalInfo = "2.15.P50",
  AssistanceSendToPracticeBtn = "2.15.P51",
  IncompleteSendToPracticeBtn = "2.15.P52",
  PracticeAssigned = "2.15.P53",
  PracticeCompleted = "2.15.P54",
  PracticeCompletedAssignEncounterBtn = "2.15.P55",
  PracticeAssignedReleaseAssignment = "2.15.P56",
  PracticeEncounters = "2.15.P57",
  AddComment = "2.15.P58",
  IncompleteSummary = "2.15.P59",
  ArchivedEncounters = "2.15.P60",
  PracticeAssistanceCompleted = "2.15.P61",
  ReleaseArchivedBtn = "2.15.P62",
  AdvanceSearch = "2.15.P63",
}

export enum enumTaskCallingPage {
  MyTask = 1,
  MyCompletedTask = 2,
}

export enum enumServiceStatus {
  // "00" = "QConstrue Service is stopped",
  // "01" = "QConstrue Service is running",
  // "02" = "Flat file parsing is inprogress",
  // "03" = "Sevice has been stopped but pending task completion is inprogress please try later",
  // "04" = "QConstrue Service Service is start",
  // "05" = "QConstrue Service is already stop",
  // "06" = "Flat file parsing is inprogress service will be stopped after completion",
  // "07" = "QConstrue Service is stop"
  "QConstrue Service is stopped" = 0,
  "QConstrue Service is running" = 1,
  "Flat file parsing is inprogress" = 2,
  "Sevice has been stopped but pending task completion is inprogress please try later" = 3,
  "QConstrue Service is start" = 4,
  "QConstrue Service is already stop" = 5,
  "Flat file parsing is inprogress service will be stopped after completion" = 6,
  "QConstrue Service is stop" = 7,
}
export enum enumEdocServiceStatus {
  "EDoc Service is stopped" = 0,
  "EDoc Service is running" = 1,
  "EDoc Service is in progress" = 2,
  "Service has been stopped but pending task completion is in progress please try later" = 3,
  "EDoc Service is start" = 4,
  "EDoc Service is already stop" = 5,
  "EDoc Service is inprogress service will be stopped after completion" = 6,
  "EDoc Service is stop" = 7,
}
export enum enumSFTPServiceStatus {
  "SFTP Service is stopped" = 0,
  "SFTP Service is running" = 1,
  "SFTP Service is in progress" = 2,
  "Service has been stopped but pending task completion is in progress please try later" = 3,
  "SFTP Service is start" = 4,
  "SFTP Service is already stop" = 5,
  "SFTP Service is inprogress service will be stopped after completion" = 6,
  "SFTP Service is stop" = 7,
}
export class Utility {
  public pagesize: number = 300;
  printOrdersPageSize: number = 50;
  public configPageSize: number = 100;
  private global: Global = new Global();
  QonductorEncryptKey = this.global.encryKey;
  DocsvaultEncryptKey = this.global.docsvaultEncryKey;
  base64Key = CryptoJS.enc.Utf8.parse(this.global.qoreencryKey);
  iv = CryptoJS.enc.Utf8.parse(this.global.qoreencryKey);
  public delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public LogError(error: any): any {
    this.showError(error);
    // alert(error);
  }

  encryptobj(object): any {
    var message = JSON.stringify(object);
    return CryptoJS.TripleDES.encrypt(message, this.global.encryKey);
  }

  decryptobj(encrypted) {
    var decrypted = CryptoJS.TripleDES.decrypt(encrypted, this.global.encryKey);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }
  encryptAES(string): any {
    const key = CryptoJS.enc.Utf8.parse(this.QonductorEncryptKey);
    const iv = CryptoJS.enc.Utf8.parse(this.QonductorEncryptKey);
    // const key = CryptoJS.enc.Utf8.parse("7061737323313233");
    // const iv = CryptoJS.enc.Utf8.parse("7061737323313233");
    // var message = JSON.stringify(object);
    const encrypted = CryptoJS.AES.encrypt(string, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted;
  }
  decryptAES(string): any {
    const key = CryptoJS.enc.Utf8.parse(this.QonductorEncryptKey);
    const iv = CryptoJS.enc.Utf8.parse(this.QonductorEncryptKey);
    // const key = CryptoJS.enc.Utf8.parse("7061737323313233");
    // const iv = CryptoJS.enc.Utf8.parse("7061737323313233");
    // var message = JSON.stringify(object);
    const decrypted = CryptoJS.AES.decrypt(string, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  encryptAESForDocsvault(string): any {
    const key = CryptoJS.enc.Utf8.parse(this.DocsvaultEncryptKey);
    const iv = CryptoJS.enc.Utf8.parse(this.DocsvaultEncryptKey);
    const encrypted = CryptoJS.AES.encrypt(string, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted;
  }
  decryptAESForDocsvault(string): any {
    const key = CryptoJS.enc.Utf8.parse(this.DocsvaultEncryptKey);
    const iv = CryptoJS.enc.Utf8.parse(this.DocsvaultEncryptKey);
    const decrypted = CryptoJS.AES.decrypt(string, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
  encryptobjorstring(inputstring: any): any {
    var base64Key = CryptoJS.enc.Utf8.parse(this.global.encryKey);
    var iv = CryptoJS.enc.Utf8.parse(this.global.encryKey);
    var source_string = inputstring;
    var encrypted = CryptoJS.AES.encrypt(source_string, base64Key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted;
  }

  decryptedobjorstring(inputstring: any) {
    // console.log(inputstring.ciphertext);

    var base64Key = CryptoJS.enc.Utf8.parse(this.global.encryKey);
    var iv = CryptoJS.enc.Utf8.parse(this.global.encryKey);
    var ciphertext = inputstring.ciphertext.toString(CryptoJS.enc.Base64);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    });
    var decrypted = CryptoJS.AES.decrypt(cipherParams, base64Key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted;
  }
  public currentDateTime(): string {
    const datepipe = new DatePipe("en-US");
    const currentDate = datepipe.transform(
      Date.now(),
      "yyyy-MM-ddTHH:mm:ss.SSSZ"
    );
    // return currentDate + "Z";
    return currentDate;
  }
  constructor(private toastr?: ToastrService) {}
  ApplicationName: "Qonductor";
  showSuccess(message: string) {
    this.toastr.success(message, this.ApplicationName);
  }

  showError(message: string) {
    this.toastr.error(message, this.ApplicationName);
  }

  showWarning(message: string) {
    this.toastr.warning(message, this.ApplicationName);
  }

  showInfo(message: string) {
    this.toastr.info(message, this.ApplicationName);
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  CheckEmptyString(strValue: string): boolean {
    if (this.isBlankString(strValue)) {
      return true;
    }
    const validateString: string = strValue.trim();
    if (validateString.length === 0) {
      return true;
    }
    return false;
  }
  private isBlankString(strValue: string): boolean {
    if (strValue === null || strValue === undefined) {
      return true;
    }
    return false;
  }

  getUserRole(roles: []) {
    for (const iterator of roles) {
    }
  }
  getApplication(applications: any[]): Application {
    var application = new Application();
    for (const iterator of applications) {
      if (iterator.applicationcode == "2") {
        application.applicationcode = iterator.applicationcode;
        application.applicationname = iterator.applicationname;
      }
    }
    return application;
  }
  getApplicationRole(roles: any): Roles {
    var role = new Roles();
    for (const iterator of roles) {
      if (iterator.applicationcode == "2") {
        role.roleid = iterator.roleid;
        role.rolename = iterator.rolename;
      }
    }
    // console.log(role);

    return role;
  }
  validateOrderSelected(OrderSelected: any[]): boolean {
    let valid = false;
    for (let i = 0; i < OrderSelected.length; i++) {
      if (
        OrderSelected[i].nstatus == 2 ||
        OrderSelected[i].nstatus == 3 ||
        OrderSelected[i].nstatus == 4 ||
        OrderSelected[i].nstatus == 5 ||
        OrderSelected[i].nstatus == 7 ||
        OrderSelected[i].nstatus == 8 ||
        // OrderSelected[i].nstatus == 9 ||
        OrderSelected[i].nstatus == 10 ||
        OrderSelected[i].nstatus == 11 ||
        OrderSelected[i].nstatus == 12 ||
        OrderSelected[i].nstatus == 13
      ) {
        valid = true;
        break;
      }
    }
    return valid;
  }
  validateOtherOrderSelected(OrderSelected: any[]): boolean {
    let valid = false;
    for (let i = 0; i < OrderSelected.length; i++) {
      if (
        OrderSelected[i].nstatus != 2 &&
        OrderSelected[i].nstatus != 3 &&
        OrderSelected[i].nstatus != 4 &&
        OrderSelected[i].nstatus != 5 &&
        OrderSelected[i].nstatus != 7 &&
        OrderSelected[i].nstatus != 8 &&
        OrderSelected[i].nstatus != 10 &&
        OrderSelected[i].nstatus != 11 &&
        OrderSelected[i].nstatus != 12 &&
        OrderSelected[i].nstatus != 13
      ) {
        valid = true;
        break;
      }
    }
    return valid;
  }
  b64toBlob = (
    b64Data: string,
    contentType = "application/pdf",
    sliceSize = 512
  ) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blobpdf = new Blob(byteArrays, { type: contentType });
    return blobpdf;
  };
  async blobToBytes(data: any) {
    //convert file blob to bytes
    return new Promise<any>((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(data);
      var base64data: any;
      reader.onloadend = function () {
        base64data = reader.result;
        base64data = base64data.replace("data:application/pdf;base64,", "");
        resolve(base64data);
      };
    });
  }
  //for comparing two json object
  jsondiff(obj1, obj2) {
    const result = {};
    if (Object.is(obj1, obj2)) {
      return undefined;
    }
    if (!obj2 || typeof obj2 !== "object") {
      return obj2;
    }
    Object.keys(obj1 || {})
      .concat(Object.keys(obj2 || {}))
      .forEach((key) => {
        if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
          result[key] = obj2[key];
        }
        if (typeof obj2[key] === "object" && typeof obj1[key] === "object") {
          const value = this.jsondiff(obj1[key], obj2[key]);
          if (value !== undefined) {
            result[key] = value;
          }
        }
      });
    return result;
  }

  checkSelectedOrderType(OrderSelected: any[]): boolean {
    let valid = false;
    valid = this.encounterSource(OrderSelected);
    return valid;
  }
  encounterSource = (OrderSelected) =>
    OrderSelected.every(
      (v) => v.encountersource === OrderSelected[0].encountersource
    );
  applyModalOpenClassOnClose(id: string) {
    $("#" + id)
      .modal()
      .on("hidden.bs.modal", function (e) {
        $("body").addClass("modal-open");
      });
  }
  formatText(text: string): string {
    if (text != null && text != undefined && text != "") {
      return text.trim().replace(/\s\s+/g, " ");
    } else {
      return text;
    }
  }
}
export class ClientInfo {
  constructor(public http: HttpClient) {}
  static getbroweser() {
    let browserName;
    const agent = window.navigator.userAgent.toLowerCase();
    //console.log(agent);  Trigger Build
    if (agent.indexOf("edge") > -1) {
      // console.log("edge");
      browserName = "edge";
    } else if (agent.indexOf("opr") > -1 && !!(<any>window).opr) {
      // console.log("opera");
      browserName = "Opera";
    } else if (agent.indexOf("chrome") > -1 && !!(<any>window).chrome) {
      // console.log("chrome");
      browserName = "Chrome";
    } else if (agent.indexOf("trident") > -1 && !!(<any>window).ie) {
      // console.log("ie");
      browserName = "Internet  Explorer";
    } else if (agent.indexOf("firefox") > -1 && !!(<any>window).firefox) {
      // console.log("firefox");
      browserName = "Firefox";
    }
    if (agent.indexOf("safari") > -1 && !!(<any>window).safari) {
      // console.log("safari");
      browserName = "Safari";
    }
    return browserName;
  }
}
