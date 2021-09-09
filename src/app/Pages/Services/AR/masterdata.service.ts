import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Claimadjustmentcode } from "src/app/Model/AR Management/Task/claimadjustmentcode";
import { Claimadjustmentremarkcode } from "src/app/Model/AR Management/Task/claimadjustmentremarkcode";
import { Status } from "src/app/Model/AR Management/Task/status";
import { Action } from "src/app/Model/AR Management/Task/action";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import {
  Task,
  TaskType,
  ScheduleAction,
} from "src/app/Model/AR Management/Task/task";
import { Notetemplate } from "src/app/Model/AR Management/Configuration/notetemplate";
import { Files } from "src/app/Model/AR Management/Files/files";
import { User } from "src/app/Model/Common/login";
import { Errorcode } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { DataTransferService } from "../Common/data-transfer.service";
import { Substatus } from "src/app/Model/AR Management/Configuration/substatus";
import { DailyProductionClose } from "src/app/Model/AR Management/Production/production";
import { Automation } from "src/app/Model/AR Management/Configuration/automation";

@Injectable({
  providedIn: "root",
})
export class MasterdataService {
  coreServiceEndPoint = environment.coreServiceUrl;
  // clientServiceEndpoint = environment.coreServiceUrl+'Client/';
  authServiceEndpoint = environment.authServiceUrl;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  constructor(
    private httpClient: HttpClient,
    private dataService: DataTransferService
  ) {}

