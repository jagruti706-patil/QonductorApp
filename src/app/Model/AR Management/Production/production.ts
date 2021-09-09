export class Production {
  id: string;
  nclientid: number;
  nagentid: number;
  sclientname: string;
  sagentname: string;
  auditedtaskcount: number;
  auditedtaskpercentage: string;
  errortaskpercentage: string;
  totalassigntask: number;
  totalcanceledtask: number;
  totalcompletedtask: number;
  totalerrorcount: number;
  totalpendingtask: number;
  totalescalatedtask: number;
  totalsystemclosedtask: number;
  createdon: string;
}

export class DailyProductionClose {
  arworked: arworked[];
  arworkcount: arworkcount;
  arbucket: arbucket;
  arstatus: arstatus[];
  arautomationstatus: arautostatus[];
}

export class DailyProductionCloseSave {
  productioncloseid: number = 0;
  productioncloseddate: string;
  workedcount: arworkcount;
  agingbucket: arbucket;
  production: arworked[];
  productionstatus: arstatus[];
  automationstatus: arautostatus[];
  todayproduction: Production[];
  createdon: string;
  userid: string;
  username: string;
}
export class arworkcount {
  averageproductivitywork: string;
  unsyncworkitem: string;
  workitems: string;
  worktask: string;
}

export class arbucket {
  bucket_1: string;
  bucket_2: string;
  bucket_3: string;
  bucket_4: string;
  bucket_5: string;
  bucket_6: string;
  bucket_7: string;
  nclientid: string;
  sclientname: string;
}
export class arstatus {
  status: string;
  nclientid: string;
  count: number;
  clientname: string;
  arvalue: string;
}
export class arworked {
  auditedtaskcount: number;
  nclientid: string;
  workedtask: number;
  clientname: string;
  errorpercentage: number;
}

export class arautostatus {
  sclaimstatus: string;
  nclientid: string;
  count: number;
  clientname: string;
}
