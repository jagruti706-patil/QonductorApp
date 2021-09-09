import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Logindetails, User, ReleaseInfo } from "src/app/Model/Common/login";
import { Utility } from "src/app/Model/utility";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  serviceEndpoint = environment.coreServiceUrl;
  authServiceEndpoint = environment.authServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  private clsUtility: Utility;
  constructor(private httpClient: HttpClient) {
    this.clsUtility = new Utility();
  }

  getUserByLoginPassword(login: string, password: string): Observable<User[]> {
    return this.httpClient
      .get<User[]>(
        this.serviceEndpoint + "Users/GetUser/" + login + "/" + password,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
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
          // console.log(authuserdetails);

          if (authuserdetails && authuserdetails.token) {
            localStorage.setItem(
              "token",
              this.clsUtility.encryptobjorstring(authuserdetails.token)
            );
          }
          return authuserdetails;
        }),
        catchError(this.handleError)
      );
  }

  saveLoginDetails(logindetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "User/LoginDetails/Save",
        logindetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateLoginDetails(logindetails): Observable<Logindetails> {
    return this.httpClient
      .put<Logindetails>(
        this.serviceEndpoint + "User/LoginDetails/Update",
        logindetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // getIpAddress() {
  //   // return this.httpClient
  //   //   .get("http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK")
  //   //   .pipe(
  //   //     map((res: Response) => {
  //   //       console.log("res ", res);
  //   //       console.log("res.json() ", res.text());
  //   //       //console.log('parseado ', JSON.parse(res.text()));
  //   //       console.log("parseado  stringify ", JSON.stringify(res.text()));
  //   //       let ipVar = res.text();
  //   //       // let num = ipVar.indexOf(":");
  //   //       // let num2 = ipVar.indexOf("\"});");
  //   //       // ipVar = ipVar.slice(num+2,num2);
  //   //       console.log("ipVar -- ", ipVar);
  //   //       return ipVar;
  //   //     }),
  //   //     catchError(this.handleError)
  //   //   );

  //   const headers = new HttpHeaders({ "Content-Type": "text/plain" });
  //   return this.httpClient
  //     .get("http://ip-api.com/json", { responseType: "text", headers })
  //     .pipe(
  //       map(response => response || {}),
  //       catchError(this.handleError)
  //     );

  //   // return this.httpClient
  //   //   .get("http://api.example.com/endpoint?callback=foo", this.httpOptions)
  //   //   .pipe(
  //   //     map(response => response || {}),
  //   //     catchError(this.handleError)
  //   //   );

  //   // return this.httpClient.get("http://jsonip.com").pipe(
  //   //   map((res: Response) => res.json()),
  //   //   catchError(this.handleError)
  //   // );
  // }

  getUser() {
    return [
      {
        roleid: 1,
        userid: 1,
        loginname: "TeresaLHill@dayrep.com",
        password: "11111111",
        firstname: "Teresa",
        middlename: "L.",
        lastname: "Hill",
        dob: "10/9/1963",
        gender: "female",
      },
      {
        roleid: 2,
        userid: 2,
        loginname: "KarenBCurlee@armyspy.com",
        password: "11111111",
        firstname: "Karen",
        middlename: "B.",
        lastname: "Curlee",
        dob: "11/3/1984",
        gender: "female",
      },
      {
        roleid: 1,
        userid: 3,
        loginname: "ThomasPMartinez@teleworm.us",
        password: "11111111",
        firstname: "Thomas",
        middlename: "P.",
        lastname: "Martinez",
        dob: "11/10/1996",
        gender: "Male",
      },
    ];
  }
  getReleaseInfo(releaseversion: string = "0") {
    return this.httpClient
      .get<any>(this.serviceEndpoint + "ReleaseInfo/" + releaseversion)
      .pipe(catchError(this.handleError));
  }
  updateReleasNotesFlag(body: ReleaseInfo): Observable<any> {
    return this.httpClient
      .post<any>(
        this.serviceEndpoint + "ReleasNotesFlag/Update",
        body,
        this.httpOptions
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
