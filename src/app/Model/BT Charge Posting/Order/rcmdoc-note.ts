export class RCMdocNote {}

export class RCM_Acknowledge {
  acknowledgedby: string;
  acknowledgedon: string;
  docid: string;
  isacknowledged: boolean;
  masterdocid: string;
  statustype: string;
  accessionno: string;
  accessionreferenceno: number = 0;
}
export class MoveDocumentSave {
  oldcategoryname: string;
  newcategoryname: string;
  createdby: string;
  modifiedon: string;
  masterdocid: string;
  clientid: string;
  clientname: string;
  documentname: string;
}
export class DeleteMasterDoc {
  masterdocid: string;
  modifiedon: string;
  ordernote: string;
  status: boolean;
  userid: string;
  username: string;
}
