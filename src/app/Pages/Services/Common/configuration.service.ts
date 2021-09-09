import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Status } from "src/app/Model/AR Management/Configuration/status";
import { Substatus } from "src/app/Model/AR Management/Configuration/substatus";
import { Actions } from "src/app/Model/AR Management/Configuration/actions";
import { Notetemplate } from "src/app/Model/AR Management/Configuration/notetemplate";
import { Client } from "src/app/Model/AR Management/Configuration/client";
import { Payer } from "src/app/Model/AR Management/Configuration/payer";
import { Payercrosswalk } from "src/app/Model/AR Management/Configuration/payercrosswalk";
import { Clientlogin } from "src/app/Model/AR Management/Configuration/clientlogin";
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { Clientusermapping } from "src/app/Model/AR Management/Configuration/clientusermapping";
import { environment } from "src/environments/environment";
import { Qsuiteusermapping } from "src/app/Model/AR Management/Configuration/qsuiteusermapping";
import { Ftpdetails } from "src/app/Model/AR Management/Configuration/ftpdetails";
import { Followup } from "src/app/Model/AR Management/Configuration/followup";
import { LogsService } from "src/app/Pages/Services/Common/Not Used/logs.service";
import { Logs, keys } from "src/app/Model/Common/logs";
import { Utility } from "src/app/Model/utility";
import { Action } from "rxjs/internal/scheduler/Action";
import {
  MailSave,
  MailRetrive,
} from "src/app/Model/AR Management/Configuration/mail";
import { CookieService } from "ngx-cookie-service";
import { Automation } from "src/app/Model/AR Management/Configuration/automation";
import { Rule } from "src/app/Model/AR Management/Configuration/rule";
import {
  GroupClientMapping,
  GroupClientMappingStatus,
} from "src/app/Model/AR Management/Configuration/group-client-mapping.model";
import * as moment from "moment";
import {
  ClientProviderMapping,
  UpdateClientProviderMappingStatus,
} from "../../../Model/AR Management/Configuration/client-provider-mapping.model";

