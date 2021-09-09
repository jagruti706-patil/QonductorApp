export class Viewdetails {
  "workQueueInfo": workQueueInfo;
  "workQueueDetails": serviceline[];
  "workQueueHistory": History[];
}

export class workQueueInfo {
  "clientinfo": clientinfo;
  "patientinfo": patientinfo;
  "claiminfo": claiminfo;
}

export class History {
  "type": string;
  "description": string;
  "date": string;
}

export class clientinfo {
  clientcode: string;
  clientname: string;
}

export class patientinsurances {
  insurancename: string;
  insuranceid: string;
  subscribername: string;
  subscriberdob: string;
  insurancetype: string;
  insurancestatus: string;
}

export class patientinfo {
  patientcode: string;
  patientfname: string;
  patientlname: string;
  patientdob: string;
  patientgender: string;
  patientstatus: string;
  patientinsurances: patientinsurances[];
}

export class claiminfo {
  claimnumber: string;
  insuranceid: string;
  responsibleinsurance: string;
  dos: string;
  insurancedue: string;
  claimageindays: string;
  tfl: string;
  dfl: string;
  billed_amount: string;
}

export class statusinfo {
  auto_laststatus: string;
  auto_lastworked: string;
  lastworked: string;
  lastworkedby: string;
  lastworkedbyusername: string;
  lastworkednote: string;
  lastworkedstatus: string;
  qpmlastworkednote: string;
  reasoncode: string;
  remarkcode: string;
}

export class serviceline {
  charge: string;
  dx1code: string;
  dx2code: string;
  dx3code: string;
  dx4code: string;
  mod1code: string;
  mod2code: string;
  dos: string;
  billed_amount: string;
  remainingbalance: string;
}
