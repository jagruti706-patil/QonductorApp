import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { FormBuilder, Validators } from "@angular/forms";
import { InventoryInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { WorkAuidtCompleted } from "src/app/Model/AR Management/QualityErrorCode/errorcode";
import {
  Filter,
  OutputFilter,
  OutputAgent,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "../../../Services/Common/filter.service";
import { QualityviewdetailsComponent } from "src/app/Pages/AR Management/Quality/qualityviewdetails/qualityviewdetails.component";
import { SubSink } from "../../../../../../node_modules/subsink";
declare var $: any;

@Component({
  selector: "app-quality-review-completed",
  templateUrl: "./quality-review-completed.component.html",
  styleUrls: ["./quality-review-completed.component.css"],
})
export class QualityReviewCompletedComponent implements OnInit {
  private ARRepID: number = 0;
  public AgentDefaultValue = { agentname: "All", agentid: 0 };

  public QualityReviewCompletedGridData: {};
  public QualityReviewCompletedGridView: GridDataResult;
  private QualityReviewCompletedItems: any[] = [];
  public QualityReviewCompletedSkip = 0;
  public QualityReviewCompletedPageSize = 10;

  public page: number = 0;
  public pagesize: number = 0;
  public displaycurrentpages: number = 0;
  public displaytotalpages: number = 0;
  public displaytotalrecordscount: number = 0;
  public totalpagescount: number = 0;
  public Ispreviousdisabled: boolean = true;
  public Isnextdisabled: boolean = true;
  private subscription = new SubSink();
  SelectedAgentId = 0;
  private clsUtility: Utility;
  // Loading
  loadingqualityreviewcompleted = true;
  loadingqualityreviewcompletedGrid = true;
  lstClients: OutputAgent[];

  public QualityReviewCompletedSort: SortDescriptor[] = [
    {
      field: "reviewedon",
      dir: "desc",
    },
  ];

  constructor(private fb: FormBuilder, private filterService: FilterService) {
    this.clsUtility = new Utility();
    this.pagesize = this.clsUtility.pagesize;
  }

  DropDownGroup = this.fb.group({
    fcRepName: ["", Validators.required],
  });

  get RepName() {
    return this.DropDownGroup.get("fcRepName");
  }

  ngOnInit() {
    try {
      this.loadingqualityreviewcompleted = true;
      this.loadingqualityreviewcompletedGrid = true;
      this.getAgentById(this.ARRepID);
      this.getReviewCompletedGridDetails();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getAgentById(id: number) {
    try {
      const filterinput = new Filter();
      filterinput.client = false;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = true;
      filterinput.automationstatus = false;
      filterinput.billingprovider = false;
      filterinput.insurance = false;
      filterinput.renderingprovider = false;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterList(JSON.stringify(filterinput))
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                AllFilterJSON = data;
                this.lstClients = AllFilterJSON.arrepresentative;
                this.loadingqualityreviewcompleted = false;
                this.loadingqualityreviewcompletedGrid = false;
              }
            },
            (err) => {
              this.loadingqualityreviewcompletedGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getReviewCompletedGridDetails() {
    try {
      this.subscription.add(
        this.filterService
          .getARReviewCompleted(this.SelectedAgentId, this.page, this.pagesize)
          .subscribe(
            (data) => {
              // console.log(JSON.stringify(data));

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
                this.QualityReviewCompletedItems = null;
                this.QualityReviewCompletedGridView = null;
              }

              this.displaycurrentpages = data.pageable.pageNumber + 1;
              this.displaytotalpages = data.totalPages;
              this.totalpagescount = data.totalPages;
              this.displaytotalrecordscount = data.totalElements;
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

              this.QualityReviewCompletedGridData = data.content;
              this.QualityReviewCompletedItems = data.content;
              if (data.content != null) this.QualityReviewCompletedLoadItems();
              else this.QualityReviewCompletedGridView = null;
              this.loadingqualityreviewcompleted = false;
              this.loadingqualityreviewcompletedGrid = false;
            },
            (err) => {
              this.loadingqualityreviewcompletedGrid = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  formValueChanged(): any {
    try {
      this.subscription.add(
        this.RepName.valueChanges.subscribe(
          (data: number) => {
            if (data != null || data != undefined) {
              this.page = 0;
              this.QualityReviewCompletedSkip = 0;
              this.SelectedAgentId = data;
              this.getReviewCompletedGridDetails();
            }
          },
          (err) => {
            this.loadingqualityreviewcompletedGrid = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private QualityReviewCompletedLoadItems(): void {
    try {
      this.QualityReviewCompletedGridView = {
        data: orderBy(
          this.QualityReviewCompletedItems,
          this.QualityReviewCompletedSort
        ),
        total: this.QualityReviewCompletedItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortQualityReviewChange(sort: SortDescriptor[]): void {
    try {
      if (this.QualityReviewCompletedItems) {
        this.QualityReviewCompletedSort = sort;
        this.QualityReviewCompletedLoadItems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onClickPrevious() {
    try {
      if (this.page >= 0) {
        if (this.page == 0) {
          this.Ispreviousdisabled = true;
          return;
        } else {
          this.Ispreviousdisabled = false;
          this.page = this.page - 1;
        }
        this.getReviewCompletedGridDetails();
      }
    } catch (error) {
      this.page = this.page + 1;
      this.clsUtility.LogError(error);
    }
  }

  onClickNext() {
    try {
      if (this.page >= 0) {
        if (this.totalpagescount > 0 && this.page < this.totalpagescount - 1)
          this.page = this.page + 1;
        this.getReviewCompletedGridDetails();
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
