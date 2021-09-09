import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Production } from "src/app/Model/AR Management/Production/production";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import {
  InventoryInputModel,
  FilterAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";

@Component({
  selector: "app-production",
  templateUrl: "./production.component.html",
  styleUrls: ["./production.component.css"],
})
export class ProductionComponent implements OnInit, OnDestroy {
  public ProductiongridData: {};
  public ProductiongridView: GridDataResult;
  private Productionitems: any[] = [];
  // public Productionskip = 0;
  // public ProductionpageSize = 20;

  private Productionid: number = 0;

  public filterApplied = false;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  public totalpagescount: number = 0;
  lstFilter: InventoryInputModel = new InventoryInputModel();
  private subscription = new SubSink();
  private clsUtility: Utility;

  // Loading
  loadingProduction = true;
  loadingProductionGrid = true;

  public Productionsort: SortDescriptor[] = [
    {
      field: "snotetitle",
      dir: "desc",
    },
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataTransferService,
    private filterService: FilterService
  ) {
    this.subscription.add(
      this.dataService.loginUserID.subscribe((loginUser) => {
        this.loginuserid = loginUser;
      })
    );
    this.clsUtility = new Utility();
    this.pagesize = this.clsUtility.pagesize;
    this.RetriveMasterData();
    this.loadProductionitems();
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
      if (this.dataService.SelectedRoleName == "AR Representative") {
        this.lstFilter.agent.splice(0, this.lstFilter.agent.length);
        const filteragent = new FilterAgent();
        filteragent.agentid = this.dataService.SelectedGCPUserid;
        filteragent.agentname = this.dataService.loginUserName;
        this.lstFilter.agent.push(filteragent);
        // console.log(filteragent);
      }
      // console.log(this.dataService.SelectedGCPUserid);

      if (this.loginuserid > 0) {
        this.subscription.add(
          this.filterService
            .applyFilter(
              JSON.stringify(this.lstFilter),
              "Production",
              this.loginuserid,
              this.page,
              this.pagesize
            )
            .subscribe(
              (data) => {
                if (data.content != null && data.content.length > 0) {
                  this.displaycurrentpages = data.pageable.pageNumber + 1;
                  this.displaytotalpages = data.totalPages;
                  this.totalpagescount = data.totalPages;
                  this.displaytotalrecordscount = data.totalElements;
                } else {
                  this.displaycurrentpages = 0;
                  this.displaytotalpages = 0;
                  this.totalpagescount = 0;
                  this.displaytotalrecordscount = 0;
                  this.Productionitems = null;
                  this.ProductiongridView = null;
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

                this.ProductiongridData = data.content;
                this.Productionitems = data.content;
                if (data.content != null) this.loadProductionitems();
                else this.ProductiongridView = null;
                this.loadingProduction = false;
                this.loadingProductionGrid = false;
              },
              (err) => {
                this.loadingProductionGrid = false;
              }
            )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ApplyFilter($event) {
    this.loadingProduction = true;
    this.loadingProductionGrid = true;
    var Productionevent = $event;
    this.page = 0;
    this.pagesize = this.clsUtility.pagesize;
    var Production: Production[];
    Production = Productionevent.content;

    if (
      Productionevent.content != null &&
      Productionevent.content != undefined &&
      Productionevent.content.length != 0
    ) {
      this.displaycurrentpages = Productionevent.pageable.pageNumber + 1;
      this.displaytotalpages = Productionevent.totalPages;
      this.totalpagescount = Productionevent.totalPages;
      this.displaytotalrecordscount = Productionevent.totalElements;
    } else {
      this.displaycurrentpages = 0;
      this.displaytotalpages = 0;
      this.totalpagescount = 0;
      this.displaytotalrecordscount = 0;
      this.Productionitems = null;
    }

    if (JSON.stringify(Productionevent.last) == "true") {
      this.Isnextdisabled = true;
    } else {
      this.Isnextdisabled = false;
    }
    if (this.page == 0) {
      this.Ispreviousdisabled = true;
    } else {
      this.Ispreviousdisabled = false;
    }

    this.ProductiongridData = Production;
    this.Productionitems = Production;
    if (Productionevent.content != null) this.loadProductionitems();
    else this.ProductiongridView = null;
    this.loadingProduction = false;
    this.loadingProductionGrid = false;
    this.filterApplied = this.dataService.isProductionFilterApplied;
  }

  private loadProductionitems(): void {
    try {
      this.ProductiongridView = {
        data: orderBy(this.Productionitems, this.Productionsort),
        total: this.Productionitems.length,
      };
      // console.log("load prod :" + JSON.stringify(this.ProductiongridView));
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortProductionChange(sort: SortDescriptor[]): void {
    try {
      if (this.Productionitems != null) {
        this.Productionsort = sort;
        this.loadProductionitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClickPrevious() {
    try {
      this.loadingProduction = true;
      this.loadingProductionGrid = true;
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        if (this.dataService.isProductionFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "Production",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pageNumber + 1;
                      this.displaytotalpages = data.totalPages;
                      this.totalpagescount = data.totalPages;
                      this.displaytotalrecordscount = data.totalElements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.Productionitems = null;
                      this.ProductiongridView = null;
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

                    this.ProductiongridData = data.content;
                    this.Productionitems = data.content;
                    if (data.content != null) this.loadProductionitems();
                    else this.ProductiongridView = null;
                    this.loadingProduction = false;
                    this.loadingProductionGrid = false;
                  },
                  (err) => {
                    this.loadingProductionGrid = false;
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
      this.loadingProduction = true;
      this.loadingProductionGrid = true;
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        if (this.dataService.isProductionFilterApplied == true) {
          if (this.loginuserid > 0) {
            this.subscription.add(
              this.filterService
                .applyFilter(
                  JSON.stringify(this.dataService.SelectedFilter),
                  "Production",
                  this.loginuserid,
                  this.page,
                  this.pagesize
                )
                .subscribe(
                  (data) => {
                    if (data.content != null) {
                      this.displaycurrentpages = data.pageable.pageNumber + 1;
                      this.displaytotalpages = data.totalPages;
                      this.totalpagescount = data.totalPages;
                      this.displaytotalrecordscount = data.totalElements;
                    } else {
                      this.displaycurrentpages = 0;
                      this.displaytotalpages = 0;
                      this.totalpagescount = 0;
                      this.displaytotalrecordscount = 0;
                      this.Productionitems = null;
                      this.ProductiongridView = null;
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

                    this.ProductiongridData = data.content;
                    this.Productionitems = data.content;
                    if (data.content != null) this.loadProductionitems();
                    else this.ProductiongridView = null;
                    this.loadingProduction = false;
                    this.loadingProductionGrid = false;
                  },
                  (err) => {
                    this.loadingProductionGrid = false;
                  }
                )
            );
          }
        } else this.RetriveMasterData();
      }
    } catch (error) {
      this.page = this.page - 1;
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
}
