import { Injectable } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  ARRespesentative,
  ManagerDashboard,
} from "src/app/Model/Dashboard/dashboard";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  coreServiceEndPoint = environment.coreServiceUrl;
  docsServiceEndPoint = environment.docsServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  private clsUtility: Utility;
  constructor(private httpClient: HttpClient) {
    this.clsUtility = new Utility();
  }
  getARRepresentativeData(nUserID: any): Observable<ARRespesentative> {
    return this.httpClient
      .get<ARRespesentative>(
        this.coreServiceEndPoint + "Dashboard/Agent/" + nUserID
      )
      .pipe(catchError(this.handleError));
  }
  getManagerDashboardData(
    nClientID: any,
    nUserID: any
  ): Observable<ManagerDashboard> {
    return this.httpClient
      .get<ManagerDashboard>(
        this.coreServiceEndPoint + "Dashboard/Data/" + nClientID + "/" + nUserID
      )
      .pipe(catchError(this.handleError));
  }
  getRCMDocsDashboard(inputJson: any): Observable<any> {
    // https://qonductor-dev.myqone.com/edocManager/Encounter/DashbordData
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/DashbordData",
        inputJson,
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
