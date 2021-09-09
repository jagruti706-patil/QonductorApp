import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, throwError } from "rxjs";
import { Viewdetails } from "src/app/Model/AR Management/Workgroup/viewdetails";
import { WorkAuidt } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CoreoperationService {
  coreServiceEndPoint = environment.coreServiceUrl;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };
  constructor(private httpClient: HttpClient) {}

  assignedWorkQueue(assignworkgroup): Observable<number> {
    return this.httpClient
      .post<number>(
        this.coreServiceEndPoint + "Task/Assign",
        assignworkgroup,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveTask(saveTask): Observable<number> {
    return this.httpClient
      .post<number>(
        this.coreServiceEndPoint + "Task/Save",
        saveTask,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getViewDetailsbyId(id, workQueue): Observable<Viewdetails> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "View/Details/" + id,
        workQueue,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getTaskDetails(taskid: number, workqueuegroupid: number): Observable<any[]> {
    return this.httpClient
      .get<any[]>(
        this.coreServiceEndPoint +
          "ARReview/TaskDetails/" +
          taskid +
          "/" +
          workqueuegroupid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveTaskDetails(workAudit): Observable<WorkAuidt> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "WorkAudit/Save",
        workAudit,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveUsers(users): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "GCPUser/Save",
        users,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  saveProductionClose(dailyProduction): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Production/DailyClose/Save",
        dailyProduction,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  saveDeferAndUndeferTask(defer): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "WorkQueueInventory/Defer/Save",
        defer,
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
