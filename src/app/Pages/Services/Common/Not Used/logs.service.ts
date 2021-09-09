import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Logs } from "src/app/Model/Common/logs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class LogsService {
  serviceEndpoint = environment.logServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  constructor(private httpClient: HttpClient) {}

  saveLogs(log): Observable<Logs> {
    return this.httpClient
      .post<Logs>(this.serviceEndpoint, log, this.httpOptions)
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
