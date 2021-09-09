import "rxjs/add/operator/map";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";
// import { Http, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";

@Injectable()
export class Api {
  token: any;
  serviceEndpoint = environment.coreServiceUrl;
  auditEndpoint = environment.qoreServiceBaseUrl;
  docvalutexternalurl =
    "https://docsvault.biotechclinical.com:8443/DocsvaultAPI/";
  newdocsServiceUrl = environment.docsServiceUrl;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  functionnm: any;
  constructor(
    public http: HttpClient,
    private httpClient: HttpClient,
    public router: Router,
    private toastr: ToastrService,
    private activetoute: ActivatedRoute
  ) {}

  get(endpoint: string) {
    return this.httpClient
      .get<any[]>(this.serviceEndpoint + endpoint, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // get_docservice(endpoint: string) {
  //   return this.httpClient
  //     .get<any[]>(this.docsServiceUrl + endpoint, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  get_docservice(endpoint: string) {
    return this.httpClient
      .get<any[]>(this.newdocsServiceUrl + endpoint, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  get_docservice_filedownload(endpoint: string) {
    return this.httpClient
      .get<any>(this.newdocsServiceUrl + endpoint, {
        responseType: "blob" as "json",
      })
      .pipe(catchError(this.handleError));
  }

  get_docvault_external(endpoint: string): any {
    return this.http
      .get<any>(this.docvalutexternalurl + endpoint)
      .pipe(catchError(this.handleError));
  }

  post_docvault_external(endpoint: string, body: any) {
    return this.http
      .post(this.docvalutexternalurl + endpoint, body)
      .pipe(catchError(this.handleError));
  }

  get_docvault_externalfiledownload(endpoint: string): Observable<any> {
    return this.http
      .get<any>(this.docvalutexternalurl + endpoint, {
        responseType: "blob" as "json",
      })
      .pipe(catchError(this.handleError));
  }

  post(endpoint: string, body: any) {
    return this.httpClient
      .post(this.serviceEndpoint + endpoint, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  audit_post(endpoint: string, body: any) {
    return this.httpClient
      .post(this.auditEndpoint + endpoint, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  put(endpoint: string, body: any) {
    return this.httpClient
      .put(this.serviceEndpoint + endpoint, body)
      .pipe(catchError(this.handleError));
  }

  delete(endpoint: string) {
    return this.httpClient
      .delete(this.serviceEndpoint + endpoint, this.httpOptions)
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

  //   getdocvalutdata()
  //   {
  //     this.http.get("https://docsvault.biotechclinical.com:8443/DocsvaultAPI/FolderDetails/GetListOfCabinets?TokenID=8dac4f5a-387f-454a-9ce3-623df1c8124e&Format=json")
  //         .subscribe(res => {

  //            console.log('Doc Response');
  //            console.log(res);

  //         });
  //     } catch (error) {
  //       console.log('Error in getdocvalutdata');
  //       console.log(error);
  //     }
  // }
}
