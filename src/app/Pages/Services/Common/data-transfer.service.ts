import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { Router } from "@angular/router";
import { Navbarlinks } from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import {
  InventoryInputModel,
  PrintFilterInputModel,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import {
  OrderDefaultYearDay,
  SendToBiotechModel,
} from "src/app/Model/BT Charge Posting/Order/order-note";
import { enumFilterCallingpage } from "src/app/Model/utility";
import { SaveUserLoginResponse, ReleaseInfo } from "src/app/Model/Common/login";
@Injectable({
  providedIn: "root",
})
// @Injectable()
export class DataTransferService {
  showActionPane: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  leftside: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  orderDay: BehaviorSubject<string> = new BehaviorSubject<string>("");
  SelectedTasks: any;
  SelectedUserid: string;
  SelectedGCPUserid: number;
  SelectedRoleid: number;
  SelectedRoleName: string;
  defaultNavigation: BehaviorSubject<string> = new BehaviorSubject<string>("");
  applicationCode: number;
  applicationName: string;
  authorizationToken: string;
  editTaskID: number;
  TaskCallingForm: number = 1;
  // IsLogin: boolean = true;
  // SelectedTasksClaimInfo: any;
  // SelectedTasksPatientInfo: any;
  // SelectedTasksStatusInfo: any;
  SelectedTasksworkqueuegroupid: any;
  isWorkQueueFilterApplied: boolean = false;
  isDeferWorkQueueFilterApplied: boolean = false;
  isTaskFilterApplied: boolean = false;
  isCompletetdTaskFilterApplied: boolean = false;
  isTaskAssignmentDone: boolean = false;
  isProductionFilterApplied: boolean = false;
  isFileFilterApplied: boolean = false;
  isOrderAssistanceFilterApplied: boolean = false; //saurabh shelar
  isAutomationFilterApplied: boolean = false; //saurabh shelar
  isOrderWorkQueueFilterApplied: boolean = false; //saurabh shelar
  isOrderCompletedFilterApplied: boolean = false; //saurabh shelar
  isOrderMyOrderFilterApplied: boolean = false;
  isOrderPendingOrderFilterApplied: boolean = false;
  isOrderSearchFilterApplied: boolean = false;
  cascadedNote: Subject<string> = new Subject<string>();
  orderType: Subject<string> = new Subject<string>(); //saurbh shelar
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ChangePassword: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  navbarLinkspermission: Navbarlinks = new Navbarlinks();
  testnav: Navbarlinks = new Navbarlinks();
  navSubject: BehaviorSubject<Navbarlinks> = new BehaviorSubject<Navbarlinks>(
    this.testnav
  );
  SelectedFilter: InventoryInputModel;
  SelectedPrintFilter: PrintFilterInputModel;
  isCallingWorkQueue: boolean = false;
  loginUserName: string;
  groupIds: string = ""; //comma separated
  isTaskViewDetails: boolean = false;
  IsShowManagerDashboard: boolean = false;
  loginUserID: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  loginGCPUserID: BehaviorSubject<string> = new BehaviorSubject<string>("");
  SubSelectedTasksClaimInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  SubSelectedTasksPatientInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  SubSelectedTasksStatusInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  loginName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  roleName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  navigation: BehaviorSubject<string> = new BehaviorSubject<string>("");
  loginid: any;
  NoteWorkItemCount: Subject<number> = new Subject<number>();
  NoteTitle: Subject<string> = new Subject<string>();
  NoteCalledFrom: Subject<enumFilterCallingpage> = new Subject<enumFilterCallingpage>();
  ShowNoteCategory: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  DeferWorkqueueDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  UndeferWorkqueueDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  orderAssignmentDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  orderReviewAssignmentDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  ); //saurabh shelar
  orderReassignmentDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  OrderDetailsDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  OrderReviewDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  OrderAssistanceDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  IncompleteDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  sendToBiotechJson: BehaviorSubject<SendToBiotechModel> = new BehaviorSubject<SendToBiotechModel>(
    null
  );
  OrderUpdateDone: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  isMarkedAcknowledged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  doExpandUpdateStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  SelectedOrders: any;
  SelectedOrderPatientInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  SelectedOrderInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  documentList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
  SelectedOrderInsuranceInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  SelectedOrderQueueGroupID: Subject<any> = new Subject<any>();
  SelectedOrderQueueGroupCode: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  SelectedMasterDocId: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  ViewDocMasterDocId: BehaviorSubject<string> = new BehaviorSubject<string>("");
  CollapsePatientInfoBanner: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  SelectedOrderDocumentInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    []
  );
  orderdetailinformation: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  ShowOrderStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  IncompleteOrderInfo: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  // IncompInfoObservable = this.IncompleteOrderInfo.asObservable();
  // private objOrderDefaultYearDay: OrderDefaultYearDay = new OrderDefaultYearDay();
  defaultYearDay: BehaviorSubject<OrderDefaultYearDay> = new BehaviorSubject<OrderDefaultYearDay>(
    null
  );
  statusReportData: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  doRefreshGrid: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  eligibilityInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  releaseInfo: BehaviorSubject<ReleaseInfo[]> = new BehaviorSubject<
    ReleaseInfo[]
  >([]);
  currentReleaseInfo: BehaviorSubject<ReleaseInfo> = new BehaviorSubject<ReleaseInfo>(
    null
  );
  // saveUserLoginResponse: BehaviorSubject<
  //   SaveUserLoginResponse
  // > = new BehaviorSubject<SaveUserLoginResponse>(null);
  advanceSearchValue: BehaviorSubject<string> = new BehaviorSubject<string>("");
  SubmitIncompleteOrderInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  practiceEncounterStatus: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  SummarySelectedPractice: BehaviorSubject<string> = new BehaviorSubject<string>(
    "0"
  );
  SummarySelectedPracticeid: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  orderfinancialdetails: any[] = [];
  orderpatientdetails: any[] = [];
  orderinsurancedetails: any[] = [];
  orderdocnotes: any[] = [];
  isarchived: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  resetOrderDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, private cookieService: CookieService) {}
  logout() {
    this.cookieService.delete("UID");
    this.cookieService.delete("AID");
    this.loginid = null;
    this.loggedIn.next(false);
    // this.router.navigate(["/login"]);

    window.location.assign(environment.ssoServiceLogoutUrl);
  }
}
