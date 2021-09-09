import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { SubSink } from "subsink";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { NoteModalComponent } from "src/app/Pages/Common/note-modal/note-modal.component";
import { GridDataResult } from "@progress/kendo-angular-grid";
import { OrderDocumentsComponent } from "../../Order Action/order-documents/order-documents.component";
import { OrderPatientBannerComponent } from "../../Cards/order-patient-banner/order-patient-banner.component";
import { orderBy, SortDescriptor } from "@progress/kendo-data-query";
import { FormBuilder } from "@angular/forms";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @ViewChild("NoteModalComponent")
  private NoteModalComponent: NoteModalComponent;
  @ViewChild("AddCommentComponent")
  private AddCommentComponent: AddCommentComponent;
  clsAuthLogs: AuthLogs;
  index: number = 0;
  orderqueuegroupid: string;
  status: number; //saurabh shelar
  showDocumentList: boolean = true;
  SelectedOrder: any;
  private subscription = new SubSink();
  @ViewChild("OrderDocumentsComponent")
  private ViewOrderDocumentComponent: OrderDocumentsComponent;
  @ViewChild("OrderPatientBannerComponent", { static: true })
  private ViewOrderPatientBannerComponent: OrderPatientBannerComponent;
  private clsUtility: Utility;
  orderdetails: any = {};
  loader: boolean = false;
  vwEncounterHistoryAddComment: boolean = false;
  vwUpdateOnHistory: boolean = false;
  isExpandedAddComment: boolean = false;
  isExpandedUpdate: boolean = false;
  isShowUpdateStatusBtn: boolean = false;
  visibleButtons: boolean = true; //for order export tab
  title: string = "Encounter";
  historyGridLoader: boolean;
  calledFrom: string = "";

  constructor(
    private coreService: CoreOperationService, // private fb: FormBuilder
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.clsUtility = new Utility(toastr);
    this.clsAuthLogs = new AuthLogs(http);
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwEncounterHistoryAddComment =
            data.viewEncounterHistoryAddComment;
          this.vwUpdateOnHistory = data.viewUpdateOnHistory;
        }
      })
    );
    this.subscription.add(
      this.dataService.doExpandUpdateStatus.subscribe(
        (doExpandUpdateStatus) => {
          this.isExpandedUpdate = doExpandUpdateStatus;
        }
      )
    );
    this.subscription.add(
      this.dataService.resetOrderDetails.subscribe((resetOrderDetails) => {
        if (resetOrderDetails) {
          this.resetComponent();
        }
      })
    );
    // console.log(this.orderqueuegroupid);
    if (this.orderqueuegroupid != undefined) {
      this.ShowOrderDetails();
    }
  }

  resetButtonFlags() {
    this.isExpandedUpdate = false;
    this.isExpandedAddComment = false;
  }
  ShowOrderDetails() {
    try {
      this.index = 0;
      this.resetButtonFlags();
      let OrderSelected = [];
      OrderSelected.push(this.SelectedOrder);
      if (this.clsUtility.validateOrderSelected(OrderSelected) == true) {
        this.isShowUpdateStatusBtn = true;
      } else {
        this.isShowUpdateStatusBtn = false;
      }
      this.dataService.SelectedOrderInfo.next(this.SelectedOrder);
      if (this.calledFrom === "archivedencounters") {
        this.subscription.add(
          this.coreService
            .getArchivedOrderDetails(this.SelectedOrder.orderqueuegroupid)
            .subscribe(
              (data) => {
                // console.log(data);
                // this.dataService.orderhistory = data.orderhistory;
                if (data) {
                  this.orderdetails = data;
                  this.dataService.orderfinancialdetails =
                    data.orderfinancialdetails;
                  this.dataService.orderpatientdetails =
                    data.orderpatientdetails;
                  this.dataService.orderinsurancedetails =
                    data.orderinsurancedetails;
                  if (data.orderhistory) {
                    this.Historyitems = data.orderhistory;
                    this.loadHistoryitems();
                  }
                  this.dataService.orderdocnotes = data.orderdocnotes;
                } else {
                  this.orderdetails = {};
                }
                this.dataService.SelectedOrderQueueGroupCode.next(
                  this.SelectedOrder.orderqueuegroupcode
                );
              },
              (error) => {
                this.clsUtility.LogError(error);
              }
            )
        );
      } else {
        this.dataService.SelectedOrderQueueGroupCode.next(
          this.SelectedOrder.orderqueuegroupcode
        );
      }
      this.dataService.CollapsePatientInfoBanner.next(true);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onUpdateOrderStatus() {
    this.isExpandedAddComment = false;
    this.isExpandedUpdate = !this.isExpandedUpdate;
    this.cdr.detectChanges();
    if (this.isExpandedUpdate) {
      this.writeLog(
        "Update " +
          this.title.toLowerCase() +
          " status from " +
          this.title.toLowerCase() +
          " history is clicked",
        "UPDATE"
      );
      this.noteModalAssignment();
    }
  }
  noteModalAssignment() {
    let OrderSelected = [];
    OrderSelected.push(this.SelectedOrder);
    this.NoteModalComponent.showTopSection = true;
    this.NoteModalComponent.getOrderStatus(
      "-1",
      OrderSelected[0].encountersource
    );
    this.dataService.NoteCalledFrom.next(
      enumFilterCallingpage.UniversalUpdateOrderStatus
    );
    this.dataService.NoteTitle.next("Update " + this.title + " Status");
    this.dataService.ShowNoteCategory.next(false);
    this.dataService.ShowOrderStatus.next(true);
    // this.dataService.IncompleteOrderInfo.next(OrderSelected);
    this.NoteModalComponent.selectedOrderReviewGroup = OrderSelected;
    this.NoteModalComponent.title = this.title;
  }
  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor-Biotech";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: this.title + " History",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  resetComponent() {
    if (
      this.ViewOrderDocumentComponent != null &&
      this.ViewOrderDocumentComponent != undefined
    )
      this.ViewOrderDocumentComponent.OnClose();
    this.orderqueuegroupid = null;
    if (
      this.ViewOrderPatientBannerComponent != null &&
      this.ViewOrderPatientBannerComponent != undefined
    )
      this.ViewOrderPatientBannerComponent.OnClose();
    this.index = 0;
    this.resetButtonFlags();
    this.dataService.SelectedOrderQueueGroupCode.next("");
    this.orderdetails = {};
    this.Historyitems = [];
    this.HistorygridView = null;
    if (this.calledFrom === "archivedencounters") {
      this.dataService.orderfinancialdetails = [];
      this.dataService.orderpatientdetails = [];
      this.dataService.orderinsurancedetails = [];
      this.dataService.orderdocnotes = [];
    }
  }

  public HistorygridData: {};
  public HistorygridView: GridDataResult;
  private Historyitems: any[] = [];
  public Historysort: SortDescriptor[] = [
    {
      field: "lastassignedon",
      dir: "desc",
    },
  ];
  retriveOrderHistory() {
    try {
      if (this.calledFrom !== "archivedencounters") {
        this.historyGridLoader = true;
        this.Historyitems = [];
        this.HistorygridView = null;
        this.subscription.add(
          this.coreService
            .getOrderHistory(this.SelectedOrder.orderqueuegroupid)
            .subscribe(
              (data) => {
                if (data != undefined || data != null) {
                  this.Historyitems = data;
                  this.loadHistoryitems();
                }
                this.historyGridLoader = false;
              },
              (error) => {
                this.historyGridLoader = false;
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private loadHistoryitems(): void {
    try {
      this.HistorygridView = {
        data: orderBy(this.Historyitems, this.Historysort),
        total: this.Historyitems.length,
      };
    } catch (error) {}
  }

  sortHistoryChange(sort: SortDescriptor[]): void {
    try {
      if (this.Historyitems != null) {
        this.Historysort = sort;
        this.loadHistoryitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public onTabSelect(e: any) {
    this.index = e.index;
    if (this.index == 1) {
      this.retriveOrderHistory();
    } else {
      this.resetButtonFlags();
    }
  }
  onAddCommentClicked() {
    try {
      this.isExpandedUpdate = false;
      this.isExpandedAddComment = !this.isExpandedAddComment;
      if (this.isExpandedAddComment) {
        this.cdr.detectChanges();
        this.AddCommentComponent.SelectedOrder = this.SelectedOrder;
        this.AddCommentComponent.getCommentTypes();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  outputCommentResult(event: boolean) {
    try {
      this.isExpandedAddComment = false; //save or cancel click
      if (event) {
        //save click
        this.retriveOrderHistory();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    this.dataService.resetOrderDetails.next(false);
    this.subscription.unsubscribe();
  }
}
