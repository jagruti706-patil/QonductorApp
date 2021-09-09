import { Component, OnInit } from "@angular/core";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import {
  Logindetails,
  AuthUserDetails,
  Application,
  Roles,
  BrowserIpDetails,
  Groups,
  SaveUserLoginResponse,
} from "src/app/Model/Common/login";
import { Utility, enumNavbarLinks } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../../Services/Common/login.service";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { CoreoperationService } from "../../Services/AR/coreoperation.service";
import { Subject } from "rxjs";
import {
  Navbarlinks,
  DashboardAccess,
  ConfigurationAccess,
  InventoryAccess,
  ReportAccess,
} from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-login-request",
  templateUrl: "./login-request.component.html",
  styleUrls: ["./login-request.component.css"],
})
export class LoginRequestComponent implements OnInit {
  constructor(
    private AuthService: CoreauthService,
    private toastr: ToastrService,
    private LoginService: LoginService,
    private datatransfer: DataTransferService,
    private route: Router,
    private coreService: CoreoperationService,
    private cookieService: CookieService,
    private http: HttpClient
  ) {
    this.clsUtility = new Utility(toastr);
  }
  private clsUtility: Utility;
  isUserUpdated = new Subject<any>();
  loadinglogin = false;
  ClientIP: any;
  country: any;
  continent: any;
  city: any;
  countryCode: any;
  region: any;
  georesult: any;
  public arr: any[] = [];
  ngOnInit() {
    // alert("in login request");

    this.getIP();
  }

