export class Task {
  ntaskid: number;
  nuserid: number;
  staskcode: string;
  nparenttaskid: number;
  nworkqueuegroupid: number;
  tasktype: string;
  tasktitle: string;
  taskdeciption: string;
  priority: number;
  createdby: number;
  nassignedtoid: number;
  updatedby: number;
  nstatus: number;
  bisfollowup: boolean;
  bisassigned: boolean;
  tasknotes: string;
  taskstarttime: string;
  taskendtime: string;
  createdon: string;
  modifiedon: string;
  sworkqueuegroupcode: string;
  dos: string;
  lastworkeddate: string;
  remainingbalance: number;
  planname: string;
  nclientid: number;
  claimno: string;
  claimage: number;
  clientcode: string;
  sausid: string;
}

// {
//     "ntaskid": 358,
//     "nuserid": null,
//     "staskcode": "TK-Apr2019-00026",
//     "nparenttaskid": null,
//     "nworkqueuegroupid": "2029071319907174265",
//     "tasktype": "AR Caller",
//     "tasktitle": null,
//     "taskdeciption": null,
//     "priority": 2,
//     "createdby": null,
//     "nassignedtoid": 2,
//     "updatedby": null,
//     "nstatus": 0,
//     "bisfollowup": false,
//     "bisassigned": false,
//     "tasknotes": "",
//     "taskstarttime": null,
//     "taskendtime": null,
//     "createdon": "2019-04-30T06:06:12.954+0000",
//     "modifiedon": null,
//     "sworkqueuegroupcode": "WG-Apr2019-cna01-00018",
//     "dos": "2019-02-06T18:30:00.000+0000",
//     "lastworkeddate": "2019-02-06T18:30:00.000+0000",
//     "remainingbalance": "$100.00",
//     "planname": "Aetna Gold",
//     "nclientid": 124,
//     "claimno": "00018",
//     "claimage": "71",
//     "clientcode": "TH124",
//     "sausid": "cnb01"
//   }

export class TaskAssigned {
  assignmentnote: string;
  duedate: string;
  nassignedtoid: number;
  sassignedtousername: string;
  stype: string;
}

export class TaskFollowup {
  bisfollowup: boolean;
  followupdate: Date;
  followupnote: string;
}

export class TaskActioncode {
  actionCode: string;
  actionDescription: string;
  actionId: number;
}

export class TaskStatus {
  statusCode: string;
  statusDescription: string;
  statusId: number;
}

export class TaskSubstatus {
  subStatusCode: string;
  subStatusDescription: string;
  subStatusId: number;
}
export class TaskLogAction {
  logactioncode: string;
  logactiondescription: string;
  logactiondate: string;
  logactionid: number;
  logclaimactioncode: string;
}
export class TaskScheduleAction {
  scheduleactioncode: string;
  scheduleactiondescription: string;
  scheduleactiondate: string;
  scheduleactionid: number;
}
export class TaskAutomationError {
  automationstatus: string;
  automationerrordesc: string;
  automationerrorid: number;
}
export class Taskaction {
  nactionid: number = 0;
  actioncode: TaskActioncode;
  createdon: string;
  modifiedon: string;
  notes: string;
  ntaskid: number;
  nuserid: number;
  reasoncodes: string[];
  remarkcodes: string[];
  status: TaskStatus;
  substatus: TaskSubstatus;
  logaction: TaskLogAction;
  scheduleaction: TaskScheduleAction;
  tflfromdos: string;
  susername: string;
  sworktype: string;
  automationerror: TaskAutomationError;
}

export class TaskSave {
  assigned: TaskAssigned;
  bisassigned: boolean;
  bisfollowup: boolean;
  createdby: number;
  createdon: Date;
  followup: TaskFollowup;
  modifiedon: Date;
  nassignedtoid: number;
  nparenttaskid: number;
  nstatus: number;
  ntaskid: number;
  nuserid: number;
  nworkqueuegroupid: number;
  priority: number;
  sassignedtousername: string;
  staskcode: string;
  susername: string;
  taskaction: Taskaction;
  taskdeciption: string;
  taskendtime: Date;
  tasknotes: string;
  taskstarttime: Date;
  tasktitle: string;
  tasktype: string;
  updatedby: number;
  nclientid: string;
  sclientname: string;
}

export class TaskType {
  ntypeid: number;
  stype: string;
  bstatus: boolean;
  createdon: string;
}

export class ScheduleAction {
  id: number;
  actioncode: string;
  actiondescription: string;
  displayaction: string;
  createdon: string;
  sclaimactioncode: string;
}
