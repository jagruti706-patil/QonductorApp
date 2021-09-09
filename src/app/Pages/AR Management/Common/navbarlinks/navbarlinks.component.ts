import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { DataTransferService } from "../../../Services/Common/data-transfer.service";
import { Navbarlinks } from "src/app/Model/AR Management/Common/navbar/navbarlinks";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "../../../../../../node_modules/subsink";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-navbarlinks",
  templateUrl: "./navbarlinks.component.html",
  styleUrls: ["./navbarlinks.component.css"],
})
export class NavbarlinksComponent implements OnInit {
  clsUtility: Utility;
  private subscription = new SubSink();
  currenturl: string = "";
  constructor(
    private dataService: DataTransferService,
    private router: Router
  ) {
    this.clsUtility = new Utility();
    this.subscription.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currenturl = this.router.url;
        }
      })
    );
  }
  vwMissingCharges = false;
  vwMyDashboard = false;
  vwARInventory = false;
  vwDeferARInventory = false;
  vwMyTask = false;
  vwCompletedTask = false;
  vwCanceledTask = false;
  vwAssistant = false;
  vwAgents = false;
  // vwFile = false;
  //vwProduction = false;
  vwAnnoucement = false;
  vwConfiguration = false;
  vwARReview = false;
  vwServiceController = false;
  vwProductionDailyClose = false;
  vwViewTask = false;
  vwCompletedARReview = false;
  ChangePasswordClick = false;
  vwReport = false;
  vwOrderInventory = false;
  vwCompletedInventory = false;
  vwAssistanceInventory = false;
  vwBiotechOrders = false;
  vwMyOrders = false;
  vwReviewOrder = false;
  //vwAutomation=false;
  homeNavigation: string;

  vwARTracking = false;
  vwEncounterTracking = false;
  vwMyReview = false;
  vwOrderSearch = false;
  vwDocumentSearch = false;
  vwTriarqAssistance = false;
  vwAddOns = false;
  vwReprocessFolder = false;
  vwOrderStatus = false;
  vwOrderExport = false;
  vwReadyForPrinting = false;
  vwSubmittedAndPrinted = false;
  vwPendingAdditionalInfo = false;
  vwRCMDocsView = false;
  vwRCMDocsDashboard = false;
  vwRCMDocsImport = false;
  vwDocuments = false;
  vwDashboard = false;
  vwPrinting = false;
  vwPracticeAssigned = false;
  vwPracticeCompleted = false;
  vwPracticeUserEncounter = false;
  vwPracticeAssistanceCompleted = false;
  vwPracticeDashboard = false;
  vwIncompleteSummary = false;
  vwArchivedEncounters = false;
  vwExecutiveDashboard = false;
  vwAdvanceSearch = false;

  ngOnInit() {
    // console.log(this.dataService.defaultNavigation);
    this.dataService.defaultNavigation.subscribe((data) => {
      this.homeNavigation = data;
    });
    // this.homeNavigation = this.dataService.defaultNavigation;
    // console.log("in navbarlinks" + JSON.stringify(this.homeNavigation));
    var testnavlinks: Navbarlinks;
    this.dataService.ChangePassword.subscribe(
      (cp) => (this.ChangePasswordClick = cp)
    );
    this.dataService.navSubject.subscribe((data) => {
      if (data != null || data != undefined) {
        testnavlinks = data;
        // console.log("testnavlinks" + JSON.stringify(testnavlinks));
        this.vwMyDashboard = testnavlinks.viewMyDashboard;
        this.vwARInventory = testnavlinks.viewARInventory;
        this.vwMyTask = testnavlinks.viewMyTask;
        this.vwAssistant = testnavlinks.viewAssistant;
        this.vwAgents = testnavlinks.viewAgents;
        this.vwCompletedTask = testnavlinks.viewCompletedTask;
        this.vwCanceledTask = testnavlinks.viewCanceledTask;
        this.vwAnnoucement = testnavlinks.viewAnnoucement;
        this.vwConfiguration = testnavlinks.viewConfiguration;
        this.vwARReview = testnavlinks.viewARReview; //this.dataService.navbarLinkspermission.viewARReview;
        this.vwServiceController = testnavlinks.viewServiceController; //testnavlinks.viewServiceController;
        this.vwProductionDailyClose = testnavlinks.viewProductionDailyClose;
        this.vwViewTask = testnavlinks.viewViewTask; //testnavlinks.viewServiceController;
        this.vwCompletedARReview = testnavlinks.viewCompletedReview;
        // this.vwReport=testnavlinks.viewReport;   //saurabh shelar
        //this.vwFile = testnavlinks.viewFile;
        //this.vwProduction = testnavlinks.viewProduction;
        //  this.vwAutomation=testnavlinks.viewAutomation;
        this.vwReport = testnavlinks.viewReport;

        this.vwDeferARInventory = testnavlinks.viewDeferARInventory;
        this.vwMyOrders = testnavlinks.viewMyOrders;

        this.vwOrderInventory = testnavlinks.viewOrderInventory;
        this.vwCompletedInventory = testnavlinks.viewCompletedInventory;
        this.vwAssistanceInventory = testnavlinks.viewAssistanceInventory;
        this.vwMissingCharges = testnavlinks.viewMissingCharges;
        this.vwReviewOrder = testnavlinks.viewReviewOrder;
        this.vwARTracking = testnavlinks.viewARTracking;
        this.vwEncounterTracking = testnavlinks.viewEncounterTracking;
        this.vwMyReview = testnavlinks.viewMyReview;
        this.vwOrderSearch = testnavlinks.viewOrderSearch;
        this.vwDocumentSearch = testnavlinks.viewDocumentSearch;
        this.vwTriarqAssistance = testnavlinks.viewTriarqAssistance;
        this.vwAddOns = testnavlinks.viewAddOns;
        this.vwBiotechOrders = testnavlinks.viewBiotechOrders;
        this.vwReprocessFolder = testnavlinks.viewReprocessFolder;
        this.vwOrderStatus = testnavlinks.viewOrderStatus;
        this.vwOrderExport = testnavlinks.viewOrderExport;
        this.vwReadyForPrinting = testnavlinks.viewReadyForPrinting;
        this.vwSubmittedAndPrinted = testnavlinks.viewSubmittedAndPrinted;
        // this.vwPendingAdditionalInfo = testnavlinks.viewPendingAdditionalInfo;
        this.vwRCMDocsView = testnavlinks.viewRCMDocsView;
        this.vwRCMDocsDashboard = testnavlinks.viewRCMDocsDashboard;
        this.vwRCMDocsImport = testnavlinks.viewRCMDocsImport;

        this.vwDashboard = testnavlinks.viewDashboard;
        this.vwDocuments = testnavlinks.viewDocuments;
        this.vwPrinting = testnavlinks.viewPrinting;
        this.vwPracticeAssigned = testnavlinks.viewPracticeAssigned;
        this.vwPracticeCompleted = testnavlinks.viewPracticeCompleted;
        this.vwPracticeUserEncounter = testnavlinks.viewPracticeUserEncounter;
        this.vwPracticeDashboard = testnavlinks.viewPracticeDashboard;
        this.vwIncompleteSummary = testnavlinks.viewIncompleteSummary;
        this.vwArchivedEncounters = testnavlinks.viewArchivedEncounters;
        this.vwPracticeAssistanceCompleted =
          testnavlinks.viewPracticeAssistanceCompleted;
        this.vwExecutiveDashboard = testnavlinks.viewExecutiveDashboard;
        this.vwAdvanceSearch = testnavlinks.viewAdvanceSearch;
      }
    });

    // if (this.dataService.navbarLinkspermission != undefined) {
    //   this.vwMyDashboard = this.dataService.navbarLinkspermission.viewMyDashboard;
    //   this.vwARInventory = this.dataService.navbarLinkspermission.viewARInventory;
    //   this.vwMyTask = this.dataService.navbarLinkspermission.viewMyTask;
    //   this.vwAssistant = this.dataService.navbarLinkspermission.viewAssistant;
    //   this.vwAgents = this.dataService.navbarLinkspermission.viewAgents;
    //   this.vwFile = this.dataService.navbarLinkspermission.viewFile;
    //   this.vwProduction = this.dataService.navbarLinkspermission.viewProduction;
    //   this.vwAnnoucement = this.dataService.navbarLinkspermission.viewAnnoucement;
    //   this.vwConfiguration = this.dataService.navbarLinkspermission.viewConfiguration;
    //   this.vwARReview = true;//this.dataService.navbarLinkspermission.viewARReview;
    // }
    // this.vwMyDashboard = true;
    //   this.vwARInventory = true;
    //   this.vwMyTask = true;
    //   this.vwAssistant = true;
    //   this.vwAgents = true;
    //   this.vwFile = true;
    //   this.vwProduction = true;
    //   this.vwAnnoucement = true;
    //   this.vwConfiguration = true;
  }
  @ViewChild("widgetsContent", { read: ElementRef })
  public widgetsContent: ElementRef<any>;

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 150,
      behavior: "smooth",
    });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 150,
      behavior: "smooth",
    });
  }
}
