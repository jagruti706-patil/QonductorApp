import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./navbar/navbar.component";
import { DashboardComponent } from "./Pages/AR Management/dashboard/dashboard.component";
import {
  GridModule,
  PDFModule,
  ExcelModule,
} from "@progress/kendo-angular-grid";
import { IntlModule } from "@progress/kendo-angular-intl";
import { MyDashboardComponent } from "./Pages/AR Management/Common/my-dashboard/my-dashboard.component";
import { WorkqueueComponent } from "./Pages/AR Management/workqueue/workqueue.component";
import { AssistantComponent } from "./Pages/AR Management/assistant/assistant.component";
import { AgentsComponent } from "./Pages/AR Management/Common/agents/agents.component";
import { FilesComponent } from "./Pages/AR Management/Reports/ReportsList/files/files.component";
import { ProductionComponent } from "./Pages/AR Management/Reports/ReportsList/production/production.component";
import { AnnouncmentComponent } from "./Pages/AR Management/announcment/announcment.component";
import { ConfigurationComponent } from "./Pages/AR Management/configuration/configuration.component";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { ButtonModule } from "@progress/kendo-angular-buttons";
import { DialogsModule } from "@progress/kendo-angular-dialog";
import {
  DatePickerModule,
  TimePickerModule,
} from "@progress/kendo-angular-dateinputs";
import { WorkqueueassignmentComponent } from "./Pages/AR Management/workqueueassignment/workqueueassignment.component";
import { AgentviewComponent } from "./Pages/AR Management/Agent/agentview/agentview.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MyTaskComponent } from "./Pages/AR Management/Common/my-task/my-task.component";
import { TaskWorkPaneComponent } from "./Pages/AR Management/Common/task-work-pane/task-work-pane.component";
import { PatientBannerComponent } from "./Pages/Common/patient-banner/patient-banner.component";
import { ClaimBannerComponent } from "./Pages/Common/claim-banner/claim-banner.component";
import { StatusBannerComponent } from "./Pages/Common/status-banner/status-banner.component";
import { AssignTaskComponent } from "./Pages/AR Management/Common/assign-task/assign-task.component";
import { LoginComponent } from "./Pages/Common/login/login.component";
import { QcriberComponent } from "./Pages/AR Management/Common/qcriber/qcriber.component";
import { ClientComponent } from "./Pages/AR Management/Common/Configuration/client-configuration/client/client.component";
import { AddclientComponent } from "./Pages/AR Management/Common/Configuration/client-configuration/addclient/addclient.component";
import { DatePipe, AsyncPipe } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
// import { HttpModule } from "@angular/http";
import { FiltersComponent } from "./Pages/Common/filter/filters/filters.component";
import { NotetemplateComponent } from "./Pages/AR Management/Common/Configuration/note-template/notetemplate/notetemplate.component";
import { AddnotetemplateComponent } from "./Pages/AR Management/Common/Configuration/note-template/addnotetemplate/addnotetemplate.component";
import { EditconfirmationComponent } from "./Pages/Common/confirmation/editconfirmation/editconfirmation.component";
import { DeleteconfirmationComponent } from "./Pages/Common/confirmation/deleteconfirmation/deleteconfirmation.component";
import { StatusComponent } from "./Pages/AR Management/Common/Configuration/status/status/status.component";
import { AddstatusComponent } from "./Pages/AR Management/Common/Configuration/status/addstatus/addstatus.component";
import { SubstatusComponent } from "./Pages/AR Management/Common/Configuration/sub-status/substatus/substatus.component";
import { AddsubstatusComponent } from "./Pages/AR Management/Common/Configuration/sub-status/addsubstatus/addsubstatus.component";
import { ActionsComponent } from "./Pages/AR Management/Common/Configuration/action/actions/actions.component";
import { AddactionsComponent } from "./Pages/AR Management/Common/Configuration/action/addactions/addactions.component";
import { ClientloginsComponent } from "./Pages/AR Management/Common/Configuration/client-logins/clientlogins/clientlogins.component";
import { SmartassignmentComponent } from "./Pages/AR Management/Common/Configuration/smart-assignment/smartassignment/smartassignment.component";
import { AnnouncementComponent } from "./Pages/AR Management/Common/Configuration/announcement/announcement/announcement.component";
import { PayerComponent } from "./Pages/AR Management/Common/Configuration/payer/payer/payer.component";
import { PayercrosswalkComponent } from "./Pages/AR Management/Common/Configuration/payer-cross-walk/payercrosswalk/payercrosswalk.component";
import { AddpayerComponent } from "./Pages/AR Management/Common/Configuration/payer/addpayer/addpayer.component";
import { AddpayercrosswalkComponent } from "./Pages/AR Management/Common/Configuration/payer-cross-walk/addpayercrosswalk/addpayercrosswalk.component";
import { HomeLayoutComponent } from "./Pages/Common/layout/home-layout/home-layout.component";
import { LoginLayoutComponent } from "./Pages/Common/layout/login-layout/login-layout.component";
import { AuthGuard } from "./Pages/Guard/auth.guard";
import { AddclientloginComponent } from "./Pages/AR Management/Common/Configuration/client-logins/addclientlogin/addclientlogin.component";
import { OpsManagerComponent } from "./Pages/Common/dashboard/ops-manager/ops-manager.component";
import { ArManagerComponent } from "./Pages/Common/dashboard/ar-manager/ar-manager.component";
import { ArRepresentativeComponent } from "./Pages/Common/dashboard/ar-representative/ar-representative.component";
import { PracticeUserComponent } from "./Pages/Common/dashboard/practice-user/practice-user.component";
import { SysAdminComponent } from "./Pages/Common/dashboard/sys-admin/sys-admin.component";
import { ArSummaryCardsComponent } from "./Pages/Common/Cards/ar-summary-cards/ar-summary-cards.component";
import { ProductionconfigurationComponent } from "./Pages/AR Management/Common/Configuration/production/productionconfiguration/productionconfiguration.component";
import { NavbarlinksComponent } from "./Pages/AR Management/Common/navbarlinks/navbarlinks.component";
import { MyCompletedTaskComponent } from "./Pages/AR Management/Common/my-completed-task/my-completed-task.component";
import { MenuModule, ContextMenuModule } from "@progress/kendo-angular-menu";
import { ViewdetailsComponent } from "./Pages/Common/viewdetails/viewdetails.component";
import { QualityReviewComponent } from "./Pages/AR Management/Quality/quality-review/quality-review.component";
import { jwtInterceptor } from "./Pages/Services/Common/jwtinterceptor";
import { ConfigurationannouncmentComponent } from "./Pages/AR Management/Common/Configuration/announcement/configurationannouncment/configurationannouncment.component";
import { QualityviewdetailsComponent } from "./Pages/AR Management/Quality/qualityviewdetails/qualityviewdetails.component";
import { ToastrModule } from "ngx-toastr";
import { ServicecontrollerComponent } from "./Pages/Common/servicecontroller/servicecontroller.component";
import { ErrortypeComponent } from "./Pages/AR Management/Common/Configuration/error/errortype/errortype.component";
import { AdderrortypeComponent } from "./Pages/AR Management/Common/Configuration/error/adderrortype/adderrortype.component";
import { ClientusermappingComponent } from "./Pages/AR Management/Common/Configuration/client-user-mapping/clientusermapping/clientusermapping.component";
import { AddclientusermappingComponent } from "./Pages/AR Management/Common/Configuration/client-user-mapping/addclientusermapping/addclientusermapping.component";
import { QualityReviewCompletedComponent } from "./Pages/AR Management/Quality/quality-review-completed/quality-review-completed.component";
import { MyCanceledTaskComponent } from "./Pages/AR Management/Common/my-canceled-task/my-canceled-task.component";
import { QsuiteusermappingComponent } from "./Pages/AR Management/Common/Configuration/qsuite-user-mapping/qsuiteusermapping/qsuiteusermapping.component";
import { AddqsuiteusermappingComponent } from "./Pages/AR Management/Common/Configuration/qsuite-user-mapping/addqsuiteusermapping/addqsuiteusermapping.component";
import { FtpdetailsComponent } from "./Pages/AR Management/Common/Configuration/ftp-details/ftpdetails/ftpdetails.component";
import { AddftpdetailsComponent } from "./Pages/AR Management/Common/Configuration/ftp-details/addftpdetails/addftpdetails.component";
import { ArAuditorComponent } from "./Pages/Common/dashboard/ar-auditor/ar-auditor.component";
import { PerManagerComponent } from "./Pages/Common/dashboard/per-manager/per-manager.component";
import { ChangePasswordComponent } from "./Pages/Common/change-password/change-password.component";
import { FollowupactionComponent } from "./Pages/AR Management/Common/Configuration/followup-action/followupaction/followupaction.component";
import { AddfollowupactionComponent } from "./Pages/AR Management/Common/Configuration/followup-action/addfollowupaction/addfollowupaction.component";
import { ProductionDailyCloseComponent } from "./Pages/AR Management/production-daily-close/production-daily-close.component";
import { ViewTaskDetailsComponent } from "./Pages/AR Management/view-task-details/view-task-details/view-task-details.component";
import { ViewTaskDetailListComponent } from "./Pages/AR Management/view-task-details/view-task-detail-list/view-task-detail-list.component";
import { AddmailconfigurationComponent } from "./Pages/AR Management/Common/Configuration/mail-configuration/addmailconfiguration/addmailconfiguration.component";
import { MailconfigurationComponent } from "./Pages/AR Management/Common/Configuration/mail-configuration/mailconfiguration/mailconfiguration.component";
import { SetsessionidComponent } from "./Pages/Common/setsessionid/setsessionid.component";
import { CookieService } from "ngx-cookie-service";
import { LoginRequestComponent } from "./Pages/Common/login-request/login-request.component";
import { AutomationComponent } from "./Pages/AR Management/Common/Configuration/Automation/automation/automation.component";
import { AddAutomationComponent } from "./Pages/AR Management/Common/Configuration/Automation/add-automation/add-automation.component";
import { ArCardsComponent } from "./Pages/Common/Cards/ar-cards/ar-cards.component";
import { ReportComponent } from "./Pages/AR Management/Reports/MainReport/report/report.component";
import { AutomationReportComponent } from "./Pages/AR Management/Reports/ReportsList/automation-report/automation-report.component";
import { NoteModalComponent } from "./Pages/Common/note-modal/note-modal.component";
import { DeferRulesComponent } from "./Pages/AR Management/Common/Configuration/DeferRule/defer-rules/defer-rules.component";
import { AddDeferRuleComponent } from "./Pages/AR Management/Common/Configuration/DeferRule/add-defer-rule/add-defer-rule.component";
import { DeferWorkqueueComponent } from "./Pages/AR Management/AR Inventory/defer-workqueue/defer-workqueue.component";
import { OrderWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-workqueue/order-workqueue.component";
import { OrderDetailsComponent } from "./Pages/BT Charge Posting/btworkqueue/order-details/order-details.component";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { OrderAssignmentComponent } from "./Pages/BT Charge Posting/btworkqueue/order-assignment/order-assignment.component";
import { MyOrderQueueComponent } from "./Pages/BT Charge Posting/btworkqueue/my-order-queue/my-order-queue.component";
import { MissingChargesComponent } from "./Pages/BT Charge Posting/btworkqueue/missing-charges/missing-charges.component";
import { OrderCompletedWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-completed-workqueue/order-completed-workqueue.component";
import { OrderAssistanceWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-assistance-workqueue/order-assistance-workqueue.component";
import { OrderActionComponent } from "./Pages/BT Charge Posting/Order Action/order-action/order-action.component";
import { OrderPatientBannerComponent } from "./Pages/BT Charge Posting/Cards/order-patient-banner/order-patient-banner.component";
import { OrderDocumentsComponent } from "./Pages/BT Charge Posting/Order Action/order-documents/order-documents.component";
import { DocsvaultComponent } from "./Pages/AR Management/Common/Configuration/docsvault/docsvault.component";
import { OrderReviewComponent } from "./Pages/BT Charge Posting/btworkqueue/order-review/order-review.component";
import { OrderSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/order-search/order-search.component";
import { OrderHistoryComponent } from "./Pages/BT Charge Posting/order-history/order-history.component";
import { MyReviewComponent } from "./Pages/BT Charge Posting/btworkqueue/my-review/my-review.component";
import { DocsfromdocvaultComponent } from "./Pages/BT Charge Posting/docsfromdocvault/docsfromdocvault.component";
import { Api } from "./Pages/Services/BT/api";
import { DocumentSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/document-search/document-search.component";
import { OrderTriarqAssistanceComponent } from "./Pages/BT Charge Posting/btworkqueue/order-triarq-assistance/order-triarq-assistance.component";
import { ActionPaneComponent } from "./Pages/BT Charge Posting/Order Action/action-pane/action-pane.component";
import { NoDblClickDirective } from "./Pages/Common/Directives/no-dbl-click.directive";
import { DocsvaultUploadComponent } from "./Pages/BT Charge Posting/btworkqueue/docsvault-upload/docsvault-upload.component";
import { IncompleteOrderActionComponent } from "./Pages/BT Charge Posting/Order Action/incomplete-order-action/incomplete-order-action.component";
import { FolderProcessComponent } from "./Pages/BT Charge Posting/btworkqueue/folder-process/folder-process.component";
import { NgCircleProgressModule } from "ng-circle-progress";
import { DragulaModule } from "ng2-dragula";
import { OrderstatusComponent } from "./Pages/BT Charge Posting/orderstatus/orderstatus.component";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { OrderSubStatusComponent } from "./Pages/AR Management/Common/Configuration/order-sub-status/order-sub-status/order-sub-status.component";
import { OrderNoteComponent } from "./Pages/AR Management/Common/Configuration/order-note/order-note/order-note.component";
import { AddOrderNoteComponent } from "./Pages/AR Management/Common/Configuration/order-note/add-order-note/add-order-note.component";
import { AddOrderSubStatusComponent } from "./Pages/AR Management/Common/Configuration/order-sub-status/add-order-sub-status/add-order-sub-status.component";
import { ActionConfirmationComponent } from "./Pages/Common/confirmation/action-confirmation/action-confirmation.component";
import { ChartsModule } from "@progress/kendo-angular-charts";
// import "hammerjs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { LabelModule } from "@progress/kendo-angular-label";
import { StatusReportComponent } from "./Pages/Common/status-report/status-report.component";
import { OrderExportComponent } from "./Pages/BT Charge Posting/btworkqueue/order-export/order-export.component";
import { EligibilityInformationComponent } from "./Pages/BT Charge Posting/Cards/order-patient-banner/eligibility-information/eligibility-information.component";
import { PrintFilterComponent } from "./Pages/Common/filter/print-filter/print-filter.component";
import { ReadyForPrintingComponent } from "./Pages/BT Charge Posting/btworkqueue/ready-for-printing/ready-for-printing.component";
import { SubmittedAndPrintedComponent } from "./Pages/BT Charge Posting/btworkqueue/submitted-and-printed/submitted-and-printed.component";
import { InterfaceDetailsComponent } from "./Pages/AR Management/Common/Configuration/Interface-configuration/interface-details/interface-details.component";
import { AddEditInterfaceComponent } from "./Pages/AR Management/Common/Configuration/Interface-configuration/add-edit-interface/add-edit-interface.component";
import { PendingAdditionalInfoComponent } from "./Pages/BT Charge Posting/btworkqueue/pending-additional-info/pending-additional-info.component";
import { AddCommentComponent } from "./Pages/Common/add-comment/add-comment.component";
import { RcmDocsViewComponent } from "./Pages/RCM Docs/rcm-docs-view/rcm-docs-view.component";
import { RcmEncounterDocumentsComponent } from "./Pages/RCM Docs/rcm-encounter-documents/rcm-encounter-documents.component";
import { GroupClientMappingComponent } from "./Pages/AR Management/Common/Configuration/groupclientmapping/group-client-mapping/group-client-mapping.component";
import { AddEditGroupClientMappingComponent } from "./Pages/AR Management/Common/Configuration/groupclientmapping/add-edit-group-client-mapping/add-edit-group-client-mapping.component";
import { DocumentHistoryComponent } from "./Pages/RCM Docs/document-history/document-history.component";
import { RCMDocsDashboardComponent } from "./Pages/Common/dashboard/rcmdocs-dashboard/rcmdocs-dashboard.component";
import { RcmDocumentsImportComponent } from "./Pages/RCM Docs/rcmdocsimport/rcm-documents-import/rcm-documents-import.component";
import { ImportDocumentsComponent } from "./Pages/RCM Docs/rcmdocsimport/import-documents/import-documents.component";
import { DragDropDirective } from "./Pages/Common/Directives/drag-drop.directive";
import { MoveRcmDocumentsComponent } from "./Pages/RCM Docs/move-rcm-documents/move-rcm-documents.component";
import { HL7FinancialInfoComponent } from "./Pages/BT Charge Posting/btworkqueue/order-details/hl7-financial-info/hl7-financial-info.component";
import { DeleteRCMDocsComponent } from "./Pages/RCM Docs/delete-rcmdocs/delete-rcmdocs.component";
import { BiotechReportComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/biotech-report/biotech-report.component";
import { MissingDocumentComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/missing-document/missing-document.component";
import { MissingHL7Component } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/missing-hl7/missing-hl7.component";
import { GenerateReportComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/generate-report/generate-report.component";
import { AddReasonComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/add-reason/add-reason.component";
import { CustomConfirmationComponent } from "./Pages/Common/confirmation/custom-confirmation/custom-confirmation.component";
import { DocumentsCountComponent } from "./Pages/BT Charge Posting/btworkqueue/documents-count/documents-count.component";
import { AdvanceSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/advance-search/advance-search.component";
import { PracticeAssignedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-assigned/practice-assigned.component";
import { PracticeCompletedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-completed/practice-completed.component";
import { PracticeUserQueueComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-user-queue/practice-user-queue.component";
import { YesNoCancelConfirmationComponent } from "./Pages/Common/confirmation/yes-no-cancel-confirmation/yes-no-cancel-confirmation.component";
import { PracticeDashboardComponent } from "./Pages/Common/dashboard/practice-dashboard/practice-dashboard.component";
import { MainReportComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/main-report/main-report.component";
import { ClientProviderMappingComponent } from "./Pages/AR Management/Common/Configuration/clientprovidermapping/client-provider-mapping/client-provider-mapping.component";
import { AddEditClientProviderMappingComponent } from "./Pages/AR Management/Common/Configuration/clientprovidermapping/add-edit-client-provider-mapping/add-edit-client-provider-mapping.component";
import { IncompleteEncounterSummaryComponent } from "./Pages/BT Charge Posting/btworkqueue/incomplete-encounter-summary/incomplete-encounter-summary.component";
import { BreadcrumbComponent } from "./Pages/Common/breadcrumb/breadcrumb.component";
import { ArchivedEncountersComponent } from "./Pages/BT Charge Posting/btworkqueue/archived-encounters/archived-encounters.component";
import { PracticeAssistanceCompletedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-assistance-completed/practice-assistance-completed.component";
import { ExecutiveDashboardComponent } from "./Pages/Common/dashboard/executive-dashboard/executive-dashboard.component";
// import { RcmDocsComponent } from './Pages/BT Charge Posting/btworkqueue/rcm-docs/rcm-docs.component';

// import {  } from '../../node_modules/string-builder/';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    MyDashboardComponent,
    WorkqueueComponent,
    AssistantComponent,
    AgentsComponent,
    FilesComponent,
    ProductionComponent,
    AnnouncmentComponent,
    ConfigurationComponent,
    WorkqueueassignmentComponent,
    AgentviewComponent,
    MyTaskComponent,
    TaskWorkPaneComponent,
    PatientBannerComponent,
    ClaimBannerComponent,
    StatusBannerComponent,
    AssignTaskComponent,
    LoginComponent,
    QcriberComponent,
    ClientComponent,
    AddclientComponent,
    FiltersComponent,
    NotetemplateComponent,
    AddnotetemplateComponent,
    EditconfirmationComponent,
    DeleteconfirmationComponent,
    StatusComponent,
    AddstatusComponent,
    SubstatusComponent,
    AddsubstatusComponent,
    ActionsComponent,
    AddactionsComponent,
    ClientloginsComponent,
    SmartassignmentComponent,
    AnnouncementComponent,
    PayerComponent,
    PayercrosswalkComponent,
    AddpayerComponent,
    AddpayercrosswalkComponent,
    HomeLayoutComponent,
    LoginLayoutComponent,
    AddclientloginComponent,
    OpsManagerComponent,
    ArManagerComponent,
    ArRepresentativeComponent,
    PracticeUserComponent,
    SysAdminComponent,
    ArSummaryCardsComponent,
    ProductionconfigurationComponent,
    NavbarlinksComponent,
    MyCompletedTaskComponent,
    ViewdetailsComponent,
    QualityReviewComponent,
    ConfigurationannouncmentComponent,
    QualityviewdetailsComponent,
    ServicecontrollerComponent,
    ErrortypeComponent,
    AdderrortypeComponent,
    ClientusermappingComponent,
    AddclientusermappingComponent,
    QualityReviewCompletedComponent,
    MyCanceledTaskComponent,
    QsuiteusermappingComponent,
    AddqsuiteusermappingComponent,
    FtpdetailsComponent,
    AddftpdetailsComponent,
    ArAuditorComponent,
    PerManagerComponent,
    ChangePasswordComponent,
    FollowupactionComponent,
    AddfollowupactionComponent,
    ProductionDailyCloseComponent,
    ViewTaskDetailsComponent,
    ViewTaskDetailListComponent,
    AddmailconfigurationComponent,
    MailconfigurationComponent,
    SetsessionidComponent,
    LoginRequestComponent,
    AutomationComponent,
    AddAutomationComponent,
    ArCardsComponent,
    ReportComponent,
    AutomationReportComponent,
    NoteModalComponent,
    DeferRulesComponent,
    AddDeferRuleComponent,
    DeferWorkqueueComponent,
    OrderWorkqueueComponent,
    OrderDetailsComponent,
    OrderAssignmentComponent,
    MyOrderQueueComponent,
    MissingChargesComponent,
    OrderCompletedWorkqueueComponent,
    OrderAssistanceWorkqueueComponent,
    OrderActionComponent,
    MissingChargesComponent,
    OrderPatientBannerComponent,
    OrderDocumentsComponent,
    DocsvaultComponent,
    OrderReviewComponent,
    OrderSearchComponent,
    OrderHistoryComponent,
    MyReviewComponent,
    DocsfromdocvaultComponent,
    DocumentSearchComponent,
    OrderTriarqAssistanceComponent,
    ActionPaneComponent,
    NoDblClickDirective,
    DocsvaultUploadComponent,
    IncompleteOrderActionComponent,
    FolderProcessComponent,
    OrderstatusComponent,
    OrderSubStatusComponent,
    OrderNoteComponent,
    AddOrderNoteComponent,
    AddOrderSubStatusComponent,
    ActionConfirmationComponent,
    StatusReportComponent,
    OrderExportComponent,
    EligibilityInformationComponent,
    PrintFilterComponent,
    ReadyForPrintingComponent,
    SubmittedAndPrintedComponent,
    InterfaceDetailsComponent,
    AddEditInterfaceComponent,
    PendingAdditionalInfoComponent,
    AddCommentComponent,
    RcmDocsViewComponent,
    RcmEncounterDocumentsComponent,
    GroupClientMappingComponent,
    AddEditGroupClientMappingComponent,
    DocumentHistoryComponent,
    RCMDocsDashboardComponent,
    RcmDocumentsImportComponent,
    ImportDocumentsComponent,
    DragDropDirective,
    MoveRcmDocumentsComponent,
    HL7FinancialInfoComponent,
    DeleteRCMDocsComponent,
    BiotechReportComponent,
    MissingDocumentComponent,
    MissingHL7Component,
    GenerateReportComponent,
    AddReasonComponent,
    CustomConfirmationComponent,
    DocumentsCountComponent,
    AdvanceSearchComponent,
    PracticeAssignedComponent,
    PracticeCompletedComponent,
    PracticeUserQueueComponent,
    YesNoCancelConfirmationComponent,
    PracticeDashboardComponent,
    MainReportComponent,
    ClientProviderMappingComponent,
    AddEditClientProviderMappingComponent,
    IncompleteEncounterSummaryComponent,
    BreadcrumbComponent,
    ArchivedEncountersComponent,
    PracticeAssistanceCompletedComponent,
    ExecutiveDashboardComponent,
    // RcmDocsComponent
  ],
  imports: [
    // RouterModule.forRoot(
    //   [
    //     {
    //       path: '',
    //       component : DashboardComponent
    //     },
    //     {
    //       path : "dashboard",
    //       component : DashboardComponent
    //     }
    // ]
    // ),
    // HttpModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    InputsModule,
    BrowserAnimationsModule,
    GridModule,
    IntlModule,
    DropDownsModule,
    ButtonModule,
    DialogsModule,
    DatePickerModule,
    TimePickerModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    ContextMenuModule,
    ToastrModule.forRoot({
      closeButton: false,
      newestOnTop: true,
      progressBar: false,
      positionClass: "toast-top-center",
      preventDuplicates: true,
      timeOut: 4000,
      extendedTimeOut: 1000,
    }),
    PDFModule,
    ExcelModule,
    PdfJsViewerModule,
    NgCircleProgressModule.forRoot({}),
    LayoutModule,
    DragulaModule.forRoot(),
    ChartsModule,
    DateInputsModule,
    LabelModule,
  ],
  providers: [
    DatePipe,
    AuthGuard,
    Api,
    AsyncPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: jwtInterceptor,
      multi: true,
    },
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
