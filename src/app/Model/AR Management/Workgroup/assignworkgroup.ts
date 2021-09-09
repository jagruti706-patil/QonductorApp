import { Workgroup } from "./workgroup";

export class Assignworkgroup {
  createdon: string;
  modifiedon: string;
  nassignedtoid: number;
  nstatus: number;
  nuserid: number;
  nworkqueuegroupid: Workgroup[];
  priority: number;
  staskcode: string;
  taskstarttime: string;
  taskendtime: string;
  tasknotes: string;
  duedate: string;
  sassignedtousername: string;
  screatedusername: string;
  supdatedusername: string;
  susername: string;
  // {
  //     "createdon": "2019-04-30T04:09:52.692Z",
  //     "modifiedon": "2019-04-30T04:09:52.692Z",
  //     "nassignedtoid": 0,
  //     "nstatus": 0,
  //     "nuserid": 0,
  //     "nworkqueuegroupid": [
  //       {
  //         "nworkqueuegroupid": 0,
  //         "sworkgroupqueuecode": "string"
  //       }
  //     ],
  //     "priority": 0,
  //     "staskcode": 0,
  //     "taskendtime": "2019-04-30T04:09:52.692Z",
  //     "tasknotes": "string",
  //     "taskstarttime": "2019-04-30T04:09:52.692Z"
  // "sassignedtousername": "string",
  // "screatedusername": "string",
  //   "supdatedusername": "string",
  //   "susername": "string",
  //   }
}