  getAllWorkQueue(id: any): Observable<Workgroup[]> {
    // console.log('service: '+this.coreServiceEndPoint);

    return this.httpClient
      .get<Workgroup[]>(
        this.coreServiceEndPoint + "WorkQueueInventory/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllTasks(id: any): Observable<Task[]> {
    // console.log('service: '+this.coreServiceEndPoint);

    return this.httpClient
      .get<Task[]>(this.coreServiceEndPoint + "Task/" + id, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getAllMyTasks(nuserid: any): Observable<Task[]> {
    // console.log('service: '+this.coreServiceEndPoint);

    return this.httpClient
      .get<Task[]>(
        this.coreServiceEndPoint + "Task/User/" + nuserid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getReasonCode(id: any): Observable<Claimadjustmentcode[]> {
    return this.httpClient
      .get<Claimadjustmentcode[]>(
        this.coreServiceEndPoint + "ClaimAdjustmentCode/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getRemarkCode(id: any): Observable<Claimadjustmentremarkcode[]> {
    return this.httpClient
      .get<Claimadjustmentremarkcode[]>(
        this.coreServiceEndPoint + "ClaimAdjustmentRemark/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getStatus(id: any, status: number = 0): Observable<Status[]> {
    return this.httpClient
      .get<Status[]>(
        this.coreServiceEndPoint + "Status/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getSubStatus(id: any, status: number = 0): Observable<Substatus[]> {
    return this.httpClient
      .get<Substatus[]>(
        this.coreServiceEndPoint + "Substatus/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getAction(id: any, status: number = 0): Observable<Action[]> {
    return this.httpClient
      .get<Action[]>(
        this.coreServiceEndPoint + "Action/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getTaskType(): Observable<TaskType[]> {
    return this.httpClient
      .get<TaskType[]>(
        this.coreServiceEndPoint + "TaskType/0",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getScheduleMasterAction(id: any): Observable<ScheduleAction[]> {
    return this.httpClient
      .get<ScheduleAction[]>(
        this.coreServiceEndPoint + "FollowupActionMaster/" + id + "/1",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getNoteTemplate(id: any, status: number = 0): Observable<Notetemplate[]> {
    return this.httpClient
      .get<Notetemplate[]>(
        this.coreServiceEndPoint + "NoteTemplate/" + id + "/" + status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
    // return [
    //   {id:1, notetitle:'REBILL WITH PRIMARY EOB', notetext: 'As per review the claim was billed to {0} So CLD@{1} S/W- {2} said there is no claim on file which was billed on {3} as {4} reprocessed the claim and Left Co-ins.So rep said to rebill the claim with Primary EOB via paper on mailing address {5}. Also, No TFL rep said for Primary EOB. So need assistance to rebill with primary EOB. Refr#-{6}', nparametercount: 6},
    //   {id:2, notetitle:'CLAIM NOT ON FILE', notetext: 'As per review the claim was billed to {0}. So CLD@{1} S/W- {2} said the claim was not on file which was mailed on {3} also verified the mailing address that was correct as per our system as rep said it was mailed on {4} said to take a follow-up after {5} days. So need to follow-up after {6} days.  Refr#- {7}', nparametercount: 7},
    //   {id:3, notetitle:'PROVIDER ISSUE', notetext: 'As per review the claim was billed to {0} So CLD@{1} S/W- {2} said the claim was receive on {3} denied on {4} denied as Provider License # is not listed under the Group TAXID# CLM#-{5}. And no other information was given by rep. Said to rebill the corrected claim TFL-{6} months from DOS. Need assistance. Refr#-  {7}', nparametercount: 7},
    //   // {id:2, notetypedescription:''},
    //   // {id:3, notetypedescription:''},
    //   // {id:4, notetypedescription:''}
    // ]
  }

  getFileDetails(clientid: number, statusid: number): Observable<File[]> {
    return this.httpClient
      .get<File[]>(
        this.coreServiceEndPoint +
          "WorkFile/Filter/" +
          clientid +
          "/" +
          statusid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAgents(userid: number): Observable<User[]> {
    return this.httpClient
      .get<User[]>(
        this.coreServiceEndPoint + "Users/" + userid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  // getUsers(): Observable<User[]> {
  //   return this.httpClient
  //     .get<User[]>(
  //       this.authServiceEndpoint +
  //         "users/" +
  //         this.dataService.applicationCode +
  //         "/0",
  //       this.httpOptions
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  getErrorCode(errorid: number, statusid: number): Observable<Errorcode[]> {
    return this.httpClient
      .get<Errorcode[]>(
        this.coreServiceEndPoint + "ErrorType/" + errorid + "/" + statusid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getdailycloseproduction(inputDate: string): Observable<DailyProductionClose> {
    return this.httpClient
      .get<DailyProductionClose>(
        this.coreServiceEndPoint + "Production/DailyClose/" + inputDate
      )
      .pipe(catchError(this.handleError));
  }

  checkProductionclosed(inputDate: string): Observable<Boolean> {
    return this.httpClient
      .get<Boolean>(
        this.coreServiceEndPoint + "Production/CheckDailyClose/" + inputDate
      )
      .pipe(catchError(this.handleError));
  }
  getAutomationError(
    errorid: number,
    statusid: number
  ): Observable<Automation[]> {
    return this.httpClient
      .get<Automation[]>(
        this.coreServiceEndPoint +
          "AutomationError/" +
          errorid +
          "/" +
          statusid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getClientConfiguration() {
    return [
      {
        clientName: "Thomas P. Martinez",
        address: "3790 Gateway Avenue Bakersfield, CA 93306",
        ausid: "TPM",
        databasename: "MAN01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Jenny F. Smith",
        address: "148 Yorkshire Circle Belvidere, NC 27919",
        ausid: "JFS",
        databasename: "gloWNH",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Pamela S. Posner",
        address: "303 Shadowmar Drive Kenner, LA 70062",
        ausid: "PSP",
        databasename: "VKM01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Tanya T. Kim",
        address: "2323 Graystone Lakes Macon, GA 31201",
        ausid: "TTK",
        databasename: "Bji01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Petra F. Nail",
        address: "4375 Bobcat Drive Washington, MD 20005",
        ausid: "PFN",
        databasename: "MIPHYS01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Alexander A. Young",
        address: "3435 Hemlock Lane Brownsville, TX 78520",
        ausid: "AAY",
        databasename: "gupta01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Jonathan M. Prichard",
        address: "579 O Conner Street Gulfport, MS 39501",
        ausid: "JMP",
        databasename: "BSmith01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Daniel L. Vanbuskirk",
        address: "3678 Hiddenview Drive Philadelphia, PA 19146",
        ausid: "DLV",
        databasename: "TCENM01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Barry M. Waits",
        address: "1543 Stonepot Road Rochelle Park, NJ 07662",
        ausid: "BMW",
        databasename: "cna01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "Debi M. Morales",
        address: "4043 Nutter Street Kansas City, MO 64106",
        ausid: "DMM",
        databasename: "DMM01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
      {
        clientName: "James V. Richardson",
        address: "4240 Bicetown Road New York, NY 10016",
        ausid: "JVR",
        databasename: "JVR01",
        tin: "",
        npi: "",
        qlivedate: "1/2812019",
        arstartdate: "1/2812019",
      },
    ];
  }

  getClient() {
    return [
      { id: 1, value: "Westwood" },
      { id: 2, value: "Happy Family" },
      { id: 3, value: "Millenium Health Practice" },
    ];
  }

  getWorkQueueAge() {
    return [
      { id: 1, value: "0-30" },
      { id: 2, value: "31-60" },
      { id: 3, value: "61-90" },
      { id: 3, value: "91-120" },
      { id: 3, value: "121-180" },
    ];
  }

  getInsurance() {
    return [
      { id: 1, value: "Atena" },
      { id: 2, value: "Medicare" },
      { id: 3, value: "Blue Cross Blue Shild" },
      { id: 4, value: "Blue Cross Blue Shild of MI" },
    ];
  }
  getAutomationStatus() {
    return [
      { id: 1, value: "Paid" },
      { id: 2, value: "Denial" },
      { id: 3, value: "Processing" },
    ];
  }

  getWorkItemStatus() {
    return [
      { id: 1, value: "Assigned" },
      { id: 2, value: "Unssigned" },
    ];
  }

  getProvider() {
    return [
      { id: 1, value: "Mickey Mouse" },
      { id: 2, value: "Donald Duck" },
    ];
  }

  getCPTGroup() {
    return [
      { id: 1, value: "Surgery" },
      { id: 2, value: "Family Practice" },
    ];
  }

  getWorkQueue() {
    return [
      {
        workgroupno: "1",
        workgroupcode: "WG-APR2019-WLC-00001",
        clientcode: "CL-00001",
        insurance: "Medicare",
        patientcode: "GLO92838",
        accountcode: "GLO8888",
        claimnumber: "TLC-1001",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "DENIED",
        isassigned: "false",
      },
      {
        workgroupno: "2",
        workgroupcode: "WG-APR2019-WLC-00002",
        clientcode: "CL-00001",
        insurance: "Medicare",
        patientcode: "GLO92838",
        accountcode: "GLO8888",
        claimnumber: "TLC-1001",
        dos: "04/01/2019",
        insurancedue: "120.2",
        claimageindays: "15",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "PAID",
        isassigned: "true",
      },
      {
        workgroupno: "3",
        workgroupcode: "WG-MAR2019-OSD01-000001",
        clientcode: "CL-00002",
        insurance: "Blue Cross Blue Shield of Michigan",
        patientcode: "RK013832",
        accountcode: "29381",
        claimnumber: "384822",
        dos: "02/15/2019",
        insurancedue: "201.01",
        claimageindays: "34",
        lastworked: "3/15/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "DENIED",
        isassigned: "true",
      },
      {
        workgroupno: "1",
        workgroupcode: "WG-APR2019-WLC-00003",
        clientcode: "CL-00003",
        insurance: "Atena",
        patientcode: "GLO92838",
        accountcode: "GLO8888",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        isassigned: "false",
      },
    ];
  }
  getAgentsList() {
    return [
      {
        id: 45,
        code: "AR-0001",
        name: "Valerie Willis",
        displayname: "AR-0001 : Valerie Willis",
        Rating: 3,
        pendingtasks: 6,
        dailyaverage: 30,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 48,
        code: "AR-0002",
        name: "Darin Collins",
        displayname: "AR-0002 : Darin Collins",
        Rating: 2,
        pendingtasks: 4,
        dailyaverage: 35,
        weekavailibility: 4,
        experience: 2,
      },
      {
        id: 51,
        code: "AR-0003",
        name: "Sanjana Roy",
        displayname: "AR-0003 : Sanjana Roy",
        Rating: 5,
        pendingtasks: 15,
        dailyaverage: 40,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 54,
        code: "AR-0004",
        name: "Rahul Bose",
        displayname: "AR-0004 : Rahul Bose",
        Rating: 3.8,
        pendingtasks: 9,
        dailyaverage: 42,
        weekavailibility: 3,
        experience: 2,
      },
      {
        id: 124,
        code: "AR-0005",
        name: "Dustin Perkins",
        displayname: "AR-0005 : Dustin Perkins",
        Rating: 0,
        pendingtasks: 8,
        dailyaverage: 37,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 146,
        code: "AR-0006",
        name: "Robert Howard",
        displayname: "AR-0006 : Robert Howard",
        Rating: 4.2,
        pendingtasks: 18,
        dailyaverage: 23,
        weekavailibility: 5,
        experience: 3,
      },
      {
        id: 528,
        code: "AR-0007",
        name: "John Snow",
        displayname: "AR-0007 : John Snow",
        Rating: 4.2,
        pendingtasks: 18,
        dailyaverage: 23,
        weekavailibility: 5,
        experience: 3,
      },
    ];
  }
  getTasks() {
    return [
      {
        taskid: 1,
        taskcode: "TK-APR2019-0001",
        workgroupcode: "WG-APR2019-WLC-00001",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 2,
        taskcode: "TK-APR2019-0002",
        workgroupcode: "WG-APR2019-WLC-00002",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 3,
        taskcode: "TK-APR2019-0003",
        workgroupcode: "WG-APR2019-WLC-00003",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 4,
        taskcode: "TK-APR2019-0001",
        workgroupcode: "WG-APR2019-WLC-00001",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 5,
        taskcode: "TK-APR2019-0002",
        workgroupcode: "WG-APR2019-WLC-00002",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 6,
        taskcode: "TK-APR2019-0003",
        workgroupcode: "WG-APR2019-WLC-00003",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 7,
        taskcode: "TK-APR2019-0001",
        workgroupcode: "WG-APR2019-WLC-00001",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 8,
        taskcode: "TK-APR2019-0002",
        workgroupcode: "WG-APR2019-WLC-00002",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 9,
        taskcode: "TK-APR2019-0003",
        workgroupcode: "WG-APR2019-WLC-00003",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 10,
        taskcode: "TK-APR2019-0001",
        workgroupcode: "WG-APR2019-WLC-00001",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 11,
        taskcode: "TK-APR2019-0002",
        workgroupcode: "WG-APR2019-WLC-00002",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      {
        taskid: 12,
        taskcode: "TK-APR2019-0003",
        workgroupcode: "WG-APR2019-WLC-00003",
        lastworked: "4/3/2019",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
        assignedby: "A001",
        assigneddate: "04/03/2019",
        clientcode: "CL-00003",
        insurance: "Atena",
        claimnumber: "TLC-1002",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
    ];
  }

  getTasksDetails(id) {
    return this.TaskDetails.find((x) => x.taskid === id);
  }

  TaskDetails = [
    {
      taskid: 1,
      taskcode: "TK-APR2019-0001",
      workgroupcode: "WG-APR2019-WLC-00001",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 2,
      taskcode: "TK-APR2019-0002",
      workgroupcode: "WG-APR2019-WLC-00002",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 3,
      taskcode: "TK-APR2019-0003",
      workgroupcode: "WG-APR2019-WLC-00003",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 4,
      taskcode: "TK-APR2019-0004",
      workgroupcode: "WG-APR2019-WLC-00001",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 5,
      taskcode: "TK-APR2019-0005",
      workgroupcode: "WG-APR2019-WLC-00002",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 6,
      taskcode: "TK-APR2019-0006",
      workgroupcode: "WG-APR2019-WLC-00003",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 7,
      taskcode: "TK-APR2019-0007",
      workgroupcode: "WG-APR2019-WLC-00001",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 8,
      taskcode: "TK-APR2019-0008",
      workgroupcode: "WG-APR2019-WLC-00002",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 9,
      taskcode: "TK-APR2019-0009",
      workgroupcode: "WG-APR2019-WLC-00003",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 10,
      taskcode: "TK-APR2019-0010",
      workgroupcode: "WG-APR2019-WLC-00001",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 11,
      taskcode: "TK-APR2019-0011",
      workgroupcode: "WG-APR2019-WLC-00002",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
    {
      taskid: 12,
      taskcode: "TK-APR2019-0012",
      workgroupcode: "WG-APR2019-WLC-00003",
      lastworked: "4/3/2019",
      auto_lastworked: "4/5/2019",
      auto_laststatus: "INPROCESS",
      assignedby: "A001",
      assigneddate: "04/03/2019",
      clientinfo: {
        clientcode: "CL-00003",
        clientname: "TRIARQ Health",
      },
      patientinfo: {
        patientcode: "P102932",
        patientfname: "Mickey",
        patientlname: "Mouse",
        patientdob: "01/21/1986",
        patientgender: "Male",
        patientstatus: "Active",
        patientinsurances: [
          {
            insurancename: "Blue Cross Blue Shield of Michigan",
            insuranceid: "X293092Y939",
            subscribername: "Minne Mouse",
            subscriberdob: "01/22/1986",
            insurancetype: "Primary",
            insurancestatus: "Active",
          },
        ],
      },
      claiminfo: {
        claimnumber: "TLC-1002",
        responsibleinsurance: "Atena",
        dos: "04/01/2019",
        insurancedue: "100",
        claimageindays: "15",
      },
      statusinfo: {
        lastworkedstatus: "Paid",
        lastworked: "4/3/2019",
        lastworkedby: "A0001",
        lastworkednote: "Last Worked Note",
        auto_lastworked: "4/5/2019",
        auto_laststatus: "INPROCESS",
      },
    },
  ];

  getResoneCode() {
    return [
      {
        id: 1,
        code: "CO45",
        Desc:
          "Charge exceeds fee schedule/maximum allowable or contracted/legislated fee arrangemen",
        displayname: "CO45",
      },
      { id: 2, code: "CO01", Desc: "Deductible Amount", displayname: "CO01" },
      {
        id: 3,
        code: "CO02",
        Desc: "Coinsurance Amount",
        displayname: "CO02: Coinsurance Amount",
      },
      {
        id: 4,
        code: "CO03",
        Desc: "Co-payment Amount",
        displayname: "CO03: Co-payment Amount",
      },
      {
        id: 5,
        code: "CO04",
        Desc:
          "The procedure code is inconsistent with the modifier used or a required modifier is missing",
        displayname:
          "CO04: The procedure code is inconsistent with the modifier used or a required modifier is missing",
      },
    ];
  }

  getNoteType() {
    return [
      {
        id: 1,
        notetitle: "REBILL WITH PRIMARY EOB",
        notetext:
          "As per review the claim was billed to {0} So CLD@{1} S/W- {2} said there is no claim on file which was billed on {3} as {4} reprocessed the claim and Left Co-ins.So rep said to rebill the claim with Primary EOB via paper on mailing address {5}. Also, No TFL rep said for Primary EOB. So need assistance to rebill with primary EOB. Refr#-{6}",
        nparametercount: 6,
      },
      {
        id: 2,
        notetitle: "CLAIM NOT ON FILE",
        notetext:
          "As per review the claim was billed to {0}. So CLD@{1} S/W- {2} said the claim was not on file which was mailed on {3} also verified the mailing address that was correct as per our system as rep said it was mailed on {4} said to take a follow-up after {5} days. So need to follow-up after {6} days.  Refr#- {7}",
        nparametercount: 7,
      },
      {
        id: 3,
        notetitle: "PROVIDER ISSUE",
        notetext:
          "As per review the claim was billed to {0} So CLD@{1} S/W- {2} said the claim was receive on {3} denied on {4} denied as Provider License # is not listed under the Group TAXID# CLM#-{5}. And no other information was given by rep. Said to rebill the corrected claim TFL-{6} months from DOS. Need assistance. Refr#-  {7}",
        nparametercount: 7,
      },
      // {id:2, notetypedescription:''},
      // {id:3, notetypedescription:''},
      // {id:4, notetypedescription:''}
    ];
  }

  getTopStatus() {
    return [
      {
        bucket1: "$1542.52",
        bucket2: "$2514.51",
        bucket3: "$1541.51",
        bucket4: "$1457.56",
        bucket5: "$85425.51",
        bucket6: "$14532.25",
        bucket7: "$262.25",
      },
    ];
  }

  getTopAction() {
    return [
      { text: "APPEAL CLAIM - PACKAGE CREATED & PLACED", value: 151 },
      { text: "AUTO ADJUSTMENT", value: 135 },
      { text: "BENEFIT ORDER COMPLETED", value: 105 },
      { text: "CLIENT ASSISTANCE REQUIRED", value: 97 },
      { text: "CREDIT BALANCE", value: 83 },
      { text: "DENIED AND COMPLETED/ADJUSTED", value: 74 },
      { text: "FLIP BALANCE TO THE OOS FC", value: 69 },
      { text: "NEED TO ALLOW FEW MORE DAYS", value: 61 },
      { text: "NEED TO FOLLOW UP", value: 51 },
      { text: "REBILLED CORRECTED ELECTRONICALLY", value: 43 },
    ];
  }

  getTopPayerByAR() {
    return [
      { text: "BANKERS LIFE AND CASUALTY", value: "$ 20151" },
      { text: "BCBS", value: "$ 15421" },
      { text: "Blue Care Network", value: "$ 10501" },
      { text: "Cigna", value: "$ 9712" },
      { text: "Aetna", value: "$ 8314" },
      { text: "Blue Cross", value: "$ 7420" },
      { text: "Blue Shield", value: "$ 6915" },
      { text: "Health Care LA", value: "$ 6121" },
      { text: "Global Care Medical Group", value: "$ 5114" },
      { text: "Pioneer Medical", value: "$ 4314" },
    ];
  }

  getTopClientByAR() {
    return [
      { text: "	Coast Neurosurgical Associates", value: "$ 51425" },
      { text: "Gupta Family Practice", value: "$ 21541" },
    ];
  }
}
