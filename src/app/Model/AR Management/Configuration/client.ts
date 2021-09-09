export class Client {
  nclientid: number;
  clientcode: string;
  sclientname: string;
  sdatabasename: string;
  address: string;
  sausid: string;
  stin: string;
  snpi: string;
  nstatus: number;
  qlivedt: string;
  arstartdt: string;
  dtstatusdate: string;
  createdon: string;
  modifiedon: string;
}

export class ClientSaveUpdateModel {
  clientServices: ClientServiceModel[];
  client: Client;
}

export class ClientServiceModel {
  clientservicestatus: boolean = false;
  servicecode: string;
  serviceid: string;
  servicename: string;
  userid: string;
  username: string;
  clientserviceid: string;
  clientid: string;
  createdon: string;
  modifiedon: string;
}
