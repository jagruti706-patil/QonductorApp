export class OrderNote {
  //saurabh shelar
  createdby: string;
  createdbyfirstname: string;
  createdbylastname: string;
  createdbyusername: string;
  createdon: string;
  docid: string;
  note: string;
  noteid: string;
  notestatus: boolean;
  notetype: number;
  pagenumber: number;
}
export class OrderDetails {
  assignedid: string;
  orderqueuegroupid: string;
  nstatus: number;
  modifiedon: string;
  ordernote: string;
  claimreferencenumber: string;
  assignsource: number;
  assistanceinfo: AssistanceInformationJson;
  ordersubstatus: string;
  ordersubstatusname: string;
  assigneduser: string;
  currentStatus: string;
  incompleteorderinfo: IncompleteOrderNote;
  isanswered: boolean = false;
}

export class OrderReviewDetails {
  //saurabh shelar

  reviewObj: ReviewObj[] = [];
  assignedto: string;
  assignedtoname: string;
  nstatus: number;
  modifiedon: string;
  ordernote: string;
  incompleteorderinfo: any;
  ordersubstatus: string;
  ordersubstatusname: string;
}
export class ReviewObj {
  claimreferencenumber: string;
  orderqueuegroupid: string;
  currentStatus: number;
}

export class OrderReleaseDetails {
  //saurabh shelar

  reviewObj: ReleaseObj[] = [];
  assignedto: string;
  assignedtoname: string;
  nstatus: number;
  modifiedon: string;
  ordernote: string;
}
export class ReleaseObj {
  claimreferencenumber: string;
  orderqueuegroupid: string;
}

export class allOrders {
  //saurabh shelar
  claimreferencenumber: string;
  orderqueuegroupid: string;
  orderqueuegroupcode: string; //accesion number
  nstatus: any;
  ordernote: string;
  status: string;
  incompleteorderinfo: any;
  ordercategory: string;
  orderyear: string;
  orderday: string;
  encountersource: string;
}

export class AssistanceInformationJson {
  requestedDate: string = "";
  miscInfo: MiscInformationJson;
  noOfDiagnosis: SelectionJson;
  medicarePatients: ProcedureDiagnosisJson;
  additionalDiagnosis: ProcedureDiagnosisJson;
  doctorsCheck: SelectionJson;
  completedInfo: CompletedInfoJson;
}
export class MiscInformationJson {
  select: boolean = false;
  info: string = "";
}
export class SelectionJson {
  select: boolean = false;
}
export class ProcedureDiagnosisJson {
  select: boolean = false;
  procedure: Array<string> = [];
  diagnosis: Array<string> = [];
}
export class CompletedInfoJson {
  completedBy: string = "";
  completedOn: string = "";
}

export class UploadOrders {
  orderqueueid: string;
  accessionno: string;
  filename: string;
  tokenid: string;
  extension: string;
}

export class IncompleteOrderNote {
  todaysdate: string;
  accessionnumber: string;
  providername: string;
  requisitiondate: string;
  requisitionno: string;
  ordercategory: string = "";
  ismedicare: boolean;

  ismiscinfocheck: boolean;
  isinsurnaceinfocheck: boolean;
  issubscriberinfocheck: boolean;
  isnodiagnosis: boolean;
  ismedicarepatient: boolean;
  isadditionalinsurance: boolean;
  isdoctorinfo: boolean;

  miscinfo: string;
  medicareprocedure1: string;
  medicareprocedure2: string;
  medicareprocedure3: string;
  medicareprocedure4: string;
  medicareprocedure5: string;

  medicarediagnosis1: string;
  medicarediagnosis2: string;
  medicarediagnosis3: string;
  medicarediagnosis4: string;
  medicarediagnosis5: string;

  additionalprocedure1: string;
  additionalprocedure2: string;
  additionalprocedure3: string;
  additionalprocedure4: string;
  additionalprocedure5: string;

  additionaldiagnosis1: string;
  additionaldiagnosis2: string;
  additionaldiagnosis3: string;
  additionaldiagnosis4: string;
  additionaldiagnosis5: string;

  signature: string;
  completedby: string;
  completedon: string;

  miscinfo_answer: string;
  insuranceplan: string;
  insuranceid: string;
  subscribername: string;
  subscriberdob: string;
  subscriberrelationship: string;
  nodxgiven_answer: string;
  // signature: string;
  // signaturename: string;
  // signaturedate: string;
  extrainformation: string;
}

export class OrderSearchStatusModel {
  assignedto: string;
  assignedtoname: string;
  currentStatus: number;
  modifiedon: string;
  nstatus: number;
  ordernote: string;
  orderqueuegroupid: string;
  incompleteorderinfo: any;
  ordersubstatus: string;
  ordersubstatusname: string;
}

export class OrderUploadtoDVDetails {
  reviewObj: ReleaseObj[] = [];
  assignedto: string;
  assignedtoname: string;
  nstatus: number;
  modifiedon: string;
}

export class OrderDefaultYearDay {
  cabinet: string[];
  folder: string[];
}

export class SendToBiotechModel {
  ordernote: string = "";
  ordersubstatus: string = "";
  ordersubstatusname: string = "";
}
export class TriarqNoteModel {
  accessionnumber: string;
  createdbyuserid: string;
  createdbyusername: string;
  createdon: string;
  orderqueuemodifiedon: string;
  ordernote: string;
  orderstatus: number;
  docid: string;
  page: string;
  commenttype: string;
  commentcode: string;
  supplementarypages: string;
  orderqueueid: string;
}
export class RcmDocsNoteModel {
  createdby: string;
  createdbyfirstname: string;
  createdbylastname: string;
  createdbyusername: string;
  createdon: string;
  docid: string;
  masterdocid: string;
  note: string;
  notestatus: boolean;
  notetype: number;
  pagenumber: string;
  commenttype: string;
  commentcode: string;
  isanswered: boolean = false;
  referenceid: string;
  supplementarypages: string;
  accessionreferenceno: number = 0;
}
export class UploadMissingInfoModel {
  documentname: string;
  category: string;
  orderqueueid: string;
  subcategory: string;
  sourcetype: string;
  cabinet: string;
  folder: string;
  externalcategoryid: string;
  createdon: string;
  modifiedon: string;
  data: string; //bytearray
  actionfrom: string;
  userid: string;
  username: string;
}
export class EligibilityModel {
  label: string;
  html: any;
}
export class SubmittedAndPrintedModel {
  batchcode: string;
  orderstatus: string;
  batchuserid: string;
  batchusername: string;
  status: any[];
  modifiedon: string;
}
export class UpdateSubStatusModel {
  modifiedon: string;
  ordersubstatus: string;
  ordersubstatusname: string;
  assignedto: string;
  assignedtoname: string;
  ordernote: string;
  reviewObj: any[];
}
export class EncounterSubStatusModel {
  statusid: string;
  statusname: string;
  substatusdescription: string;
  substatusid: string;
  substatusname: string;
}
export class EncounterNoteModel {
  note: string;
  notetitle: string;
  ordernoteid: string;
  statusid: string;
  statusname: string;
}
export class GenericSearchModel {
  searchfield: string;
  searchtext: string;
  status: number = 0;
  group: string[];
}
