import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import {
  UpdateSubStatusModel,
  UploadMissingInfoModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { DataTransferService } from "../Common/data-transfer.service";

@Injectable({
  providedIn: "root",
})
export class CoreOperationService {
  coreServiceEndPoint = environment.coreServiceUrl;
  docsServiceEndPoint = environment.docsServiceUrl;
  archivalServiceEndPoint = environment.archivalServiceUrl;

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  httpPdfOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private dataService: DataTransferService
  ) {}
  ///////////////////////////////////////////////////

  SaveNote(orderdetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Document/Note/Save",
        orderdetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  MarkPageacknowledged(acknowledgedetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/OriginalFile/MarkAcknowledged",
        acknowledgedetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  GetNotes(noteid: string, docid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "Document/Note/" + noteid + "/" + docid
      )
      .pipe(catchError(this.handleError));
  }

  updateNoteStatus(noteid: string, noteStatus: boolean) {
    // {
    //   note: "again test it",
    //   docid: "25483716-cb30-4c42-bdd3-e3a768b99eb6",
    //   noteid: "11e3bb91-cbad-4510-9cef-8e27bfe78090",
    //   notetype: 0,
    //   createdby: "21080",
    //   createdon: "2019-10-31T16:42:29.361+05:30",
    //   notestatus: false,
    //   pagenumber: 0,
    //   createdbylastname: "shelar",
    //   createdbyusername: "saurabh shelar",
    //   createdbyfirstname: "saurabh"
    // }
    let updatejson = {
      noteid: noteid,
      notestatus: noteStatus,
    };
    return this.httpClient
      .put<any>(
        this.docsServiceEndPoint + "Document/Note/Update",
        updatejson,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // GetHL7(orderid: string): Observable<any> {
  //   return this.httpClient
  //     .get<any>(
  //       this.coreServiceEndPoint + "HL/FileData/GetByTransactionId/" + orderid
  //     )
  //     .pipe(catchError(this.handleError));
  // }

  GetHLDetails(orderid: string, status: number = 0): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "HL/FileData/GetByTransactionId/" +
          orderid +
          "/" +
          status
      )
      .pipe(catchError(this.handleError));
  }

  GetDocumentList(
    accessionnumber: string,
    folder: string,
    year: string
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "DocumentInfo/" +
          accessionnumber +
          "/" +
          folder +
          "/" +
          year
      )
      .pipe(catchError(this.handleError));
  }
  GetOriginalDocumentList(masterdocid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Encounter/GetOriginalFileDocuments/" +
          masterdocid
      )
      .pipe(catchError(this.handleError));
  }
  GetDocumentsByAccession(accessionnumber: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Encounter/GetDocumentsByAccession/" +
          accessionnumber
      )
      .pipe(catchError(this.handleError));
  }
  GetCommentTypes(): Observable<any> {
    return this.httpClient
      .get<any>(this.coreServiceEndPoint + "Document/EncounterCommentType")
      .pipe(catchError(this.handleError));
  }
  GetDocumentNoteList(orderqueuegroupid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint + "Document/GetNotes/" + orderqueuegroupid
      )
      .pipe(catchError(this.handleError));
  }
  GetMasterDocumentNotes(masterdocid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Document/GetMasterDocumentNote/" +
          masterdocid
      )
      .pipe(catchError(this.handleError));
  }

  //////////////////////////////////////////////

  RetriveMissingCharges(
    status: number,
    pagesize: any,
    pagenumber: any
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderQueueInventory/MissingCharges/" +
          status +
          "?page=" +
          pagenumber +
          "&size=" +
          pagesize
      )
      .pipe(catchError(this.handleError));
  }

  RetriveOrderQueue(
    status: number,
    pagesize: any,
    pagenumber: any
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint +
          "Document/OrderQueueInventory/" +
          status +
          "?page=" +
          pagenumber +
          "&size=" +
          pagesize,

        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  RetriveOrderQueueDetails(id: string, status: number): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint +
          "Document/OrderQueueInventory/Details/" +
          id +
          "/" +
          status,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  // DownloadOrderDocument(id: string): Observable<any> {
  //   return this.httpClient
  //     .get<any>(this.docsServiceEndPoint + "Document/Download/" + id, {
  //       responseType: "blob" as "json"
  //     })
  //     .pipe(catchError(this.handleError));
  // }

  DownloadOrderDocument(id: string): Observable<any> {
    return this.httpClient
      .get<any>(this.docsServiceEndPoint + "DocsVault/download/" + id, {
        responseType: "blob" as "json",
      })
      .pipe(catchError(this.handleError));
  }
  DownloadDocsFromGCPOrDocsVault(
    fileid: string,
    docid: string
  ): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint +
          "Document/Download/GCP/" +
          fileid +
          "/" +
          docid,
        null
      )
      .pipe(catchError(this.handleError));
  }
  AssignOrderInventory(orders: string): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/Assign",
        orders,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  RetriveUserActiveOrderQueue(
    userid: string,
    status: number,
    pagesize: any,
    pagenumber: any
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderQueueInventory/" +
          userid +
          "/" +
          status +
          "?page=" +
          pagenumber +
          "&size=" +
          pagesize,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  SaveOrderAction(orderdetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/UpdateStatus",
        orderdetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  OrderInventoryStatus(
    status: string,
    encountersource: string = "BIOTECH Encounter"
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderInventoryStatus/" +
          status +
          "?encountertype=" +
          encountersource,
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

  UpdateOrderReview(orderreviewdetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/CompleteReview",
        orderreviewdetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  UpdateMyOrderReview(orderreviewdetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/ChangeOrderStatus",
        orderreviewdetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  releaseOrderAssignment(orderreleasedetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/ReleaseOrder",
        orderreleasedetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getOrderHistory(orderqueuegroupid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderQueueHistory/" +
          orderqueuegroupid,
        // "http://testing20:9096/QConstrue/Document/OrderQueueHistory/" +
        // accession,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  releaseAssignedReview(data: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/ReleaseOrder",
        data,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  uploadDocuments(orderdetails, coverpage: File): Observable<any> {
    var objFormDate = new FormData();

    objFormDate.append("accessionno", orderdetails.accessionno);
    objFormDate.append("filename", orderdetails.filename);
    objFormDate.append("extension", orderdetails.extension);
    objFormDate.append("tokenid", orderdetails.tokenid);
    objFormDate.append("file", coverpage);
    console.log(objFormDate);

    return this.httpClient
      .post<any>(this.docsServiceEndPoint + "Document/Upload", objFormDate)
      .pipe(catchError(this.handleError));
  }
  SendToBiotech(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/SendToBiotech",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  UpdateMissingInfo(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/UpdateIncompleteOrderInfo",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  UpdateOrderSearchStatus(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/UpdateOrderQueueStatus",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateIncompleteOrderStatus(OrderDetails): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/MarkUploadToDocsVault",
        OrderDetails,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getFoldersForProcess(cabinetId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "Cabinets/Folders/" + cabinetId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getFoldersDifference(externalId: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "DocsVault/Document/Difference/" +
          externalId,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  reprocessFolders(data: any[]): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "DocsVault/Reprocess/Documents",
        data,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getMissingInfo(orderqueuegroupid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderInventoryIncompleteInfo/" +
          orderqueuegroupid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getOrderSubStatusAndNotes(statuscode: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/OrderqueueSubStatusAndNote/" +
          statuscode
      )
      .pipe(catchError(this.handleError));
  }

  getDownloadDocumentArray(orderqueuegroupid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "GetDocuments/" + orderqueuegroupid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  saveTriarqNote(objTriarqNote: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/AddNote",
        objTriarqNote,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getMergedDocumentsForPrint(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "GetDocuments/PrintAll",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getPrintAllMergedDocumentsForPrint(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "GetDocuments/PrintAll",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  getMergedDocumentsForReprint(accessionno: any): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint + "GetDocuments/Print/" + accessionno,
        {
          responseType: "blob" as "json",
        }
      )
      .pipe(catchError(this.handleError));
  }
  sendPrintBatch(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/SendPrintBatch",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  markSubmittedAndPrinted(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/UpdatePrintBatch",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  uploadMissingInfo(body: UploadMissingInfoModel): Observable<any> {
    body.userid = this.dataService.loginGCPUserID.getValue();
    body.username = this.dataService.loginUserName;
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "File/Byte/Upload",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getInsuranceEligibilityData(eligibilityid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "HL/Get/InsuranceEligibilityDataById/" +
          eligibilityid
      )
      .pipe(catchError(this.handleError));
  }
  getDocumentHistory(masterdocid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Document/GetMasterDocumentNoteHistory/" +
          masterdocid
      )
      .pipe(catchError(this.handleError));
  }
  getNotesByAccession(accessionnumber: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Encounter/GetNotesByAccession/" +
          accessionnumber
      )
      .pipe(catchError(this.handleError));
  }
  updateDocumentNoteStatus(noteid: string, status: boolean): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Document/UpdateNoteStatus/" +
          noteid +
          "/" +
          status
      )
      .pipe(catchError(this.handleError));
  }
  updateQuestionToPracticeBucket(
    noteid: string,
    status: boolean,
    accessionreferenceno: number
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Document/Question/AddToPracticeBucket/" +
          noteid +
          "/" +
          status +
          "/" +
          accessionreferenceno
      )
      .pipe(catchError(this.handleError));
  }
  GeneratePracticeEncounter(body: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/GenerateNewEncouter",
        body,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getRCMImportDocumentList(page: number, size: number): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Document/FTP/DocumentList/0?page=" +
          page +
          "&size=" +
          size
      )
      .pipe(catchError(this.handleError));
  }
  saveImportDocumentList(
    file: File,
    obj: any,
    filesize: string
  ): Observable<any> {
    //save to ftp using multipart file
    let formData = new FormData();
    formData.append("file", file);
    formData.append("clientid", obj.clientid);
    formData.append("category", obj.category);
    formData.append("createdon", obj.createdon);
    formData.append("uplodedby", obj.uplodedby);
    formData.append("uplodedbyid", obj.uplodedbyid);
    formData.append("size", filesize);

    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Document/FTP/UploadOnFTP",
        formData
      )
      .pipe(catchError(this.handleError));
  }
  saveImportDocuments(inputJson: any): Observable<any> {
    //save to ftp using byte array
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Document/SFTP/UploadOnSFTP",
        inputJson
      )
      .pipe(catchError(this.handleError));
  }
  saveMoveDocuments(inputJsonArray: any): Observable<any> {
    //save to ftp using byte array
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/MoveCategory",
        inputJsonArray
      )
      .pipe(catchError(this.handleError));
  }
  deleteMasterDocument(inputJson: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.docsServiceEndPoint + "Encounter/DeleteMasterDocument",
        inputJson,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  GetFolderReport(): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint + "Document/GetFolderReport",
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  saveMissingPdfReport(saveArray: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/SaveMissingPdfReport",
        saveArray,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  saveMissingHl7Report(saveArray: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/SaveMissingHl7Report",
        saveArray,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  CheckPracticeMapping(clientid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Group/Client/CheckPracticeMapping/" +
          clientid
      )
      .pipe(catchError(this.handleError));
  }
  GetPendingQueCount(
    masterdocid: string,
    accessionno: string
  ): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Encounter/GetPendingQueCount/" +
          masterdocid +
          "/" +
          accessionno
      )
      .pipe(catchError(this.handleError));
  }
  CheckPracticeBucketQuestions(accessionno: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.docsServiceEndPoint +
          "Encounter/CheckPracticeBucketQuestions/" +
          accessionno
      )
      .pipe(catchError(this.handleError));
  }
  GetOrderqueueIsanswered(orderqueueid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Document/GetOrderqueueIsanswered/" +
          orderqueueid
      )
      .pipe(catchError(this.handleError));
  }
  updateSubStatus(saveSubStatusObj: UpdateSubStatusModel): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/ChangeOrderSubStatus",
        saveSubStatusObj,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  GetPracticeDashboardDetails(inputJson: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Document/PracticeUser/Dashboard",
        inputJson,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  getArchivedOrderDetails(orderqueuegroupid: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.archivalServiceEndPoint +
          "Get/ArchivedOrderDetails/" +
          orderqueuegroupid,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  releaseArchived(inputJson: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.archivalServiceEndPoint + "ArchivedOrder/Revert",
        inputJson,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  GetPracticeByGroup(groupIds: string = "0"): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Practice/ClientDetailsByGroups?groups=" +
          groupIds
      )
      .pipe(catchError(this.handleError));
  }
  GetExecutiveDashboardData(input: any): Observable<any> {
    return this.httpClient
      .post<any>(
        this.coreServiceEndPoint + "Practice/ExecutiveDashboardData",
        input,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
  GetLastLoginUser(practiceid: string, groupIds: string): Observable<any> {
    return this.httpClient
      .get<any>(
        this.coreServiceEndPoint +
          "Practice/GetLastLoginUser/" +
          practiceid +
          "?groups=" +
          groupIds,
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }
}
