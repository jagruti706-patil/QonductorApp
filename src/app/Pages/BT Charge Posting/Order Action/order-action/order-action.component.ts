import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "subsink";
import { Validators, FormBuilder } from "@angular/forms";
import { AssistanceInformationJson } from "src/app/Model/BT Charge Posting/Order/order-note";
import { OrderDocumentsComponent } from "../order-documents/order-documents.component";
import { RcmEncounterDocumentsComponent } from "../../../RCM Docs/rcm-encounter-documents/rcm-encounter-documents.component";
import { TabStripComponent } from "@progress/kendo-angular-layout";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { IncompleteOrderActionComponent } from "../incomplete-order-action/incomplete-order-action.component";
import { BehaviorSubject } from "rxjs";
import { Location } from "@angular/common";

@Component({
  selector: "app-order-action",
  templateUrl: "./order-action.component.html",
  styleUrls: ["./order-action.component.css"],
})
export class OrderActionComponent implements OnInit, OnDestroy {
  loadingTask: boolean = true;
  disableNext: boolean = false;
  submitted: boolean = false;
  clsUtility: Utility;
  gselectedTasks: any;
  gcurrentTask: any;
  gcurrentIndex: number;
  gtotalSelectedTaskCount: number;
  private subscription = new SubSink();
  orderAssignedID: string = "";
  procedureForMedicare: string = "";
  diaForMedicare: string = "";
  procedureForAddDiagnosis: string = "";
  diaForAddDiagnosis: string = "";
  disableClaimRefno: boolean = false;
  @ViewChild("OrderDocumentsComponent")
  private ViewOrderDocumentComponent: OrderDocumentsComponent;
  @ViewChild("RcmDocumentComponent")
  private RcmEncounterDocumentsComponent: RcmEncounterDocumentsComponent;
  sourceOrderStatus: any;
  assistanceInformation: AssistanceInformationJson;
  fullscreen = false;
  encountersource: string = "";
  leftside: boolean = false;
  @ViewChild("kendoTabStrip")
  private kendoTabStrip: TabStripComponent;
  @ViewChild("EncounterTabStrip")
  private EncounterTabStrip: TabStripComponent;

  @ViewChild("IncompleteInfoOrder")
  private ViewIncompleteInfoOrder: IncompleteOrderActionComponent;
  IncompleteOrderInformation: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private route: Router,
    private dataService: DataTransferService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private coreoperation: CoreOperationService,
    private location: Location
  ) {
    this.clsUtility = new Utility(toastr);
  }
  OrderActionFormGroup = this.fb.group({
    fcActionID: [0],
    fcStatus: ["", Validators.required],
    fcActionNote: [""], //, Validators.required   Removed by harish
    fcClaimReferenceNumber: [""], //, Validators.required   Removed by harish
    fcAssignSource: ["", Validators.required],
  });
  get fbcActionID() {
    return this.OrderActionFormGroup.get("fcActionID");
  }
  get fbcStatus() {
    return this.OrderActionFormGroup.get("fcStatus");
  }
  get fbcActionNote() {
    return this.OrderActionFormGroup.get("fcActionNote");
  }
  get fbcClaimReferenceNumber() {
    return this.OrderActionFormGroup.get("fcClaimReferenceNumber");
  }

  get fbcAssignSource() {
    return this.OrderActionFormGroup.get("fcAssignSource");
  }

  orderStatus: any[] = [];
  ngOnInit() {
    try {
      if (this.dataService.SelectedOrders == null) {
        this.NavigateBack();
      } else {
        this.gselectedTasks = this.dataService.SelectedOrders;
        this.gcurrentIndex = 0;
        this.gtotalSelectedTaskCount = this.gselectedTasks.length;
        if (this.gtotalSelectedTaskCount == 1) {
          this.disableNext = true;
        } else {
          this.disableNext = false;
        }
        this.ShowTask(this.gcurrentIndex);
        this.subscription.add(
          this.dataService.SelectedOrderInfo.subscribe((selectedOrder) => {
            this.gcurrentTask = selectedOrder;
            if (
              selectedOrder &&
              this.encountersource !==
                selectedOrder.encountersource.toLowerCase()
            ) {
              this.encountersource = selectedOrder.encountersource.toLowerCase();
              this.cdr.detectChanges();
            }
            if (this.kendoTabStrip) {
              this.kendoTabStrip.selectTab(0); //for selecting documents tab by default
              this.cdr.detectChanges();
            }
            if (this.EncounterTabStrip) {
              this.EncounterTabStrip.selectTab(0); //for selecting documents tab by default
              this.cdr.detectChanges();
            }
            // if (
            //   selectedOrder &&
            //   selectedOrder.encountersource.toLowerCase() ==
            //     "biotech encounter" &&
            //   selectedOrder.nstatus == 16
            // ) {
            //   this.getIncompleteInfo();
            // }
          })
        );
        this.subscription.add(
          this.dataService.leftside.subscribe(
            (leftside) => (this.leftside = leftside)
          )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  cardfullscreen() {
    this.fullscreen = !this.fullscreen;
  }

  orderdetails: any;
  ShowTask(index: number) {
    try {
      if (index < this.gtotalSelectedTaskCount) {
        this.gcurrentTask = null;

        this.gcurrentTask = this.gselectedTasks[index];
        this.dataService.SelectedOrderInfo.next(this.gcurrentTask);

        this.dataService.SelectedOrderQueueGroupCode.next(
          this.gcurrentTask.orderqueuegroupcode
        );
        this.dataService.CollapsePatientInfoBanner.next(true);

        this.loadingTask = false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  clearControls(): any {
    this.OrderActionFormGroup.reset();
  }
  NavigateBack() {
    try {
      // this.route.navigate(["/MyOrderInventory"]);
      this.location.back();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
      this.dataService.SelectedOrderInfo.next(null);
      this.dataService.CollapsePatientInfoBanner.next(false);
      this.dataService.SelectedOrderQueueGroupCode.next("");
      this.dataService.showActionPane.next(false);
      this.dataService.leftside.next(false);
      this.dataService.SelectedMasterDocId.next(null);
      this.dataService.SubmitIncompleteOrderInfo.next(null);
      this.dataService.IncompleteOrderInfo.next([]);
      this.dataService.practiceEncounterStatus.next(null);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OnClose() {
    try {
      if (this.encountersource == "rcm encounter") {
        // this.RcmEncounterDocumentsComponent.ResetDocuments();
        this.dataService.SelectedMasterDocId.next(null);
      } else if (
        this.encountersource == "biotech encounter" &&
        this.ViewOrderDocumentComponent
      ) {
        this.ViewOrderDocumentComponent.OnClose();
      }
      this.dataService.SelectedOrderQueueGroupCode.next("");
      this.dataService.isMarkedAcknowledged.next(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public onTabSelect(e: any) {
    // switch (e.index) {
    //   // case 1:
    //   //   let selectedIncompleteOrder: any = [];
    //   //   selectedIncompleteOrder.push(this.gcurrentTask);
    //   //   this.dataService.IncompleteOrderInfo.next(selectedIncompleteOrder);
    //   //   // this.IncompleteOrderInformation.next(
    //   //   //   this.gcurrentTask.incompleteorderinfo
    //   //   // );
    //   //   break;
    // }
  }
}
