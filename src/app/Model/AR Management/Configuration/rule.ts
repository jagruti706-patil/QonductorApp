import { Workgroup } from "../Workgroup/workgroup";

export class Rule {
  nruleid: string;
  nclientid: string;
  sclientname: string;
  bstatus: boolean;
  userid: string;
  createdon: string;
  modifiedon: string;
  ruledata: RuleData;
  susername: string;
}

export class RuleData {
  ruletitle: string;
  ruledescription: string;
  rulecategory: string;
  rulecategoryid: string;
  ruledetails: RuleDetails;
}

export class RuleDetails {
  dosbefore: string;
  dosafter: string;
  insurance: string;
  billingprovider: string;
  renderingprovider: string;
}

export class DeferUndefer {
  createdon: string;
  modifiedon: string;
  nuserid: string;
  dtdate: string;
  sdusername: string;
  sdefercategory: string;
  snote: string;
  nworkqueuegroupid: Workgroup[];
  callfor: number;
  defertype: string = "Manual";
}
