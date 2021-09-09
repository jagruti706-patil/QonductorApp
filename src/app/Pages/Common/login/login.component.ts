import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "src/app/Pages/Services/Common/login.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  Login,
  User,
  UserLogin,
  UserDetails,
  AuthUserDetails,
  Logindetails,
} from "src/app/Model/Common/login";
import { Utility, enumNavbarLinks } from "src/app/Model/utility";
import { anyChanged } from "@progress/kendo-angular-grid/dist/es2015/utils";
import { CoreauthService } from "../../Services/Common/coreauth.service";
import { Navbarlinks } from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import { ToastrService } from "ngx-toastr";
import { CoreoperationService } from "../../Services/AR/coreoperation.service";
import { SubSink } from "../../../../../node_modules/subsink";
import { Subject } from "rxjs";
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  private sMasterRoles: any;
  private localstoragevalue: any;
  private Users: User;
  private clsUtility: Utility;
  private clsLogindetails: Logindetails;

  // Loading
  loadinglogin = false;

  constructor(
    private fb: FormBuilder,
    private LoginService: LoginService,
    private AuthService: CoreauthService,
    private route: Router,
    private datatransfer: DataTransferService,
    private toastr: ToastrService,
    private coreService: CoreoperationService
  ) {
    this.clsUtility = new Utility(toastr);
    this.Users = new User();
  }
  isUserUpdated = new Subject<any>();
  LoginGroup = this.fb.group({
    fcUsername: [
      "",
      [Validators.required, Validators.email, Validators.maxLength(50)],
    ],
    fcPassword: [
      "",
      [Validators.required, Validators.minLength(8), Validators.maxLength(50)],
    ],
  });

  RoleGroup = this.fb.group({
    fcRoles: ["", Validators.required],
  });

  get LoginUsername() {
    return this.LoginGroup.get("fcUsername");
  }

  get LoginPassword() {
    return this.LoginGroup.get("fcPassword");
  }

  get Roles() {
    return this.RoleGroup.get("fcRoles");
  }

  ngOnInit() {
    // this.GetUsers();
  }

  // GetUsers() {
  //   this.Users = this.LoginService.getUser();
  // }

  GetUsersByLoginPassword() {
    try {
      this.LoginService.getUserByLoginPassword(
        this.LoginUsername.value,
        this.LoginPassword.value
      ).subscribe((data) => {
        if (data != undefined && data != null) {
          let User: any = data;
          this.Users = User;
          this.sMasterRoles = this.Users.userroles;
          if (
            JSON.stringify(this.sMasterRoles) != undefined ||
            JSON.stringify(this.sMasterRoles) != null
          ) {
            if (this.sMasterRoles.length > 1) {
              $("#addrolesModal").modal("show");
            } else {
              this.Roles.setValue(this.sMasterRoles[0].nroleid);
              this.saveRoles();
            }
          } else {
            this.clsUtility.showWarning("Invalid Username or Password");
          }
        } else {
          this.clsUtility.showWarning("Invalid Username or Password");
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateLogin() {
    if (this.LoginUsername.valid && this.LoginPassword.valid) {
      return true;
    } else {
      return false;
    }
  }

  validateRoles() {
    if (this.Roles.valid) {
      return true;
    } else {
      return false;
    }
  }

  onRolesChange($event) {
    try {
      // console.log("onRolesChange $event: " + JSON.stringify($event));
      // console.log("onRolesChange : " + JSON.stringify(this.Roles.value));
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onLogin() {
    try {
      // this.GetUsersByLoginPassword();
      this.AuthLogin();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  AuthLogin(): any {
    try {
      var userDetails = new UserDetails();
      userDetails.username = this.LoginUsername.value;
      userDetails.password = this.LoginPassword.value;
      // console.log(JSON.stringify(userDetails));

      this.AuthService.getUserFromAuthService(
        JSON.stringify(userDetails)
      ).subscribe((data) => {
        this.loadinglogin = true;
        if (data != null) {
          if (data.status !== undefined) {
            this.clsUtility.showError(data.status);

            this.clsLogindetails = new Logindetails();
            this.clsLogindetails.nloginid = 0;
            this.clsLogindetails.loginuserid = 0;
            this.clsLogindetails.loginusername = this.LoginUsername.value;
            this.clsLogindetails.loginstatus = "failure";
            this.clsLogindetails.logindatetime = this.clsUtility.currentDateTime();
            this.postLogindetails();
            this.loadinglogin = false;
            return;
          } else {
            this.updateUsers(data.applications[0].applicationcode);
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
                    Storage.applications = data.applications;
                    Storage.username = data.firstname + " " + data.lastname;
                    this.datatransfer.SelectedUserid = data.userid;
                    this.datatransfer.SelectedGCPUserid = gcpUser.ngcpuserid;
                    this.datatransfer.SelectedRoleid = data.roles[0].roleid;
                    this.datatransfer.SelectedRoleName = data.roles[0].rolename;
                    this.datatransfer.applicationCode =
                      data.applications[0].applicationcode;
                    this.datatransfer.applicationName =
                      data.applications[0].applicationname;
                    this.datatransfer.loginUserName =
                      data.firstname + " " + data.lastname;
                    // console.log("this.datatransfer.SelectedRoleName : " + JSON.stringify(this.datatransfer.SelectedRoleName));

                    localStorage.setItem(
                      "currentUser",
                      JSON.stringify(Storage)
                    );
                    // this.datatransfer.authorizationToken = data.token;
                    this.AuthService.getUserPasswordHistory(
                      gcpUser.ngcpuserid
                    ).subscribe((bIsDefaultPassword) => {
                      // console.log("bIsDefaultPassword: " + bIsDefaultPassword);
                      if (bIsDefaultPassword) {
                        this.datatransfer.ChangePassword.next(true);
                        this.route.navigate(["ChangePassword"]);
                        return;
                      } else {
                        this.datatransfer.ChangePassword.next(false);
                      }
                    });

                    this.datatransfer.loginUserID.next(
                      this.datatransfer.SelectedGCPUserid
                    );
                    this.datatransfer.loginGCPUserID.next(
                      this.datatransfer.SelectedUserid
                    );

                    this.setLoginNavigation();
                    this.getUserPermission(this.datatransfer.SelectedUserid);

                    this.clsLogindetails = new Logindetails();
                    this.clsLogindetails.nloginid = 0;
                    // this.clsLogindetails.loginuserid = data.userid;
                    this.clsLogindetails.loginuserid = gcpUser.ngcpuserid;
                    this.clsLogindetails.loginusername = this.LoginUsername.value;
                    this.clsLogindetails.loginstatus = "success";
                    this.clsLogindetails.logindatetime = this.clsUtility.currentDateTime();

                    // this.LoginService.getIpAddress().subscribe(data => {
                    //   if (data != null || data != undefined) {
                    //     // console.log(data);
                    //     console.log(data["query"]);
                    //   }
                    // });

                    this.postLogindetails();
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
      });
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
            console.log("User updated in DB");
          } else {
            this.isUserUpdated.next(false);
            console.log("Error while user updated");
          }
        });
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getUserPermission(userid: string): any {
    var navbarlinks = new Navbarlinks();

    this.AuthService.getUserPermission(userid).subscribe((data) => {
      // console.log(data);

      for (const permission of data) {
        switch (permission.moduledescription) {
          case enumNavbarLinks.ARDashboard:
            navbarlinks.viewMyDashboard = true;
            break;
          case enumNavbarLinks.ARInventory:
            navbarlinks.viewARInventory = true;
            break;
          case enumNavbarLinks.MyTask:
            navbarlinks.viewMyTask = true;
            break;
          case enumNavbarLinks.Assistant:
            navbarlinks.viewAssistant = false;
            break;
          case enumNavbarLinks.Agents:
            navbarlinks.viewAgents = true;
            break;
          case enumNavbarLinks.File:
            navbarlinks.viewFile = true;
            break;
          case enumNavbarLinks.Production:
            navbarlinks.viewProduction = true;
            break;
          case enumNavbarLinks.Annoucement:
            navbarlinks.viewAnnoucement = false;
            break;
          case enumNavbarLinks.Configuration:
            navbarlinks.viewConfiguration = true;
            break;
          case enumNavbarLinks.ARReview:
            navbarlinks.viewARReview = true;
            if (permission.permissioncode === "2.10.P11") {
              navbarlinks.viewCompletedReview = true;
            }
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
        }
      }
      // console.log(navbarlinks);
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
      this.route.navigate(["login"]);
      // return;
    }
    return navigation;
  }

  saveRoles() {
    try {
      if (
        this.sMasterRoles != undefined &&
        (this.Roles.value != null || this.Roles.value != undefined)
      ) {
        let Storage = new UserLogin();
        // console.log(this.sMasterRoles);

        if (this.sMasterRoles.find((x) => x.nroleid == this.Roles.value)) {
          const index = this.sMasterRoles.findIndex(
            (x) => x.nroleid == this.Roles.value
          );
          Storage.sloginname = this.Users.sloginname;
          Storage.srolename = this.sMasterRoles[index].srolename;
          Storage.nuserid = this.sMasterRoles[index].nuserid;
          Storage.nroleid = this.sMasterRoles[index].nroleid;
          this.datatransfer.SelectedUserid = this.sMasterRoles[index].nuserid;
          this.datatransfer.SelectedRoleid = this.sMasterRoles[index].nroleid;
        }

        // console.log("Storage : " + JSON.stringify(Storage));

        localStorage.setItem("currentUser", JSON.stringify(Storage));
      }
      this.localstoragevalue = localStorage.getItem("currentUser");
      // console.log("this.localstoragevalue :" + this.localstoragevalue);
      // console.log("this.localstoragevalue.nroleid : " + this.localstoragevalue["nroleid"]);

      // this.datatransfer.SelectedUserid = this.localstoragevalue.nroleid;

      if (this.localstoragevalue != null) {
        this.datatransfer.loggedIn.next(true);
        // console.log(this.datatransfer.SelectedRoleid);

        switch (this.datatransfer.SelectedRoleid) {
          case 1:
            this.route.navigate(["OPSManager"]);
            break;
          case 2:
            this.route.navigate(["ARResp"]);
            break;
        }
        // this.route.navigate(['Home']);
      } else {
        this.route.navigate(["login"]);
        // return;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  postLogindetails() {
    try {
      const jsonlogin = JSON.stringify(this.clsLogindetails);
      this.LoginService.saveLoginDetails(jsonlogin).subscribe((data: {}) => {
        if (data != null || data != undefined) {
          this.datatransfer.loginid = data;
          // if (data == 1) {
          //   // this.clsUtility.showSuccess("Logindetails added successfully");
          // } else if (data == 0) {
          //   // this.clsUtility.showError("Logindetails not added");
          // }
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
