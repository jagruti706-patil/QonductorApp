export class Navbarlinks {
  viewDashboard = false;
  viewARTracking = false;
  viewEncounterTracking = false;
  viewDocuments = false;
  viewPrinting = false;
  viewReport = false;
  viewConfiguration = false;
  viewServiceController = false;

  viewMyDashboard = false;
  viewARInventory = false;
  viewDeferARInventory = false;
  viewMyTask = false;
  viewAssistant = false;
  viewAgents = false;
  viewCompletedTask = false;
  viewCanceledTask = false;
  //viewReports=true;
  // viewReport=false;  //saurabh shelar
  viewFile = false;
  viewProduction = false;
  // viewAutomation= false;

  viewAnnoucement = false;

  viewARReview = false;

  viewProductionDailyClose = false;
  viewViewTask = false;
  viewCompletedReview = false;
  dashboardAccess: DashboardAccess = new DashboardAccess();
  configurationAccess: ConfigurationAccess = new ConfigurationAccess();
  inventoryAccess: InventoryAccess = new InventoryAccess();
  reportAccess: ReportAccess = new ReportAccess();

  viewOrderInventory = false;
  viewAssignOrder = false;
  viewMyOrders = false;
  viewMissingCharges = false;
  viewCompletedInventory = false;
  viewAssistanceInventory = false;
  viewReviewOrder = false;
  viewUpdateEntrStatusOnPendingReview = false;
  viewMarkIncompleteOnPendingReview = false;

  viewMyReview = false;
  viewAssignReview = false;
  viewExportGrid = false;
  viewOrderSearch = false;
  viewDocumentSearch = false;
  viewReassignOrder = false;
  viewAddCabinets = false;
  viewProcessFolders = false;
  viewTriarqAssistance = false;
  viewReleaseAssignment = false;
  viewReleaseButton = false;
  viewAddOns = false;
  viewSendToBT = false;
  viewBiotechOrders = false;
  viewOsUpdateBtn = false;
  viewUploadToDocsvault = false;
  viewUpdateMissingInfo = false;
  viewReprocessFolder = false;
  viewAllowMultiple = false;
  viewOrderStatus = false;
  viewDownloadOnIncomplete = false;
  viewDownloadAndSendToBiotech = false;
  viewShowMissingInfo = false;
  viewUpdateInfoOnBiotechOrders = false;
  viewDownloadOnBiotechOrders = false;
  viewEncounterHistoryAddComment = false;
  viewUpdateOnHistory = false;
  viewOrderExport = false;
  viewReadyForPrinting = false;
  viewPrintBtn = false;
  viewPrintAllBtn = false;
  viewSubmittedAndPrinted = false;
  viewRePrintBtn = false;
  viewFinishedAndReturnedBtn = false;
  viewFailedAndReturnedBtn = false;
  viewReturnedWithoutWorkingBtn = false;
  viewUpdateEntrStatusOnMyReview = false;
  viewMarkIncompleteOnMyReview = false;
  viewMarkCompleteOnAssistance = false;
  viewMarkIncompleteOnAssistance = false;
  viewPendingAdditionalInfo = false;
  viewRCMDocsView = false;
  viewRCMDocsDashboard = false;
  viewRCMDocsImport = false;
  viewImportDocumentsBtn = false;
  viewMoveDocumentsBtn = false;
  viewDeleteDocumentsBtn = false;
  viewSendToPractice = false;
  viewDeleteRcmDocNote = false;
  viewDeleteRcmDocAnswer = false;
  viewIncompleteSendToPracticeBtn = false;
  viewPracticeAssigned = false;
  viewPracticeCompleted = false;
  viewPracticeCompletedAssignEncounterBtn = false;
  viewReadyForPrintSendToPracticeBtn = false;
  viewSubmittedAndPrintedSendToPractice = false;
  viewPracticeUserEncounter = false;
  viewPracticeAssignedReleaseAssignment = false;
  viewAddComment = false;
  viewPracticeDashboard = false;
  viewShowAllGroupDataFilter = false;
  viewGroupWiseCards = false;
  viewPracticeAssignedAgingBucket = false;
  viewIncompleteSummary = false;
  viewArchivedEncounters = false;
  viewPracticeAssistanceCompleted = false;
  viewReleaseArchived = false;
  viewExecutiveDashboard = false;
  viewShowAllPractice = false;
  viewAdvanceSearch = false;
}

export class DashboardAccess {
  MyTaskCardAccess = false;
  ClientFilterAccess = false;
  ManagerCardAccess = false;
  AgingBucketAccess = false;
  StatusCardAccess = false;
}
export class InventoryAccess {
  AssignWorkItem = false;
  DeferWorkItem = false;
  UndeferWorkItem = false;
}

export class ReportAccess {
  FileReport = false;
  ProductionReport = false;
  AutomationReport = false;
}
export class ConfigurationAccess {
  ClientConfiguration = false;
  ClientLoginsConfiguration = false;
  PayerConfiguration = false;
  PayerCrosswalkConfiguration = false;
  NoteTemplateConfiguration = false;
  StatusConfiguration = false;
  SubStatusConfiguration = false;
  ActionConfiguration = false;
  ErrorTypeConfiguration = false;
  AutomationErrorConfiguration = false;
  ClientUserMappingConfiguration = false;
  QsuiteUserMappingConfiguration = false;
  FTPDetailsConfiguration = false;
  FollowupActionConfiguration = false;
  MailConfigurationConfiguration = false;
  InventoryRuleConfiguration = false;
  EdocsManagerConfiguration = false;
  OrderSubStatusConfiguration = false;
  OrderNoteConfiguration = false;
  InterfaceConfiguration = false;
  GroupClientMapping = false;
  ClientProviderMapping = false;
}
