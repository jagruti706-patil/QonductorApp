import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./Pages/AR Management/dashboard/dashboard.component";
import { MyDashboardComponent } from "./Pages/AR Management/Common/my-dashboard/my-dashboard.component";
import { WorkqueueComponent } from "./Pages/AR Management/workqueue/workqueue.component";
import { AssistantComponent } from "./Pages/AR Management/assistant/assistant.component";
import { AgentsComponent } from "./Pages/AR Management/Common/agents/agents.component";
import { FilesComponent } from "./Pages/AR Management/Reports/ReportsList/files/files.component";
import { ProductionComponent } from "./Pages/AR Management/Reports/ReportsList/production/production.component";
import { AnnouncmentComponent } from "./Pages/AR Management/announcment/announcment.component";
import { ConfigurationComponent } from "./Pages/AR Management/configuration/configuration.component";
import { MyTaskComponent } from "./Pages/AR Management/Common/my-task/my-task.component";
import { TaskWorkPaneComponent } from "./Pages/AR Management/Common/task-work-pane/task-work-pane.component";
import { LoginComponent } from "./Pages/Common/login/login.component";
import { AddclientComponent } from "./Pages/AR Management/Common/Configuration/client-configuration/addclient/addclient.component";
import { ClientComponent } from "./Pages/AR Management/Common/Configuration/client-configuration/client/client.component";
import { NotetemplateComponent } from "./Pages/AR Management/Common/Configuration/note-template/notetemplate/notetemplate.component";
import { StatusComponent } from "./Pages/AR Management/Common/Configuration/status/status/status.component";
import { SubstatusComponent } from "./Pages/AR Management/Common/Configuration/sub-status/substatus/substatus.component";
import { ActionsComponent } from "./Pages/AR Management/Common/Configuration/action/actions/actions.component";
import { ClientloginsComponent } from "./Pages/AR Management/Common/Configuration/client-logins/clientlogins/clientlogins.component";
import { SmartassignmentComponent } from "./Pages/AR Management/Common/Configuration/smart-assignment/smartassignment/smartassignment.component";
import { PayerComponent } from "./Pages/AR Management/Common/Configuration/payer/payer/payer.component";
import { PayercrosswalkComponent } from "./Pages/AR Management/Common/Configuration/payer-cross-walk/payercrosswalk/payercrosswalk.component";
import { ProductionconfigurationComponent } from "./Pages/AR Management/Common/Configuration/production/productionconfiguration/productionconfiguration.component";
import { LoginLayoutComponent } from "./Pages/Common/layout/login-layout/login-layout.component";
import { HomeLayoutComponent } from "./Pages/Common/layout/home-layout/home-layout.component";
import { AuthGuard } from "./Pages/Guard/auth.guard";
import { OpsManagerComponent } from "./Pages/Common/dashboard/ops-manager/ops-manager.component";
import { ArManagerComponent } from "./Pages/Common/dashboard/ar-manager/ar-manager.component";
import { ArRepresentativeComponent } from "./Pages/Common/dashboard/ar-representative/ar-representative.component";
import { PracticeUserComponent } from "./Pages/Common/dashboard/practice-user/practice-user.component";
import { SysAdminComponent } from "./Pages/Common/dashboard/sys-admin/sys-admin.component";
import { MyCompletedTaskComponent } from "./Pages/AR Management/Common/my-completed-task/my-completed-task.component";
import { QualityReviewComponent } from "./Pages/AR Management/Quality/quality-review/quality-review.component";
import { ConfigurationannouncmentComponent } from "./Pages/AR Management/Common/Configuration/announcement/configurationannouncment/configurationannouncment.component";
import { ServicecontrollerComponent } from "./Pages/Common/servicecontroller/servicecontroller.component";
import { ErrortypeComponent } from "./Pages/AR Management/Common/Configuration/error/errortype/errortype.component";
import { ClientusermappingComponent } from "./Pages/AR Management/Common/Configuration/client-user-mapping/clientusermapping/clientusermapping.component";
import { QualityReviewCompletedComponent } from "./Pages/AR Management/Quality/quality-review-completed/quality-review-completed.component";
import { MyCanceledTaskComponent } from "./Pages/AR Management/Common/my-canceled-task/my-canceled-task.component";
import { QsuiteusermappingComponent } from "./Pages/AR Management/Common/Configuration/qsuite-user-mapping/qsuiteusermapping/qsuiteusermapping.component";
import { FtpdetailsComponent } from "./Pages/AR Management/Common/Configuration/ftp-details/ftpdetails/ftpdetails.component";
import { ArAuditorComponent } from "./Pages/Common/dashboard/ar-auditor/ar-auditor.component";
import { PerManagerComponent } from "./Pages/Common/dashboard/per-manager/per-manager.component";
import { ChangePasswordComponent } from "./Pages/Common/change-password/change-password.component";
import { FollowupactionComponent } from "./Pages/AR Management/Common/Configuration/followup-action/followupaction/followupaction.component";
import { ProductionDailyCloseComponent } from "./Pages/AR Management/production-daily-close/production-daily-close.component";
import { ViewTaskDetailListComponent } from "./Pages/AR Management/view-task-details/view-task-detail-list/view-task-detail-list.component";
import { MailconfigurationComponent } from "./Pages/AR Management/Common/Configuration/mail-configuration/mailconfiguration/mailconfiguration.component";
import { SetsessionidComponent } from "./Pages/Common/setsessionid/setsessionid.component";
import { LoginRequestComponent } from "./Pages/Common/login-request/login-request.component";
import { AutomationComponent } from "./Pages/AR Management/Common/Configuration/Automation/automation/automation.component";
import { ReportComponent } from "./Pages/AR Management/Reports/MainReport/report/report.component";
import { AutomationReportComponent } from "./Pages/AR Management/Reports/ReportsList/automation-report/automation-report.component";
import { DeferRulesComponent } from "./Pages/AR Management/Common/Configuration/DeferRule/defer-rules/defer-rules.component";
import { DeferWorkqueueComponent } from "./Pages/AR Management/AR Inventory/defer-workqueue/defer-workqueue.component";
import { OrderWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-workqueue/order-workqueue.component";
import { MyOrderQueueComponent } from "./Pages/BT Charge Posting/btworkqueue/my-order-queue/my-order-queue.component";
import { OrderActionComponent } from "./Pages/BT Charge Posting/Order Action/order-action/order-action.component";
import { MissingChargesComponent } from "./Pages/BT Charge Posting/btworkqueue/missing-charges/missing-charges.component";
import { OrderCompletedWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-completed-workqueue/order-completed-workqueue.component";
import { OrderAssistanceWorkqueueComponent } from "./Pages/BT Charge Posting/btworkqueue/order-assistance-workqueue/order-assistance-workqueue.component";
import { DocsvaultComponent } from "./Pages/AR Management/Common/Configuration/docsvault/docsvault.component";
import { OrderReviewComponent } from "./Pages/BT Charge Posting/btworkqueue/order-review/order-review.component";
import { OrderSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/order-search/order-search.component";
import { OrderHistoryComponent } from "./Pages/BT Charge Posting/order-history/order-history.component";
import { MyReviewComponent } from "./Pages/BT Charge Posting/btworkqueue/my-review/my-review.component";
import { DocsfromdocvaultComponent } from "./Pages/BT Charge Posting/docsfromdocvault/docsfromdocvault.component";
import { DocumentSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/document-search/document-search.component";
import { OrderTriarqAssistanceComponent } from "./Pages/BT Charge Posting/btworkqueue/order-triarq-assistance/order-triarq-assistance.component";
import { DocsvaultUploadComponent } from "./Pages/BT Charge Posting/btworkqueue/docsvault-upload/docsvault-upload.component";
import { FolderProcessComponent } from "./Pages/BT Charge Posting/btworkqueue/folder-process/folder-process.component";

import { OrderstatusComponent } from "./Pages/BT Charge Posting/orderstatus/orderstatus.component";
import { OrderNoteComponent } from "./Pages/AR Management/Common/Configuration/order-note/order-note/order-note.component";
import { OrderSubStatusComponent } from "./Pages/AR Management/Common/Configuration/order-sub-status/order-sub-status/order-sub-status.component";
import { OrderExportComponent } from "./Pages/BT Charge Posting/btworkqueue/order-export/order-export.component";
import { ReadyForPrintingComponent } from "./Pages/BT Charge Posting/btworkqueue/ready-for-printing/ready-for-printing.component";
import { SubmittedAndPrintedComponent } from "./Pages/BT Charge Posting/btworkqueue/submitted-and-printed/submitted-and-printed.component";
import { InterfaceDetailsComponent } from "./Pages/AR Management/Common/Configuration/Interface-configuration/interface-details/interface-details.component";
import { PendingAdditionalInfoComponent } from "./Pages/BT Charge Posting/btworkqueue/pending-additional-info/pending-additional-info.component";
import { RcmDocsViewComponent } from "./Pages/RCM Docs/rcm-docs-view/rcm-docs-view.component";
import { GroupClientMappingComponent } from "./Pages/AR Management/Common/Configuration/groupclientmapping/group-client-mapping/group-client-mapping.component";
import { RCMDocsDashboardComponent } from "./Pages/Common/dashboard/rcmdocs-dashboard/rcmdocs-dashboard.component";
import { RcmDocumentsImportComponent } from "./Pages/RCM Docs/rcmdocsimport/rcm-documents-import/rcm-documents-import.component";
import { BiotechReportComponent } from "./Pages/BT Charge Posting/btworkqueue/biotechreport/biotech-report/biotech-report.component";
import { AdvanceSearchComponent } from "./Pages/BT Charge Posting/btworkqueue/advance-search/advance-search.component";
import { PracticeCompletedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-completed/practice-completed.component";
import { PracticeAssignedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-assigned/practice-assigned.component";
import { PracticeUserQueueComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-user-queue/practice-user-queue.component";
import { PracticeDashboardComponent } from "./Pages/Common/dashboard/practice-dashboard/practice-dashboard.component";
import { ClientProviderMappingComponent } from "./Pages/AR Management/Common/Configuration/clientprovidermapping/client-provider-mapping/client-provider-mapping.component";
import { IncompleteEncounterSummaryComponent } from "./Pages/BT Charge Posting/btworkqueue/incomplete-encounter-summary/incomplete-encounter-summary.component";
import { ArchivedEncountersComponent } from "./Pages/BT Charge Posting/btworkqueue/archived-encounters/archived-encounters.component";
import { PracticeAssistanceCompletedComponent } from "./Pages/BT Charge Posting/btworkqueue/practice-assistance-completed/practice-assistance-completed.component";
import { ExecutiveDashboardComponent } from "./Pages/Common/dashboard/executive-dashboard/executive-dashboard.component";
// import { RcmDocsComponent } from "./Pages/BT Charge Posting/btworkqueue/rcm-docs/rcm-docs.component";
const routes: Routes = [
  // { path: '', comzponent: DashboardComponent },
  // { path: '*', component: DashboardComponent },
  {
    path: "",
    component: LoginRequestComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    component: HomeLayoutComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: "Home", component: MyDashboardComponent },
      { path: "ARInventory", component: WorkqueueComponent },
      { path: "DeferARInventory", component: DeferWorkqueueComponent },
      { path: "Assistant", component: AssistantComponent },
      { path: "Agent", component: AgentsComponent },
      // { path: "File", component: FilesComponent },
      //{ path: "Production", component: ProductionComponent },
      { path: "Announcement", component: AnnouncmentComponent },
      { path: "OrderInventory", component: OrderWorkqueueComponent },
      { path: "MyOrderInventory", component: MyOrderQueueComponent },
      { path: "OrderActionPane", component: OrderActionComponent },
      { path: "OrderCompleted", component: OrderCompletedWorkqueueComponent },
      {
        path: "OrderAssisted/:clientid",
        component: OrderAssistanceWorkqueueComponent,
      },
      { path: "OrderReview", component: OrderReviewComponent },
      { path: "myOrderReview", component: MyReviewComponent },
      { path: "MissingCharges", component: MissingChargesComponent },
      { path: "OrderSearch", component: OrderSearchComponent },
      { path: "OrderExport", component: OrderExportComponent },
      { path: "DocumentSearch", component: DocumentSearchComponent },
      { path: "ProcessFolder", component: FolderProcessComponent },
      { path: "OrderHistory", component: OrderHistoryComponent },
      { path: "Docsvalutorderdoc", component: DocsfromdocvaultComponent },
      { path: "Assistance", component: OrderTriarqAssistanceComponent },
      { path: "OrderUpload", component: DocsvaultUploadComponent },
      { path: "orderstatus", component: OrderstatusComponent },
      {
        path: "PendingAdditionalInfo",
        component: PendingAdditionalInfoComponent,
      },
      { path: "RCMDocsDashboard", component: RCMDocsDashboardComponent },
      { path: "RCMDocsImport", component: RcmDocumentsImportComponent },
      { path: "AdvanceSearch", component: AdvanceSearchComponent },
      { path: "PracticeAssigned", component: PracticeAssignedComponent },
      { path: "PracticeCompleted", component: PracticeCompletedComponent },
      { path: "PracticeUserQueue", component: PracticeUserQueueComponent },
      {
        path: "PracticeAssistanceCompleted",
        component: PracticeAssistanceCompletedComponent,
      },
      {
        path: "IncompleteSummary",
        component: IncompleteEncounterSummaryComponent,
      },
      { path: "ArchivedEncounters", component: ArchivedEncountersComponent },
      {
        path: "Reports",
        component: ReportComponent,
        // data: {
        //   breadcrumb: "Reports",
        // },

        children: [
          {
            path: "File",
            component: FilesComponent,
            // data: {
            //   breadcrumb: "File",
            // },
          },
          {
            path: "Production",
            component: ProductionComponent,
            // data: {
            //   breadcrumb: "Production",
            // },
          },
          //add automation accuracy report component {}
          {
            path: "Automation-Accuracy",
            component: AutomationReportComponent,
            // data: {
            //   breadcrumb: "Automation-Accuracy",
            // },
          },
          {
            path: "BiotechReport",
            component: BiotechReportComponent,
            // data: {
            //   breadcrumb: "BiotechReport",
            // },
          },
        ],
      },

      {
        path: "Configuration",
        component: ConfigurationComponent,

        children: [
          { path: "client", component: ClientComponent },
          { path: "interfaces", component: InterfaceDetailsComponent },
          { path: "notetemplate", component: NotetemplateComponent },
          { path: "status", component: StatusComponent },
          { path: "substatus", component: SubstatusComponent },
          { path: "actions", component: ActionsComponent },
          { path: "clientlogins", component: ClientloginsComponent },
          {
            path: "productionconfiguration",
            component: ProductionconfigurationComponent,
          },
          { path: "smartassignment", component: SmartassignmentComponent },
          {
            path: "announcement",
            component: ConfigurationannouncmentComponent,
          },
          { path: "payer", component: PayerComponent },
          { path: "payercrosswalk", component: PayercrosswalkComponent },
          { path: "errortype", component: ErrortypeComponent },
          { path: "automation", component: AutomationComponent },
          { path: "clientusermapping", component: ClientusermappingComponent },
          { path: "qsuiteusermapping", component: QsuiteusermappingComponent },
          { path: "ftpdetails", component: FtpdetailsComponent },
          { path: "followup", component: FollowupactionComponent },
          { path: "mail", component: MailconfigurationComponent },
          { path: "inventoryrules", component: DeferRulesComponent },
          { path: "docsvault", component: DocsvaultComponent },
          { path: "ordersubstatus", component: OrderSubStatusComponent },
          { path: "ordernote", component: OrderNoteComponent },
          {
            path: "groupclientmapping",
            component: GroupClientMappingComponent,
          },
          {
            path: "practicemapping",
            component: ClientProviderMappingComponent,
          },
        ],
      },
      { path: "MyTask", component: MyTaskComponent },
      { path: "CompletedTask", component: MyCompletedTaskComponent },
      { path: "CanceledTask", component: MyCanceledTaskComponent },
      // { path: 'TaskWorkPane/:SelectedTasks', component: TaskWorkPaneComponent},
      { path: "TaskWorkPane", component: TaskWorkPaneComponent },
      // { path: '', component: LoginComponent },
      // { path: '*', component: LoginComponent },
      { path: "AddClient", component: AddclientComponent },
      { path: "OPSManager", component: OpsManagerComponent },
      { path: "ARManager", component: ArManagerComponent },
      { path: "ARResp", component: ArRepresentativeComponent },
      { path: "PracticeUser", component: PracticeUserComponent },
      { path: "Admin", component: SysAdminComponent },
      { path: "ARAuditor", component: ArAuditorComponent },
      { path: "PERManager", component: PerManagerComponent },
      { path: "ARReview", component: QualityReviewComponent },
      { path: "CompletedReview", component: QualityReviewCompletedComponent },
      { path: "ServiceController", component: ServicecontrollerComponent },
      {
        path: "ProductionDailyClose",
        component: ProductionDailyCloseComponent,
      },
      { path: "ViewTask", component: ViewTaskDetailListComponent },
      { path: "ChangePassword", component: ChangePasswordComponent },
      { path: "PrintingOrders", component: ReadyForPrintingComponent },
      { path: "SubmittedAndPrinted", component: SubmittedAndPrintedComponent },
      { path: "RCMDocsView", component: RcmDocsViewComponent },
      { path: "PracticeDashboard", component: PracticeDashboardComponent },
      { path: "ExecutiveDashboard", component: ExecutiveDashboardComponent },
      // { path: "RCMDocs", component: RcmDocsComponent },
    ],
  },
  { path: "setSID/:uid/:aid", component: SetsessionidComponent },
  { path: "clrSID", component: SetsessionidComponent },

  // {
  //   path: "",
  //   component: LoginLayoutComponent,
  //   canActivate: [AuthGuard],
  //   children: [
  //     // {
  //     //   path: "login",
  //     //   component: LoginComponent
  //     // }
  //     {
  //       path: "LoginRequest",
  //       component: LoginRequestComponent
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], //meta data object
  exports: [RouterModule],
})
export class AppRoutingModule {}
