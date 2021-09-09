import { Component, OnInit, OnDestroy } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SubSink } from "subsink";
import { DatePipe } from "@angular/common";
import { Utility } from "src/app/Model/utility";
import {
  InventoryInputModel,
  Filter,
  OutputFilter,
  FliterClient,
  FilterAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { FormBuilder, Validators } from "@angular/forms";
import { MasterdataService } from "../../../../Services/AR/masterdata.service";
import { DataTransferService } from "../../../../Services/Common/data-transfer.service";
import { FilterService } from "../../../../Services/Common/filter.service";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
//import moment = require('moment');

@Component({
  selector: "app-automation-report",
  templateUrl: "./automation-report.component.html",
  styleUrls: ["./automation-report.component.css"],
})
export class AutomationReportComponent implements OnInit, OnDestroy {
  public AutomationgridData: {};
  public AutomationgridView: GridDataResult;
  private Automationitems: any[] = [];
  // public Productionskip = 0;
  // public ProductionpageSize = 20;

  private Productionid: number = 0;

  public filterApplied = false;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true; //used in production.component.html
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  private subscription = new SubSink();
  private clsUtility: Utility;

  // Loading
  loadingAutomation = true;
  loadingAutomationGrid = true;

  public Automationsort: SortDescriptor[] = [
    {
      field: "snotetitle",
      dir: "desc",
    },
  ];

  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private dataService: DataTransferService,
    private filterService: FilterService,
    private toastr: ToastrService
  ) {
    this.subscription.add(
      this.dataService.loginUserID.subscribe((loginUser) => {
        this.loginuserid = loginUser;
      })
    );
    this.clsUtility = new Utility(toastr);
    this.pagesize = this.clsUtility.pagesize;

    const lastweek = moment().subtract(1, "weeks");
    this.lstFilter.startdate = this.datePipe.transform(
      lastweek.startOf("week"),
      "yyyy-MM-dd"
    );
    this.lstFilter.enddate = this.datePipe.transform(
      lastweek.endOf("week"),
      "yyyy-MM-dd"
    );

    this.RetriveMasterData();
    this.loadAutomationitems();
  }
  loginuserid = 0;
  ngOnInit() {
    try {
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  RetriveMasterData() {
    try {
      // console.log(this.dataService.SelectedGCPUserid);

      if (this.loginuserid > 0) {
        this.subscription.add(
          this.filterService
            .applyFilter(
              JSON.stringify(this.lstFilter),
              "Automation",
              this.loginuserid,
              this.page,
              this.pagesize
            )
            .subscribe(
              (data) => {
                if (data) {
                  if (data.content != null) {
                    this.displaycurrentpages = data.pageable.pagenumber + 1;
                    this.displaytotalpages = data.totalpages;
                    this.totalpagescount = data.totalpages;
                    this.displaytotalrecordscount = data.totalelements; //changess
                  } else {
                    this.displaycurrentpages = 0;
                    this.displaytotalpages = 0;
                    this.totalpagescount = 0;
                    this.displaytotalrecordscount = 0;
                    this.Automationitems = null;
                    this.AutomationgridView = null;
                  }

                  if (JSON.stringify(data.last) == "true") {
                    this.Isnextdisabled = true;
                  } else {
                    this.Isnextdisabled = false;
                  }
                  if (this.page == 0) {
                    this.Ispreviousdisabled = true;
                  } else {
                    this.Ispreviousdisabled = false;
                  }

                  this.AutomationgridData = data.content;
                  this.Automationitems = data.content;
                  if (data.content != null) this.loadAutomationitems();
                  else this.AutomationgridView = null;
                  this.loadingAutomation = false;
                  this.loadingAutomationGrid = false;
                } else {
                  this.loadingAutomation = false;
                  this.loadingAutomationGrid = false;
                }
              },
              (err) => {
                this.loadingAutomationGrid = false;
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    this.loadingAutomation = true;
    this.loadingAutomationGrid = true;
    var Automationevent = $event;
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;
    console.log(Automationevent);
    //var Production: Production[];
    //Production = Automationevent.content;

    if (
      Automationevent.content != null &&
      Automationevent.content != undefined &&
      Automationevent.content.length != 0
    ) {
      // this.Automationitems=Automationevent;
      this.displaycurrentpages = Automationevent.pageable.pagenumber + 1;
      this.displaytotalpages = Automationevent.totalpages;
      this.totalpagescount = Automationevent.totalpages;
      this.displaytotalrecordscount = Automationevent.totalelements; //changeeeee
    } else {
      this.displaycurrentpages = 0;
      this.displaytotalpages = 0;
      this.totalpagescount = 0;
      this.displaytotalrecordscount = 0;
      this.Automationitems = null;
    }

    if (JSON.stringify(Automationevent.last) == "true") {
      this.Isnextdisabled = true;
    } else {
      this.Isnextdisabled = false;
    }
    if (this.page == 0) {
      this.Ispreviousdisabled = true;
    } else {
      this.Ispreviousdisabled = false;
    }

    this.AutomationgridData = Automationevent;
    this.Automationitems = Automationevent.content; //temporary change
    if (
      Automationevent.content != null &&
      Automationevent.content != undefined &&
      Automationevent.content.length != 0
    )
      this.loadAutomationitems();
    else this.AutomationgridView = null;
    this.loadingAutomation = false;
    this.loadingAutomationGrid = false;
    this.filterApplied = this.dataService.isAutomationFilterApplied; //change
  }

  private loadAutomationitems(): void {
    try {
      console.log(this.Automationitems);
      this.AutomationgridView = {
        data: orderBy(this.Automationitems, this.Automationsort),
        total: this.Automationitems.length,
      };
      // console.log("load prod :" + JSON.stringify(this.AutomationgridView));
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortAutomationChange(sort: SortDescriptor[]): void {
    try {
      if (this.Automationitems != null) {
        this.Automationsort = sort;
        this.loadAutomationitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClickPrevious() {
    try {
      this.loadingAutomation = true;
      this.loadingAutomationGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        if (this.dataService.isAutomationFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "automation",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pagenumber + 1;
                      this.displaytotalpages = data.totalpages;
                      this.totalpagescount = data.totalpages;
                      this.displaytotalrecordscount = data.totalelements; ///changessss
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.Automationitems = null;
                      this.AutomationgridView = null;
                    }

                    if (JSON.stringify(data.last) == "true") {
                      this.Isnextdisabled = true;
                    } else {
                      this.Isnextdisabled = false;
                    }
                    if (this.page == 0) {
                      this.Ispreviousdisabled = true;
                    } else {
                      this.Ispreviousdisabled = false;
                    }

                    this.AutomationgridData = data.content;
                    this.Automationitems = data.content;
                    if (data.content != null) this.loadAutomationitems();
                    else this.AutomationgridView = null;
                    this.loadingAutomation = false;
                    this.loadingAutomationGrid = false;
                  },
                  (err) => {
                    this.loadingAutomationGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      this.loadingAutomation = true;
      this.loadingAutomationGrid = true;
      if (this.page >= 0) {
        console.log("Next : ", this.totalpagescount, this.page);

        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        if (this.dataService.isAutomationFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "Automation",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pagenumber + 1;
                      this.displaytotalpages = data.totalpages;
                      this.totalpagescount = data.totalpages;
                      this.displaytotalrecordscount = data.totalelements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.Automationitems = null;
                      // this.AutomationgridView = null;    // change
                    }

                    if (JSON.stringify(data.last) == "true") {
                      this.Isnextdisabled = true;
                    } else {
                      this.Isnextdisabled = false;
                    }
                    if (this.page == 0) {
                      this.Ispreviousdisabled = true;
                    } else {
                      this.Ispreviousdisabled = false;
                    }

                    this.AutomationgridData = data.content;
                    this.Automationitems = data.content;
                    if (data.content != null) this.loadAutomationitems();
                    else this.AutomationgridView = null;
                    this.loadingAutomation = false;
                    this.loadingAutomationGrid = false;
                  },
                  (err) => {
                    this.loadingAutomationGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page - 1;
      //this.page = this.page - 1;
      this.loadingAutomation = false;
      this.loadingAutomationGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
} //automatin class