  getIP() {
    this.http
      .get("https://extreme-ip-lookup.com/json/")
      // .map((res3) => res3.json())
      .subscribe(
        (res3: any) => {
          this.georesult = res3;
          this.arr = res3;
          if (this.georesult === undefined) {
            console.log("Unable to get geoiplookup from extreme-ip-lookup.com");
            this.AuthLogin();
          } else {
            if (this.georesult.query !== undefined) {
              this.ClientIP = this.georesult.query;
              this.country = this.georesult.country;
              this.countryCode = this.georesult.countryCode;
              this.continent = this.georesult.continent;
              this.region = this.georesult.region;
              // console.log("Ip", this.georesult);
              // sessionStorage.setItem("clientip", this.georesult.query);
              // sessionStorage.setItem("country", this.georesult.country);
              // sessionStorage.setItem("countryCode", this.georesult.countryCode);
              // sessionStorage.setItem("continent", this.georesult.continent);
              // sessionStorage.setItem("region", this.georesult.region);
              // sessionStorage.setItem("city", this.georesult.city);
              let browserIpDetails = new BrowserIpDetails();
              browserIpDetails.clientip = this.georesult.query;
              browserIpDetails.country = this.georesult.country;
              browserIpDetails.countryCode = this.georesult.countryCode;
              browserIpDetails.continent = this.georesult.continent;
              browserIpDetails.region = this.georesult.region;
              browserIpDetails.city = this.georesult.city;
              localStorage.setItem(
                "browserIpDetails",
                JSON.stringify(browserIpDetails)
              );

              this.AuthLogin();
            } else {
              this.AuthLogin();
            }
          }
        },
        (err) => {
          //   console.log("Unable to Get geoInfo");
          this.AuthLogin();
        }
      );
  }
  AuthLogin(): any {
    try {
      // var userDetails = new UserDetails();
      // userDetails.username = this.LoginUsername.value;
      // userDetails.password = this.LoginPassword.value;
      // console.log(JSON.stringify(userDetails));
      var uid: string = this.cookieService.get("UID");
      var clsLogindetails: Logindetails;
      // this.AuthService.getAuthorizeUser(uid).subscribe(
      this.AuthService.getAuthorizeUserForApp(uid).subscribe(
        // this.AuthService.getUserFromAuthService(
        //   JSON.stringify(userDetails)
        // ).subscribe(
        (data) => {
          this.loadinglogin = true;
          if (data != null) {
            if (data.status !== undefined) {
              this.clsUtility.showError(data.status);

              clsLogindetails = new Logindetails();
              clsLogindetails.nloginid = 0;
              clsLogindetails.loginuserid = 0;
              clsLogindetails.loginusername = uid;
              clsLogindetails.loginstatus = "failure";
              clsLogindetails.logindatetime = this.clsUtility.currentDateTime();
              this.postLogindetails(clsLogindetails);
              this.loadinglogin = false;

              return;
            } else {
              if (data.applications && data.applications.length > 0)
                this.updateUsers(data.applications[0].applicationcode);
              else {
                this.loadinglogin = false;
                this.clsUtility.showInfo("User don't have any permission");
              }
              // const ngcpuserid = this.MapGCPUserWithLocal(data.userid);
              this.isUserUpdated.subscribe((response) => {
                if (response) {
                  this.AuthService.getLocalGCPUser(data.userid).subscribe(
                    (gcpUser) => {
                      // console.log(gcpUser);

                      let Storage = new AuthUserDetails();
                      // console.log(this.sMasterRoles);
                      Storage.firstname = data.firstname;
                      Storage.lastname = data.lastname;
                      Storage.userid = data.userid;
                      Storage.gcpuserid = gcpUser.ngcpuserid;

                      Storage.roles = data.roles;
                      Storage.defaultnavigation = this.GetDafaultNavigation(
                        data.roles[0].rolename
                      );
                      // var objApplication: Application = new Application();
                      // objApplication = this.clsUtility.getApplication(
                      //   data.applications
                      // );
                      // // console.log(data.roles);

                      // var objRoles: Roles = new Roles();
                      // objRoles = this.clsUtility.getApplicationRole(data.roles);
                      // Storage.roles.push(objRoles);
                      // Storage.applications.push(objApplication);
                      Storage.applications = data.applications;
                      Storage.username = data.firstname + " " + data.lastname;
                      Storage.loginemailid = data.username;
                      Storage.grouplist = data.groups;
                      let objgroups: Groups[] = <Groups[]>data.groups;
                      let groupIds: string = "";
                      if (objgroups) {
                        let arrayOfIds = [];
                        objgroups.forEach((ele) =>
                          arrayOfIds.push(ele.groupid)
                        );
                        groupIds = arrayOfIds.join(","); //join by comma seperated
                      }
                      Storage.groupids = groupIds;
                      this.datatransfer.groupIds = groupIds;
                      this.datatransfer.SelectedUserid = data.userid;
                      this.datatransfer.SelectedGCPUserid = gcpUser.ngcpuserid;
                      this.datatransfer.SelectedRoleid = data.roles[0].roleid;
                      this.datatransfer.SelectedRoleName =
                        data.roles[0].rolename;
                      this.datatransfer.applicationCode =
                        data.applications[0].applicationcode;
                      this.datatransfer.applicationName =
                        data.applications[0].applicationname;
                      this.datatransfer.loginUserName =
                        data.firstname + " " + data.lastname;

                      // console.log("Group ids", groupIds);

                      // console.log("this.datatransfer.SelectedRoleName : " + JSON.stringify(this.datatransfer.SelectedRoleName));

                      localStorage.setItem(
                        "currentUser",
                        JSON.stringify(Storage)
                      );
                      // this.datatransfer.authorizationToken = data.token;
                      // this.AuthService.getUserPasswordHistory(
                      //   gcpUser.ngcpuserid
                      // ).subscribe(bIsDefaultPassword => {
                      //   // console.log("bIsDefaultPassword: " + bIsDefaultPassword);
                      //   if (bIsDefaultPassword) {
                      //     this.datatransfer.ChangePassword.next(true);
                      //     this.route.navigate(["ChangePassword"]);
                      //     return;
                      //   } else {
                      //     this.datatransfer.ChangePassword.next(false);
                      //   }
                      // });
                      this.datatransfer.ChangePassword.next(false);
                      this.datatransfer.loginUserID.next(
                        this.datatransfer.SelectedGCPUserid
                      );
                      this.datatransfer.loginGCPUserID.next(
                        this.datatransfer.SelectedUserid
                      );

                      this.setLoginNavigation();
                      this.getUserPermission(this.datatransfer.SelectedUserid);

                      clsLogindetails = new Logindetails();
                      clsLogindetails.nloginid = 0;
                      // clsLogindetails.loginuserid = data.userid;
                      clsLogindetails.loginuserid = gcpUser.ngcpuserid;
                      clsLogindetails.loginusername = uid;
                      clsLogindetails.loginstatus = "success";
                      clsLogindetails.logindatetime = this.clsUtility.currentDateTime();

                      // this.LoginService.getIpAddress().subscribe(data => {
                      //   if (data != null || data != undefined) {
                      //     // console.log(data);
                      //     console.log(data["query"]);
                      //   }
                      // });

                      this.postLogindetails(clsLogindetails);
                      this.loadinglogin = false;
                    }
                  );
                }
              });
              // switch (this.datatransfer.SelectedRoleName) {
              //   case 'RCM OPS Manager': this.route.navigate(['OPSManager']);
              //     break;
              //   case 'AR Representative': this.route.navigate(['ARResp']);
              //     break;
              //     case 'AR Manager': this.route.navigate(['ARManager']);
              //     break;
              //     case 'Client': this.route.navigate(['PracticeUser']);
              //     break;
              //     case 'System Admin': this.route.navigate(['Admin']);
              //     break;

              // }
            }
          }
        }
      );
      // console.log('localStorage.getItem()'+localStorage.getItem('currentUser'));

      // this.LoginService.getUserByLoginPassword(this.LoginUsername.value, this.LoginPassword.value).subscribe((data) => {
      //   if (data != undefined && data != null) {
      //     let User: any = data;
      //     this.Users = User;
      //     this.sMasterRoles = this.Users.userroles;
      //     if (JSON.stringify(this.sMasterRoles) != undefined || JSON.stringify(this.sMasterRoles) != null) {
      //       if (this.sMasterRoles.length > 1) {
      //         $("#addrolesModal").modal('show');
      //       }
      //       else {
      //         this.Roles.setValue(this.sMasterRoles[0].nroleid);
      //         this.saveRoles();
      //       }
      //     }
      //     else {
      //       alert("Invalid Username or Password");
      //     }
      //   }
      //   else {
      //     alert("Invalid Username or Password");
      //   }
      // })
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  postLogindetails(objLogindetails: Logindetails) {
    try {
      const jsonlogin = JSON.stringify(objLogindetails);
      this.LoginService.saveLoginDetails(jsonlogin).subscribe(
        // (data) => {
        // (data: SaveUserLoginResponse) => {
        // if (data != null || data != undefined) {
        //   if (data.releaseflag)
        //     this.datatransfer.loginid = data.releaseflag.nloginid;
        //   // data.releasenotesflag = true; //uncomment to see release note popup
        //   this.datatransfer.saveUserLoginResponse.next(data);
        //   localStorage.setItem("ReleaseInfo", JSON.stringify(data));
        //   // this.getReleaseNotes();
        //   // if (data == 1) {
        //   //   // this.clsUtility.showSuccess("Logindetails added successfully");
        //   // } else if (data == 0) {
        //   //   // this.clsUtility.showError("Logindetails not added");
        //   // }
        // }
        (data: SaveUserLoginResponse) => {
          if (data != null || data != undefined) {
            if (data.releaseflag) {
              this.datatransfer.loginid = data.releaseflag.nloginid;
              // data.releasenotesflag = true; //uncomment to see release note popup
              this.datatransfer.currentReleaseInfo.next(data.releaseflag);
              if (data.releaseinfo) {
                // console.log(data);
                localStorage.setItem(
                  "releaseInfo",
                  JSON.stringify(data.releaseinfo)
                );
                this.datatransfer.releaseInfo.next(data.releaseinfo);
              } else {
                localStorage.setItem("releaseInfo", "[]");
                this.datatransfer.releaseInfo.next([]);
              }
            }
          }
        }
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // getReleaseNotes() {
  //   try {
  //     this.LoginService.getReleaseInfo().subscribe((data) => {
  //       if (data) {
  //         // console.log(data);
  //         localStorage.setItem("releaseInfo", JSON.stringify(data));
  //         this.datatransfer.releaseInfo.next(data);
  //       } else {
  //         localStorage.setItem("releaseInfo", "[]");
  //         this.datatransfer.releaseInfo.next([]);
  //       }
  //     });
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  updateUsers(applicationcode: any): any {
    try {
      this.AuthService.getAllUsersToSave(applicationcode).subscribe((data) => {
        // console.log(data);
        const fieldName = "gcpuser";
        const fieldValue = data;
        const obj = {};
        obj[fieldName] = fieldValue;
        const jsonUser = JSON.stringify(obj);
        this.coreService.saveUsers(jsonUser).subscribe((userData) => {
          // console.log(userData);
          if (userData == 1) {
            this.isUserUpdated.next(true);
            // console.log("User updated");
          } else {
            this.isUserUpdated.next(false);
            // console.log("Error while user updated");
          }
        });
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getUserPermission(userid: string): any {
    var navbarlinks = new Navbarlinks();
    var dashboard = new DashboardAccess();
    var report = new ReportAccess();
    var configuration = new ConfigurationAccess();
    var inventory = new InventoryAccess();
    this.AuthService.getUserPermission(userid).subscribe((data) => {
      // console.log(data);
      // console.log("data in login-request: " + JSON.stringify(data));

      for (const permission of data) {
        let masterPermission: string = "" + permission.permissioncode;
        switch (masterPermission.toUpperCase()) {
          case enumNavbarLinks.ARDashboard:
            navbarlinks.viewMyDashboard = true;
            break;
          case enumNavbarLinks.ARDashboardMyTaskCard:
            dashboard.MyTaskCardAccess = true;
            break;
          case enumNavbarLinks.ARDashboardClientFilter:
            dashboard.ClientFilterAccess = true;
            break;
          case enumNavbarLinks.ARDashboardManagerCard:
            dashboard.ManagerCardAccess = true;
            break;
          case enumNavbarLinks.ARDashboardAgingBucket:
            dashboard.AgingBucketAccess = true;
            break;
          case enumNavbarLinks.ARDashboardStatusCard:
            dashboard.StatusCardAccess = true;
            break;
          case enumNavbarLinks.ARInventory:
            navbarlinks.viewARInventory = true;
            break;
          case enumNavbarLinks.DeferARInventory:
            navbarlinks.viewDeferARInventory = true;
            break;
          case enumNavbarLinks.AssignWorkitem:
            inventory.AssignWorkItem = true;
            break;
          case enumNavbarLinks.DeferWorkitem:
            inventory.DeferWorkItem = true;
            break;
          case enumNavbarLinks.UndeferWorkitem:
            inventory.UndeferWorkItem = true;
            break;
          case enumNavbarLinks.MyTask:
            navbarlinks.viewMyTask = true;
            break;
          case enumNavbarLinks.CompletedTask:
            navbarlinks.viewCompletedTask = true;
            break;
          case enumNavbarLinks.CanceledTask:
            navbarlinks.viewCanceledTask = true;
            break;
          case enumNavbarLinks.Assistant:
            navbarlinks.viewAssistant = false;
            break;
          case enumNavbarLinks.Agents:
            navbarlinks.viewAgents = true;
            break;
          case enumNavbarLinks.Report:
            navbarlinks.viewReport = true;
            break;

          case enumNavbarLinks.File:
            report.FileReport = true;
            break;
          case enumNavbarLinks.Production:
            report.ProductionReport = true;
            break;
          case enumNavbarLinks.AutomationAccuracy:
            report.AutomationReport = true;
            break;
          case enumNavbarLinks.Annoucement:
            navbarlinks.viewAnnoucement = false;
            break;
          case enumNavbarLinks.Configuration:
            navbarlinks.viewConfiguration = true;
            break;
          case enumNavbarLinks.ClientConfiguration:
            configuration.ClientConfiguration = true;
            break;
          case enumNavbarLinks.InterfaceConfiguration:
            configuration.InterfaceConfiguration = true;
            break;
          case enumNavbarLinks.GroupClientMapping:
            configuration.GroupClientMapping = true;
            break;
          case enumNavbarLinks.ClientLoginsConfiguration:
            configuration.ClientLoginsConfiguration = true;
            break;
          case enumNavbarLinks.PayerConfiguration:
            configuration.PayerConfiguration = true;
            break;
          case enumNavbarLinks.PayerCrosswalkConfiguration:
            configuration.PayerCrosswalkConfiguration = true;
            break;
          case enumNavbarLinks.NoteTemplateConfiguration:
            configuration.NoteTemplateConfiguration = true;
            break;
          case enumNavbarLinks.StatusConfiguration:
            configuration.StatusConfiguration = true;
            break;
          case enumNavbarLinks.SubStatusConfiguration:
            configuration.SubStatusConfiguration = true;
            break;
          case enumNavbarLinks.ActionConfiguration:
            configuration.ActionConfiguration = true;
            break;
          case enumNavbarLinks.ErrorTypeConfiguration:
            configuration.ErrorTypeConfiguration = true;
            break;
          case enumNavbarLinks.AutomationErrorConfiguration:
            configuration.AutomationErrorConfiguration = true;
            break;
          case enumNavbarLinks.ClientUserMappingConfiguration:
            configuration.ClientUserMappingConfiguration = true;
            break;
          case enumNavbarLinks.QsuiteUserMappingConfiguration:
            configuration.QsuiteUserMappingConfiguration = true;
            break;
          case enumNavbarLinks.FTPDetailsConfiguration:
            configuration.FTPDetailsConfiguration = true;
            break;
          case enumNavbarLinks.FollowupActionConfiguration:
            configuration.FollowupActionConfiguration = true;
            break;
          case enumNavbarLinks.MailConfigurationConfiguration:
            configuration.MailConfigurationConfiguration = true;
            break;
          case enumNavbarLinks.InventoryRuleConfiguration:
            configuration.InventoryRuleConfiguration = true;
            break;
          case enumNavbarLinks.EdocsManagerConfiguration:
            configuration.EdocsManagerConfiguration = true;
            break;
          case enumNavbarLinks.OrderSubStatusConfiguration:
            configuration.OrderSubStatusConfiguration = true;
            break;
          case enumNavbarLinks.OrderNoteConfiguration:
            configuration.OrderNoteConfiguration = true;
            break;
          case enumNavbarLinks.ClientProviderMapping:
            configuration.ClientProviderMapping = true;
            break;
          case enumNavbarLinks.ARReview:
            navbarlinks.viewARReview = true;
            break;
          case enumNavbarLinks.ARCompletedReview:
            navbarlinks.viewCompletedReview = true;
            break;
          case enumNavbarLinks.ServiceController:
            navbarlinks.viewServiceController = true;
            break;
          case enumNavbarLinks.ProductionDailyClose:
            navbarlinks.viewProductionDailyClose = true;
            break;
          case enumNavbarLinks.ViewTask:
            navbarlinks.viewViewTask = true;
            break;
          case enumNavbarLinks.OrderInventory:
            navbarlinks.viewOrderInventory = true;
            break;
          case enumNavbarLinks.AssignOrder:
            navbarlinks.viewAssignOrder = true;
            break;
          case enumNavbarLinks.MyOrders:
            navbarlinks.viewMyOrders = true;
            break;
          case enumNavbarLinks.CompletedInventory:
            navbarlinks.viewCompletedInventory = true;
            break;
          case enumNavbarLinks.AssistanceInventory:
            navbarlinks.viewAssistanceInventory = true;
            break;
          case enumNavbarLinks.MissingCharges:
            navbarlinks.viewMissingCharges = true;
            break;
          case enumNavbarLinks.ReviewOrder:
            navbarlinks.viewReviewOrder = true;
            break;
          case enumNavbarLinks.UpdateEntrStatusOnPendingReview:
            navbarlinks.viewUpdateEntrStatusOnPendingReview = true;
            break;
          case enumNavbarLinks.MarkIncompleteOnPendingReview:
            navbarlinks.viewMarkIncompleteOnPendingReview = true;
            break;
          case enumNavbarLinks.UpdateEntrStatusOnMyReview:
            navbarlinks.viewUpdateEntrStatusOnMyReview = true;
            break;
          case enumNavbarLinks.MarkIncompleteOnMyReview:
            navbarlinks.viewMarkIncompleteOnMyReview = true;
            break;
          case enumNavbarLinks.MarkCompleteOnAssistance:
            navbarlinks.viewMarkCompleteOnAssistance = true;
            break;
          case enumNavbarLinks.MarkIncompleteOnAssistance:
            navbarlinks.viewMarkIncompleteOnAssistance = true;
            break;
          case enumNavbarLinks.ARTracking:
            navbarlinks.viewARTracking = true;
            break;
          case enumNavbarLinks.EncounterTracking:
            navbarlinks.viewEncounterTracking = true;
            break;
          // case enumNavbarLinks.OrderGen:
          // case enumNavbarLinks.OrderTox:
          //   if (enumNavbarLinks.OrderGen == "2.16.P3")
          //     this.datatransfer.orderType.next("GEN");
          //   else if (enumNavbarLinks.OrderTox == "2.16.P4")
          //     this.datatransfer.orderType.next("TOX");
          //   else this.datatransfer.orderType.next("");
          //   break;
          case enumNavbarLinks.MyReview:
            navbarlinks.viewMyReview = true;
            break;
          case enumNavbarLinks.AssignReview:
            navbarlinks.viewAssignReview = true;
            break;
          case enumNavbarLinks.ExportGrid:
            navbarlinks.viewExportGrid = true;
            break;
          case enumNavbarLinks.OrderSearch:
            navbarlinks.viewOrderSearch = true;
            break;
          case enumNavbarLinks.DocumentSearch:
            navbarlinks.viewDocumentSearch = true;
            break;
          case enumNavbarLinks.ReassignOrder:
            navbarlinks.viewReassignOrder = true;
            break;
          case enumNavbarLinks.AddCabinets:
            navbarlinks.viewAddCabinets = true;
            break;
          case enumNavbarLinks.ProcessFolders:
            navbarlinks.viewProcessFolders = true;
            break;
          case enumNavbarLinks.OrderAssistance:
            navbarlinks.viewTriarqAssistance = true;
            break;
          case enumNavbarLinks.ReleaseAssignment:
            navbarlinks.viewReleaseAssignment = true;
            break;
          case enumNavbarLinks.ReleaseAssignedReview:
            navbarlinks.viewReleaseButton = true;
            break;
          case enumNavbarLinks.AddOns:
            navbarlinks.viewAddOns = true;
            break;
          case enumNavbarLinks.SendToBT:
            navbarlinks.viewSendToBT = true;
            break;
          case enumNavbarLinks.BiotechOrders:
            navbarlinks.viewBiotechOrders = true;
            break;
          case enumNavbarLinks.OrderSearchUpdateBtn:
            navbarlinks.viewOsUpdateBtn = true;
            break;
          case enumNavbarLinks.UploadToDocsvaultBtn:
            navbarlinks.viewUploadToDocsvault = true;
            break;
          case enumNavbarLinks.UpdateMissingInfoBtn:
            navbarlinks.viewUpdateMissingInfo = true;
            break;
          case enumNavbarLinks.ReprocessFolder:
            navbarlinks.viewReprocessFolder = true;
            break;
          case enumNavbarLinks.AllowMultiple:
            navbarlinks.viewAllowMultiple = true;
            break;
          case enumNavbarLinks.OrderStatus:
            navbarlinks.viewOrderStatus = true;
            break;
          case enumNavbarLinks.DownloadOnIncomplete:
            navbarlinks.viewDownloadOnIncomplete = true;
            break;
          case enumNavbarLinks.DownloadAndSendToBiotech:
            navbarlinks.viewDownloadAndSendToBiotech = true;
            break;
          case enumNavbarLinks.ViewMissingInfo:
            navbarlinks.viewShowMissingInfo = true;
            break;
          case enumNavbarLinks.DownloadOnBiotechOrders:
            navbarlinks.viewDownloadOnBiotechOrders = true;
            break;
          case enumNavbarLinks.UpdateInfoOnBiotechOrders:
            navbarlinks.viewUpdateInfoOnBiotechOrders = true;
            break;
          case enumNavbarLinks.EncounterHistoryAddCommentBtn:
            navbarlinks.viewEncounterHistoryAddComment = true;
            break;
          case enumNavbarLinks.UpdateOnHistory:
            navbarlinks.viewUpdateOnHistory = true;
            break;
          case enumNavbarLinks.OrderExport:
            navbarlinks.viewOrderExport = true;
            break;
          case enumNavbarLinks.ReadyForPrinting:
            navbarlinks.viewReadyForPrinting = true;
            break;
          case enumNavbarLinks.SubmittedAndPrinted:
            navbarlinks.viewSubmittedAndPrinted = true;
            break;
          case enumNavbarLinks.PrintBtn:
            navbarlinks.viewPrintBtn = true;
            break;
          case enumNavbarLinks.PrintAllBtn:
            navbarlinks.viewPrintAllBtn = true;
            break;
          case enumNavbarLinks.RePrintBtn:
            navbarlinks.viewRePrintBtn = true;
            break;
          case enumNavbarLinks.FinishedAndReturnedBtn:
            navbarlinks.viewFinishedAndReturnedBtn = true;
            break;
          case enumNavbarLinks.FailedAndReturnedBtn:
            navbarlinks.viewFailedAndReturnedBtn = true;
            break;
          case enumNavbarLinks.ReturnedWithoutWorkingBtn:
            navbarlinks.viewReturnedWithoutWorkingBtn = true;
            break;
          case enumNavbarLinks.PendingAdditionalInfo:
            navbarlinks.viewPendingAdditionalInfo = true;
            break;
          case enumNavbarLinks.RCMDocsView:
            navbarlinks.viewRCMDocsView = true;
            break;
          case enumNavbarLinks.RCMDocsDashboard:
            navbarlinks.viewRCMDocsDashboard = true;
            break;
          case enumNavbarLinks.RCMDocsImport:
            navbarlinks.viewRCMDocsImport = true;
            break;
          case enumNavbarLinks.ImportDocsBtn:
            navbarlinks.viewImportDocumentsBtn = true;
            break;

          case enumNavbarLinks.Dashboard:
            navbarlinks.viewDashboard = true;
            break;
          case enumNavbarLinks.Documents:
            navbarlinks.viewDocuments = true;
            break;
          case enumNavbarLinks.Printing:
            navbarlinks.viewPrinting = true;
            break;
          case enumNavbarLinks.MoveDocsBtn:
            navbarlinks.viewMoveDocumentsBtn = true;
            break;
          case enumNavbarLinks.DeleteDocsBtn:
            navbarlinks.viewDeleteDocumentsBtn = true;
            break;
          case enumNavbarLinks.AssistanceSendToPracticeBtn:
            navbarlinks.viewSendToPractice = true;
            break;
          case enumNavbarLinks.DeleteRcmDocNoteBtn:
            navbarlinks.viewDeleteRcmDocNote = true;
            break;
          case enumNavbarLinks.DeleteRcmDocAnswerBtn:
            navbarlinks.viewDeleteRcmDocAnswer = true;
            break;
          case enumNavbarLinks.IncompleteSendToPracticeBtn:
            navbarlinks.viewIncompleteSendToPracticeBtn = true;
            break;
          case enumNavbarLinks.PracticeAssigned:
            navbarlinks.viewPracticeAssigned = true;
            break;
          case enumNavbarLinks.PracticeCompleted:
            navbarlinks.viewPracticeCompleted = true;
            break;
          case enumNavbarLinks.PracticeCompletedAssignEncounterBtn:
            navbarlinks.viewPracticeCompletedAssignEncounterBtn = true;
            break;
          case enumNavbarLinks.ReadyForPrintSendToPracticeBtn:
            navbarlinks.viewReadyForPrintSendToPracticeBtn = true;
            break;
          case enumNavbarLinks.SubmittedAndPrintedSendToPractice:
            navbarlinks.viewSubmittedAndPrintedSendToPractice = true;
            break;
          case enumNavbarLinks.PracticeAssignedReleaseAssignment:
            navbarlinks.viewPracticeAssignedReleaseAssignment = true;
            break;
          case enumNavbarLinks.PracticeEncounters:
            navbarlinks.viewPracticeUserEncounter = true;
            break;
          case enumNavbarLinks.AddComment:
            navbarlinks.viewAddComment = true;
            break;
          case enumNavbarLinks.PracticeDashboard:
            navbarlinks.viewPracticeDashboard = true;
            break;
          case enumNavbarLinks.ShowAllGroupDataFilter:
            navbarlinks.viewShowAllGroupDataFilter = true;
            break;
          case enumNavbarLinks.GroupWiseCards:
            navbarlinks.viewGroupWiseCards = true;
            break;
          case enumNavbarLinks.PracticeAssignedAgingBucket:
            navbarlinks.viewPracticeAssignedAgingBucket = true;
            break;
          case enumNavbarLinks.IncompleteSummary:
            navbarlinks.viewIncompleteSummary = true;
            break;
          case enumNavbarLinks.ArchivedEncounters:
            navbarlinks.viewArchivedEncounters = true;
            break;
          case enumNavbarLinks.PracticeAssistanceCompleted:
            navbarlinks.viewPracticeAssistanceCompleted = true;
            break;
          case enumNavbarLinks.ReleaseArchivedBtn:
            navbarlinks.viewReleaseArchived = true;
            break;
          case enumNavbarLinks.ExecutiveDashboard:
            navbarlinks.viewExecutiveDashboard = true;
            break;
          case enumNavbarLinks.ShowAllPractice:
            navbarlinks.viewShowAllPractice = true;
            break;
          case enumNavbarLinks.AdvanceSearch:
            navbarlinks.viewAdvanceSearch = true;
            break;
        }
      }
      navbarlinks.dashboardAccess = dashboard;
      navbarlinks.configurationAccess = configuration;
      navbarlinks.inventoryAccess = inventory;
      navbarlinks.reportAccess = report;

      // console.log("links in login-request: " + JSON.stringify(navbarlinks));
      localStorage.setItem("links", JSON.stringify(navbarlinks));
      this.datatransfer.navSubject.next(navbarlinks);
    });
  }
  GetDafaultNavigation(arg0: any): string {
    var navigation = "";
    // console.log(this.datatransfer.SelectedRoleName);
    switch (arg0) {
      case "RCM OPS Manager":
        navigation = "OPSManager";
        break;
      case "AR Representative":
        navigation = "ARResp";
        break;
      case "AR Manager":
        navigation = "ARManager";
        break;
      case "Client":
        navigation = "PracticeUser";
        break;
      case "System Admin":
        navigation = "Admin";
        break;
      case "AR Auditor":
        navigation = "ARAuditor";
        break;
      case "RCM Performance Manager":
        navigation = "PERManager";
        break;
      default:
        navigation = "Home";
        break;
    }
    return navigation;
  }

  private setLoginNavigation(): string {
    if (localStorage.getItem("currentUser") != null) {
      this.datatransfer.loggedIn.next(true);
      var navigation = "";
      // console.log(this.datatransfer.SelectedRoleName);
      switch (this.datatransfer.SelectedRoleName) {
        case "RCM OPS Manager":
          this.route.navigate(["OPSManager"]);
          navigation = "OPSManager";
          break;
        case "AR Representative":
          this.route.navigate(["ARResp"]);
          navigation = "ARResp";
          break;
        case "AR Manager":
          this.route.navigate(["ARManager"]);
          navigation = "ARManager";
          break;
        case "Client":
          this.route.navigate(["PracticeUser"]);
          navigation = "PracticeUser";
          break;
        case "System Admin":
          this.route.navigate(["Admin"]);
          navigation = "Admin";
          break;
        case "AR Auditor":
          this.route.navigate(["ARAuditor"]);
          navigation = "ARAuditor";
          break;
        case "RCM Performance Manager":
          this.route.navigate(["PERManager"]);
          navigation = "PERManager";
          break;
        default:
          this.route.navigate(["Home"]);
          navigation = "Home";
          break;
      }
      // this.route.navigate(['Home']);
    } else {
      // this.route.navigate(["login"]);
      window.location.assign(environment.ssoServiceLoginUrl);
      // return;
    }
    return navigation;
  }
}
