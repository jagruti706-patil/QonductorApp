import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { ClientInfo } from "../utility";
import { BrowserIpDetails } from "./login";

export class Logs {
  currentTimeZone = "";
  constructor() {
    var num = environment.offset;
    var hours = -(num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    this.currentTimeZone = rhours.toString() + ":" + rminutes.toString();
    // console.log(
    //   " num:" +
    //     num +
    //     "hours:" +
    //     hours +
    //     "rhours:" +
    //     rhours +
    //     "minutes:" +
    //     minutes +
    //     "rminutes:" +
    //     rminutes +
    //     "this.currentTimeZone:" +
    //     this.currentTimeZone
    // );
  }
  // logobject: {
  "logentrytypeid": number = 1;
  "sourcetype": string = "Application";
  "environment": string = environment.currentEnvironment; //"Development";
  "level": string;
  "token": string;
  "appname": string = "Qonductor";
  "version": string = environment.version;
  "timestamp": string;
  "timezone": string = this.currentTimeZone; //"Asia/Calcutta";
  "methodname": string;
  "methodtype": string;
  "message": string;
  "details": string;
  "keys": keys[] = [];
  // };
}

export class keys {
  "keyname": string;
  "keyvalue": string;
}

export class WriteLogsModel {
  application: string;
  auditlogcode: string;
  city: string;
  clientbrowser: string;
  clientip: string;
  continent: string;
  country: string;
  countrycode: string;
  groupid: string;
  loginuser: string;
  message: string;
  module: string;
  organizationid: string;
  outcome: string;
  region: string;
  screen: string;
  transactionid: string;
  useraction: string;
  userfullname: string;
  userid: string;
}

export class AuthLogs {
  clientIP: any;
  country: any;
  countryCode: any;
  continent: any;
  region: any;
  city: any;
  clientBrowser: any;
  currentUser: any;

  constructor(private http: HttpClient) {
    this.clientBrowser = ClientInfo.getbroweser();
  }
  callApi(para: any) {
    if (
      para.message != undefined &&
      para.useraction != undefined &&
      para.screen != undefined
    ) {
      // this.clientIP = sessionStorage.getItem("clientip");
      // this.country = sessionStorage.getItem("country");
      // this.countryCode = sessionStorage.getItem("countryCode");
      // this.continent = sessionStorage.getItem("continent");
      // this.region = sessionStorage.getItem("region");
      // this.city = sessionStorage.getItem("city");
      let browserIpDetails = localStorage.getItem("browserIpDetails");
      if (browserIpDetails != undefined && browserIpDetails != null) {
        let objBrowserdetails: BrowserIpDetails = JSON.parse(
          localStorage.getItem("browserIpDetails")
        );
        this.clientIP = objBrowserdetails.clientip;
        this.country = objBrowserdetails.country;
        this.countryCode = objBrowserdetails.countryCode;
        this.continent = objBrowserdetails.continent;
        this.region = objBrowserdetails.region;
        this.city = objBrowserdetails.city;
      }
      let localStorageValues = localStorage.getItem("currentUser");
      if (localStorageValues != undefined && localStorageValues != null) {
        this.currentUser = JSON.parse(localStorageValues);
      } else {
        return;
      }
      let inputWriteLog = new WriteLogsModel();
      inputWriteLog.application = "Qonductor";
      inputWriteLog.city = this.city;
      inputWriteLog.clientbrowser = this.clientBrowser;
      inputWriteLog.clientip = this.clientIP;
      inputWriteLog.continent = this.continent;
      inputWriteLog.country = this.country;
      inputWriteLog.countrycode = this.countryCode;
      inputWriteLog.loginuser = this.currentUser.loginemailid;
      inputWriteLog.userid = this.currentUser.userid;
      inputWriteLog.message = para.message;
      inputWriteLog.module = para.module;
      inputWriteLog.region = this.region;
      inputWriteLog.screen = para.screen;
      inputWriteLog.transactionid = para.transactionid
        ? para.transactionid
        : "12345678";
      inputWriteLog.useraction = para.useraction;
      inputWriteLog.userfullname = para.loginuser;
      inputWriteLog.outcome = para.outcome;
      this.http
        .post(
          environment.qoreServiceBaseUrl + "audit/v1/WriteAuditLog",
          inputWriteLog
        )
        .subscribe((res) => {});
    }
  }
}
