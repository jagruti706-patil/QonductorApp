import { DatePipe } from "@angular/common";
import * as moment from "moment";

export class InventoryInputModel {
  "client": FliterClient[] = [];
  "payer": FilterPayer[] = [];
  "agent": FilterAgent[] = [];
  "workitemstatus" = 2;
  "lastworkedage" = 30;
  "startdate": string = new DatePipe("en-US").transform(
    Date.now(),
    "yyyy-MM-dd"
  ); //1month before
  "enddate": string = new DatePipe("en-US").transform(Date.now(), "yyyy-MM-dd"); //Todays date
  "renderingProvider": OutputRenderingproviders[] = [];
  "billingProvider": OutputBillingproviders[] = [];
  "automationstatus": string = "";
  "age": string = "";
  "insurancedue": number = 0;
  "searchtext": string = "";
  "priority": number = 0;
  "followupstartdate": string = new DatePipe("en-US").transform(
    // Date.now(),
    moment(),
    "yyyy-MM-dd"
  );
  "followupenddate": string = new DatePipe("en-US").transform(
    // Date.now(),
    moment(),
    "yyyy-MM-dd"
  );

  "filestatus" = -1;

  "orderworkqueuestatus" = 0; //saurabh shelar

  "accuracystatus" = ""; //saurabh shelar
  "defercategory": string = "";
  "accessionNo": string = "";
  "orderCategory": Array<string> = [];
  "orderday": Array<string> = [];
  "orderyear": Array<string> = [];
  "status": Array<number> = [];
  "userid": string = "";
  "npi": Array<string> = [];
  "hl7present": number = -1;
  "clientbilling": number = -1;
  "ordersubstatus": Array<string> = [];
  "insurancecompanyname": Array<string> = [];
  "servicecode": string = "ARTR";
  "isacknowledged": boolean = false;
  "groupid": Array<string> = [];
  "encountertype": string = "";
  "filtergroup": string = "";
  "assignmenttype": number = -1;
  "practicecode": Array<string> = [];
  "searchinarchive": boolean = false;
}
export class PrintFilterInputModel {
  accessionNo: string = "";
  medicare: number = -1;
  npi: string[] = [];
  orderCategory: string[] = [];
  orderday: string[] = [];
  ordersubcategory: string = "";
  orderyear: string[] = [];
  status: number[] = [];
  insurancecompanyname: Array<string> = [];
  userid: string = "0";
  batchcode: string = "0";
  practicecode: string[] = [];
}

// All Filter Input JSON
export class Filter {
  client: boolean;
  insurance: boolean;
  agingbucket: boolean;
  automationstatus: boolean;
  billingprovider: boolean;
  renderingprovider: boolean;
  arrepresentative: boolean;
  defercategory: boolean;
  entrdoccategory: boolean;
  servicecode: string;

  constructor(
    bIsClient: boolean = true,
    bIsInsurnace: boolean = true,
    bIsAgingbucket: boolean = true,
    bIsAutomationStatus: boolean = true,
    bIsBillingProvider: boolean = true,
    bIsRenderingProvider: boolean = true,
    bIsArRepesentative: boolean = true,
    bIsDeferCategory: boolean = true,
    entrdoccategory: boolean = false,
    sServicecode: string = "ARTR"
  ) {
    this.client = bIsClient;
    this.insurance = bIsInsurnace;
    this.agingbucket = bIsAgingbucket;
    this.automationstatus = bIsAutomationStatus;
    this.billingprovider = bIsBillingProvider;
    this.renderingprovider = bIsRenderingProvider;
    this.arrepresentative = bIsArRepesentative;
    this.defercategory = bIsDeferCategory;
    this.entrdoccategory = entrdoccategory;
    this.servicecode = sServicecode;
  }
}

export class FliterClient {
  "clientid": number;
  "clientname": string;
}

export class FilterPayer {
  "payerid": string;
  "payername": string;
}

export class FilterAgent {
  "agentid": number;
  "agentname": string;
}

// All Filter Output JSON
export class OutputFilter {
  "client": OutputClient[];
  "insurances": OutputInsurance[];
  "bucket": OutputBucket[];
  "automationstatus": OutputAutomationstatus[];
  "billingproviders": OutputBillingproviders[];
  "renderingproviders": OutputRenderingproviders[];
  "arrepresentative": OutputAgent[];
  "defercategory": OutputDeferCategory[];
  "entrdoccategory": OutputEncounterDocCategory[];
}

// All Filter Output Client JSON
export class OutputClient {
  nclientid: number;
  clientcode: string;
  clientcodename: string;
}

// All Filter Output Insurance JSON
export class OutputInsurance {
  companyid: string;
  companyname: string;
}

// All Filter Output Bucket JSON
export class OutputBucket {
  bucket: string;
  lowerlimit: number;
  upperlimit: number;
}

// All Filter Output Automationstatus JSON
export class OutputAutomationstatus {
  sautomationstatus: string;
}

// All Filter Output Billingproviders JSON
export class OutputBillingproviders {
  providerid: string;
  providername: string;
}

// All Filter Output Renderingproviders JSON
export class OutputRenderingproviders {
  providerid: string;
  providername: string;
}

// All Filter Output Agent JSON
export class OutputAgent {
  agentid: number;
  agentname: string;
}

export class OutputDeferCategory {
  sdefercategory: string;
}
export class OutputEncounterDocCategory {
  id: string;
  categorycode: String;
  description: string;
  isactive: boolean;
  createdon: string;
}
