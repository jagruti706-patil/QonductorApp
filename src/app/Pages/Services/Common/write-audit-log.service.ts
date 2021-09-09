import { Injectable } from "@angular/core";
import { DataTransferService } from "./data-transfer.service";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class WriteAuditLogService {
  clsAuthLogs: AuthLogs;
  constructor(
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.clsAuthLogs = new AuthLogs(http);
  }
  writeLog(
    Message: string,
    UserAction: string,
    ScreenName: string,
    ModuleName: string
  ) {
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: ScreenName,
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }
}
