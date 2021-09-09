export class OrderSubStatusModel {
  isactive: boolean;
  modifiedon: string;
  createdon: string;
  statusid: string;
  statusname: string;
  substatusdescription: string;
  substatusname: string;
  userid: any;
  username: string;
  substatusid: string;
}

export class OrderNoteModel {
  ordernoteid: string;
  isactive: boolean;
  modifiedon: string;
  note: string;
  notetitle: string;
  statusid: string;
  statusname: string;
  userid: any;
  username: string;
}
