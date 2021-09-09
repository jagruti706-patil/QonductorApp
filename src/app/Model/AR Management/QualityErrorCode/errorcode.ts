export class Errorcode {
  nerrorid: number;
  serrordescription: string;
  bisactive: boolean;
  createdby: string;
  createdbyname: string;
  bissystemdefined: boolean;
  createdon: string;
  modifiedon: string;
}

export class WorkAuidt {
  bauditstatus: boolean;
  breworkrequired: boolean;
  createdon: string;
  modifiedon: string;
  nerrorid: number;
  ntaskid: number;
  nworkauditid: number;
  nworkqueuegroupid: number;
  nworkqueueid: number;
  serrordescription: string;
  susername: string;
  userid: number;
}

export class WorkAuidtCompleted {
  nworkqueuegroupid: string;
  sworkqueuegroupcode: string;
  ntaskid: number;
  staskcode: string;
  reviewstatus: string;
  serrordescription: string;
  breworkrequired: string;
  reviewedby: string;
  agentid: number;
  agentname: string;
  reviewedon: string;
}
