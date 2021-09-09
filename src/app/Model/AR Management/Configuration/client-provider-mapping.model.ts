export class ClientProviderMapping {
  practiceClientGroupMapping: PracticeClientGroupMapping[];
  practiceClientMaster: PracticeClientMaster;
  practiceProviderDetails: PracticeProviderDetails[];
  practiceEmailConfig: PracticeEmailConfig;
}
export class PracticeClientGroupMapping {
  clientid: string;
  clientmasterid: string;
  createdon: string;
  groupid: string;
  groupname: string;
  ismappingactive: boolean;
  mappingid: string;
  modifiedon: string;
  userid: string;
  username: string;
}
export class PracticeClientMaster {
  address1: string;
  address2: string;
  city: string;
  clientcode: string;
  clientid: string;
  clientname: string;
  createdon: string;
  lookup: string;
  modifiedon: string;
  npi: string;
  phoneno1: string;
  phoneno2: string;
  state: string;
  status: boolean;
  upin: string;
  userid: string;
  username: string;
  zip: string;
  contactname: string;
  contactemail: string;
}
export class PracticeProviderDetails {
  clientid: string;
  clientmasterid: string;
  code: string;
  createdon: string;
  lookup: string;
  modifiedon: string;
  name: string;
  npi: string;
  phoneno1: string;
  phoneno2: string;
  providerid: string;
  status: boolean;
  upin: string;
  userid: string;
  username: string;
}
export class UpdateClientProviderMappingStatus {
  status: boolean;
  userid: string;
  clientid: string;
  providerid: string;
  username: string;
  modifiedon: string;
}
export class PracticeEmailConfig {
  clientcode: string;
  clientid: string;
  configid: string;
  createdon: string;
  emailconfig: EmailConfig[];
  modifiedon: string;
  userid: string;
  username: string;
}
export class EmailConfig {
  email: string;
  username: string;
  userid: string;
  groupid: string;
}
