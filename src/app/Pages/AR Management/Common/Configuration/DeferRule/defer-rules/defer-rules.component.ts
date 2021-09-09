import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { SubSink } from "subsink";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { Router } from "@angular/router";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import { AddDeferRuleComponent } from "../add-defer-rule/add-defer-rule.component";
import { Rule } from "src/app/Model/AR Management/Configuration/rule";
declare var $: any;

@Component({
  selector: "app-defer-rules",
  templateUrl: "./defer-rules.component.html",
  styleUrls: ["./defer-rules.component.css"],
})
export class DeferRulesComponent implements OnInit, OnDestroy {
  public deferrulegridData: {};
  public DeferRulegridView: GridDataResult;
  private deferruleitems: any[] = [];
  public DeferRuleskip = 0;
  public DeferRulepageSize = 10;

  public editdeferruleid: string = "";
  public EditDeferRuleid: string = "";

  public InputEditMessage: string;
  public OutEditResult: boolean;
  private subscription = new SubSink();
  private clsUtility: Utility;

  @ViewChild("AddDeferRuleChild", { static: true })
  private AddDeferRuleChild: AddDeferRuleComponent;

  public DeferRulesort: SortDescriptor[] = [
    {
      field: "sclientname",
      dir: "asc",
    },
  ];

  constructor(
    private route: Router,
    private ConfigurationService: ConfigurationService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
    this.DeferRulepageSize = this.clsUtility.configPageSize;
  }

  OutputDeferRuleEditResult($event) {
    try {
      let IsSaved = $event;
      if (IsSaved == true) {
        this.getdeferruleById();
      }

      this.AddDeferRuleChild.ResetComponents();
      this.editdeferruleid = null;
      this.EditDeferRuleid = null;
      $("#adddeferruleModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnInit() {
    try {
      this.getdeferruleById();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getdeferruleById() {
    try {
      this.subscription.add(
        this.ConfigurationService.getRuleByid(0).subscribe((data) => {
          if (data != null || data != undefined) {
            this.deferrulegridData = data;
            this.deferruleitems = data;
            this.loadItemsdeferrule();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  private loadItemsdeferrule(): void {
    try {
      this.DeferRulegridView = {
        data: orderBy(
          this.deferruleitems.slice(
            this.DeferRuleskip,
            this.DeferRuleskip + this.DeferRulepageSize
          ),
          this.DeferRulesort
        ),
        total: this.deferruleitems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  sortDeferRuleChange(sort: SortDescriptor[]): void {
    try {
      if (this.deferruleitems != null) {
        this.DeferRulesort = sort;
        this.loadItemsdeferrule();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public pageChangeDeferRule(event: PageChangeEvent): void {
    try {
      this.DeferRuleskip = event.skip;
      this.loadItemsdeferrule();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  EditDeferRule({ sender, rowIndex, dataItem }) {
    try {
      this.editdeferruleid = dataItem.nruleid;

      this.InputEditMessage = "Do you want to edit inventory rule ?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updatedeferruleStatus(Ruleid, Rule) {
    try {
      this.subscription.add(
        this.ConfigurationService.updateRuleStatus(
          Ruleid,
          JSON.stringify(Rule)
        ).subscribe((data: {}) => {
          if (data != null || data != undefined) {
            if (data == 1) {
              this.clsUtility.showSuccess("Status updated successfully");
            } else {
              this.clsUtility.showError("Status not updated");
            }
            this.getdeferruleById();
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddDeferRule() {
    try {
      this.editdeferruleid = "";
      this.EditDeferRuleid = "";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputEditResult($event) {
    try {
      this.OutEditResult = $event;
      if (this.OutEditResult == true) {
        this.EditDeferRuleid = this.editdeferruleid;
        console.log(this.EditDeferRuleid);

        $("#adddeferruleModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnDeferRuleStatus(Ruleid, RuleStatus) {
    try {
      let objRule: Rule;
      objRule = new Rule();
      objRule.nruleid = Ruleid;
      objRule.bstatus = RuleStatus;
      this.updatedeferruleStatus(Ruleid, objRule);
    } catch (error) {
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
