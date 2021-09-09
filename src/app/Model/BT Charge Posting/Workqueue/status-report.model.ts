export class StatusReportModel {
  title: string;
  currentStatus: string;
  updatedStatus: string;
  accessionNo: string;
  status: number;
  description: string;
  sequenceno: string;
  documentname: string;
  documentsize: string;
}
export class CountModel {
  total: number = 0;
  success: number = 0;
  error: number = 0;
  skipped: number = 0;
}
