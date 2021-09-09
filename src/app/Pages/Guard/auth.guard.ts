import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { DataTransferService } from "../Services/Common/data-transfer.service";
import { Utility, ClientInfo } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CookieService } from "ngx-cookie-service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { AuthLogs } from "src/app/Model/Common/logs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  clsUtility: Utility;
  clsAuthLogs: AuthLogs;
  constructor(
    private router: Router,
    private dataservice: DataTransferService,
    private http: HttpClient,
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    this.clsUtility = new Utility(toastr);
    this.clsAuthLogs = new AuthLogs(http);
  }
  public isAuthenticate = false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("in can activate");

    // if (localStorage.getItem('currentUser')) {
    //   this.isAuthenticate = true;
    //   return true;
    // }

    // if (this.cookieService.check("UID") && this.cookieService.check("AID")) {
    //   this.isAuthenticate = true;
    //   return true;
    // }

    // this.isAuthenticate = false;
    // // this.router.navigate(["/login"]);
    // window.location.assign(environment.ssoServiceLoginUrl);
    // return false;
    if (this.cookieService.check("UID") && this.cookieService.check("AID")) {
      this.isAuthenticate = true;
      return true;
    }

    this.isAuthenticate = false;
    // this.router.navigate(["/login"]);
    window.location.assign(environment.ssoServiceLoginUrl);
    return false;
  }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  loginuser: number;
  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // console.log("in can activate");
    if (this.cookieService.check("UID") && this.cookieService.check("AID")) {
      // console.log("in can activate");
      this.checklogin();

      var defaultURL: string = "";
      this.dataservice.defaultNavigation.subscribe((data) => {
        defaultURL = data;
      });
      // console.log("Default URL:" + defaultURL);
      // console.log(this.dataservice.navbarLinkspermission);
      if (this.CheckPermission(next.routeConfig.path.toString())) {
        this.clsUtility.showInfo(
          "Login user not having permission. So redirect to My Dashboard."
        );
        this.router.navigate(["/" + defaultURL + ""]);
      }

      this.dataservice.loginUserID.subscribe(
        (userid) => (this.loginuser = userid)
      );
      // console.log(this.loginuser);

      this.isAuthenticate = true;
      return true;
      // if (localStorage.getItem("currentUser") && this.loginuser != 0) {
      //   this.isAuthenticate = true;
      //   return true;
      // }
    }
    this.isAuthenticate = false;
    // this.router.navigate(["/login"]);
    window.location.assign(environment.ssoServiceLoginUrl);
    return false;
  }
  // canLoad(
  //   route: Route,
  //   segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }
  localstoragevalue: any;
  localstorageToken: string;
  clientBrowser: any;

  checklogin() {
    this.localstoragevalue = localStorage.getItem("currentUser");
    // this.localstorageToken = localStorage.getItem("token");
    this.localstorageToken = this.cookieService.get("AID");
    if (this.localstoragevalue != null && this.localstorageToken != null) {
      const user = JSON.parse(this.localstoragevalue);
      // console.log(user.roles[0].roleid);
      // console.log(user);
      this.dataservice.loginName.next(user.firstname + " " + user.lastname);
      this.dataservice.roleName.next(user.roles[0].rolename);
      this.dataservice.navigation.next(user.defaultnavigation);

      this.dataservice.SelectedUserid = user.userid;
      this.dataservice.SelectedGCPUserid = user.gcpuserid;
      this.dataservice.SelectedRoleid = user.roles[0].roleid;
      this.dataservice.SelectedRoleName = user.roles[0].rolename;
      this.dataservice.applicationCode = user.applications[0].applicationcode;
      this.dataservice.applicationName = user.applications[0].applicationname;
      this.dataservice.defaultNavigation.next(user.defaultnavigation);
      this.dataservice.loginUserName = user.username;
      this.dataservice.groupIds = user.groupids;
      this.dataservice.loginUserID.next(this.dataservice.SelectedGCPUserid);
      this.dataservice.loginGCPUserID.next(this.dataservice.SelectedUserid);
      if (localStorage.getItem("links") != null) {
        this.dataservice.navbarLinkspermission = JSON.parse(
          localStorage.getItem("links")
        );
        this.dataservice.navSubject.next(
          this.dataservice.navbarLinkspermission
        );
      }
    } else {
      // alert("in else of check login");
      // return;
      window.location.assign(environment.ssoServiceLoginUrl);
    }
  }

  CheckPermission(clickedLink: string): boolean {
    var IsHavingPermission: boolean = false;
    var ModuleName: string;
    var Message: string;
    var UserAction: string;

    switch (clickedLink) {
      case "ARInventory":
        if (!this.dataservice.navbarLinkspermission.viewARInventory) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "AR Inventory permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "AR Inventory viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ARReview":
        if (!this.dataservice.navbarLinkspermission.viewARReview) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "AR Review permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "AR Review viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Agent":
        if (!this.dataservice.navbarLinkspermission.viewAgents) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Agent permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Agent viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Annoucement":
        if (!this.dataservice.navbarLinkspermission.viewAnnoucement) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Annoucement permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Annoucement viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Assistant":
        if (!this.dataservice.navbarLinkspermission.viewAssistant) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Assistant permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Assistant viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Configuration":
        if (!this.dataservice.navbarLinkspermission.viewConfiguration) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Configuration permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Configuration viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;

      // case "File":
      //   if (!this.dataservice.navbarLinkspermission.viewFile) {
      //     IsHavingPermission = true;
      //   }
      //break;

      case "Reports":
        if (!this.dataservice.navbarLinkspermission.viewReport) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Reports permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Reports viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;

      case "MyDashboard":
        if (!this.dataservice.navbarLinkspermission.viewMyDashboard) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "My Dashboard permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "My Dashboard viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "MyTask":
        if (!this.dataservice.navbarLinkspermission.viewMyTask) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "My Task permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "My Task viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      // case "Production":
      //   if (!this.dataservice.navbarLinkspermission.viewProduction) {
      //     IsHavingPermission = true;
      //   }
      //   break;
      case "ProductionDailyClose":
        if (!this.dataservice.navbarLinkspermission.viewProductionDailyClose) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Daily Close permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Daily Close viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ServiceController":
        if (!this.dataservice.navbarLinkspermission.viewServiceController) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Service Controller permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Service Controller viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ViewTask":
        if (!this.dataservice.navbarLinkspermission.viewViewTask) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "View Task permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "View Task viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "CompletedReview":
        if (!this.dataservice.navbarLinkspermission.viewCompletedReview) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Completed Review permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Completed Review viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderInventory":
        if (!this.dataservice.navbarLinkspermission.viewOrderInventory) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Inventory permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Inventory viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "MyOrderInventory":
        if (!this.dataservice.navbarLinkspermission.viewMyOrders) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "My Encounters permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "My Encounters viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderAssisted":
        if (!this.dataservice.navbarLinkspermission.viewAssistanceInventory) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Incomplete Encounters permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Incomplete Encounters viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderUpload":
        if (!this.dataservice.navbarLinkspermission.viewBiotechOrders) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Biotech Encounters permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Biotech Encounters viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "MissingCharges":
        if (!this.dataservice.navbarLinkspermission.viewMissingCharges) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Pending Encounters permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Pending Encounters viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderCompleted":
        if (!this.dataservice.navbarLinkspermission.viewCompletedInventory) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Completed Encounters permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Completed Encounters viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderExport":
        if (!this.dataservice.navbarLinkspermission.viewOrderExport) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Export permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Export viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ReadyForPrinting":
        if (!this.dataservice.navbarLinkspermission.viewReadyForPrinting) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Ready for Printing permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Ready for Printing viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "SubmittedAndPrinted":
        if (!this.dataservice.navbarLinkspermission.viewSubmittedAndPrinted) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Submitted and Printed permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Submitted and Printed viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderReview":
        if (!this.dataservice.navbarLinkspermission.viewReviewOrder) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Pending Review permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Pending Review viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "myOrderReview":
        if (!this.dataservice.navbarLinkspermission.viewMyReview) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "My Review permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "My Review viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "OrderSearch":
        if (!this.dataservice.navbarLinkspermission.viewOrderSearch) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Search permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Search viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Docsvalutorderdoc":
        if (!this.dataservice.navbarLinkspermission.viewAddOns) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Add-ons permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Add-ons viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "DocumentSearch":
        if (!this.dataservice.navbarLinkspermission.viewDocumentSearch) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Document Search permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Document Search viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "orderstatus":
        if (!this.dataservice.navbarLinkspermission.viewOrderStatus) {
          IsHavingPermission = true;
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Status permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor-Biotech";
          Message = "Encounter Status viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "client":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ClientConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Client tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Client tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "interfaces":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .InterfaceConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Client Service Interfaces tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Client Service Interfaces tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "groupclientmapping":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .GroupClientMapping
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Group Client Mapping tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Group Client Mapping tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "clientlogins":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ClientLoginsConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Client login tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Client login tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "payer":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .PayerConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Payer tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Payer tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "payercrosswalk":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .PayerCrosswalkConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Payer crosswalk tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Payer crosswalk tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "notetemplate":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .NoteTemplateConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Note template tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Note template tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "status":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .StatusConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Status tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Status tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "substatus":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .SubStatusConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Sub-Status tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Sub-Status tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "actions":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ActionConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Action tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Action tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "errortype":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ErrorTypeConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Error type tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Error type tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "automation":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .AutomationErrorConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Automation Error tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Automation Error tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "clientusermapping":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ClientUserMappingConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Client user mapping tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Client user mapping tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "qsuiteusermapping":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .QsuiteUserMappingConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Qsuite user mapping tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Qsuite user mapping tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ftpdetails":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .FTPDetailsConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "FTP Details tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "FTP Details tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "followup":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .FollowupActionConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Folllow-up Actions tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Folllow-up Actions tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "mail":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .MailConfigurationConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Mail Configuration tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Mail Configuration tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "inventoryrules":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .InventoryRuleConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Inventory Rules tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Inventory Rules tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "docsvault":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .EdocsManagerConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Edocs Manager tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Edocs Manager tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ordersubstatus":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .OrderSubStatusConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Encounter Sub-Status tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Encounter Sub-Status tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ordernote":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .OrderNoteConfiguration
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Encounter Note tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Encounter Note tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "File":
        if (!this.dataservice.navbarLinkspermission.reportAccess.FileReport) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "File tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "File tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Production":
        if (
          !this.dataservice.navbarLinkspermission.reportAccess.ProductionReport
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Production tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Production tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "Automation-Accuracy":
        if (
          !this.dataservice.navbarLinkspermission.reportAccess.AutomationReport
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Automation Accuracy tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Automation Accuracy tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ProcessFolder":
        if (!this.dataservice.navbarLinkspermission.viewReprocessFolder) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Process Folder tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Process Folder tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PendingAdditionalInfo":
        if (!this.dataservice.navbarLinkspermission.viewPendingAdditionalInfo) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message =
            "Pending for Additional Information tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Pending for Additional Information tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "RCMDocsView":
        if (!this.dataservice.navbarLinkspermission.viewRCMDocsView) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "RCM Documents View tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "RCM Documents View tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "RCMDocsImport":
        if (!this.dataservice.navbarLinkspermission.viewRCMDocsImport) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "RCM Documents Import tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "RCM Documents Import View tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PracticeDashboard":
        if (!this.dataservice.navbarLinkspermission.viewPracticeDashboard) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Practice Dashboard tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Practice Dashboard tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PracticeAssigned":
        if (!this.dataservice.navbarLinkspermission.viewPracticeAssigned) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Practice Assigned tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Practice Assigned tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PracticeCompleted":
        if (!this.dataservice.navbarLinkspermission.viewPracticeCompleted) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Practice Completed tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Practice Completed tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PracticeUserQueue":
        if (!this.dataservice.navbarLinkspermission.viewPracticeUserEncounter) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Practice Encounters tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Practice Encounters View tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "clientprovidermapping":
        if (
          !this.dataservice.navbarLinkspermission.configurationAccess
            .ClientProviderMapping
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Client Provider Mapping tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Client Provider Mapping tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ArchivedEncounters":
        if (!this.dataservice.navbarLinkspermission.viewArchivedEncounters) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Archived Encounters tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Archived Encounters View tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "PracticeAssistanceCompleted":
        if (
          !this.dataservice.navbarLinkspermission
            .viewPracticeAssistanceCompleted
        ) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Practice Assistance Completed tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Practice Assistance Completed View tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "ExecutiveDashboard":
        if (!this.dataservice.navbarLinkspermission.viewExecutiveDashboard) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Executive Dashboard tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Executive Dashboard tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
      case "AdvanceSearch":
        if (!this.dataservice.navbarLinkspermission.viewAdvanceSearch) {
          IsHavingPermission = true;
          ModuleName = "Qonductor";
          Message = "Advance Search tab permission not granted.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        } else {
          ModuleName = "Qonductor";
          Message = "Advance Search tab viewed.";
          UserAction = "Read";
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
            clientbrowser: this.clientBrowser,
            loginuser: this.dataservice.loginUserName,
            module: ModuleName,
            screen: clickedLink,
            message: Message,
            useraction: UserAction,
            transactionid: "12345678",
          };
          this.clsAuthLogs.callApi(para);
        }
        break;
    }
    // console.log("ishavingpermission: " + IsHavingPermission);

    return IsHavingPermission;
  }

  // callApi(para) {
  //   if (
  //     para.message != undefined &&
  //     para.useraction != undefined &&
  //     para.screen != undefined
  //   ) {
  //     this.http
  //       .get<any>(
  //         environment.auditUrl +
  //           "audit/WriteAuditLog?" +
  //           "application=Qonductor&clientbrowser=" +
  //           para.clientBrowser +
  //           "&clientip=" +
  //           para.clientIP +
  //           "&loginuser=" +
  //           para.loginuser +
  //           "&message=" +
  //           para.message +
  //           "&module=" +
  //           para.module +
  //           "&screen=" +
  //           para.screen +
  //           "&transactionid=" +
  //           para.transactionid +
  //           "&useraction=" +
  //           para.useraction +
  //           "&country=" +
  //           this.country +
  //           "&countrycode=" +
  //           this.countryCode +
  //           "&continent=" +
  //           this.continent +
  //           "&region=" +
  //           this.region +
  //           "&city=" +
  //           this.city +
  //           ""
  //       )
  //       .subscribe(res => {
  //         //console.log("in API", para, "response", res);
  //       });
  //   }
  // }
}