@Injectable({
  providedIn: "root",
})
export class ConfigurationService {
  serviceEndpoint = environment.coreServiceUrl;
  docsServiceEndPoint = environment.docsServiceUrl;
  archivalServiceEndPoint = environment.archivalServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private Logservice: LogsService,
    private cookieService: CookieService
  ) {
    this.clsUtility = new Utility();
  }

  clsUtility: Utility;

  getClientID() {
    // return this.httpClient
    //   .get<number>(
    //     this.serviceEndpoint + "Client/GetClientId",
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "";
    clskeys.keyvalue = "";
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<number>(
        this.serviceEndpoint + "Client/GetClientId",
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Clientid created successfully";
          } else {
            DetailMessage = "Clientid not created";
          }
          this.SaveLogs(
            "INFO",
            "getClientID",
            "GET",
            "Get clientid",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getClientConfigurationById(id: any): Observable<Client[]> {
    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientid";
    clskeys.keyvalue = id;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Client[]>(this.serviceEndpoint + "Client/" + id, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get all client details successfully";
          } else {
            DetailMessage = "Client details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getClientConfigurationById",
            "POST",
            "Get clientdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveClientConfiguration(client): Observable<Client> {
    // return this.httpClient
    //   .post<Client>(
    //     this.serviceEndpoint + "Client/Save",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objclient = new Client();
    objclient = JSON.parse(client);
    var strclient =
      objclient.nclientid +
      "|" +
      objclient.clientcode +
      "|" +
      objclient.qlivedt +
      "|" +
      objclient.arstartdt +
      "|" +
      objclient.sclientname +
      "|" +
      objclient.address +
      "|" +
      objclient.sdatabasename +
      "|" +
      objclient.sausid +
      "|" +
      objclient.stin +
      "|" +
      objclient.snpi +
      "|" +
      objclient.nstatus +
      "|" +
      objclient.dtstatusdate +
      "|" +
      objclient.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "client";
    clskeys.keyvalue = strclient;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Client>(
        this.serviceEndpoint + "Client/Save",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Saved client details successfully";
            DetailMessage = this.LogMessage("Client", "saved", Resultdata);
          } else {
            DetailMessage = "Client details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveClientConfiguration",
            "POST",
            "Save clientdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientConfiguration(id: number, client): Observable<Client> {
    // return this.httpClient
    //   .put<Client>(
    //     this.serviceEndpoint + "Client/Update",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    // var clskeys = new keys();
    // const clskey: keys[] = [];

    // clskeys.keyname = "id";
    // clskeys.keyvalue = "1";
    // clskey.push(clskeys);
    // clskeys = new keys();
    // clskeys.keyname = "client";
    // clskeys.keyvalue = "configuration";
    // clskey.push(clskeys);

    // console.log(clskey);

    var objclient = new Client();
    objclient = JSON.parse(client);
    var strclient =
      objclient.nclientid +
      "|" +
      objclient.clientcode +
      "|" +
      objclient.qlivedt +
      "|" +
      objclient.arstartdt +
      "|" +
      objclient.sclientname +
      "|" +
      objclient.address +
      "|" +
      objclient.sdatabasename +
      "|" +
      objclient.sausid +
      "|" +
      objclient.stin +
      "|" +
      objclient.snpi +
      "|" +
      objclient.nstatus +
      "|" +
      objclient.dtstatusdate +
      "|" +
      objclient.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "client";
    clskeys.keyvalue = strclient;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Client>(
        this.serviceEndpoint + "Client/Update",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update client details successfully";
            DetailMessage = this.LogMessage("Client", "updated", Resultdata);
          } else {
            DetailMessage = "Client details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientConfiguration",
            "PUT",
            "Update clientdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientStatus(id: number, client): Observable<Client> {
    // return this.httpClient
    //   .put<Client>(
    //     this.serviceEndpoint + "Client/UpdateStatus",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(client);
    var objclient = new Client();
    objclient = JSON.parse(client);
    var strclient = objclient.nclientid + "|" + objclient.nstatus;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "client";
    clskeys.keyvalue = strclient;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Client>(
        this.serviceEndpoint + "Client/UpdateStatus",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update client status successfully";
            DetailMessage = this.LogMessage(
              "Client status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Client status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientStatus",
            "PUT",
            "Update clientstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteClientConfiguration(id: number) {
    return this.httpClient
      .delete(this.serviceEndpoint + "Client/Delete/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getStatusById(id: any, status: number = 0): Observable<Status[]> {
    // return this.httpClient
    //   .get<Status[]>(
    //     this.serviceEndpoint + "Status/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strclient = id + "|" + status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "status";
    clskeys.keyvalue = strclient;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Status[]>(
        this.serviceEndpoint + "Status/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get status details successfully";
          } else {
            DetailMessage = "Status details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getStatusById",
            "GET",
            "Get StatusDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveStatus(status): Observable<Status> {
    // return this.httpClient
    //   .post<Status>(
    //     this.serviceEndpoint + "Status/Save",
    //     status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objstatus = new Status();
    objstatus = JSON.parse(status);
    var strstatus =
      objstatus.nstatusid +
      "|" +
      objstatus.sstatuscode +
      "|" +
      objstatus.sstatusdescription +
      "|" +
      objstatus.sdisplaycodedesc +
      "|" +
      objstatus.bisactive +
      "|" +
      objstatus.bissystemdefined +
      "|" +
      objstatus.createdby +
      "|" +
      objstatus.screatedusername +
      "|" +
      objstatus.createdon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "status";
    clskeys.keyvalue = strstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Status>(
        this.serviceEndpoint + "Status/Save",
        status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Saved status details successfully";
            DetailMessage = this.LogMessage(
              "Status details",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "Status details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveStatus",
            "POST",
            "Save statusdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateStatus(id: number, status): Observable<Status> {
    // return this.httpClient
    //   .put<Status>(
    //     this.serviceEndpoint + "Status/Update",
    //     status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objstatus = new Status();
    objstatus = JSON.parse(status);
    var strstatus =
      objstatus.nstatusid +
      "|" +
      objstatus.sstatuscode +
      "|" +
      objstatus.sstatusdescription +
      "|" +
      objstatus.sdisplaycodedesc +
      "|" +
      objstatus.bisactive +
      "|" +
      objstatus.bissystemdefined +
      "|" +
      objstatus.createdby +
      "|" +
      objstatus.screatedusername;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "status";
    clskeys.keyvalue = strstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Status>(
        this.serviceEndpoint + "Status/Update",
        status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update status details successfully";
            DetailMessage = this.LogMessage(
              "Status details",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Status details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientConfiguration",
            "PUT",
            "Update statusdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateStatusStatus(id: number, status): Observable<Status> {
    // return this.httpClient
    //   .put<Status>(
    //     this.serviceEndpoint + "Status/UpdateStatus",
    //     status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objstatus = new Status();
    objstatus = JSON.parse(status);
    var strstatus = objstatus.nstatusid + "|" + objstatus.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "status";
    clskeys.keyvalue = strstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Status>(
        this.serviceEndpoint + "Status/UpdateStatus",
        status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Status status successfully";
            DetailMessage = this.LogMessage(
              "Status status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Status status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateStatusStatus",
            "PUT",
            "Update Statusstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteStatus(id: number) {
    return this.httpClient
      .delete(this.serviceEndpoint + "Status/Delete/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getSubStatusById(id: any, status: number = 0): Observable<Substatus[]> {
    // return this.httpClient
    //   .get<Substatus[]>(
    //     this.serviceEndpoint + "Substatus/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strsubstatus = id + "|" + status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "substatus";
    clskeys.keyvalue = strsubstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Substatus[]>(
        this.serviceEndpoint + "Substatus/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Substaus details successfully";
          } else {
            DetailMessage = "Substatus details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getSubStatusById",
            "GET",
            "Get SubStatusDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveSubStatus(substatus): Observable<Substatus> {
    // return this.httpClient
    //   .post<Substatus>(
    //     this.serviceEndpoint + "Substatus/Save",
    //     substatus,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    // console.log(substatus);

    var objsubstatus = new Substatus();
    objsubstatus = JSON.parse(substatus);
    var strsubstatus =
      objsubstatus.nsubstatusid +
      "|" +
      objsubstatus.ssubstatuscode +
      "|" +
      objsubstatus.ssubstatusdescription +
      "|" +
      objsubstatus.sdisplaycodedesc +
      "|" +
      objsubstatus.bisactive +
      "|" +
      objsubstatus.bissystemdefined +
      "|" +
      objsubstatus.createdby +
      "|" +
      objsubstatus.screatedusername +
      "|" +
      objsubstatus.createdon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "substatus";
    clskeys.keyvalue = strsubstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Substatus>(
        this.serviceEndpoint + "Substatus/Save",
        substatus,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Substaus details successfully";
            DetailMessage = this.LogMessage(
              "Substatus details",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "Substatus details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveSubStatus",
            "POST",
            "Save SubStatusDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateSubStatus(id: number, substatus): Observable<Substatus> {
    // return this.httpClient
    //   .put<Substatus>(
    //     this.serviceEndpoint + "Substatus/Update",
    //     substatus,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objsubstatus = new Substatus();
    objsubstatus = JSON.parse(substatus);
    var strsubstatus =
      objsubstatus.nsubstatusid +
      "|" +
      objsubstatus.ssubstatuscode +
      "|" +
      objsubstatus.ssubstatusdescription +
      "|" +
      objsubstatus.sdisplaycodedesc +
      "|" +
      objsubstatus.bisactive +
      "|" +
      objsubstatus.bissystemdefined +
      "|" +
      objsubstatus.createdby +
      "|" +
      objsubstatus.screatedusername;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "substatus";
    clskeys.keyvalue = strsubstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Substatus>(
        this.serviceEndpoint + "Substatus/Update",
        substatus,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Substatus details successfully";
            DetailMessage = this.LogMessage(
              "Substatus details",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "SubStatus details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateSubStatus",
            "PUT",
            "Update Substatusdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateSubStatusStatus(id: number, substatus): Observable<Substatus> {
    // return this.httpClient
    //   .put<Substatus>(
    //     this.serviceEndpoint + "Substatus/UpdateStatus",
    //     substatus,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objsubstatus = new Substatus();
    objsubstatus = JSON.parse(substatus);
    var strsubstatus = objsubstatus.nsubstatusid + "|" + objsubstatus.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "substatus";
    clskeys.keyvalue = strsubstatus;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Substatus>(
        this.serviceEndpoint + "Substatus/UpdateStatus",
        substatus,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update SubStatus status successfully";
            DetailMessage = this.LogMessage(
              "Substatus status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "SubStatus status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateSubStatusStatus",
            "PUT",
            "Update SubStatusstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteSubStatus(id: number) {
    return this.httpClient
      .delete(this.serviceEndpoint + "Substatus/Delete/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getNoteTemplateById(id: any, status: number = 0): Observable<Notetemplate[]> {
    // return this.httpClient
    //   .get<Notetemplate[]>(
    //     this.serviceEndpoint + "NoteTemplate/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var strnotetemplate = id + "|" + status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "notetemplate";
    clskeys.keyvalue = strnotetemplate;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Notetemplate[]>(
        this.serviceEndpoint + "NoteTemplate/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get NoteTemplate details successfully";
          } else {
            DetailMessage = "NoteTemplate details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getNoteTemplateById",
            "GET",
            "Get NoteTemplateDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveNoteTemplate(notetemplate): Observable<Notetemplate> {
    // return this.httpClient
    //   .post<Notetemplate>(
    //     this.serviceEndpoint + "NoteTemplate/Save",
    //     notetemplate,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    // console.log(notetemplate);
    var objnotetemplate = new Notetemplate();
    objnotetemplate = JSON.parse(notetemplate);
    var strnotetemplate =
      objnotetemplate.nnoteid +
      "|" +
      objnotetemplate.snotetitle +
      "|" +
      objnotetemplate.snotetext +
      "|" +
      objnotetemplate.nnoteparametercount +
      "|" +
      objnotetemplate.bisactive +
      "|" +
      objnotetemplate.createdby +
      "|" +
      objnotetemplate.screatedusername +
      "|" +
      objnotetemplate.createdon +
      "|" +
      objnotetemplate.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "notetemplate";
    clskeys.keyvalue = strnotetemplate;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Notetemplate>(
        this.serviceEndpoint + "NoteTemplate/Save",
        notetemplate,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save NoteTemplate details successfully";
            DetailMessage = this.LogMessage(
              "Notetemplate",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "NoteTemplate details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveNoteTemplate",
            "POST",
            "Save NoteTemplateDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateNoteTemplate(id: number, notetemplate): Observable<Notetemplate> {
    // return this.httpClient
    //   .put<Notetemplate>(
    //     this.serviceEndpoint + "NoteTemplate/Update",
    //     notetemplate,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objnotetemplate = new Notetemplate();
    objnotetemplate = JSON.parse(notetemplate);
    var strnotetemplate =
      objnotetemplate.nnoteid +
      "|" +
      objnotetemplate.snotetitle +
      "|" +
      objnotetemplate.snotetext +
      "|" +
      objnotetemplate.nnoteparametercount +
      "|" +
      objnotetemplate.bisactive +
      "|" +
      objnotetemplate.createdby +
      "|" +
      objnotetemplate.screatedusername +
      "|" +
      objnotetemplate.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "notetemplate";
    clskeys.keyvalue = strnotetemplate;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Notetemplate>(
        this.serviceEndpoint + "NoteTemplate/Update",
        notetemplate,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update NoteTemplate details successfully";
            DetailMessage = this.LogMessage(
              "Notetemplate",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "NoteTemplate details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateNoteTemplate",
            "PUT",
            "Update NoteTemplatedetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateNoteTemplateStatus(id: number, notetemplate): Observable<Notetemplate> {
    // return this.httpClient
    //   .put<Notetemplate>(
    //     this.serviceEndpoint + "NoteTemplate/UpdateStatus",
    //     notetemplate,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objnotetemplate = new Notetemplate();
    objnotetemplate = JSON.parse(notetemplate);
    var strnotetemplate =
      objnotetemplate.nnoteid + "|" + objnotetemplate.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "notetemplate";
    clskeys.keyvalue = strnotetemplate;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Notetemplate>(
        this.serviceEndpoint + "NoteTemplate/UpdateStatus",
        notetemplate,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update NoteTemplate status successfully";
            DetailMessage = this.LogMessage(
              "Notetemplate status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "NoteTemplate status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateNoteTemplateStatus",
            "PUT",
            "Update NoteTemplatestatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteNoteTemplate(id: number) {
    return this.httpClient
      .delete(
        this.serviceEndpoint + "/NoteTemplate/Delete/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getActionsById(id: any, status: number = 0): Observable<Actions[]> {
    // return this.httpClient
    //   .get<Actions[]>(
    //     this.serviceEndpoint + "Action/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var straction = id + "|" + status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "action";
    clskeys.keyvalue = straction;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Actions[]>(
        this.serviceEndpoint + "Action/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Actions details successfully";
          } else {
            DetailMessage = "Actions details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getActionsById",
            "GET",
            "Get ActionsDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveActions(actions): Observable<Actions> {
    // return this.httpClient
    //   .post<Actions>(
    //     this.serviceEndpoint + "Action/Save",
    //     actions,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(actions);
    var objaction = new Actions();
    objaction = JSON.parse(actions);
    var straction =
      objaction.nactionid +
      "|" +
      objaction.sactioncode +
      "|" +
      objaction.sactiondescription +
      "|" +
      objaction.sdisplaycodedesc +
      "|" +
      objaction.bisactive +
      "|" +
      objaction.createdby +
      "|" +
      objaction.screatedusername +
      "|" +
      objaction.createdon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "action";
    clskeys.keyvalue = straction;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Actions>(
        this.serviceEndpoint + "Action/Save",
        actions,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Actions details successfully";
            DetailMessage = this.LogMessage("Action", "saved", Resultdata);
          } else {
            DetailMessage = "Actions details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveActions",
            "POST",
            "Save ActionsDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateActions(id: number, actions): Observable<Actions> {
    // return this.httpClient
    //   .put<Actions>(
    //     this.serviceEndpoint + "Action/Update",
    //     actions,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objaction = new Actions();
    objaction = JSON.parse(actions);
    var straction =
      objaction.nactionid +
      "|" +
      objaction.sactioncode +
      "|" +
      objaction.sactiondescription +
      "|" +
      objaction.sdisplaycodedesc +
      "|" +
      objaction.bisactive +
      "|" +
      objaction.createdby +
      "|" +
      objaction.screatedusername;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "action";
    clskeys.keyvalue = straction;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Actions>(
        this.serviceEndpoint + "Action/Update",
        actions,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Actions details successfully";
            DetailMessage = this.LogMessage("Action", "updated", Resultdata);
          } else {
            DetailMessage = "Actions details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateActions",
            "PUT",
            "Update Actionsdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateActionsStatus(id: number, actions): Observable<Actions> {
    // return this.httpClient
    //   .put<Actions>(
    //     this.serviceEndpoint + "Action/UpdateStatus",
    //     actions,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objaction = new Actions();
    objaction = JSON.parse(actions);
    var straction = objaction.nactionid + "|" + objaction.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "action";
    clskeys.keyvalue = straction;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Actions>(
        this.serviceEndpoint + "Action/UpdateStatus",
        actions,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Actions status successfully";
            DetailMessage = this.LogMessage(
              "Action status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Actions status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateActionsStatus",
            "PUT",
            "Update Actionsstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteActions(id: number) {
    return this.httpClient
      .delete(this.serviceEndpoint + "Action/Delete/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getPayerById(id: any): Observable<Payer[]> {
    // return this.httpClient
    //   .get<Payer[]>(this.serviceEndpoint + "Payer/" + id, this.httpOptions)
    //   .pipe(catchError(this.handleError));
    var strpayer = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payer";
    clskeys.keyvalue = strpayer;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Payer[]>(this.serviceEndpoint + "Payer/" + id, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Payer details successfully";
          } else {
            DetailMessage = "Payer details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getPayerById",
            "GET",
            "Get PayerDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  savePayer(payer): Observable<Payer> {
    // return this.httpClient
    //   .post<Payer>(
    //     this.serviceEndpoint + "Payer/Save",
    //     actions,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(payer);
    var objpayer = new Payer();
    objpayer = JSON.parse(payer);
    var strpayer =
      objpayer.npayerid +
      "|" +
      objpayer.spayername +
      "|" +
      objpayer.bisactive +
      "|" +
      objpayer.createdon +
      "|" +
      objpayer.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payer";
    clskeys.keyvalue = strpayer;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Payer>(this.serviceEndpoint + "Payer/Save", payer, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Payer details successfully";
            DetailMessage = this.LogMessage("Payer", "saved", Resultdata);
          } else {
            DetailMessage = "Payer details not saved";
          }
          this.SaveLogs(
            "INFO",
            "savePayer",
            "POST",
            "Save PayerDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updatePayer(id: number, payer): Observable<Payer> {
    // return this.httpClient
    //   .put<Payer>(
    //     this.serviceEndpoint + "Payer/Update",
    //     payer,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objpayer = new Payer();
    objpayer = JSON.parse(payer);
    var strpayer =
      objpayer.npayerid +
      "|" +
      objpayer.spayername +
      "|" +
      objpayer.bisactive +
      "|" +
      objpayer.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payer";
    clskeys.keyvalue = strpayer;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payer>(
        this.serviceEndpoint + "Payer/Update",
        payer,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payer details successfully";
            DetailMessage = this.LogMessage("Payer", "updated", Resultdata);
          } else {
            DetailMessage = "Payer details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updatePayer",
            "PUT",
            "Update Payerdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updatePayerStatus(id: number, payer): Observable<Payer> {
    // return this.httpClient
    //   .put<Payer>(
    //     this.serviceEndpoint + "Payer/UpdateStatus",
    //     payer,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objpayer = new Payer();
    objpayer = JSON.parse(payer);
    var strpayer = objpayer.npayerid + "|" + objpayer.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payer";
    clskeys.keyvalue = strpayer;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payer>(
        this.serviceEndpoint + "Payer/UpdateStatus",
        payer,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payer status successfully";
            DetailMessage = this.LogMessage(
              "Payer status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Payer status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updatePayerStatus",
            "PUT",
            "Update Payerstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deletePayer(id: number) {
    return this.httpClient
      .delete(this.serviceEndpoint + "Payer/Delete/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getPayercrosswalkById(
    id: any,
    status: any,
    page: number = 0,
    size: number = this.clsUtility.pagesize
  ): Observable<any> {
    // return this.httpClient
    //   .get<Payercrosswalk[]>(
    //     this.serviceEndpoint + "CrossPayers/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strpayercrosswalk = id + "|" + status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payercrosswalk";
    clskeys.keyvalue = strpayercrosswalk;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<any>(
        this.serviceEndpoint +
          "CrossPayers/" +
          id +
          "/" +
          status +
          "?page=" +
          page +
          "&size=" +
          size,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Payercrosswalk details successfully";
          } else {
            DetailMessage = "Payercrosswalk details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getPayercrosswalkById",
            "GET",
            "Get PayercrosswalkDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  savePayercrosswalk(payercrosswalk): Observable<Payercrosswalk> {
    // return this.httpClient
    //   .post<Payercrosswalk>(
    //     this.serviceEndpoint + "CrossPayers/Save",
    //     payercrosswalk,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(payercrosswalk);
    var objpayercrosswalk = new Payercrosswalk();
    objpayercrosswalk = JSON.parse(payercrosswalk);
    var strpayercrosswalk =
      objpayercrosswalk.crosswalkid +
      "|" +
      objpayercrosswalk.clientid +
      "|" +
      objpayercrosswalk.payerid +
      "|" +
      objpayercrosswalk.payername +
      "|" +
      objpayercrosswalk.filepayername +
      "|" +
      objpayercrosswalk.bisactive +
      "|" +
      objpayercrosswalk.createdon +
      "|" +
      objpayercrosswalk.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payercrossawlk";
    clskeys.keyvalue = strpayercrosswalk;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Payercrosswalk>(
        this.serviceEndpoint + "CrossPayers/Save",
        payercrosswalk,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Payercrosswalk details successfully";
            DetailMessage = this.LogMessage(
              "Payercrossawlk",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "Payercrosswalk details not saved";
          }
          this.SaveLogs(
            "INFO",
            "savePayercrosswalk",
            "POST",
            "Save PayerDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updatePayercrosswalk(id: number, payercrosswalk): Observable<Payercrosswalk> {
    // return this.httpClient
    //   .put<Payercrosswalk>(
    //     this.serviceEndpoint + "CrossPayers/Update",
    //     payercrosswalk,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objpayercrosswalk = new Payercrosswalk();
    objpayercrosswalk = JSON.parse(payercrosswalk);
    var strpayercrosswalk =
      objpayercrosswalk.crosswalkid +
      "|" +
      objpayercrosswalk.clientid +
      "|" +
      objpayercrosswalk.payerid +
      "|" +
      objpayercrosswalk.payername +
      "|" +
      objpayercrosswalk.filepayername +
      "|" +
      objpayercrosswalk.bisactive +
      "|" +
      objpayercrosswalk.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payercrossawlk";
    clskeys.keyvalue = strpayercrosswalk;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payercrosswalk>(
        this.serviceEndpoint + "CrossPayers/Update",
        payercrosswalk,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payercrosswalk details successfully";
            DetailMessage = this.LogMessage(
              "Payercrosswalk",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Payercrosswalk details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updatePayercrosswalk",
            "PUT",
            "Update Payercrosswalkdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updatePayercrosswalkStatus(
    id: number,
    payercrosswalk
  ): Observable<Payercrosswalk> {
    // return this.httpClient
    //   .put<Payercrosswalk>(
    //     this.serviceEndpoint + "CrossPayers/UpdateStatus",
    //     payercrosswalk,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objpayercrosswalk = new Payercrosswalk();
    objpayercrosswalk = JSON.parse(payercrosswalk);
    var strpayercrosswalk =
      objpayercrosswalk.crosswalkid + "|" + objpayercrosswalk.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "payercrosswalk";
    clskeys.keyvalue = strpayercrosswalk;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payercrosswalk>(
        this.serviceEndpoint + "CrossPayers/UpdateStatus",
        payercrosswalk,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payercrosswalk status successfully";
            DetailMessage = this.LogMessage(
              "Payercrosswalk status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Payercrosswalk status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updatePayercrosswalkStatus",
            "PUT",
            "Update Payercrosswalkstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deletePayercrosswalk(id: number) {
    return this.httpClient
      .delete(
        this.serviceEndpoint + "CrossPayers/Delete/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getClientUserMappingById(id: any): Observable<Clientusermapping[]> {
    // return this.httpClient
    //   .get<Clientusermapping[]>(
    //     this.serviceEndpoint + "ClientUser/" + id,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strclientusermapping = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientusermapping";
    clskeys.keyvalue = strclientusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Clientusermapping[]>(
        this.serviceEndpoint + "ClientUser/" + id,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get ClientUserMapping details successfully";
          } else {
            DetailMessage = "ClientUserMapping details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getClientUserMappingById",
            "GET",
            "Get ClientUserMappingDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveClientUserMapping(clientuser): Observable<Clientusermapping> {
    // return this.httpClient
    //   .post<Clientusermapping>(
    //     this.serviceEndpoint + "ClientUser/Save",
    //     clientuser,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(clientuser);
    var objclientusermapping = new Clientusermapping();
    objclientusermapping = JSON.parse(clientuser);
    var strclientusermapping =
      objclientusermapping.nmappingid +
      "|" +
      objclientusermapping.nclientid +
      "|" +
      objclientusermapping.nuserid +
      "|" +
      objclientusermapping.status +
      "|" +
      objclientusermapping.createdby +
      "|" +
      objclientusermapping.createdon +
      "|" +
      objclientusermapping.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientusermapping";
    clskeys.keyvalue = strclientusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Clientusermapping>(
        this.serviceEndpoint + "ClientUser/Save",
        clientuser,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save ClientUserMapping details successfully";
            DetailMessage = this.LogMessage(
              "ClientUserMapping",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "ClientUserMapping details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveClientUserMapping",
            "POST",
            "Save PayerDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientUserMapping(
    id: number,
    clientuser
  ): Observable<Clientusermapping> {
    // return this.httpClient
    //   .put<Clientusermapping>(
    //     this.serviceEndpoint + "ClientUser/Update",
    //     clientuser,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objclientusermapping = new Clientusermapping();
    objclientusermapping = JSON.parse(clientuser);
    var strclientusermapping =
      objclientusermapping.nmappingid +
      "|" +
      objclientusermapping.nclientid +
      "|" +
      objclientusermapping.nuserid +
      "|" +
      objclientusermapping.status +
      "|" +
      objclientusermapping.createdby +
      "|" +
      objclientusermapping.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientusermapping";
    clskeys.keyvalue = strclientusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Clientusermapping>(
        this.serviceEndpoint + "ClientUser/Update",
        clientuser,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update ClientUserMapping details successfully";
            DetailMessage = this.LogMessage(
              "ClientUserMapping",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "ClientUserMapping details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientUserMapping",
            "PUT",
            "Update ClientUserMappingdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientUserMappingStatus(
    id: number,
    clientuser
  ): Observable<Clientusermapping> {
    // return this.httpClient
    //   .put<Clientusermapping>(
    //     this.serviceEndpoint + "ClientUser/UpdateStatus",
    //     clientuser,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objclientusermapping = new Clientusermapping();
    objclientusermapping = JSON.parse(clientuser);
    var strclientusermapping =
      objclientusermapping.nmappingid + "|" + objclientusermapping.status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientusermapping";
    clskeys.keyvalue = strclientusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Clientusermapping>(
        this.serviceEndpoint + "ClientUser/UpdateStatus",
        clientuser,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update ClientUserMapping status successfully";
            DetailMessage = this.LogMessage(
              "ClientUserMapping status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "ClientUserMapping status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientUserMappingStatus",
            "PUT",
            "Update ClientUserMappingstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  deleteClientLogin(id: number) {
    return this.httpClient
      .delete(
        this.serviceEndpoint + "LoginDetails/Delete/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getQConstrueParserServiceStatus() {
    return this.httpClient
      .get<any[]>(
        this.serviceEndpoint + "QConstrueScheduler/Status",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postQConstrueParserServiceStatus(status: any) {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "QConstrueScheduler/StartScheduler/" + status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // getErrortypeById(id: any, status: number = 0): Observable<Errorcode[]> {
  //   return this.httpClient.get<Errorcode[]>(this.serviceEndpoint + 'Errortype/' + id + '/' + status, this.httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  saveErrortype(errortype): Observable<Errorcode> {
    // return this.httpClient
    //   .post<Errorcode>(
    //     this.serviceEndpoint + "ErrorType/Save",
    //     errortype,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    // console.log(errortype);
    var objerrortype = new Errorcode();
    objerrortype = JSON.parse(errortype);
    var strerrortype =
      objerrortype.nerrorid +
      "|" +
      objerrortype.serrordescription +
      "|" +
      objerrortype.bisactive +
      "|" +
      objerrortype.createdby +
      "|" +
      objerrortype.createdbyname +
      "|" +
      objerrortype.bissystemdefined +
      "|" +
      objerrortype.createdon +
      "|" +
      objerrortype.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "errortype";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Errorcode>(
        this.serviceEndpoint + "ErrorType/Save",
        errortype,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Errortype details successfully";
            DetailMessage = this.LogMessage("Errotype", "saved", Resultdata);
          } else {
            DetailMessage = "Errortype details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveErrortype",
            "POST",
            "Save ErrortypeDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateErrortype(id: number, errortype): Observable<Errorcode> {
    // return this.httpClient
    //   .put<Errorcode>(
    //     this.serviceEndpoint + "ErrorType/Update",
    //     errortype,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objerrortype = new Errorcode();
    objerrortype = JSON.parse(errortype);
    var strerrortype =
      objerrortype.nerrorid +
      "|" +
      objerrortype.serrordescription +
      "|" +
      objerrortype.bisactive +
      "|" +
      objerrortype.createdby +
      "|" +
      objerrortype.createdbyname +
      "|" +
      objerrortype.bissystemdefined +
      "|" +
      objerrortype.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "errortype";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Errorcode>(
        this.serviceEndpoint + "ErrorType/Update",
        errortype,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Errortype details successfully";
            DetailMessage = this.LogMessage("Errortype", "updated", Resultdata);
          } else {
            DetailMessage = "Errortype details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateErrortype",
            "PUT",
            "Update Errortypedetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateErrortypeStatus(id: number, errortype): Observable<Errorcode> {
    // return this.httpClient
    //   .put<Errorcode>(
    //     this.serviceEndpoint + "ErrorType/UpdateStatus",
    //     errortype,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var objerrortype = new Errorcode();
    objerrortype = JSON.parse(errortype);
    var strerrortype = objerrortype.nerrorid + "|" + objerrortype.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "errortype";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Errorcode>(
        this.serviceEndpoint + "ErrorType/UpdateStatus",
        errortype,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Errortype status successfully";
            DetailMessage = this.LogMessage(
              "Errortype status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Errortype status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateErrortypeStatus",
            "PUT",
            "Update Errortypestatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getClientLoginById(id: any): Observable<Clientlogin[]> {
    // return this.httpClient
    //   .get<Clientlogin[]>(
    //     this.serviceEndpoint + "LoginDetails/" + id,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    var strclientlogin = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientlogin";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Clientlogin[]>(
        this.serviceEndpoint + "LoginDetails/" + id,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get ClientLogin details successfully";
          } else {
            DetailMessage = "ClientLogin details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getClientLoginById",
            "POST",
            "Save ClientLoginDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveClientLogin(client): Observable<Clientlogin> {
    // return this.httpClient
    //   .post<Clientlogin>(
    //     this.serviceEndpoint + "LoginDetails/Save",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(client);
    var objclientlogin = new Clientlogin();
    objclientlogin = JSON.parse(client);
    var strclientlogin =
      objclientlogin.nloginid +
      "|" +
      objclientlogin.nclientid +
      "|" +
      objclientlogin.npayerid +
      "|" +
      objclientlogin.nproviderid +
      "|" +
      objclientlogin.nupdatetoid +
      "|" +
      objclientlogin.supdatetousername +
      "|" +
      objclientlogin.sloginusing +
      "|" +
      objclientlogin.createdon +
      "|" +
      objclientlogin.modifiedon +
      "|" +
      objclientlogin.sloginname +
      "|" +
      objclientlogin.spassword +
      "|" +
      objclientlogin.sloginemailid +
      "|" +
      objclientlogin.sloginemailpassword +
      "|" +
      objclientlogin.dtloginstartdate +
      "|" +
      objclientlogin.dtloginendate +
      "|" +
      objclientlogin.bisactivelogin;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "errortype";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Clientlogin>(
        this.serviceEndpoint + "LoginDetails/Save",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save ClientLogin details successfully";
            DetailMessage = this.LogMessage("ClientLogin", "saved", Resultdata);
          } else {
            DetailMessage = "ClientLogin details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveClientLogin",
            "POST",
            "Save ClientLoginDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientLogin(id: number, client): Observable<Clientlogin> {
    // return this.httpClient
    //   .put<Clientlogin>(
    //     this.serviceEndpoint + "LoginDetails/Update",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objclientlogin = new Clientlogin();
    objclientlogin = JSON.parse(client);
    var strclientlogin =
      objclientlogin.nloginid +
      "|" +
      objclientlogin.nclientid +
      "|" +
      objclientlogin.npayerid +
      "|" +
      objclientlogin.nproviderid +
      "|" +
      objclientlogin.nupdatetoid +
      "|" +
      objclientlogin.supdatetousername +
      "|" +
      objclientlogin.sloginusing +
      "|" +
      objclientlogin.modifiedon +
      "|" +
      objclientlogin.sloginname +
      "|" +
      objclientlogin.spassword +
      "|" +
      objclientlogin.sloginemailid +
      "|" +
      objclientlogin.sloginemailpassword +
      "|" +
      objclientlogin.dtloginstartdate +
      "|" +
      objclientlogin.dtloginendate +
      "|" +
      objclientlogin.bisactivelogin;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "errortype";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Clientlogin>(
        this.serviceEndpoint + "LoginDetails/Update",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update ClientLogin details successfully";
            DetailMessage = this.LogMessage(
              "ClientLogin",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "ClientLogin details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientLogin",
            "PUT",
            "Update ClientLogindetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateClientLoginStatus(id: number, client): Observable<Clientlogin> {
    // return this.httpClient
    //   .put<Clientlogin>(
    //     this.serviceEndpoint + "LoginDetails/UpdateStatus",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objclientlogin = new Clientlogin();
    objclientlogin = JSON.parse(client);
    var strclientlogin =
      objclientlogin.nloginid + "|" + objclientlogin.bisactivelogin;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "clientlogin";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Clientlogin>(
        this.serviceEndpoint + "LoginDetails/UpdateStatus",
        client,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update ClientLogin status successfully";
            DetailMessage = this.LogMessage(
              "ClientLogin status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "ClientLogin status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateClientLoginStatus",
            "PUT",
            "Update ClientLoginstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getDBDetails(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(this.serviceEndpoint + "DBDetails/", this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getQsuiteUserMappingById(id: any): Observable<Qsuiteusermapping[]> {
    // return this.httpClient
    //   .get<Qsuiteusermapping[]>(
    //     this.serviceEndpoint + "QsuitUserMapping/" + id,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strqsuiteusermapping = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "qsuiteusermapping";
    clskeys.keyvalue = strqsuiteusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Qsuiteusermapping[]>(
        this.serviceEndpoint + "QsuitUserMapping/" + id,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get QsuiteUserMapping details successfully";
          } else {
            DetailMessage = "QsuiteUserMapping details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getQsuiteUserMappingById",
            "POST",
            "Save QsuiteUserMappingDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveQsuiteUserMapping(qsuiteuser): Observable<Qsuiteusermapping> {
    // return this.httpClient
    //   .post<Qsuiteusermapping>(
    //     this.serviceEndpoint + "QsuitUserMapping/Save",
    //     qsuiteuser,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    // console.log(qsuiteuser);
    var objqsuiteusermapping = new Qsuiteusermapping();
    objqsuiteusermapping = JSON.parse(qsuiteuser);
    var strqsuiteusermapping =
      objqsuiteusermapping.nmappingid +
      "|" +
      objqsuiteusermapping.nclientid +
      "|" +
      objqsuiteusermapping.userid +
      "|" +
      objqsuiteusermapping.sausid +
      "|" +
      objqsuiteusermapping.sdatabasename +
      "|" +
      objqsuiteusermapping.qsuiteloginname +
      "|" +
      objqsuiteusermapping.createdon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "qsuiteusermapping";
    clskeys.keyvalue = strqsuiteusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Qsuiteusermapping>(
        this.serviceEndpoint + "QsuitUserMapping/Save",
        qsuiteuser,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save QsuiteUserMapping details successfully";
            DetailMessage = this.LogMessage(
              "QsuiteUserMapping",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "QsuiteUserMapping details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveQsuiteUserMapping",
            "POST",
            "Save QsuiteUserMappingDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateQsuiteUserMapping(qsuiteuser): Observable<Qsuiteusermapping> {
    // return this.httpClient
    //   .put<Qsuiteusermapping>(
    //     this.serviceEndpoint + "QsuitUserMapping/Update",
    //     qsuiteuser,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objqsuiteusermapping = new Qsuiteusermapping();
    objqsuiteusermapping = JSON.parse(qsuiteuser);
    var strqsuiteusermapping =
      objqsuiteusermapping.nmappingid +
      "|" +
      objqsuiteusermapping.nclientid +
      "|" +
      objqsuiteusermapping.userid +
      "|" +
      objqsuiteusermapping.sausid +
      "|" +
      objqsuiteusermapping.sdatabasename +
      "|" +
      objqsuiteusermapping.qsuiteloginname;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "qsuiteusermapping";
    clskeys.keyvalue = strqsuiteusermapping;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Qsuiteusermapping>(
        this.serviceEndpoint + "QsuitUserMapping/Update",
        qsuiteuser,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update QsuiteUserMapping details successfully";
            DetailMessage = this.LogMessage(
              "QsuiteUserMapping",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "QsuiteUserMapping details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateQsuiteUserMapping",
            "PUT",
            "Update QsuiteUserMappingdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getFtpdetailsById(id: any): Observable<Ftpdetails[]> {
    // return this.httpClient
    //   .get<Ftpdetails[]>(this.serviceEndpoint + "FTP/" + id, this.httpOptions)
    //   .pipe(catchError(this.handleError));
    var strftp = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftpdetails";
    clskeys.keyvalue = strftp;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Ftpdetails[]>(this.serviceEndpoint + "FTP/" + id, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Ftpdetails details successfully";
          } else {
            DetailMessage = "Ftpdetails details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getFtpdetailsById",
            "POST",
            "Save FtpdetailsDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveFtpdetails(ftp): Observable<Ftpdetails> {
    // return this.httpClient
    //   .post<Ftpdetails>(
    //     this.serviceEndpoint + "FTP/Save",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(ftp);
    var objftp = new Ftpdetails();
    objftp = JSON.parse(ftp);
    var strftp =
      objftp.nsfptid +
      "|" +
      objftp.sftphost +
      "|" +
      objftp.sftpport +
      "|" +
      objftp.sftpuser +
      "|" +
      objftp.sftppass +
      "|" +
      objftp.sftpworkingdir +
      "|" +
      objftp.sftpname +
      "|" +
      objftp.status +
      "|" +
      objftp.createdon +
      "|" +
      objftp.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftp";
    clskeys.keyvalue = strftp;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Ftpdetails>(
        this.serviceEndpoint + "FTP/Save",
        ftp,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Ftpdetails details successfully";
            DetailMessage = this.LogMessage("Ftpdetails", "saved", Resultdata);
          } else {
            DetailMessage = "Ftpdetails details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveFtpdetails",
            "POST",
            "Save FtpdetailsDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateFtpdetails(ftp): Observable<Ftpdetails> {
    // return this.httpClient
    //   .put<Ftpdetails>(
    //     this.serviceEndpoint + "FTP/Update",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objftp = new Ftpdetails();
    objftp = JSON.parse(ftp);
    var strftp =
      objftp.nsfptid +
      "|" +
      objftp.sftphost +
      "|" +
      objftp.sftpport +
      "|" +
      objftp.sftpuser +
      "|" +
      objftp.sftppass +
      "|" +
      objftp.sftpworkingdir +
      "|" +
      objftp.sftpname +
      "|" +
      objftp.status +
      "|" +
      objftp.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftp";
    clskeys.keyvalue = strftp;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Ftpdetails>(
        this.serviceEndpoint + "FTP/Update",
        ftp,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Ftpdetails details successfully";
            DetailMessage = this.LogMessage(
              "Ftpdetails",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Ftpdetails details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateFtpdetails",
            "PUT",
            "Update Ftpdetailsdetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateFtpdetailsStatus(id: number, ftp): Observable<Ftpdetails> {
    // return this.httpClient
    //   .put<Ftpdetails>(
    //     this.serviceEndpoint + "FTP/UpdateStatus",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objftp = new Ftpdetails();
    objftp = JSON.parse(ftp);
    var strclientlogin = objftp.nsfptid + "|" + objftp.status;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftp";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Ftpdetails>(
        this.serviceEndpoint + "FTP/UpdateStatus",
        ftp,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Ftpdetails status successfully";
            DetailMessage = this.LogMessage(
              "Ftpdetails status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Ftpdetails status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateFtpdetailsStatus",
            "PUT",
            "Update Ftpdetailsstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }
  CheckFtpExists(ftp): Observable<Ftpdetails> {
    // return this.httpClient
    //   .post<Ftpdetails>(
    //     this.serviceEndpoint + "FTP/Save",
    //     client,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(ftp);
    var objftp = new Ftpdetails();
    objftp = JSON.parse(ftp);
    var strftp =
      objftp.nsfptid +
      "|" +
      objftp.sftphost +
      "|" +
      objftp.sftpport +
      "|" +
      objftp.sftpuser +
      "|" +
      objftp.sftppass +
      "|" +
      objftp.sftpworkingdir +
      "|" +
      objftp.sftpname +
      "|" +
      objftp.status +
      "|" +
      objftp.createdon +
      "|" +
      objftp.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftp";
    clskeys.keyvalue = strftp;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Ftpdetails>(
        this.serviceEndpoint + "FTP/ConnectionExist",
        ftp,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Ftpdetails details successfully";
            DetailMessage = this.LogMessage(
              "Ftp",
              "connection exist",
              Resultdata
            );
          } else {
            DetailMessage = "Ftp connection not exist";
          }
          this.SaveLogs(
            "INFO",
            "CheckFtpExists",
            "POST",
            "Check FtpExists",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }
  getFollowupById(id: any, status: number = 0): Observable<Followup[]> {
    // return this.httpClient
    //   .get<Followup[]>(
    //     this.serviceEndpoint + "FollowupActionMaster/" + id + "/" + status,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var strfollowup = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "followup";
    clskeys.keyvalue = strfollowup;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<Followup[]>(
        this.serviceEndpoint + "FollowupActionMaster/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Followup details successfully";
          } else {
            DetailMessage = "Followup details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getFollowupById",
            "POST",
            "Save FollowupDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveFollowup(followup): Observable<Followup> {
    // return this.httpClient
    //   .post<Followup>(
    //     this.serviceEndpoint + "FollowupActionMaster/Save",
    //     followup,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(followup);
    var objfollowup = new Followup();
    objfollowup = JSON.parse(followup);
    var strfollowup =
      objfollowup.id +
      "|" +
      objfollowup.actioncode +
      "|" +
      objfollowup.actiondescription +
      "|" +
      objfollowup.displayaction +
      "|" +
      objfollowup.bisactive;
    "|" + objfollowup.createdon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "followup";
    clskeys.keyvalue = strfollowup;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Followup>(
        this.serviceEndpoint + "FollowupActionMaster/Save",
        followup,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Followup details successfully";
            DetailMessage = this.LogMessage("Followup", "saved", Resultdata);
          } else {
            DetailMessage = "Followup details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveFollowup",
            "POST",
            "Save FollowupDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateFollowupStatus(id: number, followup): Observable<Followup> {
    // return this.httpClient
    //   .put<Followup>(
    //     this.serviceEndpoint + "FollowupActionMaster/UpdateStatus",
    //     followup,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objfollowup = new Followup();
    objfollowup = JSON.parse(followup);
    var strclientlogin = objfollowup.id + "|" + objfollowup.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "followup";
    clskeys.keyvalue = strclientlogin;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Followup>(
        this.serviceEndpoint + "FollowupActionMaster/UpdateStatus",
        followup,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update FollowupStatus status successfully";
            DetailMessage = this.LogMessage(
              "Followup status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "FollowupStatus status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateFollowupStatus",
            "PUT",
            "Update FollowupStatusstatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getMailByid(id: any): Observable<MailRetrive[]> {
    var strmailconfiguration = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "mailconfiguration";
    clskeys.keyvalue = strmailconfiguration;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<MailRetrive[]>(
        this.serviceEndpoint + "EmailConfiguration/" + id,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          // var outmail: MailRetrive[] = [];
          // for (const mail of data) {
          //   var mailretrive: MailRetrive = new MailRetrive();
          //   mailretrive.configid = mail.configid;
          //   mailretrive.userid = mail.userid;
          //   mailretrive.username = mail.username;
          //   mailretrive.title = mail.title;
          //   mailretrive.frompassword = mail.frompassword;
          //   mailretrive.emailfrom = mail.emailfrom;
          //   mailretrive.emailto = mail.emailto;
          //   mailretrive.emailcc = mail.emailcc;
          //   for (const email of mail.emailto) {
          //     var emailformat: MailInput = new MailInput();
          //     emailformat = email;
          //     mailretrive.semailto.push(email.Email);
          //     emailformat = null;
          //   }
          //   if (mail.emailcc.length > 0) {
          //     for (const email of mail.emailcc) {
          //       var emailformat: MailInput = new MailInput();
          //       emailformat = email;
          //       mailretrive.semailcc.push(email.Email);
          //       emailformat = null;
          //     }
          //   }
          //   outmail.push(mailretrive);
          // }

          // if (data.length > 1) {
          //   Resultdata = outmail;
          // } else {
          //   Resultdata = data;
          // }
          Resultdata = data;
          // console.log(data);

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Mail Configuration details successfully";
          } else {
            DetailMessage = "Mail Configuration details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getMailByid",
            "POST",
            "Get MailConfigurationDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  saveMail(Mail): Observable<MailSave> {
    var objmail = new MailSave();
    objmail = JSON.parse(Mail);
    var strftp =
      objmail.title +
      "|" +
      objmail.username +
      "|" +
      objmail.frompassword +
      "|" +
      objmail.emailto +
      "|" +
      objmail.emailcc +
      "|" +
      objmail.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "ftp";
    clskeys.keyvalue = strftp;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Ftpdetails>(
        this.serviceEndpoint + "EmailConfiguration/Save",
        Mail,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = this.LogMessage(
              "MailConfiguration",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "MailConfiguration details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveMail",
            "POST",
            "Save MailConfiguration",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateMail(Mail): Observable<MailSave> {
    var objmail = new MailSave();
    objmail = JSON.parse(Mail);
    var strmailconfiguration =
      objmail.title +
      "|" +
      objmail.username +
      "|" +
      objmail.frompassword +
      "|" +
      objmail.emailto +
      "|" +
      objmail.emailcc +
      "|" +
      objmail.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "mailconfiguration";
    clskeys.keyvalue = strmailconfiguration;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Ftpdetails>(
        this.serviceEndpoint + "EmailConfiguration/Update",
        Mail,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = this.LogMessage(
              "MailConfiguration",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "MailConfiguration details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateMailByid",
            "PUT",
            "Update MailConfiguration",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getMailByTitle(Title) {
    var strmailconfiguration = Title;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "mailconfiguration";
    clskeys.keyvalue = strmailconfiguration;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<MailRetrive[]>(
        this.serviceEndpoint + "EmailConfigurationByTitle/" + Title,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;
          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Mail Configuration details successfully";
          } else {
            DetailMessage = "Mail Configuration details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "getMailByTitle",
            "POST",
            "Get MailConfigurationDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getRuleCategory(): Observable<any> {
    // var RuleCategory: any = [
    //   { id: "188d475a-df75-11e9-ae93-42010a8f8009", value: "Authorization" },
    //   { id: "1e42e146-df75-11e9-ae93-42010a8f8009", value: "Provider" },
    //   { id: "2280f1ee-df75-11e9-ae93-42010a8f8009", value: "Insurance" }
    // ];
    // return RuleCategory;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "rule category";
    clskeys.keyvalue = "0";
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<any[]>(this.serviceEndpoint + "RuleCategory", this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;
          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Rule category details successfully";
          } else {
            DetailMessage = "Rule category details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "RuleCategory",
            "Get",
            "Get Rule category list",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  getRuleByid(id: any): Observable<any[]> {
    var strRule = id;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "Rule List";
    clskeys.keyvalue = strRule;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .get<any[]>(this.serviceEndpoint + "Rule/" + id, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;
          // console.log(data);

          if (Resultdata != null || Resultdata != undefined) {
            DetailMessage = "Get Rule details successfully";
          } else {
            DetailMessage = "Rule details not retrived";
          }
          this.SaveLogs(
            "INFO",
            "Rule",
            "Get",
            "Get Rule list",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }
  saveRule(rule): Observable<Payer> {
    // return this.httpClient
    //   .post<Payer>(
    //     this.serviceEndpoint + "Payer/Save",
    //     actions,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));
    // console.log(payer);
    console.log(rule);
    //alert(rule);                                  //saurabh shelar
    var objRule = new Rule();
    objRule = JSON.parse(rule);
    console.log(objRule);
    var strRule =
      objRule.nruleid +
      "|" +
      objRule.nclientid +
      "|" +
      objRule.sclientname +
      "|" +
      objRule.bstatus +
      "|" +
      objRule.userid +
      "|" +
      objRule.susername +
      "|[" +
      objRule.ruledata.ruletitle +
      "|" +
      objRule.ruledata.ruledescription +
      "|[" +
      objRule.ruledata.ruledetails.dosafter +
      "|" +
      objRule.ruledata.ruledetails.dosbefore +
      "|" +
      objRule.ruledata.ruledetails.insurance +
      "|" +
      objRule.ruledata.ruledetails.billingprovider +
      "|" +
      objRule.ruledata.ruledetails.renderingprovider +
      "]" +
      "]|" +
      objRule.createdon +
      "|" +
      objRule.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "Rule details";
    clskeys.keyvalue = strRule;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Payer>(this.serviceEndpoint + "Rule/Save", rule, this.httpOptions)
      .pipe(
        map((data) => {
          Resultdata = data;
          console.log(Resultdata);
          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Payer details successfully";
            DetailMessage = this.LogMessage("Rule", "saved", Resultdata);
          } else {
            DetailMessage = "Rule is not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveRule",
            "POST",
            "Save RuleDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateRule(id: number, payer): Observable<Payer> {
    // return this.httpClient
    //   .put<Payer>(
    //     this.serviceEndpoint + "Payer/Update",
    //     payer,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objRule = new Rule();
    objRule = JSON.parse(payer);
    var strRule =
      objRule.nruleid +
      "|" +
      objRule.nclientid +
      "|" +
      objRule.sclientname +
      "|" +
      objRule.bstatus +
      "|" +
      objRule.userid +
      "|" +
      objRule.susername +
      "|[" +
      objRule.ruledata.ruletitle +
      "|" +
      objRule.ruledata.ruledescription +
      "|[" +
      objRule.ruledata.ruledetails.dosafter +
      "|" +
      objRule.ruledata.ruledetails.dosbefore +
      "|" +
      objRule.ruledata.ruledetails.insurance +
      "|" +
      objRule.ruledata.ruledetails.billingprovider +
      "|" +
      objRule.ruledata.ruledetails.renderingprovider +
      "]" +
      "]|" +
      objRule.createdon +
      "|" +
      objRule.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "Rule";
    clskeys.keyvalue = strRule;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payer>(
        this.serviceEndpoint + "RuleMaster/Update",
        payer,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payer details successfully";
            DetailMessage = this.LogMessage("Rule", "updated", Resultdata);
          } else {
            DetailMessage = "Rule is not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateRule",
            "PUT",
            "Update RuleDetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateRuleStatus(id: number, payer): Observable<Payer> {
    // return this.httpClient
    //   .put<Payer>(
    //     this.serviceEndpoint + "Payer/UpdateStatus",
    //     payer,
    //     this.httpOptions
    //   )
    //   .pipe(catchError(this.handleError));

    var objRule = new Rule();
    objRule = JSON.parse(payer);
    var strRule = objRule.nruleid + "|" + objRule.bstatus;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "Rule";
    clskeys.keyvalue = strRule;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Payer>(
        this.serviceEndpoint + "RuleMaster/UpdateStatus",
        payer,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Payer status successfully";
            DetailMessage = this.LogMessage(
              "Rule status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "Rule status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateRuleStatus",
            "PUT",
            "Update RuleStatus",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  // deleteRule(id: number) {
  //   return this.httpClient
  //     .delete(this.serviceEndpoint + "Payer/Delete/" + id, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  saveAutoamtionError(automationerror): Observable<Automation> {
    var objerrortype = new Automation();
    objerrortype = JSON.parse(automationerror);
    var strerrortype =
      objerrortype.nautomationerrorid +
      "|" +
      objerrortype.sautomationerrordescription +
      "|" +
      objerrortype.bisactive +
      "|" +
      objerrortype.createdby +
      "|" +
      objerrortype.createdbyname +
      "|" +
      objerrortype.bissystemdefined +
      "|" +
      objerrortype.createdon +
      "|" +
      objerrortype.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "AutomationError";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .post<Errorcode>(
        this.serviceEndpoint + "AutomationError/Save",
        automationerror,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Save Errortype details successfully";
            DetailMessage = this.LogMessage(
              "AutomationError",
              "saved",
              Resultdata
            );
          } else {
            DetailMessage = "AutomationError details not saved";
          }
          this.SaveLogs(
            "INFO",
            "saveAutoamtionError",
            "POST",
            "Save AutomationError Details",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateAutoamtionError(id: number, automationerror): Observable<Automation> {
    var objerrortype = new Automation();
    objerrortype = JSON.parse(automationerror);
    var strerrortype =
      objerrortype.nautomationerrorid +
      "|" +
      objerrortype.sautomationerrordescription +
      "|" +
      objerrortype.bisactive +
      "|" +
      objerrortype.createdby +
      "|" +
      objerrortype.createdbyname +
      "|" +
      objerrortype.bissystemdefined +
      "|" +
      objerrortype.createdon +
      "|" +
      objerrortype.modifiedon;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "AutomationError";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Errorcode>(
        this.serviceEndpoint + "AutomationError/Update",
        automationerror,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Errortype details successfully";
            DetailMessage = this.LogMessage(
              "AutomationError",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "AutomationError details not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateAutoamtionError",
            "PUT",
            "Update AutomationErrordetails",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  updateAutoamtionErrorStatus(
    id: number,
    automationerror
  ): Observable<Automation> {
    var objerrortype = new Automation();
    objerrortype = JSON.parse(automationerror);
    var strerrortype =
      objerrortype.nautomationerrorid + "|" + objerrortype.bisactive;

    var clskeys = new keys();
    const clskey: keys[] = [];
    clskeys.keyname = "AutomationError";
    clskeys.keyvalue = strerrortype;
    clskey.push(clskeys);

    var DetailMessage;
    var Resultdata;
    return this.httpClient
      .put<Errorcode>(
        this.serviceEndpoint + "AutomationError/UpdateStatus",
        automationerror,
        this.httpOptions
      )
      .pipe(
        map((data) => {
          Resultdata = data;

          if (Resultdata != null || Resultdata != undefined) {
            // DetailMessage = "Update Errortype status successfully";
            DetailMessage = this.LogMessage(
              "AutomationError status",
              "updated",
              Resultdata
            );
          } else {
            DetailMessage = "AutomationError status not updated";
          }
          this.SaveLogs(
            "INFO",
            "updateAutoamtionErrorStatus",
            "PUT",
            "Update AutomationError",
            DetailMessage,
            clskey
          );

          return Resultdata;
        }),
        catchError(this.handleError)
      );
  }

  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    var errMessage = `${error.message}`;

    if (errMessage.toString().search("ConnectionExist") < 0) {
      window.alert(errorMessage);
    }

    return throwError(errorMessage);
  }

  // SaveLogs(
  //   logLevel,
  //   logMethodname,
  //   logMethodtype,
  //   logMessage,
  //   loginDetails,
  //   logKeyname,
  //   logKeyvalue
  // ) {
  //   try {
  //     const currenttime = this.clsUtility.currentDateTime();
  //     const clskeys = new keys();
  //     const clskey: keys[] = [];

  //     clskeys.keyname = logKeyname;
  //     clskeys.keyvalue = logKeyvalue;
  //     clskey.push(clskeys);

  //     // clskeys.keyname = logKeyname;
  //     // clskeys.keyvalue = logKeyvalue;
  //     // clskey.push(clskeys);

  //     const clsLogs = new Logs();
  //     clsLogs.level = logLevel;
  //     clsLogs.timestamp = currenttime;
  //     clsLogs.methodname = logMethodname;
  //     clsLogs.methodtype = logMethodtype;
  //     clsLogs.message = logMessage;
  //     clsLogs.details = loginDetails;

  //     clsLogs.token = localStorage.getItem("token").toString();
  //     // clskey.push(clskeys);
  //     clsLogs.keys = clskey;
  //     const logobject = {};
  //     logobject["logobject"] = clsLogs;

  //     this.Logservice.saveLogs(logobject).subscribe(
  //       (data: any) => {},
  //       err => {}
  //     );
  //   } catch (error) {}
  // }

  SaveLogs(
    logLevel,
    logMethodname,
    logMethodtype,
    logMessage,
    loginDetails,
    logKeys
  ) {
    try {
      const currenttime = this.clsUtility.currentDateTime();

      // const clskeys = new keys();
      // const clskey: keys[] = [];
      // clskeys.keyname = logKeyname;
      // clskeys.keyvalue = logKeyvalue;
      // clskey.push(clskeys);

      const clsLogs = new Logs();
      clsLogs.level = logLevel;
      clsLogs.timestamp = currenttime;
      clsLogs.methodname = logMethodname;
      clsLogs.methodtype = logMethodtype;
      clsLogs.message = logMessage;
      clsLogs.details = loginDetails;

      clsLogs.token = this.cookieService.get("AID");
      clsLogs.timezone = clsLogs.currentTimeZone;
      // clsLogs.token = localStorage.getItem("token").toString();
      // clskey.push(clskeys);
      // clsLogs.keys = clskey;
      clsLogs.keys = logKeys;
      const logobject = {};
      logobject["logobject"] = clsLogs;

      // this.Logservice.saveLogs(logobject).subscribe(
      //   (data: any) => {},
      //   (err) => {}
      // );
    } catch (error) {}
  }

  LogMessage(Configurationname, Methodname, Result): String {
    try {
      var strMessage;
      if (Result == 1) {
        strMessage = Configurationname + " " + Methodname + " successfully";
      } else if (Result == 2) {
        strMessage = Configurationname + " already registered";
      } else if (Result == 3) {
        strMessage = Configurationname + " cannot be updated alredy in use";
      } else {
        strMessage = Configurationname + " not " + Methodname;
      }
      return strMessage;
    } catch (error) {}
  }

  ////////////////////////////////////

  Getcabinets(): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "DocsVault/cabinate")
      .pipe(catchError(this.handleError));
  }

  Savecabinets(cabinet): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Cabinets/Save",
        cabinet,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  Getfolderdata(externalid: string): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "Cabinets" + "/" + 0)
      .pipe(catchError(this.handleError));
  }

  Getfolders(cabinetId: string): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "Cabinets/Folders/" + cabinetId)
      .pipe(
        tap((ele) => {
          if (ele) {
            ele.map((element) => {
              if (element.createdon)
                element.createdon = moment(element.createdon).format(
                  "MM-DD-YYYY"
                );
              else element.createdon = null;
            });
          }
        }),
        catchError(this.handleError)
      );
  }
  processFolders(foldername: any): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "DocsVault/ProcessFolder/" + foldername
      )
      .pipe(catchError(this.handleError));
  }
  SaveEDocServiceSetting(objEdoc): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "ServiceSettings/Save",
        objEdoc,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  SaveHL7ServiceSetting(objHL7): Observable<any> {
    return this.httpClient
      .put<any>(
        this.serviceEndpoint + "HL/ServiceControl/hl7ScheduledTime/Update",
        objHL7,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  SaveDocUploadServiceSetting(objEdoc): Observable<any> {
    return this.httpClient
      .put<any>(
        this.serviceEndpoint + "HL/ServiceControl/EdocsScheduledTime/Update",
        objEdoc,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  GetEdocServiceSetting(
    id: string,
    settingsname: string = ""
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "ServiceSettings/" +
          id +
          "?settingsname=" +
          settingsname
      )
      .pipe(catchError(this.handleError));
  }

  EdocServiceStatusChanged(flag: boolean): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "FileScheduler/StartScheduler/" + flag,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getEdocServiceStatus(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "FileScheduler/Status",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getSFTPServiceStatus(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "FTPScheduler/Status",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getHL7Control(id: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint + "HL/ServiceControl/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  HL7UpdateStatus(json: any): Observable<any> {
    return this.httpClient
      .put<any>(
        this.serviceEndpoint + "HL/ServiceControl/HLControlStatus/Update",
        json,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateAutomationEdocServiceStatus(json: any) {
    return this.httpClient
      .put<any>(
        this.serviceEndpoint + "HL/ServiceControl/EdocControlStatus/Update",
        json,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateSFTPServiceStatus(flag: boolean) {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "FTPScheduler/StartScheduler/" + flag,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getArchivalServiceStatus() {
    return this.httpClient
      .get<any>(
        this.archivalServiceEndPoint + "OrderqueueArchiveScheduler/Status",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateArchivalServiceStatus(status: boolean) {
    return this.httpClient
      .post<any>(
        this.archivalServiceEndPoint +
          "QConstrueArchiveScheduler/StartScheduler/" +
          status,
        null,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveOrderSubStatus(body: any): Observable<any> {
    return this.httpClient
      .post(
        this.serviceEndpoint + "Document/OrderqueueSubStatus/save",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  UpdateOrderSubStatus(body: any): Observable<any> {
    return this.httpClient
      .post(
        this.serviceEndpoint + "Document/OrderqueueSubStatus/update",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getOrderSubStatus(substatusid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint + "Document/OrderqueueSubStatus/" + substatusid
      )
      .pipe(catchError(this.handleError));
  }
  // getOrderSubStatusByStatusId(statusid:string):Observable<any>{
  //   return this.httpClient.get<any>(this.serviceEndpoint + "Document/OrderqueueSubStatus?statusid="+statusid).pipe(catchError(this.handleError));
  // }
  getOrderNotes(ordernoteid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint + "Document/OrderqueueNoteById/" + ordernoteid
      )
      .pipe(catchError(this.handleError));
  }
  saveOrderNote(body: any): Observable<any> {
    return this.httpClient
      .post(
        this.serviceEndpoint + "Document/OrderqueueNote/save",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateOrderNote(body: any): Observable<any> {
    return this.httpClient
      .post(
        this.serviceEndpoint + "Document/OrderqueueNote/update",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  saveClientDetails(body: any): Observable<any> {
    return this.httpClient
      .post(this.serviceEndpoint + "ClientService/Save", body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  updateClientDetails(body: any): Observable<any> {
    return this.httpClient
      .put(
        this.serviceEndpoint + "ClientService/Update",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getClientDetailsById(clientid: any): Observable<any> {
    return this.httpClient
      .get<any>(this.serviceEndpoint + "ClientService/" + clientid)
      .pipe(catchError(this.handleError));
  }
  save(body: any): Observable<any> {
    return this.httpClient
      .post(
        this.serviceEndpoint + "Document/OrderqueueNote/update",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getClientServiceMaster(): Observable<any> {
    return this.httpClient
      .get<any>(this.serviceEndpoint + "ServicesMaster")
      .pipe(catchError(this.handleError));
  }
  // getInterfaces(accountid: any, interfacecode: string = "0"): Observable<any> {
  //   return this.httpClient
  //     .get<any>(
  //       this.docsServiceEndPoint +
  //         "Account/ByAccountid/" +
  //         accountid +
  //         "/" +
  //         interfacecode
  //     )
  //     .pipe(catchError(this.handleError));
  // }
  getInterfaces(): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "Account/GetInterfaceList/0")
      .pipe(catchError(this.handleError));
  }
  getInterfaceDetails(
    clientid: any,
    interfacecode: string,
    loginid: string,
    rootfolder: string
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Account/ClientByInterfaceCode/" +
          clientid +
          "/" +
          interfacecode +
          "?loginid=" +
          loginid +
          "&rootfolder=" +
          rootfolder
      )
      .pipe(catchError(this.handleError));
  }
  saveInterface(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Account/Save",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateInterface(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Account/Update",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateInterfaceStatus(
    accountid: string,
    status: boolean,
    interfacecode: string = "0",
    body: any //in case of activate/deactivate sftp
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        this.docsServiceEndPoint +
          "Account/UpdateStatus/" +
          accountid +
          "/" +
          status +
          "/" +
          interfacecode,
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  checkIsInterfaceActive(
    clientid: string,
    servicecode: string
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Account/CheckActive/" +
          clientid +
          "/" +
          servicecode
      )
      .pipe(catchError(this.handleError));
  }
  checkIsClientMappedToGroup(clientid: string): Observable<any> {
    return this.httpClient
      .get<any>(this.serviceEndpoint + "Group/Client/Check/" + clientid)
      .pipe(catchError(this.handleError));
  }
  deactivateInterface(clientid: string, status: boolean): Observable<any> {
    return this.httpClient
      .put<any>(
        this.docsServiceEndPoint +
          "Account/UpdateStatusByClientid/" +
          clientid +
          "/" +
          status,
        null,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getInterfacesByClient(clientid: string): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "Account/" + clientid)
      .pipe(catchError(this.handleError));
  }
  getGroupClientMappings(
    groupid: string,
    mappingtypeid: number = 0
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint + "Group/Client/" + groupid + "/" + mappingtypeid
      )
      .pipe(catchError(this.handleError));
  }
  saveGroupClientMappings(inputBody: GroupClientMapping): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "Group/Client/Save",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateGroupClientMappingStatus(
    inputBody: GroupClientMappingStatus
  ): Observable<any> {
    return this.httpClient
      .put<any>(
        this.serviceEndpoint + "Group/Client/UpdateStatus",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getClientProviderMappings(
    clientid: string,
    providernpi: string,
    groupmapping: number = -1,
    page: number = 0,
    pagesize: number = this.clsUtility.pagesize
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint +
          "Practice/ClientRegistrationDetails/" +
          clientid +
          "/" +
          providernpi +
          "/" +
          groupmapping +
          "?page=" +
          page +
          "&size=" +
          pagesize
      )
      .pipe(catchError(this.handleError));
  }
  getClientProviderMappingsDetails(
    clientid: string,
    page: number = 0,
    pagesize: number = this.clsUtility.configPageSize
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.serviceEndpoint + "Practice/ClientRegistration/" + clientid
        // +
        // "?page=" +
        // page +
        // "&size=" +
        // pagesize
      )
      .pipe(catchError(this.handleError));
  }
  saveClientProviderMappings(
    inputBody: ClientProviderMapping
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "Practice/SavePracticeClientMapping",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  // saveGroupClientMappings(inputBody: GroupClientMapping): Observable<any> {
  //   return this.httpClient
  //     .post<any>(
  //       this.serviceEndpoint + "Group/Client/Save",
  //       inputBody,
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }
  // updateGroupClientMappingStatus(
  //   inputBody: GroupClientMappingStatus
  // ): Observable<any> {
  //   return this.httpClient
  //     .put<any>(
  //       this.serviceEndpoint + "Group/Client/UpdateStatus",
  //       inputBody,
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  getPracticeFilterMaster(): Observable<any> {
    return this.httpClient
      .get<any>(this.serviceEndpoint + "Practice/FilterMaster")
      .pipe(catchError(this.handleError));
  }
  updatePracticeClientMasterStatus(
    inputBody: UpdateClientProviderMappingStatus
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "Practice/UpdateStatus/PracticeClientMaster",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updatePracticeProviderStatus(
    inputBody: UpdateClientProviderMappingStatus
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "Practice/UpdateStatus/PracticeProviderDetails",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  validateGroupMapping(inputBody: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "Practice/ValidateGroupMapping",
        inputBody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
