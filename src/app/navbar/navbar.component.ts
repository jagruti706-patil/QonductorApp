import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Router } from "@angular/router";
import { LoginService } from "src/app/Pages/Services/Common/login.service";
import { Utility } from "../Model/utility";
import {
  Logindetails,
  ReleaseInfo,
  SaveUserLoginResponse,
} from "../Model/Common/login";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { SubSink } from "subsink";
declare var $: any;

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  localstoragevalue: any;
  localstoragelinks: string;
  localstorageToken: string;
  loginName: string;
  roleName: string;
  navigation: string;
  clsUtility: Utility;
  private clsLogindetails: Logindetails;
  appEnvironment: any = environment.currentEnvironment;
  releaseInfo: ReleaseInfo[] = [];
  currentReleaseInfo: ReleaseInfo = new ReleaseInfo();
  latestReleaseInfo: ReleaseInfo = new ReleaseInfo();
  loader: boolean;
  collaspeMenu: boolean = true;
  private subscription: SubSink = new SubSink();
  vwAdvanceSearch: boolean = false;

  constructor(
    private LoginService: LoginService,
    private datatransfer: DataTransferService,
    private route: Router,
    private cookieService: CookieService,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    // console.log("in navbar");
    this.dataService.navSubject.subscribe((data) => {
      if (data != null || data != undefined) {
        this.vwAdvanceSearch = data.viewAdvanceSearch;
      }
    });

    if (this.cookieService.check("UID") && this.cookieService.check("AID")) {
      this.localstoragevalue = localStorage.getItem("currentUser");
      // console.log(this.localstoragevalue);

      // this.localstorageToken = localStorage.getItem("token");
      this.localstorageToken = this.cookieService.get("AID");
      if (this.localstoragevalue != null && this.localstorageToken != null) {
        const user = JSON.parse(this.localstoragevalue);
        // console.log(user.roles[0].roleid);
        // console.log(user);
        this.datatransfer.loginName.next(user.firstname + " " + user.lastname);
        this.datatransfer.roleName.next(user.roles[0].rolename);
        this.datatransfer.navigation.next(user.defaultnavigation);

        this.datatransfer.loginName.subscribe((data) => {
          this.loginName = data;
        });
        this.datatransfer.roleName.subscribe((data) => {
          this.roleName = data;
        });
        this.datatransfer.navigation.subscribe((data) => {
          this.navigation = data;
        });
        // this.loginName = user.firstname + " " + user.lastname;
        // this.roleName = user.roles[0].rolename;
        // this.navigation = user.defaultnavigation;
        this.datatransfer.SelectedUserid = user.userid;
        this.datatransfer.SelectedGCPUserid = user.gcpuserid;
        this.datatransfer.SelectedRoleid = user.roles[0].roleid;
        this.datatransfer.SelectedRoleName = user.roles[0].rolename;
        this.datatransfer.applicationCode =
          user.applications[0].applicationcode;
        this.datatransfer.applicationName =
          user.applications[0].applicationname;
        this.datatransfer.defaultNavigation.next(user.defaultnavigation);
        this.datatransfer.loginUserName = user.username;
        this.datatransfer.loginUserID.next(this.datatransfer.SelectedGCPUserid);
        this.datatransfer.loginGCPUserID.next(this.datatransfer.SelectedUserid);
        // this.localstoragelinks= localStorage.getItem('links');
        // if (this.localstoragelinks!=null) {
        //   this.datatransfer.navbarLinkspermission=JSON.parse(this.localstoragelinks);
        // }
        // console.log(
        //   "in navbar localstorage: " +
        //     JSON.stringify(localStorage.getItem("links"))
        // );
        // console.log(
        //   "in navbar localstorage: " +
        //     localStorage.getItem("links")
        // );
        if (localStorage.getItem("links") != null) {
          this.datatransfer.navbarLinkspermission = JSON.parse(
            localStorage.getItem("links")
          );
          if (this.datatransfer.navbarLinkspermission !== undefined) {
            this.datatransfer.navSubject.next(
              this.datatransfer.navbarLinkspermission
            );
          }
        }
        // this.route.navigate([this.datatransfer.defaultNavigation]);
        // console.log(
        //   "in navbar navbarLinkspermission: " +
        //     JSON.stringify(this.datatransfer.navbarLinkspermission)
        // );
        // console.log(
        //   "in navbar navSubject: " +
        //     JSON.stringify(this.datatransfer.navSubject)
        // );
        // this.loginName = user.sloginname;
        // this.roleName = user.srolename;
        // // this.navigation = user.defaultnavigation;
        // this.datatransfer.SelectedRoleName = user.srolename;
        // console.log(this.datatransfer.applicationName);

        // if (user.nroleid > 0) {
        //   this.datatransfer.SelectedUserid = user.nuserid;
        //   this.datatransfer.SelectedRoleid = user.nroleid;
        //   this.loginName = user.lastname+' '+user.firstname;
        //   this.roleName = user.roles[0];
        //   // console.log("this.datatransfer.SelectedUserid : " + this.datatransfer.SelectedUserid);
        //   // console.log("this.datatransfer.SelectedRoleid : " + this.datatransfer.SelectedRoleid);

        // }
        this.subscription.add(
          this.datatransfer.releaseInfo.subscribe((data: ReleaseInfo[]) => {
            this.releaseInfo = data;
          })
        );
        // this.datatransfer.saveUserLoginResponse.subscribe(
        //   (data: SaveUserLoginResponse) => {
        //     if (data) {
        //       this.releaseInfo = data.releaseinfo;
        //       this.currentReleaseInfo = data.releaseflag;
        //       if (this.currentReleaseInfo) {
        //         if (this.currentReleaseInfo.releasenotesflag)
        //           $("#releaseNotesModal").modal("show");
        //       }
        //     }
        //   }
        // );
        this.subscription.add(
          this.datatransfer.currentReleaseInfo.subscribe(
            (data: ReleaseInfo) => {
              if (data) {
                this.currentReleaseInfo = data;
                // this.latestReleaseInfo = data;
                if (this.currentReleaseInfo.releasenotesflag)
                  $("#releaseNotesModal").modal("show");
              } else {
                this.currentReleaseInfo = null;
              }
            }
          )
        );
        this.releaseInfo = JSON.parse(localStorage.getItem("releaseInfo"));
        // let localStorageReleaseInfoValue = localStorage.getItem("ReleaseInfo");
        // if (localStorageReleaseInfoValue) {
        //   let releaseInfoStorageValue: SaveUserLoginResponse = <
        //     SaveUserLoginResponse
        //   >JSON.parse(localStorageReleaseInfoValue);
        //   if (releaseInfoStorageValue) {
        //     this.releaseInfo = releaseInfoStorageValue.releaseinfo;
        //     this.currentReleaseInfo = releaseInfoStorageValue.releaseflag;
        //   }
        // }
      } else {
        // this.route.navigate(["login"]);
        // alert("in else navbar");
        // return;
        window.location.assign(environment.ssoServiceLoginUrl);
      }
    }
  }

  onLogout() {
    this.updateLogindetails();
  }
  clearAndLogout() {
    localStorage.clear();
    this.datatransfer.loginGCPUserID.next("");
    this.datatransfer.SelectedRoleid = 0;
    this.datatransfer.logout();
  }
  updateLogindetails() {
    try {
      this.clsLogindetails = new Logindetails();
      this.clsLogindetails.nloginid = this.datatransfer.loginid;
      this.clsLogindetails.logoutdatetime = this.clsUtility.currentDateTime();
      const jsonlogin = JSON.stringify(this.clsLogindetails);
      this.loader = true;
      this.subscription.add(
        this.LoginService.updateLoginDetails(jsonlogin).subscribe(
          (data: {}) => {
            // this.datatransfer.loginid = data;
            this.clearAndLogout();
            // this.loader = false;
          },
          (error) => {
            this.clearAndLogout();
            // this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clearAndLogout();
      this.clsUtility.LogError(error);
    }
  }

  onChangePassword() {
    this.datatransfer.ChangePassword.next(false);
    this.route.navigate(["ChangePassword"]);
  }
  onViewReleaseNote() {
    try {
      this.updateReleasNotesFlag();
      window.open(this.currentReleaseInfo.doclocation, "_blank");
      this.datatransfer.currentReleaseInfo.next(null);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCancelReleaseNote() {
    try {
      this.updateReleasNotesFlag();
      this.datatransfer.currentReleaseInfo.next(null);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  updateReleasNotesFlag() {
    try {
      let inputbody: any = {
        nloginid: this.currentReleaseInfo.nloginid,
        loginuserid: this.datatransfer.SelectedGCPUserid,
        releasenotesflag: false,
        releaseinfo: this.currentReleaseInfo.releaseversion,
      };

      this.subscription.add(
        this.LoginService.updateReleasNotesFlag(inputbody).subscribe(
          (data) => {},
          (error) => {}
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onEnter(Searchvalue: HTMLInputElement) {
    // alert(Searchvalue);
    this.datatransfer.advanceSearchValue.next(Searchvalue.value.trim());
    Searchvalue.value = "";
    this.route.navigate(["AdvanceSearch"]);
  }
  showAboutQonductor() {
    let localStorageReleaseInfoValue = localStorage.getItem("releaseInfo");
    let latestInfo = JSON.parse(localStorageReleaseInfoValue);
    if (latestInfo && latestInfo[0]) {
      this.latestReleaseInfo = latestInfo[0];
      if (this.latestReleaseInfo) $("#aboutModal").modal("show");
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
