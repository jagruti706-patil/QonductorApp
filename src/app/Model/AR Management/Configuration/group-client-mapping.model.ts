export class GroupClientMapping {
  client: Array<GroupClients>;
  createdby: string;
  createdon: string;
  groupclientmappingid: string;
  groupid: string;
  groupname: string;
  groupstatus: boolean;
  mappingtypename: string;
  mappingtypeid: number;
}
export class GroupClients {
  clientid: string;
  clientname: string;
}
export class GroupClientMappingStatus {
  groupid: string;
  groupstatus: boolean;
  mappingtypeid: number;
}
