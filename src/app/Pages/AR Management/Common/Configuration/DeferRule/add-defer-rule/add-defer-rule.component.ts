import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { FormBuilder, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import {
  Filter,
  OutputFilter,
} from "src/app/Model/AR Management/Common/Filter/filter";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import {
  Rule,
  RuleData,
  RuleDetails,
} from "src/app/Model/AR Management/Configuration/rule";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
declare var $: any;

@Component({
  selector: "app-add-defer-rule",
  templateUrl: "./add-defer-rule.component.html",
  styleUrls: ["./add-defer-rule.component.css"],
})
export class AddDeferRuleComponent implements OnInit, OnChanges {
  public newDeferRule = true;
  public DeferRuledetail: any = [];
  public DeferRuleid: any;
  public selectedDeferRuleValue: string;
  // private clsDeferRule: DeferRule;
  private subscription = new SubSink();
  private clsUtility: Utility;
  public submitted = false;

  public ddlClientdetail: any = [];
  public ddlInsurnace: any = [];
  public ddlBillingProvider: any = [];
  public ddlRenderingProvider: any = [];
  public ddlRuleCategory: any = [];

  // Received Input from parent component
  @Input() InputDeferRuleid: any;

  // Send Output to parent component
  @Output() OutputDeferRuleEditResult = new EventEmitter<boolean>();

  OutputdeferruleResult(data: any) {
    let outDeferRuleResult = data;
    this.OutputDeferRuleEditResult.emit(outDeferRuleResult);
  }

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private filterService: FilterService,
    private ConfigurationService: ConfigurationService,
    private datatransfer: DataTransferService,
    private toastr: ToastrService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  DeferRuleGroup = this.fb.group({
    fcRuleTitle: ["", [Validators.required, Validators.maxLength(50)]],
    fcRuleDescription: ["", Validators.maxLength(250)],
    fcClientID: ["", Validators.required],
    fcInsurance: [],
    fcBillingProvider: [],
    fcRenderingProvider: [],
    fcDOSBefore: [],
    fcDOSAfter: [],
    fcRuleCategory: ["", Validators.required],
    fcRuleID: ["0", Validators.required],
    fcRuleStatus: [true],
  });

  get fbcRuleID() {
    return this.DeferRuleGroup.get("fcRuleID");
  }
  get fbcRuleTitle() {
    return this.DeferRuleGroup.get("fcRuleTitle");
  }
  get fbcRuleDescription() {
    return this.DeferRuleGroup.get("fcRuleDescription");
  }
  get fbcClientID() {
    return this.DeferRuleGroup.get("fcClientID");
  }
  get fbcInsurance() {
    return this.DeferRuleGroup.get("fcInsurance");
  }
  get fbcBillingProvider() {
    return this.DeferRuleGroup.get("fcBillingProvider");
  }
  get fbcRenderingProvider() {
    return this.DeferRuleGroup.get("fcRenderingProvider");
  }
  get fbcDOSBefore() {
    return this.DeferRuleGroup.get("fcDOSBefore");
  }
  get fbcDOSAfter() {
    return this.DeferRuleGroup.get("fcDOSAfter");
  }
  get fbcRuleCategory() {
    return this.DeferRuleGroup.get("fcRuleCategory");
  }
  get fbcRuleStatus() {
    return this.DeferRuleGroup.get("fcRuleStatus");
  }

  ngOnInit() {
    try {
      // console.log("in init");

      this.getClient("0");
      // this.getCategory();
      if (this.InputDeferRuleid != null && this.InputDeferRuleid != "") {
        this.newDeferRule = false;
        this.DeferRuleid = this.InputDeferRuleid;
        this.getDeferRuleById(this.DeferRuleid);
      } else {
        this.newDeferRule = true;
      }
      // console.log(this.InputDeferRuleid);

      // this.getClient("0");
      // this.getCategory();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnChanges() {
    try {
      // console.log("in change");

      this.getClient("0");
      // this.getCategory();
      if (this.InputDeferRuleid != null && this.InputDeferRuleid != "") {
        this.newDeferRule = false;
        this.DeferRuleid = this.InputDeferRuleid;
        this.getDeferRuleById(this.DeferRuleid);
      } else {
        this.newDeferRule = true;
      }
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  validateDeferRule() {
    try {
      if (
        this.clientcheck != undefined &&
        this.ddlClientdetail.length != 0 &&
        this.fbcRuleTitle.valid &&
        !this.clsUtility.CheckEmptyString(this.fbcRuleTitle.value) &&
        this.fbcClientID.valid &&
        this.fbcRuleDescription.valid
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // getCategory() {
  //   try {
  //     // this.ddlRuleCategory = this.ConfigurationService.getRuleCategory();
  //     this.subscription.add(
  //       this.ConfigurationService.getRuleCategory().subscribe(data => {
  //         if (data != null || data != undefined) {
  //           this.ddlRuleCategory = data;
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  clientcheck: any;
  getClient(id: string) {
    try {
      const filterinput = new Filter();
      filterinput.client = true;
      filterinput.agingbucket = false;
      filterinput.arrepresentative = false;
      filterinput.automationstatus = false;
      filterinput.billingprovider = true;
      filterinput.insurance = true;
      filterinput.renderingprovider = true;
      let AllFilterJSON = new OutputFilter();
      this.subscription.add(
        this.filterService
          .getAllFilterListByClient(JSON.stringify(filterinput), id)
          .subscribe((data) => {
            if (data != null || data != undefined) {
              AllFilterJSON = data;
              this.ddlClientdetail = AllFilterJSON.client;
              this.clientcheck = this.ddlClientdetail.find(
                (x) => x.nclientid === id
              );

              if (this.clientcheck != undefined) {
                //saurabh shelar
                this.ddlBillingProvider = AllFilterJSON.billingproviders;
                this.ddlRenderingProvider = AllFilterJSON.renderingproviders;
                this.ddlInsurnace = AllFilterJSON.insurances;
              } else {
                this.ddlBillingProvider = this.ddlRenderingProvider = this.ddlInsurnace = null;
              }

              // if(this.ddlClientdetail.length)
              // {
              // this.ddlBillingProvider = AllFilterJSON.billingproviders;
              // this.ddlRenderingProvider = AllFilterJSON.renderingproviders;
              // this.ddlInsurnace = AllFilterJSON.insurances;
              // }   //saurabh shelar
            }
          })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  selectedclient: any;
  selectedCategory: any;
  formValueChanged(): any {
    try {
      if (this.ddlClientdetail != null) {
        this.subscription.add(
          this.fbcClientID.valueChanges.subscribe((data: any) => {
            if (data !== null && data > 0) {
              //console.log("in ddl client"+this.ddlClientdetail);    //saurabh shelar

              this.getClient(String(data));
              this.selectedclient = this.ddlClientdetail.find(
                (x) => x.nclientid === data
              );
              console.log("New Log ->", this.selectedclient);
              this.fbcDOSBefore.setValue("");
              this.fbcDOSAfter.setValue("");
              this.fbcInsurance.setValue(null);
              this.fbcBillingProvider.setValue(null);
              this.fbcRenderingProvider.setValue(null);
            }
            if (this.fbcClientID.valid) {
              this.IsClientSelected = true;
            } else {
              this.IsClientSelected = false;
            }
          })
        );
      } //if condition
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getDeferRuleById(id: string) {
    try {
      // console.log(id);

      this.subscription.add(
        this.ConfigurationService.getRuleByid(id).subscribe((data) => {
          // console.log(data);

          if (data != null || data != undefined) {
            this.DeferRuledetail = data;
            if (this.InputDeferRuleid != null && this.InputDeferRuleid != "") {
              this.FillDeferRuleGroup(this.DeferRuledetail);
            }
          }
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  saveDeferRule() {
    try {
      this.submitted = true;
      if (this.validateDeferRule()) {
        // console.log(this.newDeferRule);

        // console.log(this.fbcRuleStatus.value);
        // console.log(this.fbcRuleTitle.value);
        // console.log(this.fbcRuleDescription.value);
        // console.log(this.fbcInsurance.value);
        // console.log(this.fbcBillingProvider.value);
        // console.log(this.fbcRenderingProvider.value);
        // console.log(
        //   new DatePipe("en-US").transform(this.fbcDOS.value, "yyyy-MM-dd")
        // );

        let currentDateTime = this.clsUtility.currentDateTime();
        let SelectedUserid = "0";
        let LoginUsername = null;
        if (this.datatransfer.SelectedGCPUserid != undefined)
          SelectedUserid = String(this.datatransfer.SelectedGCPUserid);

        if (this.datatransfer.loginUserName != undefined)
          LoginUsername = this.datatransfer.loginUserName;
        var ruledata = new RuleData();
        var ruledetails = new RuleDetails();
        var clsRule = new Rule();
        clsRule.nruleid = this.InputDeferRuleid;
        clsRule.nclientid = String(this.fbcClientID.value).trim();
        clsRule.sclientname = String(this.selectedclient.clientcodename).trim();
        clsRule.bstatus =
          this.fbcRuleStatus.value == null ? true : this.fbcRuleStatus.value;
        clsRule.userid = SelectedUserid;
        clsRule.susername = LoginUsername;
        clsRule.createdon = currentDateTime;
        clsRule.modifiedon = currentDateTime;

        ruledata.ruletitle = String(this.fbcRuleTitle.value).trim();
        ruledata.ruledescription = String(
          this.fbcRuleDescription.value == null
            ? ""
            : this.fbcRuleDescription.value
        ).trim();
        ruledata.rulecategory = "Defer Rule";

        ruledetails.insurance =
          this.fbcInsurance.value == null || this.fbcInsurance.value == ""
            ? "null"
            : String(this.fbcInsurance.value).trim();
        ruledetails.billingprovider =
          this.fbcBillingProvider.value == null ||
          this.fbcBillingProvider.value == ""
            ? "null"
            : String(this.fbcBillingProvider.value).trim();
        ruledetails.renderingprovider =
          this.fbcRenderingProvider.value == null ||
          this.fbcRenderingProvider.value == ""
            ? "null"
            : String(this.fbcRenderingProvider.value).trim();
        ruledetails.dosbefore =
          this.fbcDOSBefore.value == null || this.fbcDOSBefore.value == ""
            ? ""
            : String(
                new DatePipe("en-US").transform(
                  this.fbcDOSBefore.value,
                  "yyyy-MM-dd"
                )
              ).trim();
        ruledetails.dosafter =
          this.fbcDOSAfter.value == null || this.fbcDOSAfter.value == ""
            ? ""
            : String(
                new DatePipe("en-US").transform(
                  this.fbcDOSAfter.value,
                  "yyyy-MM-dd"
                )
              ).trim();

        ruledata.ruledetails = ruledetails;
        clsRule.ruledata = ruledata;
        // console.log(JSON.stringify(clsRule));

        if (this.newDeferRule) {
          this.subscription.add(
            this.ConfigurationService.saveRule(
              JSON.stringify(clsRule)
            ).subscribe((data: {}) => {
              if (data != null || data != undefined) {
                if (data == 1) {
                  this.clsUtility.showSuccess("Rule added successfully");
                  this.OutputdeferruleResult(true);
                } else if (data == 0) {
                  this.clsUtility.showError("Rule not added");
                  this.OutputdeferruleResult(false);
                } else {
                  this.clsUtility.showInfo(
                    "Rule already exist for selected client."
                  );
                }
              }
            })
          );
        } else {
          this.subscription.add(
            this.ConfigurationService.updateRule(
              this.DeferRuleid,
              JSON.stringify(clsRule)
            ).subscribe((data: {}) => {
              if (data != null || data != undefined) {
                if (data == 1) {
                  this.clsUtility.showSuccess("Rule updated successfully");
                  this.OutputdeferruleResult(true);
                } else if (data == 0) {
                  this.clsUtility.showError("Rule not updated");
                  this.OutputdeferruleResult(false);
                } else {
                  this.clsUtility.showInfo(
                    "Rule already exist for selected client."
                  );
                }
              }
            })
          );
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FillDeferRuleGroup(rule: any) {
    try {
      let objrule: object[];
      let objruledata: object[];
      let objruledetails: object[];

      objrule = rule[0];
      objruledata = rule[0].ruledata;
      objruledetails = rule[0].ruledata.ruledetails;
      var insurance =
        String(objruledetails["insurance"]) == "null"
          ? ""
          : String(objruledetails["insurance"]).split(",");
      var billingprovider =
        String(objruledetails["billingprovider"]) == "null"
          ? ""
          : String(objruledetails["billingprovider"]).split(",");
      var renderingprovider =
        String(objruledetails["renderingprovider"]) == "null"
          ? ""
          : String(objruledetails["renderingprovider"]).split(",");
      var dosBefore = objruledetails["dosbefore"];
      var dosAfter = objruledetails["dosafter"];
      // console.log(objrule);

      this.fbcRuleID.setValue(objrule["nruleid"]);
      this.fbcRuleStatus.setValue(objrule["bstatus"]);
      this.fbcClientID.setValue(objrule["nclientid"]);
      this.fbcRuleCategory.setValue(objruledata["rulecategory"]);
      this.fbcRuleTitle.setValue(objruledata["ruletitle"]);
      this.fbcRuleDescription.setValue(objruledata["ruledescription"]);
      this.fbcInsurance.setValue(insurance);
      this.fbcBillingProvider.setValue(billingprovider);
      this.fbcRenderingProvider.setValue(renderingprovider);
      if (String(dosBefore) != "") {
        this.fbcDOSBefore.setValue(new Date(dosBefore));
      } else {
        this.fbcDOSBefore.setValue("");
      }
      if (String(dosAfter) != "") {
        this.fbcDOSAfter.setValue(new Date(dosAfter));
      } else {
        this.fbcDOSAfter.setValue("");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OnClose() {
    try {
      this.OutputdeferruleResult(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  IsClientSelected = false;
  ResetComponents() {
    try {
      this.DeferRuleGroup.reset();
      this.submitted = false;
      this.InputDeferRuleid = null;
      // this.clsPayer = null;
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
