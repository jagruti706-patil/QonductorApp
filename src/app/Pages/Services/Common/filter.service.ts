import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Client } from "src/app/Model/AR Management/Configuration/client";
import { Payer } from "src/app/Model/AR Management/Configuration/payer";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import {
  Filter,
  OutputFilter,
  InventoryInputModel,
  PrintFilterInputModel,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { Agebucket } from "src/app/Model/AR Management/Common/Filter/agebucket";
import { WorkAuidtCompleted } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { GridDataResult } from "@progress/kendo-angular-grid";
import * as moment from "moment";
import { DataTransferService } from "./data-transfer.service";

@Injectable({
  providedIn: "root",
})
export class FilterService {
  private clsUtility: Utility;

  coreServiceEndPoint = environment.coreServiceUrl;
  docsServiceEndPoint = environment.docsServiceUrl;
  archivalServiceEndPoint = environment.archivalServiceUrl;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  groupIds: string;
  constructor(
    private httpClient: HttpClient,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
    this.groupIds = dataService.groupIds ? this.dataService.groupIds : "0";
  }

  getAllFilterList(filter: string): Observable<OutputFilter> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Filter/MasterValue",
        filter,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getAllFilterListByClient(
    filter: string,
    clientid: string
  ): Observable<OutputFilter> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Filter/MasterValue/" + clientid,
        filter,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // getAllClientList(id: any): Observable<Client[]> {
  //   return this.httpClient.get<Client[]>(this.coreServiceEndPoint + 'Client/' + id, this.httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // getAllPayerList(id: any): Observable<Payer[]> {
  //   return this.httpClient.get<Payer[]>(this.coreServiceEndPoint + 'Payer/' + id, this.httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // getAgingBucket(): any {
  //   return this.httpClient.get<Agebucket[]>(this.coreServiceEndPoint + 'Bucket/', this.httpOptions).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // getAutomationStatus() {
  //   return [
  //     { id: 1, value: "Paid" },
  //     { id: 2, value: "Denial" },
  //     { id: 3, value: "Processing" }
  //   ];
  // }

  getWorkItemStatus() {
    return [
      { id: 1, value: "Assigned" },
      { id: 2, value: "Unassigned" },
    ];
  }

  getFileStatus() {
    return [
      { id: -1, value: "All" },
      { id: 1, value: "Processed" },
      { id: 2, value: "Unprocessed" },
    ];
  }

  // getProvider() {
  //   return [{ id: 1, value: "Mickey Mouse" }, { id: 2, value: "Donald Duck" }];
  // }

  getCPTGroup() {
    return [
      { id: 1, value: "Surgery" },
      { id: 2, value: "Family Practice" },
    ];
  }

  getAgents() {
    return [
      {
        id: 45,
        code: "AR-0001",
        name: "Valerie Willis",
        displayname: "AR-0001 : Valerie Willis",
        Rating: 3,
        pendingtasks: 6,
        dailyaverage: 30,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 48,
        code: "AR-0002",
        name: "Darin Collins",
        displayname: "AR-0002 : Darin Collins",
        Rating: 2,
        pendingtasks: 4,
        dailyaverage: 35,
        weekavailibility: 4,
        experience: 2,
      },
      {
        id: 51,
        code: "AR-0003",
        name: "Sanjana Roy",
        displayname: "AR-0003 : Sanjana Roy",
        Rating: 5,
        pendingtasks: 15,
        dailyaverage: 40,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 54,
        code: "AR-0004",
        name: "Rahul Bose",
        displayname: "AR-0004 : Rahul Bose",
        Rating: 3.8,
        pendingtasks: 9,
        dailyaverage: 42,
        weekavailibility: 3,
        experience: 2,
      },
      {
        id: 124,
        code: "AR-0005",
        name: "Dustin Perkins",
        displayname: "AR-0005 : Dustin Perkins",
        Rating: 0,
        pendingtasks: 8,
        dailyaverage: 37,
        weekavailibility: 5,
        experience: 2,
      },
      {
        id: 146,
        code: "AR-0006",
        name: "Robert Howard",
        displayname: "AR-0006 : Robert Howard",
        Rating: 4.2,
        pendingtasks: 18,
        dailyaverage: 23,
        weekavailibility: 5,
        experience: 3,
      },
      {
        id: 528,
        code: "AR-0007",
        name: "John Snow",
        displayname: "AR-0007 : John Snow",
        Rating: 4.2,
        pendingtasks: 18,
        dailyaverage: 23,
        weekavailibility: 5,
        experience: 3,
      },
    ];
  }

  getProduction() {
    return [
      {
        nclientid: 121,
        id: 45,
        sclientname: "Flora R. Ronquillo2",
        name: "Valerie Willis",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 48,
        sclientname: "Flora R. Ronquillo2",
        name: "Darin Collins",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 51,
        sclientname: "Flora R. Ronquillo2",
        name: "Sanjana Roy",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 54,
        sclientname: "Flora R. Ronquillo2",
        name: "Rahul Bose",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 124,
        sclientname: "Flora R. Ronquillo2",
        name: "Dustin Perkins",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 146,
        sclientname: "Flora R. Ronquillo2",
        name: "Robert Howard",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
      {
        nclientid: 121,
        id: 528,
        sclientname: "Flora R. Ronquillo2",
        name: "John Snow",
        nworkeditemcount: 100,
        npendingitemcount: 50,
        createdon: "2019 - 04 - 24T10: 42: 04.858 + 0000",
        modifiedon: "2019 - 05 - 07T04: 43: 18.255+0000",
      },
    ];
  }

  applyFilter(
    filter: any,
    calledFrom: string = "workqueue",
    loginUserID: number = 0,
    page: number = 0,
    size: number = this.clsUtility.pagesize,
    status: number = 0
  ): Observable<any> {
    if (filter != null) {
      var appliedFilter = new InventoryInputModel();
      appliedFilter = JSON.parse(filter);
      appliedFilter.groupid = this.dataService.groupIds
        ? this.dataService.groupIds.split(",")
        : [];
      filter = JSON.stringify(appliedFilter);
    }
    var filterResponse: any;
    switch (calledFrom.toLowerCase()) {
      case "mytask":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Task/filter/" +
              loginUserID +
              "/" +
              1 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          // filterResponse = this.httpClient.post<any>(this.coreServiceEndPoint + 'Task/filter/' + loginUserID , filter, this.httpOptions)
          .pipe(catchError(this.handleError));
        break;
      case "completedtask":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Task/filter/" +
              loginUserID +
              "/" +
              2 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          // filterResponse = this.httpClient.post<any>(this.coreServiceEndPoint + 'Task/filter/' + loginUserID , filter, this.httpOptions)
          .pipe(catchError(this.handleError));
        break;
      case "canceledtask":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Task/filter/" +
              loginUserID +
              "/" +
              status +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          // filterResponse = this.httpClient.post<any>(this.coreServiceEndPoint + 'Task/filter/' + loginUserID , filter, this.httpOptions)
          .pipe(catchError(this.handleError));
        break;
      case "workqueue":
        // filterResponse = this.httpClient.post<any>(this.coreServiceEndPoint + 'WorkQueueInventory/filter', filter, this.httpOptions)
        //   .pipe(
        //     catchError(this.handleError)
        //   );
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "WorkQueueInventory/filter" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "deferworkqueue":
        var deferstatus = 1;
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "WorkQueueInventory/Defer/filter/" +
              deferstatus +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "production":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Production/filter" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "file":
        var strFilter = new InventoryInputModel();

        var clientid, filestatus;
        strFilter = JSON.parse(filter);

        if (strFilter.client.length == 0) {
          clientid = 0;
        } else {
          clientid = strFilter.client[0].clientid;
        }

        filterResponse = this.httpClient
          .get<File[]>(
            this.coreServiceEndPoint +
              "WorkFile/Filter/" +
              clientid +
              "/" +
              strFilter.filestatus +
              "/" +
              strFilter.startdate +
              "/" +
              strFilter.enddate +
              "/" +
              strFilter.servicecode
          )
          .pipe(catchError(this.handleError));
        break;

      case "automation": //saurabh shelar
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "AutomationError/Accuracy/filter" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        // console.log(filterResponse);
        break;

      case "pendingadditionalinfo":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              -1 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "orderworkqueue":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              0 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "orderassistanceworkqueue":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              3 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "orderreview":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              4 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "ordercompletedworkqueue":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              2 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      // case "ordermyorder":
      //   filterResponse = this.httpClient
      //     .get<any>(
      //       this.coreServiceEndPoint +
      //         "Document/OrderQueueInventory/" +
      //         loginUserID +
      //         "/" +
      //         status +
      //         "?page=" +
      //         page +
      //         "&size=" +
      //         size,
      //       this.httpOptions
      //     )
      //     .pipe(catchError(this.handleError));
      //   break;

      case "orderpendingorder":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/MissingCharges/" +
              status +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "ordersearchorder":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/SearchInventoryDetails" +
              // status +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "orderexport":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/SearchInventoryDetails" +
              // status +
              "?page=" +
              page +
              "&size=" +
              10000,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "orderdocumentsearch":
        let lstFilter = JSON.parse(filter);
        if (lstFilter.accessionNo) {
          filterResponse = this.httpClient
            .get<any>(
              this.docsServiceEndPoint + "Document/" + lstFilter.accessionNo
            )
            .pipe(catchError(this.handleError));
        } else {
          filterResponse = null;
        }
        break;
      case "orderassistance":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              7 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "orderupload":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/SubmittedIncompleteOrders" +
              // "Document/OrderQueueInventory/" +
              // 8 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "myencounters":
        appliedFilter.userid = this.dataService.loginGCPUserID.getValue();
        appliedFilter.status = [1];
        filter = JSON.stringify(appliedFilter);
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/AssignedOrderQueueInventory" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "myreview":
        appliedFilter.userid = this.dataService.loginGCPUserID.getValue();
        appliedFilter.status = [6];
        filter = JSON.stringify(appliedFilter);
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/AssignedOrderQueueInventory" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "documentcount":
        let input: {
          cabinet: string[];
          folder: string[];
          clientid: string;
        } = {
          cabinet: appliedFilter.orderyear,
          folder: appliedFilter.orderday,
          clientid:
            appliedFilter.client.length == 1
              ? appliedFilter.client[0].clientid.toString()
              : "0",
        };
        filterResponse = this.httpClient
          .post<any>(
            this.docsServiceEndPoint + "Document/GetCounts",
            input,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "advancesearchorder":
        // appliedFilter.orderyear == "All"
        //   ? (appliedFilter.orderyear = "0")
        //   : appliedFilter.orderyear;
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/Encounter/SearchInventoryDetails" +
              // status +
              "?page=" +
              page +
              "&size=" +
              size,
            JSON.stringify(appliedFilter),
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case "practiceassigned":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/MissingCharges/" +
              16 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "practicecompleted":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              17 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "practiceuserencounter":
        appliedFilter.userid = this.dataService.loginGCPUserID.getValue();
        appliedFilter.status = [16];
        filter = JSON.stringify(appliedFilter);
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/PracticeUser/AssignedOrderQueue" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "practiceassistancecompleted":
        appliedFilter.userid = this.dataService.loginGCPUserID.getValue();
        // appliedFilter.status = [16];
        filter = JSON.stringify(appliedFilter);
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/PracticeUser/CompletedOrderQueue" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.modifiedon)
                      element.workeddate = moment(element.modifiedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
      case "incompletesummary":
        filterResponse = this.httpClient
          .get<any>(
            this.coreServiceEndPoint +
              "Practice/ClientWiseIncompleteCount" +
              "?page=" +
              page +
              "&size=" +
              10000,
            this.httpOptions
          )
          // filterResponse = this.httpClient.post<any>(this.coreServiceEndPoint + 'Task/filter/' + loginUserID , filter, this.httpOptions).
          .pipe(catchError(this.handleError));
        break;
      case "archivedencounters":
        filterResponse = this.httpClient
          .post<any>(
            this.archivalServiceEndPoint +
              "Get/ArchivedOrderQueueDetails" +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            tap((ele) => {
              if (ele) {
                if (ele.content) {
                  ele.content.map((element) => {
                    if (element.archivedon)
                      element.workeddate = moment(element.archivedon).format(
                        "MM-DD-YYYY"
                      );
                    else element.workeddate = null;
                  });
                }
              }
            }),
            catchError(this.handleError)
          );
        break;
    } //switch block
    return filterResponse;
  }

  clearFilter(id: any): Observable<Workgroup[]> {
    return this.httpClient
      .get<Workgroup[]>(
        this.coreServiceEndPoint + "WorkQueueInventory/" + id,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getARReviewTask(
    loginUserID: number = 0,
    page: number = 0,
    size: number = this.clsUtility.pagesize,
    status = 1
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "ARReview/Task/" +
          loginUserID +
          "/" +
          status +
          "?page=" +
          page +
          "&size=" +
          size,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getARReviewCompleted(
    agentID: number = 0,
    page: number = 0,
    size: number = this.clsUtility.pagesize
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "WorkAudit/CompletedReview/" +
          agentID +
          "?page=" +
          page +
          "&size=" +
          size,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getARReviewViewTaskDetails(
    loginUserID: number = 0,
    page: number = 0,
    size: number = this.clsUtility.pagesize,
    status = 1
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "ViewTask/" +
          loginUserID +
          "/" +
          status +
          "?page=" +
          page +
          "&size=" +
          size,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getFolders(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "Cabinets/Folders/0",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getCategory(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint + "Document/OrderCategory",
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

  exportData(
    filter: any,
    page: number = 0,
    size: number = 0,
    callingFrom: string = ""
  ): Observable<GridDataResult> {
    var filterResponse: any;
    switch (callingFrom.toLowerCase()) {
      case "orderworkqueue":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              0 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            catchError(this.handleError)
          );
        break;
      case "orderassistanceworkqueue":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              3 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            catchError(this.handleError)
          );
        break;
      case "ordependingorder":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/MissingCharges/" +
              0 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            tap((ele) => {
              ele.data.map((ele) => {
                if (ele.nstatus == 1) ele.nstatus = "Assigned";
                else if (ele.nstatus == 2) ele.nstatus = "Completed";
                else if (ele.nstatus == 3) ele.nstatus = "Assistance";
                else if (ele.nstatus == 4) ele.nstatus = "Pending Review";
                else if (ele.nstatus == 5) ele.nstatus = "Void";
                else if (ele.nstatus == 6) ele.nstatus = "Assigned Review";
              });
            }),
            catchError(this.handleError)
          );
        break;
      case "ordercompletedorder":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              2 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            catchError(this.handleError)
          );
        break;
      case "orderreview":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/" +
              4 +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            catchError(this.handleError)
          );
        break;
      case "ordersearchorder":
        filterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/OrderQueueInventory/SearchInventoryDetails" +
              // status +
              "?page=" +
              page +
              "&size=" +
              size,
            filter,
            this.httpOptions
          )
          .pipe(
            map(
              (response) =>
                <GridDataResult>{
                  data: response["content"],
                  total: parseInt(response["totalelements"], 10),
                }
            ),
            tap((ele) => {
              ele.data.map((ele) => {
                if (ele.nstatus == 0) ele.nstatus = "New";
                else if (ele.nstatus == 1) ele.nstatus = "Assigned";
                else if (ele.nstatus == 2) ele.nstatus = "Completed";
                else if (ele.nstatus == 3) ele.nstatus = "Assistance";
                else if (ele.nstatus == 4) ele.nstatus = "Pending Review";
                else if (ele.nstatus == 5) ele.nstatus = "Void";
                else if (ele.nstatus == 6) ele.nstatus = "Assigned Review";
              });
            }),
            catchError(this.handleError)
          );
        break;
    }
    return filterResponse;
  }

  getFolderCategoryAndYear(
    defaultYear: any,
    statusid: any,
    clientid: any = 0
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/FilterMaster/" +
          defaultYear +
          "/" +
          clientid +
          "?status=" +
          statusid +
          "&group=" +
          this.groupIds,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  applyPrintFilter(
    callingFrom = "",
    page = 0,
    size = 0,
    body = new PrintFilterInputModel()
  ): Observable<any> {
    var printFilterResponse: any;
    switch (callingFrom.toLowerCase()) {
      case enumFilterCallingpage.ReadyForPrinting:
        body.status = [8];
        printFilterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/ReadyToPrintOrderqueue?page=" +
              page +
              "&size=" +
              size,
            body,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
      case enumFilterCallingpage.SubmittedAndPrinted:
        body.status = [10];
        printFilterResponse = this.httpClient
          .post<any>(
            this.coreServiceEndPoint +
              "Document/ReadyToPrintOrderqueue?page=" +
              page +
              "&size=" +
              size,
            body,
            this.httpOptions
          )
          .pipe(catchError(this.handleError));
        break;
    }
    return printFilterResponse;
  }
  getDocumentsByMaster(page, size, body) {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint +
          "Encounter/GetDocuments?page=" +
          page +
          "&size=" +
          size,
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  retrieveEncounterMaster(inputJson: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/GetMasterDetails",
        inputJson,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getClients(servicecode: string, status: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint + "Client/" + servicecode + "/" + status, //servicecode= "ENTR/ARTR/0" status="-1/0/1"
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getGenericSearchData(reqbody: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Practice/GenericSearch",
        reqbody,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
