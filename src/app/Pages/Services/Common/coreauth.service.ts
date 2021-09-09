import { Injectable } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { DataTransferService } from "./data-transfer.service";
import { GCPUser, ChangePassword } from "src/app/Model/Common/login";
import { MailSend } from "src/app/Model/AR Management/Configuration/mail";

@Injectable({
  providedIn: "root",
})
export class CoreauthService {
  authServiceEndpoint = environment.authServiceUrl;
  qoreServiceEndpoint = environment.qoreServiceBaseUrl;
  coreServiceEndPoint = environment.coreServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  private clsUtility: Utility;

  constructor(
    private httpClient: HttpClient,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
  }

  getUserFromAuthService(logindetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.authServiceEndpoint + "signin",
        logindetails,
        this.httpOptions
      )
      .pipe(
        map((authuserdetails) => {
          if (authuserdetails && authuserdetails.token) {
            localStorage.setItem(
              "token",
              authuserdetails.token
              // this.clsUtility.encryptobj(authuserdetails.token)
            );
            // localStorage.setItem("authtoken", authuserdetails.token);
          }
          return authuserdetails;
        }),
        catchError(this.handleError)
      );
  }
  getAuthorizeUser(uid): Observable<any> {
    // console.log(uid);

    return this.httpClient
      .get<any>(this.authServiceEndpoint + "cicp/authorizeUser/" + uid)
      .pipe(catchError(this.handleError));
  }

  getAuthorizeUserForApp(uid): Observable<any> {
    // console.log("authorizeUserForApp");

    return this.httpClient
      .get<any>(
        this.authServiceEndpoint + "cicp/authorizeUserForApp/" + uid + "/2"
      )
      .pipe(catchError(this.handleError));
  }
  changePasswordAuthService(userDetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.authServiceEndpoint + "users/changepassword",
        userDetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveChangePasswordDetails(
    ChangePasswordDetails: ChangePassword
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "GCPUserPasswordHistory/Save",
        ChangePasswordDetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  updateChangePasswordDetails(
    ChangePasswordDetails: ChangePassword
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "GCPUserPasswordHistory/Update",
        ChangePasswordDetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getUserPermission(userid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.authServiceEndpoint +
          "users/applicationpermissions/" +
          userid +
          "/" +
          this.dataService.applicationCode
      )
      .pipe(catchError(this.handleError));
  }
  getUserPasswordHistory(userid: number): Observable<any> {
    return this.httpClient
      .get<any>(this.coreServiceEndPoint + "GCPUserPasswordHistory/" + userid)
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<GCPUser[]> {
    return this.httpClient
      .get<GCPUser[]>(
        this.authServiceEndpoint +
          "users/" +
          this.dataService.applicationCode +
          "/0"
      )
      .pipe(catchError(this.handleError));
  }

  getUsersByRole(roleid: number): Observable<GCPUser[]> {
    return this.httpClient
      .get<GCPUser[]>(
        this.authServiceEndpoint +
          "users/" +
          this.dataService.applicationCode +
          "/" +
          roleid
      )
      .pipe(
        map((users) => {
          // console.log(users);
          // var returnedUser: [];
          // var userWorkDetails: any;
          // var user=GCPUser;
          // user=users[0];
          // this.getUserWorkDetails(users[0].userid).subscribe(data => {
          //   userWorkDetails = data;
          //   console.log(userWorkDetails);
          //   users[0].pendingtask=data.pending_task
          //   returnedUser.push(users[0])
          // });
          var returnedUser: GCPUser[] = [];
          for (const user of users) {
            this.getUserWorkDetails(user.userid).subscribe((data) => {
              user.pendingtask = data.pending_task;
              user.workavg = data.work_avg;
              user.errorrate = data.error_rate;
              user.initials =
                user.firstname.substr(0, 1).toUpperCase() +
                user.lastname.substr(0, 1).toUpperCase();
              // console.log(user);
              returnedUser.push(user);
            });
          }
          // console.log(returnedUser);

          return returnedUser;
        }),
        catchError(this.handleError)
      );
  }

  getUserWorkDetails(userid: any): Observable<any> {
    return this.httpClient
      .get<any>(this.coreServiceEndPoint + "Users/GetAgentWorkDetail/" + userid)
      .pipe(catchError(this.handleError));
  }

  getAllRoles(): Observable<any> {
    return this.httpClient.get<any>(
      this.authServiceEndpoint +
        "role/applicationcode/" +
        this.dataService.applicationCode
    );
    // .pipe(catchError(this.handleError));
  }

  getAllLocalGCPUser(): Observable<GCPUser[]> {
    return this.httpClient
      .get<GCPUser[]>(this.coreServiceEndPoint + "GCPUser")
      .pipe(catchError(this.handleError));
  }

  getLocalGCPUser(nuserid: any): Observable<GCPUser> {
    return this.httpClient
      .get<GCPUser>(this.coreServiceEndPoint + "GCPUser/User/" + nuserid)
      .pipe(catchError(this.handleError));
  }

  getAllLocalGCPUserByRoleid(roleid: number): Observable<any[]> {
    return this.httpClient
      .get<any>(this.coreServiceEndPoint + "GCPUser/" + roleid)
      .pipe(catchError(this.handleError));
  }

  getAllLocalUserWorkDetails(roleid: number): Observable<any[]> {
    return this.httpClient
      .get<GCPUser[]>(this.coreServiceEndPoint + "GCPUser/" + roleid)
      .pipe(
        map((users) => {
          var returnedUser: GCPUser[] = [];
          for (const user of users) {
            this.getUserWorkDetails(user.ngcpuserid).subscribe((data) => {
              // console.log(data);

              user.pendingtask = data.pending_task;
              user.workavg = data.work_avg;
              user.errorrate = data.error_rate;
              user.initials =
                user.firstname.substr(0, 1).toUpperCase() +
                user.lastname.substr(0, 1).toUpperCase();

              if (data.work_avg >= 0 && data.work_avg <= 5) {
                user.rating = 1;
              }
              if (data.work_avg >= 6 && data.work_avg <= 15) {
                user.rating = 2;
              }
              if (data.work_avg >= 16 && data.work_avg <= 25) {
                user.rating = 3;
              }
              if (data.work_avg >= 26 && data.work_avg <= 35) {
                user.rating = 1;
              }
              if (data.work_avg >= 36) {
                user.rating = 1;
              }
              // console.log(user);
              returnedUser.push(user);
            });
          }
          // console.log(returnedUser);

          return returnedUser;
        }),
        catchError(this.handleError)
      );
  }

  sendMail(emailconfiguration: MailSend, file: File): Observable<any> {
    var objFormDate = new FormData();

    objFormDate.append("To", emailconfiguration.To);
    objFormDate.append("Cc", emailconfiguration.Cc);
    objFormDate.append("FromEmail", emailconfiguration.FromEmail);
    objFormDate.append("FromPassword", emailconfiguration.FromPassword);
    objFormDate.append("Body", emailconfiguration.Body);
    objFormDate.append("Subject", emailconfiguration.Subject);
    objFormDate.append("file", file);

    return this.httpClient
      .post<any>(this.authServiceEndpoint + "sendAttachmentMail", objFormDate)
      .pipe(catchError(this.handleError));
  }
  // getAllLocalUserWorkDetails(rolename: string): Observable<any[]> {
  //   return this.httpClient
  //     .get<GCPUser[]>(this.coreServiceEndPoint + "GCPUser/" + rolename)
  //     .pipe(
  //       map(users => {
  //         var returnedUser: GCPUser[] = [];
  //         for (const user of users) {
  //           this.getUserWorkDetails(user.ngcpuserid).subscribe(data => {
  //             // console.log(data);

  //             user.pendingtask = data.pending_task;
  //             user.workavg = data.work_avg;
  //             user.errorrate = data.error_rate;
  //             user.initials =
  //               user.firstname.substr(0, 1).toUpperCase() +
  //               user.lastname.substr(0, 1).toUpperCase();

  //             if (data.work_avg >= 0 && data.work_avg <= 5) {
  //               user.rating = 1;
  //             }
  //             if (data.work_avg >= 6 && data.work_avg <= 15) {
  //               user.rating = 2;
  //             }
  //             if (data.work_avg >= 16 && data.work_avg <= 25) {
  //               user.rating = 3;
  //             }
  //             if (data.work_avg >= 26 && data.work_avg <= 35) {
  //               user.rating = 1;
  //             }
  //             if (data.work_avg >= 36) {
  //               user.rating = 1;
  //             }
  //             // console.log(user);
  //             returnedUser.push(user);
  //           });
  //         }
  //         // console.log(returnedUser);

  //         return returnedUser;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  getAllUsersToSave(applicationCode: any): Observable<GCPUser[]> {
    return this.httpClient
      .get<GCPUser[]>(
        this.authServiceEndpoint + "users/" + applicationCode + "/0"
      )
      .pipe(catchError(this.handleError));
  }

  getLoginUserGroups(nuserid: any): Observable<GCPUser> {
    return this.httpClient
      .get<GCPUser>(
        this.authServiceEndpoint +
          "groups/getgroupsbyuserid/" +
          nuserid +
          "/" +
          true
      )
      .pipe(catchError(this.handleError));
  }

  getGroupsUser(groupid: any): Observable<any> {
    return this.httpClient
      .get<any>(this.authServiceEndpoint + "users/getUserByGroup/" + groupid)
      .pipe(
        map((users) => {
          var returnedUser: any[] = [];
          for (const user of users) {
            user.displayname = user.firstname + " " + user.lastname;
            returnedUser.push(user);
          }
          return returnedUser;
        }),
        catchError(this.handleError)
      );
  }
  getAllUserPermission() {
    return [
      {
        moduledescription: "My Dashboard",
        permissiondescription: "MyDashboard Access Granted",
        permissioncode: "2.1.P1",
      },
      {
        moduledescription: "AR Inventory",
        permissiondescription: "AR Inventory Access Granted",
        permissioncode: "2.2.P2",
      },
      {
        moduledescription: "My Tasks",
        permissiondescription: "My Tasks Access Granted",
        permissioncode: "2.3.P3",
      },
      {
        moduledescription: "Assistant",
        permissiondescription: "Assistant Access Granted",
        permissioncode: "2.4.P4",
      },
      {
        moduledescription: "Agents",
        permissiondescription: "Agents Access Granted",
        permissioncode: "2.5.P5",
      },
      {
        moduledescription: "Files",
        permissiondescription: "Files Access Granted",
        permissioncode: "2.6.P6",
      },
      {
        moduledescription: "Production",
        permissiondescription: "Production Access Granted",
        permissioncode: "2.7.P7",
      },
      {
        moduledescription: "Annoucement",
        permissiondescription: "Annoucement Access Granted",
        permissioncode: "2.8.P8",
      },
      {
        moduledescription: "Configuration",
        permissiondescription: "Configuration Access Granted",
        permissioncode: "2.9.P9",
      },
    ];
  }
  getAllGroups(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.authServiceEndpoint +
          "groups?pagenumber=0&size=100000&sortby=groupname"
      )
      .pipe(catchError(this.handleError));
  }
  getClientGroups(clientid: string, providernpi: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Practice/GetClientGroups/" +
          clientid +
          "/" +
          providernpi
      )
      .pipe(catchError(this.handleError));
  }
  getUserGroupByNpi(providernpi: string): Observable<any> {
    return this.httpClient
      .get<any>(this.authServiceEndpoint + "users/getBynpi/" + providernpi)
      .pipe(catchError(this.handleError));
  }
  getProvidersFromNpiRegistry(providernpi: string): Observable<any> {
    //https://qore-dev.myqone.com/directoryservice//npiregistry/getAllProviders?firstname=&lastname=&npi=1780671461&city=&state=&postalCode=&taxonomy=&pagenumber=0&size=20&sortby=providerid
    return this.httpClient
      .get<any>(
        this.qoreServiceEndpoint +
          "directoryservice/npiregistry/getAllProviders?npi=" +
          providernpi +
          "&sortby=providerid"
      )
      .pipe(catchError(this.handleError));
  }

  handleError(error) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
