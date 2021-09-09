export class Cabinet {
  externalid: string;
  cabinetname: string;
  status: boolean;
}

export class SaveCabinet {
  cabinet: Cabinet[] = [];
  createdon: string;
  createdby: string;
}

export class GetFolders {
  createdby: string = "";
  createdon: string = "";
  externalid: string = "";
  folderid: string = "";
  foldername: string = "";
  processedstatus: boolean;
}

export class GetCategory {
  categoryid: any;
  categoryname: string = "";
}

export class Year {
  year: string = "";
}

export class FolderCategoryAndYearModel {
  folder: GetFolders[] = [];
  category: GetCategory[] = [];
  year: Year[] = [];
  providernpi: GetProviderList[] = [];
  substatus: SubStatus[] = [];
  insurancecompanyname: InsuranceCompanyName[] = [];
  client: Client[] = [];
  encounter: any[] = [];
  practice: any[] = [];
}

export class InsuranceCompanyName {
  insurancecompanyname: string = "";
}
export class GetProviderList {
  npi: string = "";
  providername: string = "";
}

export class SubStatus {
  substatusid: string = "";
  substatusname: string = "";
}

export class Client {
  nclientid: number;
  clientcode: string;
  clientcodename: string;
}
