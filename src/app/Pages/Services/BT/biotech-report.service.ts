import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BiotechReportService {
  coreServiceEndPoint = environment.coreServiceUrl;
  docsServiceEndPoint = environment.docsServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private httpClient: HttpClient) {}

  GetDailyStatusReports(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint + "Report/GetDailyStatusReports/0",
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
