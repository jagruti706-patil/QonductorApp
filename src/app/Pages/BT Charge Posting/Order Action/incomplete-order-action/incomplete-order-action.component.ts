import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  OnDestroy,
  Input,
} from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { GridComponent, GridDataResult } from "@progress/kendo-angular-grid";
import { GroupDescriptor, State } from "@progress/kendo-data-query";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { groupBy } from "rxjs/operators";
import { Observable } from "rxjs";
import { IncompleteOrderNote } from "src/app/Model/BT Charge Posting/Order/order-note";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { exportPDF, Group } from "@progress/kendo-drawing";
import { SubSink } from "subsink";
declare var $: any;

@Component({
  selector: "app-incomplete-order-action",
  templateUrl: "./incomplete-order-action.component.html",
  styleUrls: ["./incomplete-order-action.component.css"],
})
export class IncompleteOrderActionComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  errMiscInfo: boolean = false;
  errMedicarePatient: boolean = false;
  errAdditionalInsurance: boolean = false;
  errAnsSubMiscInfo: boolean = false;
  errAnsSubInsurancePlanInfo: boolean = false;
  errAnsSubSubscriberInfo: boolean = false;
  errAnsSubNoDXGivenInfo: boolean = false;
  errAnsSubDiagnosisInfo: boolean = false;
  errAnsSubMedicarePatient: boolean = false;
  errAnsSignature: boolean = false;

  IncompleteOrder: any = [
    {
      status: false,
      serialno: -1,
      title: "",
      description: "Category",
    },

    {
      status: false,
      serialno: 0,
      // title:
      //   "Dear Physician: Please provide the following MISSING information for billing purposes*",
      title: "",
      description:
        "Dear Physician: *Please provide the following MISSING information for billing purposes*",
    },
    {
      status: false,
      serialno: 1,
      title: "HELP!! MISSING INFO...",
      description: "",
    },
    {
      status: true,
      serialno: 2,
      title: "Misc. Info",
      description: "",
    },
    {
      status: true,
      serialno: 3,
      title: "Insurance Info",
      description: "",
    },
    {
      status: true,
      serialno: 4,
      title: "Subscriber Info",
      description: "",
    },
    {
      status: true,
      serialno: 5,
      title: "No Dx given on requisition",
      description: "No Dx given on requisition",
    },
    {
      status: true,
      serialno: 6,
      title:
        "Medicare patients: Need Medicare payable diagnosis for the following",
      description: "",
    },
    {
      status: false,
      serialno: 6.1,
      // title: "Lab Test",
      title: "",
      description: "Lab Test",
    },
    // {
    //   status: false,
    //   serialno: 6.2,
    //   // title: "Diagnosis Code",
    //   title: "",
    //   description: "Diagnosis Code"
    // },
    // {
    //   status: false,
    //   serialno: 7,
    //   // title: "Additional Dx Need for all other Insurance",
    //   title: "",
    //   description: ""
    // },
    // {
    //   status: false,
    //   serialno: 7.1,
    //   // title: "Lab Test",
    //   title: "",
    //   description: "Lab Test"
    // },
    // {
    //   status: false,
    //   serialno: 7.2,
    //   // title: "Diagnosis Code",
    //   title: "",
    //   description: "Diagnosis Code"
    // },
    {
      status: true,
      serialno: 7,
      title:
        "Doctors: Please read and check box if appropriate***No Dx given. BILL AS IS",
      description: "",
    },
    {
      status: false,
      serialno: 9,
      title: "",
      description: "",
    },
    {
      status: false,
      serialno: 10,
      title: "",
      description: "",
    },
  ];

  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10,
  };
  @Input() calledFrom: string = "";
  @Input() noteCalledFrom: string = "";

  IncompleteInfoGroup = this.formBuilder.group({
    fcTodayDate: [],
    fcOrderAccessionNo: [""],
    fcOrderProvider: [""],

    fcRequisitionDate: [],
    fcRequisitionNo: [""],

    fcOrderCategory: [""],
    fcIsMedicare: [false],

    fcIsMiscInfo: [false],
    fcIsInsuranceInfo: [false],
    fcIsSubscriberInfo: [false],
    fcIsNoDiagnosis: [false],
    fcIsMedicarePatient: [false],
    fcIsAdditionalInsurance: [false],
    fcIsDoctorInfo: [false],

    fcMiscInfo: [""],

    fcMedicareProcedure1: [""],
    fcMedicareProcedure2: [""],
    fcMedicareProcedure3: [""],
    fcMedicareProcedure4: [""],
    fcMedicareProcedure5: [""],

    fcMedicareDiagnosis1: [""],
    fcMedicareDiagnosis2: [""],
    fcMedicareDiagnosis3: [""],
    fcMedicareDiagnosis4: [""],
    fcMedicareDiagnosis5: [""],

    fcAdditionalProcedure1: [""],
    fcAdditionalProcedure2: [""],
    fcAdditionalProcedure3: [""],
    fcAdditionalProcedure4: [""],
    fcAdditionalProcedure5: [""],

    fcAdditionalDiagnosis1: [""],
    fcAdditionalDiagnosis2: [""],
    fcAdditionalDiagnosis3: [""],
    fcAdditionalDiagnosis4: [""],
    fcAdditionalDiagnosis5: [""],

    fcSignature: [""],
    fcCompletedBy: [""],
    fcCompletedOn: [""],

    fcMiscInfoAnswer: [""],
    fcNoDXGivenAnswer: [""],
    fcInsurancePlanName: [""],
    fcSubscriberID: [""],
    fcSubscriberName: [""],
    fcSubscriberDOB: [""],
    fcSubscriberRelationToPatient: [""],
    fcExtraNote: [""],
  });
  // isanswered: boolean;

  get fbcTodayDate() {
    return this.IncompleteInfoGroup.get("fcTodayDate");
  }
  get fbcOrderAccessionNo() {
    return this.IncompleteInfoGroup.get("fcOrderAccessionNo");
  }
  get fbcOrderProvider() {
    return this.IncompleteInfoGroup.get("fcOrderProvider");
  }

  get fbcOrderCategory() {
    return this.IncompleteInfoGroup.get("fcOrderCategory");
  }

  get fbcIsMedicare() {
    return this.IncompleteInfoGroup.get("fcIsMedicare");
  }

  get fbcIsMiscInfo() {
    return this.IncompleteInfoGroup.get("fcIsMiscInfo");
  }

  get fbcIsInsuranceInfo() {
    return this.IncompleteInfoGroup.get("fcIsInsuranceInfo");
  }
  get fbcIsSubscriberInfo() {
    return this.IncompleteInfoGroup.get("fcIsSubscriberInfo");
  }

  get fbcIsNoDiagnosis() {
    return this.IncompleteInfoGroup.get("fcIsNoDiagnosis");
  }
  get fbcIsMedicarePatient() {
    return this.IncompleteInfoGroup.get("fcIsMedicarePatient");
  }
  //fbcIsAdditionalInsurance is now used for serial no. 7
  get fbcIsAdditionalInsurance() {
    return this.IncompleteInfoGroup.get("fcIsAdditionalInsurance");
  }
  get fbcIsDoctorInfo() {
    return this.IncompleteInfoGroup.get("fcIsDoctorInfo");
  }

  get fbcRequisitionDate() {
    return this.IncompleteInfoGroup.get("fcRequisitionDate");
  }
  get fbcRequisitionNo() {
    return this.IncompleteInfoGroup.get("fcRequisitionNo");
  }

  get fbcMisscInfo() {
    return this.IncompleteInfoGroup.get("fcMiscInfo");
  }

  get fbcMedicareProcedure1() {
    return this.IncompleteInfoGroup.get("fcMedicareProcedure1");
  }
  get fbcMedicareProcedure2() {
    return this.IncompleteInfoGroup.get("fcMedicareProcedure2");
  }
  get fbcMedicareProcedure3() {
    return this.IncompleteInfoGroup.get("fcMedicareProcedure3");
  }
  get fbcMedicareProcedure4() {
    return this.IncompleteInfoGroup.get("fcMedicareProcedure4");
  }
  get fbcMedicareProcedure5() {
    return this.IncompleteInfoGroup.get("fcMedicareProcedure5");
  }
  get fbcMedicareDiagnosis1() {
    return this.IncompleteInfoGroup.get("fcMedicareDiagnosis1");
  }
  get fbcMedicareDiagnosis2() {
    return this.IncompleteInfoGroup.get("fcMedicareDiagnosis2");
  }
  get fbcMedicareDiagnosis3() {
    return this.IncompleteInfoGroup.get("fcMedicareDiagnosis3");
  }
  get fbcMedicareDiagnosis4() {
    return this.IncompleteInfoGroup.get("fcMedicareDiagnosis4");
  }
  get fbcMedicareDiagnosis5() {
    return this.IncompleteInfoGroup.get("fcMedicareDiagnosis5");
  }

  get fbcAdditionalProcedure1() {
    return this.IncompleteInfoGroup.get("fcAdditionalProcedure1");
  }
  get fbcAdditionalProcedure2() {
    return this.IncompleteInfoGroup.get("fcAdditionalProcedure2");
  }
  get fbcAdditionalProcedure3() {
    return this.IncompleteInfoGroup.get("fcAdditionalProcedure3");
  }
  get fbcAdditionalProcedure4() {
    return this.IncompleteInfoGroup.get("fcAdditionalProcedure4");
  }
  get fbcAdditionalProcedure5() {
    return this.IncompleteInfoGroup.get("fcAdditionalProcedure5");
  }
  get fbcAdditionalDiagnosis1() {
    return this.IncompleteInfoGroup.get("fcAdditionalDiagnosis1");
  }
  get fbcAdditionalDiagnosis2() {
    return this.IncompleteInfoGroup.get("fcAdditionalDiagnosis2");
  }
  get fbcAdditionalDiagnosis3() {
    return this.IncompleteInfoGroup.get("fcAdditionalDiagnosis3");
  }
  get fbcAdditionalDiagnosis4() {
    return this.IncompleteInfoGroup.get("fcAdditionalDiagnosis4");
  }
  get fbcAdditionalDiagnosis5() {
    return this.IncompleteInfoGroup.get("fcAdditionalDiagnosis5");
  }

  get fbcSignature() {
    return this.IncompleteInfoGroup.get("fcSignature");
  }
  get fbcCompletedBy() {
    return this.IncompleteInfoGroup.get("fcCompletedBy");
  }
  get fbcCompletedOn() {
    return this.IncompleteInfoGroup.get("fcCompletedOn");
  }
  get fbcMiscInfoAnswer() {
    return this.IncompleteInfoGroup.get("fcMiscInfoAnswer");
  }
  get fbcNoDXGivenAnswer() {
    return this.IncompleteInfoGroup.get("fcNoDXGivenAnswer");
  }
  get fbcInsurancePlanName() {
    return this.IncompleteInfoGroup.get("fcInsurancePlanName");
  }
  get fbcSubscriberID() {
    return this.IncompleteInfoGroup.get("fcSubscriberID");
  }
  get fbcSubscriberName() {
    return this.IncompleteInfoGroup.get("fcSubscriberName");
  }
  get fbcSubscriberDOB() {
    return this.IncompleteInfoGroup.get("fcSubscriberDOB");
  }
  get fbcSubscriberRelationToPatient() {
    return this.IncompleteInfoGroup.get("fcSubscriberRelationToPatient");
  }
  get fbcExtraNote() {
    return this.IncompleteInfoGroup.get("fcExtraNote");
  }
  IncompleteOrderInfo: IncompleteOrderNote;
  private clsUtility: Utility;
  public changes: any = {};
  orderdetails: any = null;
  todaydate: string;
  isReadonlyCoverpage: boolean = false;
  isSubmittingAnswer: boolean = false;
  private subscription: SubSink = new SubSink();
  loader: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataTransferService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private coreService: CoreOperationService
  ) {
    this.clsUtility = new Utility(toastr);
    this.IncompleteOrderInfo = new IncompleteOrderNote();
  }
  datepipe = new DatePipe("en-US");
  public ngOnInit(): void {
    this.view = this.IncompleteOrder;

    // this.editService.read();
    // let isoninit: boolean = true;
    this.subscription.add(
      this.dataService.IncompleteOrderInfo.subscribe((order) => {
        // console.log(order);   this.subscription.add(

        if (order != null && order[0]) {
          this.orderdetails = order[0];
          let foldername: string = this.orderdetails.orderday;
          if (foldername.toLowerCase().includes("tox")) {
            this.fbcOrderCategory.setValue("Toxicology");
          } else {
            if (isNaN(Number(foldername.toLowerCase())) == false) {
              this.fbcOrderCategory.setValue("Blood");
            } else {
              this.fbcOrderCategory.setValue("");
            }
          }
          this.todaydate = this.datepipe.transform(
            this.clsUtility.currentDateTime(),
            "MMM dd, yyyy"
          );
          let requisitiondate: string = this.datepipe.transform(
            this.orderdetails.mintransactiondate,
            "yyyy-MM-ddTHH:mm:ss.SSSZ"
          );
          // var requisitiondate: string = this.datepipe.transform(
          //   this.orderdetails.mintransactiondate,
          //   "MMM dd, yyyy"
          // );
          this.fbcTodayDate.setValue(this.todaydate);
          if (requisitiondate) {
            this.fbcRequisitionDate.setValue(new Date(requisitiondate));
          }
          this.fbcOrderAccessionNo.setValue(
            this.orderdetails.orderqueuegroupcode
          );

          this.fbcOrderProvider.setValue(this.orderdetails.providername);

          if (
            // !isoninit &&
            this.calledFrom === "notemodal" &&
            this.noteCalledFrom !==
              enumFilterCallingpage.OrderAssistanceWorkqueue
          ) {
            this.loader = true;
            this.subscription.add(
              this.coreService
                .GetOrderqueueIsanswered(order[0].orderqueuegroupid)
                .subscribe(
                  (isanswered) => {
                    this.loader = false;
                    if (!isanswered) {
                      if (order[0].incompleteorderinfo) {
                        this.IncompleteOrderInfo = order[0].incompleteorderinfo;
                        this.SetIncompleteOrderGrid();
                      }
                    }
                  },
                  (error) => {
                    this.loader = false;
                  }
                )
            );
          } else {
            if (order[0].incompleteorderinfo) {
              if (order[0].isSubmittingAnswer) {
                this.isSubmittingAnswer = order[0].isSubmittingAnswer;
                this.resetAnswerErrorFlags();
              }
              this.IncompleteOrderInfo = order[0].incompleteorderinfo;
              this.SetIncompleteOrderGrid();
            }
          }
          // console.log(this.orderdetails);
        }
      })
    );
    // isoninit = false;
    if (this.calledFrom === "encounteraction") {
      this.subscription.add(
        this.dataService.SubmitIncompleteOrderInfo.subscribe(
          (incompletinfo) => {
            if (incompletinfo) {
              this.IncompleteOrderInfo = incompletinfo;
              this.SetIncompleteOrderGrid();
            }
          }
        )
      );
    }
  }
  resetAnswerErrorFlags() {
    try {
      this.errAnsSubMiscInfo = false;
      this.errAnsSubInsurancePlanInfo = false;
      this.errAnsSubSubscriberInfo = false;
      this.errAnsSubNoDXGivenInfo = false;
      this.errAnsSubDiagnosisInfo = false;
      this.errAnsSubMedicarePatient = false;
      this.errAnsSignature = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public onStateChange(state: State) {
    this.gridState = state;

    // this.editService.read();
  }

  public cellClickHandler({
    sender,
    rowIndex,
    column,
    columnIndex,
    dataItem,
    isEdited,
  }) {
    if (columnIndex != 2) {
      if (!isEdited && !this.isReadOnly(column.field)) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
    }
  }

  public cellCloseHandler(args: any) {
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      // this.editService.assignValues(dataItem, formGroup.value);
      // this.editService.update(dataItem);
    }
  }

  // public addHandler({ sender }) {
  //     sender.addRow(this.createFormGroup(new Product()));
  // }

  // public cancelHandler({ sender, rowIndex }) {
  //     sender.closeRow(rowIndex);
  // }

  // public saveHandler({ sender, formGroup, rowIndex }) {
  //     if (formGroup.valid) {
  //         this.editService.create(formGroup.value);
  //         sender.closeRow(rowIndex);
  //     }
  // }

  // public removeHandler({ sender, dataItem }) {
  //     this.editService.remove(dataItem);

  //     sender.cancelCell();
  // }

  public saveChanges(grid: any): void {
    grid.closeCell();
    grid.cancelCell();

    // this.editService.saveChanges();
  }

  public cancelChanges(grid: any): void {
    grid.cancelCell();

    // this.editService.cancelChanges();
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      serialno: dataItem.serialno,
      title: [dataItem.title],
      description: dataItem.description,
    });
  }

  private isReadOnly(field: string): boolean {
    const readOnlyColumns = ["serialno", "title", "description"];
    return readOnlyColumns.indexOf(field) > -1;
  }
  SaveIncompleteOrderActionDetails(): any {
    var incompletenote = new IncompleteOrderNote();
    incompletenote.todaysdate = this.fbcTodayDate.value;
    incompletenote.accessionnumber = this.fbcOrderAccessionNo.value;
    incompletenote.providername = this.fbcOrderProvider.value;
    incompletenote.requisitiondate = this.datepipe.transform(
      this.fbcRequisitionDate.value,
      "MM/dd/yyyy"
    );
    if (incompletenote.requisitiondate == null) {
      incompletenote.requisitiondate = "";
    }
    incompletenote.requisitionno = this.fbcRequisitionNo.value;
    incompletenote.ordercategory = this.fbcOrderCategory.value;
    incompletenote.ismedicare = this.fbcIsMedicare.value;

    incompletenote.ismiscinfocheck = this.fbcIsMiscInfo.value;
    incompletenote.isinsurnaceinfocheck = this.fbcIsInsuranceInfo.value;
    incompletenote.issubscriberinfocheck = this.fbcIsSubscriberInfo.value;
    incompletenote.isnodiagnosis = this.fbcIsNoDiagnosis.value;
    incompletenote.ismedicarepatient = this.fbcIsMedicarePatient.value;
    // incompletenote.isadditionalinsurance = this.fbcIsAdditionalInsurance.value;
    incompletenote.isdoctorinfo = this.fbcIsDoctorInfo.value;

    incompletenote.miscinfo = this.fbcMisscInfo.value;
    // incompletenote.insuranceplan = this.fbcInsurancePlanName.value;
    // incompletenote.subscriberid = this.fbcSubscriberID.value;
    // incompletenote.subscribername = this.fbcSubscriberName.value;
    // incompletenote.subscriberdob = this.fbcSubscriberDOB.value;
    // incompletenote.subscriberreleationshiptopatient = this.fbcSubscriberRelationToPatient.value;
    // if (this.fbcIsInsuranceInfo.value) {
    //   incompletenote.insurnacemissinginfolable = this.fbcInsuranceInfoLabel.value;
    // } else {
    //   incompletenote.insurnacemissinginfolable = "";
    // }

    // if (this.fbcIsSubscriberInfo.value) {
    //   incompletenote.subscribermissinginfolable = this.fbcSubscriberInfoLabel.value;
    // } else {
    //   incompletenote.subscribermissinginfolable = "";
    // }

    incompletenote.medicareprocedure1 = this.fbcMedicareProcedure1.value;
    incompletenote.medicareprocedure2 = this.fbcMedicareProcedure2.value;
    incompletenote.medicareprocedure3 = this.fbcMedicareProcedure3.value;
    incompletenote.medicareprocedure4 = this.fbcMedicareProcedure4.value;
    incompletenote.medicareprocedure5 = this.fbcMedicareProcedure5.value;

    incompletenote.medicarediagnosis1 = this.fbcMedicareDiagnosis1.value;
    incompletenote.medicarediagnosis2 = this.fbcMedicareDiagnosis2.value;
    incompletenote.medicarediagnosis3 = this.fbcMedicareDiagnosis3.value;
    incompletenote.medicarediagnosis4 = this.fbcMedicareDiagnosis4.value;
    incompletenote.medicarediagnosis5 = this.fbcMedicareDiagnosis5.value;
    incompletenote.additionalprocedure1 = this.fbcAdditionalProcedure1.value;
    incompletenote.additionalprocedure2 = this.fbcAdditionalProcedure2.value;
    incompletenote.additionalprocedure3 = this.fbcAdditionalProcedure3.value;
    incompletenote.additionalprocedure4 = this.fbcAdditionalProcedure4.value;
    incompletenote.additionalprocedure5 = this.fbcAdditionalProcedure5.value;

    incompletenote.additionaldiagnosis1 = this.fbcAdditionalDiagnosis1.value;
    incompletenote.additionaldiagnosis2 = this.fbcAdditionalDiagnosis2.value;
    incompletenote.additionaldiagnosis3 = this.fbcAdditionalDiagnosis3.value;
    incompletenote.additionaldiagnosis4 = this.fbcAdditionalDiagnosis4.value;
    incompletenote.additionaldiagnosis5 = this.fbcAdditionalDiagnosis5.value;
    // if (this.fbcIsMiscInfo.value) {
    //   incompletenote.miscinfo = this.fbcMisscInfo.value;
    // }
    // if (this.fbcIsMedicarePatient.value) {
    //   incompletenote.medicareprocedure1 = this.fbcMedicareProcedure1.value;
    //   incompletenote.medicareprocedure2 = this.fbcMedicareProcedure2.value;
    //   incompletenote.medicareprocedure3 = this.fbcMedicareProcedure3.value;
    //   incompletenote.medicareprocedure4 = this.fbcMedicareProcedure4.value;
    //   incompletenote.medicareprocedure5 = this.fbcMedicareProcedure5.value;

    //   incompletenote.medicarediagnosis1 = this.fbcMedicareDiagnosis1.value;
    //   incompletenote.medicarediagnosis2 = this.fbcMedicareDiagnosis2.value;
    //   incompletenote.medicarediagnosis3 = this.fbcMedicareDiagnosis3.value;
    //   incompletenote.medicarediagnosis4 = this.fbcMedicareDiagnosis4.value;
    //   incompletenote.medicarediagnosis5 = this.fbcMedicareDiagnosis5.value;
    // }
    // if (this.fbcIsAdditionalInsurance.value) {
    //   incompletenote.additionalprocedure1 = this.fbcAdditionalProcedure1.value;
    //   incompletenote.additionalprocedure2 = this.fbcAdditionalProcedure2.value;
    //   incompletenote.additionalprocedure3 = this.fbcAdditionalProcedure3.value;
    //   incompletenote.additionalprocedure4 = this.fbcAdditionalProcedure4.value;
    //   incompletenote.additionalprocedure5 = this.fbcAdditionalProcedure5.value;

    //   incompletenote.additionaldiagnosis1 = this.fbcAdditionalDiagnosis1.value;
    //   incompletenote.additionaldiagnosis2 = this.fbcAdditionalDiagnosis2.value;
    //   incompletenote.additionaldiagnosis3 = this.fbcAdditionalDiagnosis3.value;
    //   incompletenote.additionaldiagnosis4 = this.fbcAdditionalDiagnosis4.value;
    //   incompletenote.additionaldiagnosis5 = this.fbcAdditionalDiagnosis5.value;
    // }
    // console.log(
    //   "this.IncompleteInfoGroup.value",
    //   this.IncompleteInfoGroup.value
    // );
    // console.log("incompletenote", incompletenote);
    if (this.isSubmittingAnswer) {
      incompletenote.miscinfo_answer = this.fbcMiscInfoAnswer.value;
      incompletenote.insuranceplan = this.fbcInsurancePlanName.value;
      incompletenote.insuranceid = this.fbcSubscriberID.value;
      incompletenote.subscribername = this.fbcSubscriberName.value;
      incompletenote.subscriberdob = this.fbcSubscriberDOB.value;
      incompletenote.subscriberrelationship = this.fbcSubscriberRelationToPatient.value;
      incompletenote.nodxgiven_answer = this.fbcNoDXGivenAnswer.value;
      incompletenote.signature = this.fbcSignature.value;
      incompletenote.completedby = this.fbcCompletedBy.value;
      incompletenote.completedon = this.fbcCompletedOn.value;
      incompletenote.extrainformation = this.fbcExtraNote.value;
    }
    return incompletenote;
  }
  // public grids: QueryList<GridComponent>;
  selectedFiles: File;
  @ViewChildren("IncompleteOrderGrid")
  public grids: QueryList<GridComponent>;
  // public exportGrids(grids: QueryList<GridComponent>, filename: string): any {
  //   try {
  //     // if (IsUpload === false) {
  //     //   $("#addclientModal").modal("hide");
  //     //   return;
  //     // }
  //     // // console.log(this.grids);
  //     // $("#addclientModal").modal("hide");
  //     const promises = grids.map(grid => grid.drawPDF());
  //     Promise.all(promises)
  //       .then(groups => {
  //         const rootGroup = new Group({
  //           pdf: {
  //             multiPage: true
  //           }
  //         });
  //         groups.forEach(group => {
  //           rootGroup.append(...group.children);
  //         });

  //         return exportPDF(rootGroup, { paperSize: "A4" });
  //       })
  //       .then(dataUri => {
  //         // console.log(dataUri);
  //         dataUri = dataUri.replace("data:application/pdf;base64,", "");
  //         // console.log(dataUri);

  //         const blobltext = this.b64toBlob(dataUri, "application/pdf");
  //         // console.log(blobltext);

  //         // var uploadorder: UploadOrders = new UploadOrders();
  //         // var selectedProvider: string;
  //         // for (const order of this.OrderSelected) {
  //         //   uploadorder.orderqueueid = order.orderqueuegroupid;
  //         //   uploadorder.accessionno = order.orderqueuegroupcode;
  //         //   selectedProvider = order.providername.replace(" ", "_");
  //         // }
  //         // var currentdate: string = this.datePipe.transform(
  //         //   this.clsUtility.currentDateTime(),
  //         //   "ddMMyy"
  //         // );

  //         // uploadorder.tokenid = "188b4c46-7543-4c24-aec7-96385c5d9f54";
  //         // var uploadfilename: string;
  //         // if (selectedProvider == "") {
  //         //   uploadfilename = currentdate + "_Unknown";
  //         // } else {
  //         //   uploadfilename = currentdate + "_" + selectedProvider;
  //         // }

  //         // uploadorder.filename = uploadfilename;
  //         // uploadorder.extension = ".pdf";
  //         // // console.log(uploadorder);

  //         // var filename =
  //         //   uploadfilename + "_" + uploadorder.accessionno + "-000-Cover";

  //         var testFile = new File([blobltext], filename, {
  //           type: "application/pdf"
  //         });
  //         // console.log(testFile);

  //         this.selectedFiles = testFile;
  //         console.log("File in incomplete", this.selectedFiles);

  //         // this.subscription.add(
  //         //   this.coreService
  //         //     .uploadDocuments(uploadorder, this.selectedFiles)
  //         //     .subscribe(data => {
  //         //       if (data == 1) {
  //         //         this.clsUtility.showSuccess(
  //         //           "Documents uploaded to docsvault successfully"
  //         //         );

  //         //         this.OrderSelected = [];
  //         //         this.lstFilter = this.dataService.SelectedFilter;
  //         //         this.RetriveMasterData(this.pagesize, this.OrderSkip);
  //         //       } else {
  //         //         this.clsUtility.showError("Error while uploading documents");
  //         //       }
  //         //     })
  //         // );
  //         // this.getMailConfigurationByTitle("Daily Production Close");

  //         // saveAs(dataUri, filename);
  //         return this.selectedFiles;
  //       });
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  public exportGrids(filename: string): Promise<any> {
    try {
      const promises = this.grids.map((grid) => grid.drawPDF());
      return Promise.all(promises)
        .then((groups) => {
          const rootGroup = new Group({
            pdf: {
              multiPage: true,
            },
          });
          groups.forEach((group) => {
            rootGroup.append(...group.children);
          });

          return exportPDF(rootGroup, { paperSize: "A4" });
        })
        .then((dataUri) => {
          // console.log(dataUri);
          dataUri = dataUri.replace("data:application/pdf;base64,", "");
          // console.log(dataUri);

          const blobltext = this.b64toBlob(dataUri, "application/pdf");
          // console.log(blobltext);
          var testFile = new File([blobltext], filename, {
            type: "application/pdf",
          });
          // console.log(testFile);

          this.selectedFiles = testFile;
          // console.log("File in incomplete", this.selectedFiles);

          return this.selectedFiles;
        });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  b64toBlob = (b64Data, contentType = "application/pdf", sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blobpdf = new Blob(byteArrays, { type: contentType });
    return blobpdf;
  };

  SetIncompleteOrderGrid(): boolean {
    try {
      var IsLoaded: boolean = false;
      if (this.IncompleteOrderInfo != null) {
        this.fbcTodayDate.setValue(
          this.datepipe.transform(
            this.IncompleteOrderInfo.todaysdate,
            "MMM dd, yyyy"
          )
        );
        this.fbcOrderAccessionNo.setValue(
          this.IncompleteOrderInfo.accessionnumber
        );
        this.fbcOrderProvider.setValue(this.IncompleteOrderInfo.providername);
        this.fbcRequisitionNo.setValue(this.IncompleteOrderInfo.requisitionno);
        let rdate: string = this.datepipe.transform(
          this.IncompleteOrderInfo.requisitiondate,
          "yyyy-MM-ddTHH:mm:ss.SSSZ"
        );
        if (rdate) {
          this.fbcRequisitionDate.setValue(new Date(rdate));
        } else {
          this.fbcRequisitionDate.setValue(null);
        }
        this.fbcOrderCategory.setValue(
          this.IncompleteOrderInfo.ordercategory == undefined
            ? ""
            : this.IncompleteOrderInfo.ordercategory
        );
        this.fbcIsMedicare.setValue(this.IncompleteOrderInfo.ismedicare);
        this.fbcIsMiscInfo.setValue(this.IncompleteOrderInfo.ismiscinfocheck);
        this.fbcIsInsuranceInfo.setValue(
          this.IncompleteOrderInfo.isinsurnaceinfocheck
        );
        this.fbcIsSubscriberInfo.setValue(
          this.IncompleteOrderInfo.issubscriberinfocheck
        );
        this.fbcIsNoDiagnosis.setValue(this.IncompleteOrderInfo.isnodiagnosis);
        this.fbcIsMedicarePatient.setValue(
          this.IncompleteOrderInfo.ismedicarepatient
        );
        // this.fbcIsAdditionalInsurance.setValue(
        //   this.IncompleteOrderInfo.isadditionalinsurance
        // );
        this.fbcIsDoctorInfo.setValue(this.IncompleteOrderInfo.isdoctorinfo);
        this.fbcMisscInfo.setValue(this.IncompleteOrderInfo.miscinfo);

        // this.fbcInsuranceInfoLabel.setValue(
        //   this.IncompleteOrderInfo.insurnacemissinginfolable
        // );
        // this.fbcSubscriberInfoLabel.setValue(
        //   this.IncompleteOrderInfo.subscribermissinginfolable
        // );
        // this.fbcInsurancePlanName.setValue(
        //   this.IncompleteOrderInfo.insuranceplan
        // );
        // this.fbcSubscriberID.setValue(this.IncompleteOrderInfo.subscriberid);
        // this.fbcSubscriberName.setValue(this.IncompleteOrderInfo.subscribername);
        // this.fbcSubscriberDOB.setValue(this.IncompleteOrderInfo.subscriberdob);
        // this.fbcSubscriberRelationToPatient.setValue(
        //   this.IncompleteOrderInfo.subscriberreleationshiptopatient
        // );
        this.fbcMedicareProcedure1.setValue(
          this.IncompleteOrderInfo.medicareprocedure1
        );
        this.fbcMedicareProcedure2.setValue(
          this.IncompleteOrderInfo.medicareprocedure2
        );
        this.fbcMedicareProcedure3.setValue(
          this.IncompleteOrderInfo.medicareprocedure3
        );
        this.fbcMedicareProcedure4.setValue(
          this.IncompleteOrderInfo.medicareprocedure4
        );
        this.fbcMedicareProcedure5.setValue(
          this.IncompleteOrderInfo.medicareprocedure5
        );

        this.fbcMedicareDiagnosis1.setValue(
          this.IncompleteOrderInfo.medicarediagnosis1
        );
        this.fbcMedicareDiagnosis2.setValue(
          this.IncompleteOrderInfo.medicarediagnosis2
        );
        this.fbcMedicareDiagnosis3.setValue(
          this.IncompleteOrderInfo.medicarediagnosis3
        );
        this.fbcMedicareDiagnosis4.setValue(
          this.IncompleteOrderInfo.medicarediagnosis4
        );
        this.fbcMedicareDiagnosis5.setValue(
          this.IncompleteOrderInfo.medicarediagnosis5
        );

        this.fbcAdditionalProcedure1.setValue(
          this.IncompleteOrderInfo.additionalprocedure1
        );
        this.fbcAdditionalProcedure2.setValue(
          this.IncompleteOrderInfo.additionalprocedure2
        );
        this.fbcAdditionalProcedure3.setValue(
          this.IncompleteOrderInfo.additionalprocedure3
        );
        this.fbcAdditionalProcedure4.setValue(
          this.IncompleteOrderInfo.additionalprocedure4
        );
        this.fbcAdditionalProcedure5.setValue(
          this.IncompleteOrderInfo.additionalprocedure5
        );

        this.fbcAdditionalDiagnosis1.setValue(
          this.IncompleteOrderInfo.additionaldiagnosis1
        );
        this.fbcAdditionalDiagnosis2.setValue(
          this.IncompleteOrderInfo.additionaldiagnosis2
        );
        this.fbcAdditionalDiagnosis3.setValue(
          this.IncompleteOrderInfo.additionaldiagnosis3
        );
        this.fbcAdditionalDiagnosis4.setValue(
          this.IncompleteOrderInfo.additionaldiagnosis4
        );
        this.fbcAdditionalDiagnosis5.setValue(
          this.IncompleteOrderInfo.additionaldiagnosis5
        );

        // if (!this.fbcIsNoDiagnosis && !this.fbcIsMedicarePatient)
        this.fbcSignature.setValue(this.IncompleteOrderInfo.signature);
        this.fbcCompletedBy.setValue(this.IncompleteOrderInfo.completedby);
        this.fbcCompletedOn.setValue(this.IncompleteOrderInfo.completedon);

        this.fbcMiscInfoAnswer.setValue(
          this.IncompleteOrderInfo.miscinfo_answer != ""
            ? this.IncompleteOrderInfo.miscinfo_answer
            : ""
        );

        this.fbcInsurancePlanName.setValue(
          this.IncompleteOrderInfo.insuranceplan != ""
            ? this.IncompleteOrderInfo.insuranceplan
            : ""
        );

        this.fbcSubscriberID.setValue(
          this.IncompleteOrderInfo.insuranceid != ""
            ? this.IncompleteOrderInfo.insuranceid
            : ""
        );

        this.fbcSubscriberName.setValue(
          this.IncompleteOrderInfo.subscribername != ""
            ? this.IncompleteOrderInfo.subscribername
            : ""
        );
        this.fbcSubscriberDOB.setValue(
          this.IncompleteOrderInfo.subscriberdob != ""
            ? this.IncompleteOrderInfo.subscriberdob
            : ""
        );
        this.fbcSubscriberRelationToPatient.setValue(
          this.IncompleteOrderInfo.subscriberrelationship != ""
            ? this.IncompleteOrderInfo.subscriberrelationship
            : ""
        );
        this.fbcNoDXGivenAnswer.setValue(
          this.IncompleteOrderInfo.nodxgiven_answer != ""
            ? this.IncompleteOrderInfo.nodxgiven_answer
            : ""
        );
        this.fbcExtraNote.setValue(
          this.IncompleteOrderInfo.extrainformation != ""
            ? this.IncompleteOrderInfo.extrainformation
            : ""
        );

        if (this.isSubmittingAnswer) {
          // this.fbcIsMiscInfo.disable();
          // this.fbcIsInsuranceInfo.disable();
          // this.fbcIsMedicare.disable();
          // this.fbcIsMedicarePatient.disable();
          // this.fbcIsNoDiagnosis.disable();
          // this.fbcIsSubscriberInfo.disable();
          // this.fbcIsDoctorInfo.disable();
          // this.fbcOrderCategory.disable();
          if (!this.fbcIsNoDiagnosis.value && !this.fbcIsMedicarePatient.value)
            this.fbcSignature.setValue(this.dataService.loginUserName);
          this.fbcCompletedBy.setValue(this.dataService.loginUserName);
          this.fbcCompletedOn.setValue(
            this.datepipe.transform(new Date(), "MMM dd, yyyy")
          );
        }
        IsLoaded = true;
      } else {
        this.IncompleteInfoGroup.reset();
        IsLoaded = false;
      }
      return IsLoaded;
      // this.exportGrids();
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  validateFields(): boolean {
    try {
      let isValid: boolean = false;
      let isCategoryValid: boolean = false;
      let isInsuranceTypeValid: boolean = false;

      if (!this.fbcOrderCategory.value) {
        isCategoryValid = false;
      } else {
        isCategoryValid = true;
      }
      if (!this.fbcIsMedicare.value) {
        isInsuranceTypeValid = false;
      } else {
        isInsuranceTypeValid = true;
      }
      this.fbcIsMedicare.updateValueAndValidity();
      this.fbcOrderCategory.updateValueAndValidity();
      this.fbcIsMiscInfo.updateValueAndValidity();
      this.fbcIsInsuranceInfo.updateValueAndValidity();
      this.fbcIsSubscriberInfo.updateValueAndValidity();
      this.fbcIsMedicarePatient.updateValueAndValidity();
      // this.fbcIsAdditionalInsurance.updateValueAndValidity();
      this.fbcMisscInfo.updateValueAndValidity();
      // this.fbcInsurancePlanName.updateValueAndValidity();
      // this.fbcSubscriberID.updateValueAndValidity();
      // this.fbcSubscriberName.updateValueAndValidity();
      // this.fbcSubscriberDOB.updateValueAndValidity();
      // this.fbcSubscriberRelationToPatient.updateValueAndValidity();
      this.fbcMedicareProcedure1.updateValueAndValidity();
      this.fbcMedicareProcedure2.updateValueAndValidity();
      this.fbcMedicareProcedure3.updateValueAndValidity();
      this.fbcMedicareProcedure4.updateValueAndValidity();
      this.fbcMedicareProcedure5.updateValueAndValidity();
      this.fbcAdditionalProcedure1.updateValueAndValidity();
      this.fbcAdditionalProcedure2.updateValueAndValidity();
      this.fbcAdditionalProcedure3.updateValueAndValidity();
      this.fbcAdditionalProcedure4.updateValueAndValidity();
      this.fbcAdditionalProcedure5.updateValueAndValidity();

      if (
        this.fbcIsMiscInfo.value ||
        this.fbcIsInsuranceInfo.value ||
        this.fbcIsSubscriberInfo.value ||
        this.fbcIsMedicarePatient.value ||
        // this.fbcIsAdditionalInsurance.value ||
        this.fbcIsNoDiagnosis.value ||
        this.fbcIsDoctorInfo.value
      ) {
        isValid = true;
      }

      if (this.fbcIsMiscInfo.value) {
        if (
          this.fbcMisscInfo.value == null ||
          this.fbcMisscInfo.value.trim() == ""
        ) {
          isValid = false;
          this.errMiscInfo = true; //to show error for misc info
        } else {
          this.errMiscInfo = false;
        }
      } else {
        if (this.fbcMisscInfo.value && this.fbcMisscInfo.value.trim()) {
          this.fbcIsMiscInfo.setValue(true);
          this.fbcIsMiscInfo.updateValueAndValidity();
          isValid = true;
        }
        this.errMiscInfo = false;
      }

      if (this.fbcIsMedicarePatient.value) {
        if (
          (this.fbcMedicareProcedure1.value == null ||
            this.fbcMedicareProcedure1.value.trim() == "") &&
          (this.fbcMedicareProcedure2.value == null ||
            this.fbcMedicareProcedure2.value.trim() == "") &&
          (this.fbcMedicareProcedure3.value == null ||
            this.fbcMedicareProcedure3.value.trim() == "") &&
          (this.fbcMedicareProcedure4.value == null ||
            this.fbcMedicareProcedure4.value.trim() == "") &&
          (this.fbcMedicareProcedure5.value == null ||
            this.fbcMedicareProcedure5.value.trim() == "") &&
          (this.fbcAdditionalProcedure1.value == null ||
            this.fbcAdditionalProcedure1.value.trim() == "") &&
          (this.fbcAdditionalProcedure2.value == null ||
            this.fbcAdditionalProcedure2.value.trim() == "") &&
          (this.fbcAdditionalProcedure3.value == null ||
            this.fbcAdditionalProcedure3.value.trim() == "") &&
          (this.fbcAdditionalProcedure4.value == null ||
            this.fbcAdditionalProcedure4.value.trim() == "") &&
          (this.fbcAdditionalProcedure5.value == null ||
            this.fbcAdditionalProcedure5.value.trim() == "")
        ) {
          isValid = false;
          this.errMedicarePatient = true; //to show error for Medicare Patient
        } else {
          this.errMedicarePatient = false;
        }
      } else {
        if (
          (this.fbcMedicareProcedure1.value &&
            this.fbcMedicareProcedure1.value.trim()) ||
          (this.fbcMedicareProcedure2.value &&
            this.fbcMedicareProcedure2.value.trim()) ||
          (this.fbcMedicareProcedure3.value &&
            this.fbcMedicareProcedure3.value.trim()) ||
          (this.fbcMedicareProcedure4.value &&
            this.fbcMedicareProcedure4.value.trim()) ||
          (this.fbcMedicareProcedure5.value &&
            this.fbcMedicareProcedure5.value.trim()) ||
          (this.fbcAdditionalProcedure1.value &&
            this.fbcAdditionalProcedure1.value.trim()) ||
          (this.fbcAdditionalProcedure2.value &&
            this.fbcAdditionalProcedure2.value.trim()) ||
          (this.fbcAdditionalProcedure3.value &&
            this.fbcAdditionalProcedure3.value.trim()) ||
          (this.fbcAdditionalProcedure4.value &&
            this.fbcAdditionalProcedure4.value.trim()) ||
          (this.fbcAdditionalProcedure5.value &&
            this.fbcAdditionalProcedure5.value.trim())
        ) {
          this.fbcIsMedicarePatient.setValue(true);
          this.fbcIsMedicarePatient.updateValueAndValidity();
          isValid = true;
        }
        this.errMedicarePatient = false;
      }

      // if (this.fbcIsAdditionalInsurance.value) {
      //   if (
      //     (this.fbcAdditionalProcedure1.value == null ||
      //       this.fbcAdditionalProcedure1.value.trim() == "") &&
      //     (this.fbcAdditionalProcedure2.value == null ||
      //       this.fbcAdditionalProcedure2.value.trim() == "") &&
      //     (this.fbcAdditionalProcedure3.value == null ||
      //       this.fbcAdditionalProcedure3.value.trim() == "") &&
      //     (this.fbcAdditionalProcedure4.value == null ||
      //       this.fbcAdditionalProcedure4.value.trim() == "") &&
      //     (this.fbcAdditionalProcedure5.value == null ||
      //       this.fbcAdditionalProcedure5.value.trim() == "")
      //   ) {
      //     isValid = false;
      //     this.errAdditionalInsurance = true; //to show error for Additional Insurance
      //   } else {
      //     this.errAdditionalInsurance = false;
      //   }
      // } else {
      //   if (
      //     (this.fbcAdditionalProcedure1.value &&
      //       this.fbcAdditionalProcedure1.value.trim()) ||
      //     (this.fbcAdditionalProcedure2.value &&
      //       this.fbcAdditionalProcedure2.value.trim()) ||
      //     (this.fbcAdditionalProcedure3.value &&
      //       this.fbcAdditionalProcedure3.value.trim()) ||
      //     (this.fbcAdditionalProcedure4.value &&
      //       this.fbcAdditionalProcedure4.value.trim()) ||
      //     (this.fbcAdditionalProcedure5.value &&
      //       this.fbcAdditionalProcedure5.value.trim())
      //   ) {
      //     this.fbcIsAdditionalInsurance.setValue(true);
      //     this.fbcIsAdditionalInsurance.updateValueAndValidity();
      //     isValid = true;
      //   }
      //   this.errAdditionalInsurance = false;
      // }

      //  else {
      //   this.errMiscInfo = false;
      //   this.errMedicarePatient = false;
      //   this.errAdditionalInsurance = false;
      // }
      if (this.isSubmittingAnswer) {
        isValid = this.submitAnswerValid();
      }
      if (!this.cdr["destroyed"]) {
        this.cdr.detectChanges();
      }
      if (isCategoryValid && isValid && isInsuranceTypeValid) {
        return true;
      } else {
        return false;
      }
      // return isValid;
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  submitAnswerValid(): boolean {
    try {
      let isValid: boolean = true;
      if (
        this.fbcIsMiscInfo.value &&
        (this.fbcMiscInfoAnswer.value == null ||
          this.fbcMiscInfoAnswer.value.trim() == "")
      ) {
        isValid = false;
        this.errAnsSubMiscInfo = true; //to show error for misc info
      } else {
        this.errAnsSubMiscInfo = false;
      }
      if (this.fbcIsInsuranceInfo.value) {
        if (
          this.fbcInsurancePlanName.value == null ||
          this.fbcInsurancePlanName.value.trim() == "" ||
          this.fbcSubscriberID.value == null ||
          this.fbcSubscriberID.value.trim() == ""
        ) {
          isValid = false;
          this.errAnsSubInsurancePlanInfo = true; //to show error for misc info
        } else {
          this.errAnsSubInsurancePlanInfo = false;
        }
      }
      if (this.fbcIsSubscriberInfo.value) {
        if (
          this.fbcSubscriberName.value == null ||
          this.fbcSubscriberName.value.trim() == "" ||
          this.fbcSubscriberDOB.value == null ||
          this.fbcSubscriberDOB.value.trim() == "" ||
          this.fbcSubscriberRelationToPatient.value == null ||
          this.fbcSubscriberRelationToPatient.value.trim() == ""
        ) {
          isValid = false;
          this.errAnsSubSubscriberInfo = true; //to show error for misc info
        } else {
          this.errAnsSubSubscriberInfo = false;
        }
      }
      if (this.fbcIsNoDiagnosis.value) {
        if (
          this.fbcNoDXGivenAnswer.value == null ||
          this.fbcNoDXGivenAnswer.value.trim() == ""
        ) {
          isValid = false;
          this.errAnsSubNoDXGivenInfo = true; //to show error for misc info
        } else {
          this.errAnsSubNoDXGivenInfo = false;
        }
      }
      if (this.fbcIsMedicarePatient.value) {
        if (
          (this.fbcMedicareProcedure1.value &&
            this.fbcMedicareProcedure1.value.trim() &&
            (this.fbcMedicareDiagnosis1.value == null ||
              this.fbcMedicareDiagnosis1.value.trim() == "")) ||
          (this.fbcMedicareProcedure2.value &&
            this.fbcMedicareProcedure2.value.trim() &&
            (this.fbcMedicareDiagnosis2.value == null ||
              this.fbcMedicareDiagnosis2.value.trim() == "")) ||
          (this.fbcMedicareProcedure3.value &&
            this.fbcMedicareProcedure3.value.trim() &&
            (this.fbcMedicareDiagnosis3.value == null ||
              this.fbcMedicareDiagnosis3.value.trim() == "")) ||
          (this.fbcMedicareProcedure4.value &&
            this.fbcMedicareProcedure4.value.trim() &&
            (this.fbcMedicareDiagnosis4.value == null ||
              this.fbcMedicareDiagnosis4.value.trim() == "")) ||
          (this.fbcMedicareProcedure5.value &&
            this.fbcMedicareProcedure5.value.trim() &&
            (this.fbcMedicareDiagnosis5.value == null ||
              this.fbcMedicareDiagnosis5.value.trim() == "")) ||
          (this.fbcAdditionalProcedure1.value &&
            this.fbcAdditionalProcedure1.value.trim() &&
            (this.fbcAdditionalDiagnosis1.value == null ||
              this.fbcAdditionalDiagnosis1.value.trim() == "")) ||
          (this.fbcAdditionalProcedure2.value &&
            this.fbcAdditionalProcedure2.value.trim() &&
            (this.fbcAdditionalDiagnosis2.value == null ||
              this.fbcAdditionalDiagnosis2.value.trim() == "")) ||
          (this.fbcAdditionalProcedure3.value &&
            this.fbcAdditionalProcedure3.value.trim() &&
            (this.fbcAdditionalDiagnosis3.value == null ||
              this.fbcAdditionalDiagnosis3.value.trim() == "")) ||
          (this.fbcAdditionalProcedure4.value &&
            this.fbcAdditionalProcedure4.value.trim() &&
            (this.fbcAdditionalDiagnosis4.value == null ||
              this.fbcAdditionalDiagnosis4.value.trim() == "")) ||
          (this.fbcAdditionalProcedure5.value &&
            this.fbcAdditionalProcedure5.value.trim() &&
            (this.fbcAdditionalDiagnosis5.value == null ||
              this.fbcAdditionalDiagnosis5.value.trim() == ""))
        ) {
          isValid = false;
          this.errAnsSubMedicarePatient = true;
        } else {
          this.errAnsSubMedicarePatient = false;
        }
        // if (
        //   (this.fbcMedicareProcedure1.value &&
        //   this.fbcMedicareProcedure1.value.trim() && (this.fbcMedicareDiagnosis1.value == null ||
        //     this.fbcMedicareDiagnosis1.value.trim() == "")) ||
        // ) {
        //   if (
        //     this.fbcMedicareDiagnosis1.value == null ||
        //     this.fbcMedicareDiagnosis1.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcMedicareProcedure2.value &&
        //   this.fbcMedicareProcedure2.value.trim()
        // ) {
        //   if (
        //     this.fbcMedicareDiagnosis2.value == null ||
        //     this.fbcMedicareDiagnosis2.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcMedicareProcedure3.value &&
        //   this.fbcMedicareProcedure3.value.trim()
        // ) {
        //   if (
        //     this.fbcMedicareDiagnosis3.value == null ||
        //     this.fbcMedicareDiagnosis3.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcMedicareProcedure4.value &&
        //   this.fbcMedicareProcedure4.value.trim()
        // ) {
        //   if (
        //     this.fbcMedicareDiagnosis4.value == null ||
        //     this.fbcMedicareDiagnosis4.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcMedicareProcedure5.value &&
        //   this.fbcMedicareProcedure5.value.trim()
        // ) {
        //   if (
        //     this.fbcMedicareDiagnosis5.value == null ||
        //     this.fbcMedicareDiagnosis5.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcAdditionalProcedure1.value &&
        //   this.fbcAdditionalProcedure1.value.trim()
        // ) {
        //   if (
        //     this.fbcAdditionalDiagnosis1.value == null ||
        //     this.fbcAdditionalDiagnosis1.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcAdditionalProcedure2.value &&
        //   this.fbcAdditionalProcedure2.value.trim()
        // ) {
        //   if (
        //     this.fbcAdditionalDiagnosis2.value == null ||
        //     this.fbcAdditionalDiagnosis2.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcAdditionalProcedure3.value &&
        //   this.fbcAdditionalProcedure3.value.trim()
        // ) {
        //   if (
        //     this.fbcAdditionalDiagnosis3.value == null ||
        //     this.fbcAdditionalDiagnosis3.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcAdditionalProcedure4.value &&
        //   this.fbcAdditionalProcedure4.value.trim()
        // ) {
        //   if (
        //     this.fbcAdditionalDiagnosis4.value == null ||
        //     this.fbcAdditionalDiagnosis4.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (
        //   this.fbcAdditionalProcedure5.value &&
        //   this.fbcAdditionalProcedure5.value.trim()
        // ) {
        //   if (
        //     this.fbcAdditionalDiagnosis5.value == null ||
        //     this.fbcAdditionalDiagnosis5.value.trim() == ""
        //   ) {
        //     this.errAnsSubMedicarePatient = true;
        //   }
        // }
        // if (this.errAnsSubMedicarePatient) {
        //   isValid = false;
        // }
        // if (
        //   (this.fbcMedicareProcedure1.value &&  this.fbcMedicareProcedure1.value.trim() &&this.fbcMedicareDiagnosis1.value == null ||
        //     this.fbcMedicareDiagnosis1.value.trim() == "") &&
        //   (this.fbcMedicareDiagnosis2.value == null ||
        //     this.fbcMedicareDiagnosis2.value.trim() == "") &&
        //   (this.fbcMedicareDiagnosis3.value == null ||
        //     this.fbcMedicareDiagnosis3.value.trim() == "") &&
        //   (this.fbcMedicareDiagnosis4.value == null ||
        //     this.fbcMedicareDiagnosis4.value.trim() == "") &&
        //   (this.fbcMedicareDiagnosis5.value == null ||
        //     this.fbcMedicareDiagnosis5.value.trim() == "") &&
        //   (this.fbcAdditionalProcedure1.value &&  this.fbcAdditionalProcedure1.value.trim() &&this.fbcAdditionalDiagnosis1.value == null ||
        //     this.fbcAdditionalDiagnosis1.value.trim() == "") &&
        //   (this.fbcAdditionalDiagnosis2.value == null ||
        //     this.fbcAdditionalDiagnosis2.value.trim() == "") &&
        //   (this.fbcAdditionalDiagnosis3.value == null ||
        //     this.fbcAdditionalDiagnosis3.value.trim() == "") &&
        //   (this.fbcAdditionalDiagnosis4.value == null ||
        //     this.fbcAdditionalDiagnosis4.value.trim() == "") &&
        //   (this.fbcAdditionalDiagnosis5.value == null ||
        //     this.fbcAdditionalDiagnosis5.value.trim() == "")
        // ) {
        //   isValid = false;
        //   this.errAnsSubMedicarePatient = true; //to show error for Medicare Patient
        // } else {
        //   this.errAnsSubMedicarePatient = false;
        // }
      }
      if (
        this.fbcSignature.value == null ||
        this.fbcSignature.value.trim() == ""
      ) {
        isValid = false;
        this.errAnsSignature = true;
      } else {
        this.errAnsSignature = false;
      }
      return isValid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseClick() {
    if (this.isSubmittingAnswer) {
      this.IncompleteInfoGroup.reset();
    }
  }
  onOkClick() {
    if (this.validateFields() && this.isSubmittingAnswer) {
      var saveIncompleteInfo = this.SaveIncompleteOrderActionDetails();
      if (saveIncompleteInfo) {
        this.UploadIncompleteCoverpage(saveIncompleteInfo);
      }
    } else {
      this.clsUtility.showError("Please enter information");
    }
  }
  UploadIncompleteCoverpage(incompleteinfo: any) {
    throw new Error("Method not implemented.");
  }

  onFocusOutEvent(event: any) {
    // console.log(JSON.stringify(event));
    // console.log(event.target.value);
    // if (event.target.value != "") {
    //   this.IncompleteInfoGroup.valueChanges.subscribe((formvalue) => {
    //     // console.log(JSON.stringify(formvalue));
    //     console.log(this.fbcMiscInfoAnswer.value);
    //     console.log(this.fbcInsurancePlanName.value);
    //   });
    // }
    // if (this.validateFields()) {
    // console.log(this.IncompleteInfoGroup);
    // console.log(this.SaveIncompleteOrderActionDetails());
    this.validateFields();
    this.dataService.SubmitIncompleteOrderInfo.next(
      this.SaveIncompleteOrderActionDetails()
    );
    // }
  }
  ngOnDestroy() {
    try {
      if (this.calledFrom !== "encounteraction")
        this.dataService.IncompleteOrderInfo.next([]);
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
