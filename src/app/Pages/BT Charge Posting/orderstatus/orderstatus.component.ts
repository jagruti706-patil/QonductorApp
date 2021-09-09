import { filter } from "rxjs/operators";
import { clsOrder, clsCategoryOrder } from "./clsOrders";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DataBindingDirective } from "@progress/kendo-angular-grid";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import {
  GroupDescriptor,
  process,
  State,
  DataResult,
  groupBy,
  GroupResult,
} from "@progress/kendo-data-query";
import { Api } from "../../Services/BT/api";
import { Utility, enumOrderAssignSource } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { Subscription } from "rxjs";
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as moment from "moment";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { FilterService } from "../../Services/Common/filter.service";

@Component({
  selector: "app-orderstatus",
  templateUrl: "./orderstatus.component.html",
  styleUrls: ["./orderstatus.component.css"],
})
export class OrderstatusComponent implements OnInit {
  public aggregates: any[] = [
    { field: "ordercount", aggregate: "sum" },
    { field: "StatusReview.New", aggregate: "sum" },
    { field: "StatusReview.Void", aggregate: "sum" },
    { field: "StatusReview.Assigned", aggregate: "sum" },
    { field: "StatusReview.Completed", aggregate: "sum" },
    { field: "StatusReview.Assistance", aggregate: "sum" },
    { field: "StatusReview.Incomplete", aggregate: "sum" },
    { field: "StatusReview.PendingReview", aggregate: "sum" },
    { field: "StatusReview.AssignedReview", aggregate: "sum" },
    { field: "StatusReview.SendtoBiotechforPrinting", aggregate: "sum" },
    { field: "StatusReview.SubmittedandPrinted", aggregate: "sum" },
    { field: "StatusReview.FinishedandReturned", aggregate: "sum" },
    { field: "StatusReview.FailedandReturned", aggregate: "sum" },
    { field: "StatusReview.Returnedwithoutworking", aggregate: "sum" },
    { field: "StatusReview.Archived", aggregate: "sum" },
    // { field: "StatusReview.PendingforAdditionalInformation", aggregate: "sum" },
    // { field: "StatusReview.SendToBiotechAuto", aggregate: "sum" },
  ];

  public aggregates_hh: any[] = [{ field: "ActivityDATE", aggregate: "sum" }];

  //public aggregates: any[] = [{ field: 'UnitPrice', aggregate: 'sum' }, { field: 'Discontinued', aggregate: 'count' }];
  public range = { start: null, end: null };
  public range_hh = { start: null, end: null };
  minimode: boolean = true;
  expand: boolean = true;
  expand_hh: boolean = true;
  loading: boolean = false;
  alldayloading: boolean = false;
  grouploading: boolean = false;
  hourloading: boolean = false;
  dayloading: boolean = false;
  daystatusloading: boolean = false;
  loadingfolder: boolean = false;
  public listItems: Array<string> = ["One week", "Custom"];
  public hourlistItems: Array<string> = ["One week", "Custom"];
  public selectedFilter: string = "One week";
  public hourselectedFilter: string = "One week";
  public orderstatuslist: any;
  public allSelectedOrder: any = [];

  objSelectedOrders_cat = new clsCategoryOrder();
  objAllSelectedOrders_cat: clsOrder[] = [];
  public currentselectedDayorder_cat: any;
  public daymasterlist_cat: any;
  public OG_daymasterlist_cat: any;
  public daymasterlist: any;
  public Alldaymasterlist: any;
  public groupwiseorder: any;
  public hourwiseusers: any;
  public distinct_date: any;
  public distinct_hours: any;

  public chart_cateories: any;
  public chart_lines: any;
  public chart_lines_new: any;
  public chart_lines_void: any;
  public chart_lines_Assigned: any;
  public chart_lines_Completed: any;

  public groupwiseorder_count: any;
  public groupwiseorder_total_count: number = 0;
  public OG_daymasterlist: any;
  public years: any;
  public year_years: any;
  public years_group: any;
  public years_cat: any;
  objSelectedOrders = new clsOrder();
  objAllSelectedOrders: clsOrder[] = [];
  public currentselectedDayorder: any;

  clsUtility: Utility;
  private subscription = new SubSink();
  subs = new Subscription();
  _selectedfolder = [];
  _selectedfolder_cat = [];
  drake: any;
  toggleme: boolean = true;
  toggleme2: boolean = true;
  filterName: string = "";
  filterName_cat: string = "";
  searching: boolean = false;
  sortdirection: boolean = true;
  sortdirection2: boolean = true;
  frmgroup: FormGroup;
  frmgroup_cat: FormGroup;
  frmgroup_year: FormGroup;
  frmgroup_group: FormGroup;
  //selectedType: string = "value";
  selectedType: string = "percentage";
  groupbysearchbar: string = "";
  hourseachbar: string = "";
  public ClientDefaultValue = { nclientid: 0, clientcodename: "All" };

  // public min: Date = new Date(2020, 0, 1);
  // public max: Date = new Date(2020, 1, 25);

  public min: Date;
  public max: Date;
  AllClientData: any[] = [];
  clients: any[] = [];
  clients_cat: any[] = [];
  clients_year: any[] = [];
  clients_group: any[] = [];

  constructor(
    fb: FormBuilder,
    private api: Api,
    private dragulaService: DragulaService,
    private toastr: ToastrService,
    private elementRef: ElementRef,
    private ConfigurationService: ConfigurationService,
    private filterService: FilterService
  ) {
    this.clsUtility = new Utility(toastr);

    this.frmgroup = fb.group({
      fctlyear: ["", Validators.required],
      fctlclient: [0, Validators.required],
    });

    this.frmgroup_cat = fb.group({
      fctlyear_cat: ["", Validators.required],
      fctlclient_cat: [0, Validators.required],
    });

    this.frmgroup_year = fb.group({
      fctlyear_year: ["", Validators.required],
      fctlclient_year: [0, Validators.required],
    });

    this.frmgroup_group = fb.group({
      fctlyear_group: ["", Validators.required],
      //fctlyear_range: ["", Validators.required],
      displaytype: [""],
      fctlclient_group: [0, Validators.required],
    });

    const bag: any = this.dragulaService.find("first-bag");
    if (bag !== undefined) {
      this.dragulaService.destroy("first-bag");
    }
    const bag2: any = this.dragulaService.find("second-bag");
    if (bag2 !== undefined) {
      this.dragulaService.destroy("second-bag");
    }

    this.dragulaService.createGroup("first-bag", {
      // copySortSource:true,
      // revertOnSpill: true,
      invalid: (el, handle) => el.classList.contains("donotdrag"),
      moves: function (el, source, handle, sibling) {
        if (el.classList.contains("donotdrag")) {
          return false; // elements are always draggable by default
        } else {
          return true; // elements are always draggable by default
        }
      },
      copy: (el, source) => {
        return source.id === "left";
      },
      copyItem: (person: any) => {
        return person;
      },
    });

    // some events have lots of properties, just pick the ones you need
    this.subs.add(
      this.dragulaService
        .dropModel("first-bag")
        // WHOA
        // .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
        .subscribe(({ sourceModel, targetModel, item }) => {
          if (item != undefined) {
            var temp = targetModel.filter(
              (element) =>
                element.foldername.toString() === item.foldername.toString()
            );
            if (temp != undefined && temp != null) {
              if (temp.length > 1) {
                this.toastr.warning("Duplicate Selection Not Allowed");
                var index = targetModel.indexOf(item);
                targetModel.splice(index, 1);
              } else {
                this.get_DaywiseOrderStauslist(item.foldername.toString());
              }
            }
          } else {
            console.log("selected Item is undefined");
          }
        })
    );

    this.dragulaService.createGroup("second-bag", {
      invalid: (el, handle) => el.classList.contains("donotdrag"),
      moves: function (el, source, handle, sibling) {
        if (el.classList.contains("donotdrag")) {
          return false; // elements are always draggable by default
        } else {
          return true; // elements are always draggable by default
        }
      },
      copy: (el, source) => {
        return source.id === "left2";
      },
      copyItem: (person: any) => {
        return person;
      },
    });

    // some events have lots of properties, just pick the ones you need
    this.subs.add(
      this.dragulaService
        .dropModel("second-bag")
        .subscribe(({ sourceModel, targetModel, item }) => {
          if (item != undefined) {
            var temp = targetModel.filter(
              (element) =>
                element.foldername.toString() === item.foldername.toString()
            );
            if (temp != undefined && temp != null) {
              if (temp.length > 1) {
                this.toastr.warning("Duplicate Selection Not Allowed");
                var index = targetModel.indexOf(item);
                targetModel.splice(index, 1);
              } else {
                this.get_DaywiseOrderCategorylist(item.foldername.toString());
              }
            }
          } else {
            console.log("Second bag item undefined");
          }
        })
    );
  }

  ngOnInit() {
    //this.get_daylist();
    this.get_daylist_yearwise();
    this.get_daylist_yearwise_category();
    //this.get_Alldaylist();
    //this.get_DaywiseOrderCategorylist("344");
  }

  get fbctlclient() {
    return this.frmgroup.get("fctlclient");
  }
  get fbctlyear() {
    return this.frmgroup.get("fctlyear");
  }
  get fbctlclient_cat() {
    return this.frmgroup_cat.get("fctlclient_cat");
  }
  get fbctlyear_cat() {
    return this.frmgroup_cat.get("fctlyear_cat");
  }
  get fbctlyear_year() {
    return this.frmgroup_year.get("fctlyear_year");
  }
  get fbctlclient_year() {
    return this.frmgroup_year.get("fctlclient_year");
  }
  get fbctlclient_group() {
    return this.frmgroup_group.get("fctlclient_group");
  }
  get fbctlyear_group() {
    return this.frmgroup_group.get("fctlyear_group");
  }

  handleFilter(value, tab: string) {
    try {
      if (tab == "statuswise") {
        this.clients = this.AllClientData.filter(
          (s) =>
            s.clientcodename.toLowerCase().includes(value.toLowerCase()) ===
            true
        );
      } else if (tab == "categorywise") {
        this.clients_cat = this.AllClientData.filter(
          (s) =>
            s.clientcodename.toLowerCase().includes(value.toLowerCase()) ===
            true
        );
      } else if (tab == "yearwise") {
        this.clients_year = this.AllClientData.filter(
          (s) =>
            s.clientcodename.toLowerCase().includes(value.toLowerCase()) ===
            true
        );
      } else if (tab == "groupwise") {
        this.clients_group = this.AllClientData.filter(
          (s) =>
            s.clientcodename.toLowerCase().includes(value.toLowerCase()) ===
            true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  clientChange(evt: any, tab: string) {
    try {
      if (tab == "statuswise") {
        this.get_daylist_yearwise("0", evt.nclientid.toString());
        this.OG_daymasterlist = [];
        this._selectedfolder = [];
        this.objAllSelectedOrders = [];
      } else if (tab == "categorywise") {
        this.get_daylist_yearwise_category("0", evt.nclientid.toString());
        this.OG_daymasterlist_cat = [];
        this._selectedfolder_cat = [];
        this.objAllSelectedOrders_cat = [];
      } else if (tab == "yearwise") {
        this.get_daylist_yearwise(
          "0",
          evt.nclientid.toString(),
          "fromyearwise"
        );
      } else if (tab == "groupwise") {
        this.getyearlist("0", evt.nclientid.toString());
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getPercentage(no: any, total: any) {
    if (no == null || no == 0) {
      return 0;
    }
    var retno = ((Number(no) * 100) / Number(total)).toFixed(2);
    return Number(retno) == 0 ? 0 : Number(retno) == 100 ? 100 : retno;
  }

  // get_daylist() {
  //   try {
  //     this.dayloading = true;
  //     let seq = this.api.get("Document/FilterMaster");
  //     this.subscription.add(
  //       seq.subscribe(
  //         (res) => {
  //           if (res != undefined && res != null) {
  //             this.OG_daymasterlist = res["folder"];
  //             this.years = res["year"];
  //             this.OG_daymasterlist = this.OG_daymasterlist.sort(
  //               (a, b) =>
  //                 Number(b.foldername.toString().replace(/\D/g, "")) -
  //                 Number(a.foldername.toString().replace(/\D/g, ""))
  //             );
  //             this.daymasterlist = this.OG_daymasterlist;
  //             this.OG_daymasterlist_cat = res["folder"];
  //             this.OG_daymasterlist_cat = this.OG_daymasterlist_cat.sort(
  //               (a, b) =>
  //                 Number(b.foldername.toString().replace(/\D/g, "")) -
  //                 Number(a.foldername.toString().replace(/\D/g, ""))
  //             );
  //             this.daymasterlist_cat = this.OG_daymasterlist_cat;

  //             // console.log("Year");
  //             // console.log(this.years);
  //             // console.log("Current Year");
  //             if (this.years != undefined && this.years != null) {
  //               if (this.years.length > 0) {
  //                 // console.log(this.years[0]);
  //                 // console.log(this.years[0].year);
  //                 var currentYear = new Date().getFullYear().toString();
  //                 // console.log(new Date().getFullYear());

  //                 var temp = this.years.filter(
  //                   (element) => element.year.toString() === currentYear
  //                 );
  //                 if (temp != undefined && temp != null) {
  //                   // console.log("temp");
  //                   // console.log(temp);
  //                   if (temp.length > 0) {
  //                     this.frmgroup.controls["fctlyear"].setValue(currentYear);
  //                   } else {
  //                     this.frmgroup.controls["fctlyear"].setValue(
  //                       this.years[0].year
  //                     );
  //                   }
  //                 } else {
  //                   this.frmgroup.controls["fctlyear"].setValue(
  //                     this.years[0].year
  //                   );
  //                 }
  //               }
  //             }

  //             // get default day data
  //             // this.get_DaywiseOrderStauslist(350);
  //             // let folder : { foldername: string } = {foldername :'350'};
  //             //  this._selectedfolder.push(folder);
  //             //  console.log('this._selectedfolder 0');
  //             //  console.log(this._selectedfolder);
  //           }
  //           this.dayloading = false;
  //         },
  //         (err) => {
  //           this.dayloading = false;
  //           this.clsUtility.LogError(err);
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     this.dayloading = false;
  //     this.clsUtility.LogError(error);
  //   }
  // }

  get_daylist_yearwise(
    stryear: string = "0",
    clientid: string = "0",
    clientChangeFrom: string = ""
  ) {
    try {
      this.dayloading = true;
      let seq: any;
      // if (stryear == "") {
      //   seq = this.api.get("Document/FilterMaster");
      // } else {
      //   seq = this.api.get("Document/FilterMaster/" + stryear + "");
      // }
      // seq = this.api.get("Document/FilterMaster/" + stryear + "/" + clientid);
      seq = this.filterService.getFolderCategoryAndYear(stryear, 0, clientid);

      if (seq != undefined && seq != null) {
        this.subscription.add(
          seq.subscribe(
            (res) => {
              this.dayloading = false;
              if (res != undefined && res != null) {
                if (clientChangeFrom == "fromyearwise") {
                  this.clients_year = res["client"];
                  if (this.clients_year == null) {
                    this.fbctlclient_year.setValue(0);
                  } else {
                    if (this.clients_year.length == 1) {
                      this.fbctlclient_year.setValue(
                        this.clients_year[0].nclientid
                      );
                    }
                  }
                  this.year_years = res["year"];
                  if (this.year_years == null) {
                    this.fbctlyear_year.reset();
                    this.fbctlyear_year.setValue("");
                  }

                  if (this.year_years != undefined && this.year_years != null) {
                    if (this.year_years.length > 0) {
                      var temp = this.year_years.filter(
                        (element) => element.isdefault.toString() === "true"
                      );
                      if (temp != undefined && temp != null) {
                        if (temp.length > 0) {
                          this.frmgroup_year.controls["fctlyear_year"].setValue(
                            temp[0].year
                          );
                        } else {
                          this.frmgroup_year.controls["fctlyear_year"].setValue(
                            this.year_years[0].year
                          );
                        }
                      } else {
                        this.frmgroup_year.controls["fctlyear_year"].setValue(
                          this.year_years[0].year
                        );
                      }
                    }
                  }
                  if (stryear == "0" && clientid == "0") {
                    this.yearwiseApply();
                  }
                  return;
                }
                if (res["folder"] != null && res["folder"] != undefined) {
                  this.OG_daymasterlist = res["folder"];
                } else {
                  this.OG_daymasterlist = [];
                  this._selectedfolder = [];
                  this.objAllSelectedOrders = [];
                }
                if (stryear == "0") {
                  this.AllClientData = res["client"];
                  this.clients = res["client"];
                  this.years = res["year"];
                }
                if (this.years == null) {
                  this.fbctlyear.reset();
                  this.fbctlyear.setValue("");
                }
                if (this.clients == null) {
                  this.fbctlclient.setValue(0);
                } else {
                  if (this.clients.length == 1) {
                    this.fbctlclient.setValue(this.clients[0].nclientid);
                  }
                }
                var re = /THMissing_\d+$/g;
                this.OG_daymasterlist = this.OG_daymasterlist.sort(
                  (a, b) =>
                    Number(
                      b.foldername.toString().replace(re, "").replace(/\D/g, "")
                    ) -
                    Number(
                      a.foldername.toString().replace(re, "").replace(/\D/g, "")
                    )
                );
                this.daymasterlist = this.OG_daymasterlist;

                // if (stryear == "") {
                //   if (this.years != undefined && this.years != null) {
                //     if (this.years.length > 0) {
                //       this.frmgroup.controls['fctlyear'].setValue(this.years[1].year);
                //     }
                //   }
                // }

                if (stryear == "0") {
                  if (this.years != undefined && this.years != null) {
                    if (this.years.length > 0) {
                      var temp = this.years.filter(
                        (element) => element.isdefault.toString() === "true"
                      );
                      if (temp != undefined && temp != null) {
                        if (temp.length > 0) {
                          this.frmgroup.controls["fctlyear"].setValue(
                            temp[0].year
                          );
                          this.frmgroup_year.controls["fctlyear_year"].setValue(
                            temp[0].year
                          );
                        } else {
                          this.frmgroup.controls["fctlyear"].setValue(
                            this.years[0].year
                          );
                          this.frmgroup_year.controls["fctlyear_year"].setValue(
                            this.years[0].year
                          );
                        }
                      } else {
                        this.frmgroup.controls["fctlyear"].setValue(
                          this.years[0].year
                        );
                        this.frmgroup_year.controls["fctlyear_year"].setValue(
                          this.years[0].year
                        );
                      }
                    }
                  }
                }

                // if (this.years != undefined && this.years != null) {
                //   if (this.years.length > 0) {
                //     var currentYear = (new Date()).getFullYear().toString();
                //     var temp = this.years.filter(element => element.year.toString() === currentYear);
                //     if (temp != undefined && temp != null) {
                //       if (temp.length > 0) {
                //         this.frmgroup.controls['fctlyear'].setValue(currentYear);
                //       }
                //       else {
                //         this.frmgroup.controls['fctlyear'].setValue(this.years[0].year);
                //       }
                //     }
                //     else {
                //       this.frmgroup.controls['fctlyear'].setValue(this.years[0].year);
                //     }
                //   }
                // }
              }
              this.dayloading = false;
            },
            (err) => {
              this.dayloading = false;
              this.clsUtility.LogError(err);
            }
          )
        );
      }
    } catch (error) {
      this.dayloading = false;
      this.clsUtility.LogError(error);
    }
  }

  get_daylist_yearwise_category(stryear: string = "0", clientid: string = "0") {
    try {
      this.dayloading = true;
      let seq: any;
      // if (stryear == "") {
      //   seq = this.api.get("Document/FilterMaster");
      // } else {
      //   seq = this.api.get("Document/FilterMaster/" + stryear + "");
      // }
      // seq = this.api.get("Document/FilterMaster/" + stryear + "/" + clientid);
      seq = this.filterService.getFolderCategoryAndYear(stryear, 0, clientid);
      if (seq != undefined && seq != null) {
        this.subscription.add(
          seq.subscribe(
            (res) => {
              if (res != undefined && res != null) {
                if (res["folder"] != null && res["folder"] != undefined) {
                  this.OG_daymasterlist_cat = res["folder"];
                } else {
                  this.OG_daymasterlist_cat = [];
                  this._selectedfolder_cat = [];
                  this.objAllSelectedOrders_cat = [];
                }

                if (stryear == "0") {
                  this.AllClientData = res["client"];
                  this.clients_cat = res["client"];
                  this.years_cat = res["year"];
                }
                if (this.years_cat == null) {
                  this.fbctlyear_cat.reset();
                  this.fbctlyear_cat.setValue("");
                }
                if (this.clients_cat == null) {
                  this.fbctlclient_cat.setValue(0);
                } else {
                  if (this.clients_cat.length == 1) {
                    this.fbctlclient_cat.setValue(
                      this.clients_cat[0].nclientid
                    );
                  }
                }
                // console.log("this.years_cat");
                // console.log(this.years_cat);
                var re = /THMissing_\d+$/g;
                this.OG_daymasterlist_cat = this.OG_daymasterlist_cat.sort(
                  (a, b) =>
                    Number(
                      b.foldername.toString().replace(re, "").replace(/\D/g, "")
                    ) -
                    Number(
                      a.foldername.toString().replace(re, "").replace(/\D/g, "")
                    )
                );
                this.daymasterlist_cat = this.OG_daymasterlist_cat;

                if (stryear == "0") {
                  if (this.years_cat != undefined && this.years_cat != null) {
                    if (this.years_cat.length > 0) {
                      // this.frmgroup_cat.controls['fctlyear_cat'].setValue(this.years_cat[1].year);
                      //// Logic To set Default Year
                      var temp = this.years_cat.filter(
                        (element) => element.isdefault.toString() === "true"
                      );
                      if (temp != undefined && temp != null) {
                        if (temp.length > 0) {
                          this.frmgroup_cat.controls["fctlyear_cat"].setValue(
                            temp[0].year
                          );
                        } else {
                          this.frmgroup_cat.controls["fctlyear_cat"].setValue(
                            this.years_cat[0].year
                          );
                        }
                      } else {
                        this.frmgroup_cat.controls["fctlyear_cat"].setValue(
                          this.years_cat[0].year
                        );
                      }
                    }
                  }
                }

                // if (this.years_cat != undefined && this.years_cat != null) {
                //   if (this.years_cat.length > 0) {

                //     var currentYear = (new Date()).getFullYear().toString();
                //     var temp = this.years_cat.filter(element => element.year.toString() === currentYear);

                //     if (temp != undefined && temp != null) {
                //       if (temp.length > 0) {
                //         this.frmgroup_cat.controls['fctlyear_cat'].setValue(currentYear);
                //       }
                //       else {
                //         this.frmgroup_cat.controls['fctlyear_cat'].setValue(this.years_cat[0].year);
                //       }
                //     }
                //     else {
                //       this.frmgroup_cat.controls['fctlyear_cat'].setValue(this.years_cat[0].year);
                //     }
                //   }
                // }
              }
              this.dayloading = false;
            },
            (err) => {
              this.dayloading = false;
              this.clsUtility.LogError(err);
            }
          )
        );
      }
    } catch (error) {
      this.dayloading = false;
      this.clsUtility.LogError(error);
    }
  }

  // get_Alldaylist() {
  //   try {
  //     this.alldayloading = true;
  //     let seq = this.api.get("Document/OrderInventoryStatusCount/0");
  //     this.subscription.add(
  //       seq.subscribe(
  //         res => {
  //           if (res != undefined && res != null) {
  //             this.Alldaymasterlist = res;
  //           }
  //           this.alldayloading = false;
  //         },
  //         err => {
  //           this.alldayloading = false;
  //           this.clsUtility.LogError(err);
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     this.alldayloading = false;
  //     this.clsUtility.LogError(error);
  //   }
  // }

  get_Alldaylist_yearwise(stryear: string = "0", clientid: string = "0") {
    try {
      this.alldayloading = true;
      let seq = this.api.get(
        "Document/OrderInventoryStatusCount/" + stryear + "/" + clientid
      );
      this.subscription.add(
        seq.subscribe(
          (res) => {
            if (res != undefined && res != null) {
              this.Alldaymasterlist = res;
            }
            this.alldayloading = false;
          },
          (err) => {
            this.alldayloading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.alldayloading = false;
      this.clsUtility.LogError(error);
    }
  }

  //day name, multiple can be retrived by comma seperated
  get_DaywiseOrderStauslist(day) {
    try {
      // console.log("fctlyear - " + this.frmgroup.controls.fctlyear.value);
      if (
        this.frmgroup.controls.fctlyear.value != "" &&
        this.frmgroup.controls.fctlyear.value != null
      ) {
        this.daystatusloading = true;
        //let seq = this.api.get("Document/OrderInventoryDayDetails?days=" + day + "");
        let seq = this.api.get(
          "Document/OrderInventoryDayDetails?days=" +
            day +
            "&year=" +
            this.frmgroup.controls.fctlyear.value +
            "&clientid=" +
            this.fbctlclient.value
        );
        this.subscription.add(
          seq.subscribe(
            (res) => {
              if (res != undefined && res != null) {
                this.currentselectedDayorder = res;
                this.objSelectedOrders = new clsOrder();
                this.objSelectedOrders.folder_name = day;
                this.objSelectedOrders.folder_data = this.currentselectedDayorder;
                this.objAllSelectedOrders.push(this.objSelectedOrders);
              }
              this.daystatusloading = false;
            },
            (err) => {
              this.daystatusloading = false;
              this.clsUtility.LogError(err);
            }
          )
        );
      } else {
        this.toastr.warning("Please Select Year");
      }
    } catch (error) {
      this.daystatusloading = false;
      this.clsUtility.LogError(error);
    }
  }

  valueChange(event) {
    try {
      // console.log("valueChange");
      // console.log(event);
      this.filterName = "";
      // console.log(this.frmgroup.controls.fctlyear.value);
      //this.get_daylist_yearwise(this.frmgroup.controls.fctlyear.value)
      if (event) {
        this.get_daylist_yearwise(
          event.toString(), //changed value
          this.fbctlclient.value.toString()
        );
      }
      this._selectedfolder = [];
      this.objAllSelectedOrders = [];
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  valueChange_cat(event) {
    try {
      // console.log("valueChange cat");
      // console.log(event);
      this.filterName_cat = "";
      if (event) {
        this.get_daylist_yearwise_category(
          event.toString(),
          this.fbctlclient_cat.value
        );
      }
      // console.log(this.frmgroup_cat.controls.fctlyear_cat.value);
      this._selectedfolder_cat = [];
      this.objAllSelectedOrders_cat = [];
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // valueChange_year(event) {
  //   try {

  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  yearwiseApply() {
    try {
      this.get_Alldaylist_yearwise(
        this.fbctlyear_year.value ? this.fbctlyear_year.value.toString() : "0",
        this.fbctlclient_year.value.toString()
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  valueChange_year_group(event) {
    try {
      this.min = new Date(
        Number(this.frmgroup_group.controls.fctlyear_group.value),
        0,
        1
      );
      this.max = new Date(
        Number(this.frmgroup_group.controls.fctlyear_group.value),
        11,
        31
      );
      this.selectedFilter = "One week";
      this.range = { start: null, end: null };

      this.getGroupwiseorders(
        this.frmgroup_group.controls.fctlyear_group.value.toString()
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  valueChange_dd(value: any): void {
    if (this.selectedFilter == "Custom") {
      this.range = { start: null, end: null };
    } else if (this.selectedFilter == "One week") {
      this.range = { start: null, end: null };
      this.getGroupwiseorders(
        this.frmgroup_group.controls.fctlyear_group.value.toString()
      );
    }
  }

  valueChange_hh(value: any): void {
    if (this.hourselectedFilter == "Custom") {
      this.range_hh = { start: null, end: null };
    } else if (this.hourselectedFilter == "One week") {
      this.range_hh = { start: null, end: null };
      this.gethourlyusercount();
    }
  }

  selectionChange_dd(value: any): void {}

  applycustomrange() {
    // public min: Date = new Date(
    //   new DatePipe("en-US").transform(new Date(), "MM/dd/yyyy")
    // );
    // new date(moment().toDate())

    // moment(this.range.start).format('YYYY-MM-DD');

    this.getGroupwiseorders(
      this.frmgroup_group.controls.fctlyear_group.value.toString(),
      moment(new Date(this.range.start)).format("YYYY/MM/DD"),
      moment(new Date(this.range.end)).format("YYYY/MM/DD")
    );
  }

  applycustomrange_hh() {
    this.gethourlyusercount(
      moment(new Date(this.range_hh.start)).format("YYYY-MM-DD"),
      moment(new Date(this.range_hh.end)).format("YYYY-MM-DD")
    );
  }

  // selectionChange(event)
  // {
  //   console.log('selectionChange');
  //   console.log(event);
  //   console.log(this.frmgroup.controls.fctlyear.value);
  // }

  get_DaywiseOrderCategorylist(day) {
    try {
      if (
        this.frmgroup_cat.controls.fctlyear_cat.value != "" &&
        this.frmgroup_cat.controls.fctlyear_cat.value != null
      ) {
        this.loading = true;
        let seq = this.api.get(
          "Document/OrderInventoryCategoryDayDetails?days=" +
            day +
            "&year=" +
            this.frmgroup_cat.controls.fctlyear_cat.value +
            "&clientid=" +
            this.fbctlclient_cat.value
        );
        this.subscription.add(
          seq.subscribe(
            (res) => {
              if (res != undefined && res != null) {
                this.currentselectedDayorder = res;
                this.objSelectedOrders_cat = new clsCategoryOrder();
                this.objSelectedOrders_cat.folder_name = day;
                const distinctThings = this.currentselectedDayorder.filter(
                  (thing, i, arr) =>
                    arr.findIndex((t) => t.category === thing.category) === i
                );
                var result = [];
                this.currentselectedDayorder.reduce(function (res, value) {
                  if (!res[value.status]) {
                    res[value.status] = {
                      status: value.status,
                      ordercount: 0,
                      totalcount: value.totalcount,
                    };
                    result.push(res[value.status]);
                  }
                  res[value.status].ordercount += value.ordercount;
                  res[value.status].totalcount = value.totalcount;
                  return res;
                }, {});

                result.forEach(
                  (item) =>
                    (item.percentage =
                      Number(
                        (Number(item["ordercount"]) * 100) /
                          Number(item["totalcount"])
                      ) == 0
                        ? 0
                        : Number(
                            (Number(item["ordercount"]) * 100) /
                              Number(item["totalcount"])
                          ) == 100
                        ? 100
                        : Number(
                            (Number(item["ordercount"]) * 100) /
                              Number(item["totalcount"])
                          ).toFixed(2))
                );
                // var arrCategory =  Array.from(new Set(this.currentselectedDayorder.map((item: any) => item.category)));

                this.objSelectedOrders_cat.categorylist = distinctThings.sort(
                  (obj1, obj2) => {
                    if (obj1.category > obj2.category) {
                      return 1;
                    }
                    if (obj1.category < obj2.category) {
                      return -1;
                    }
                    return 0;
                  }
                );
                // var arrStaus =Array.from(new Set(this.currentselectedDayorder.map((item: any) => item.status)));
                // this.objSelectedOrders_cat.Statuslist = arrStaus.sort();
                this.objSelectedOrders_cat.Statuslist = result;
                // .sort(
                //   (obj1, obj2) => {
                //     if (obj1.status > obj2.status) {
                //       return 1;
                //     }
                //     if (obj1.status < obj2.status) {
                //       return -1;
                //     }
                //     return 0;
                //   }
                // );

                this.objSelectedOrders_cat.folder_data = this.currentselectedDayorder.sort(
                  (obj1, obj2) => {
                    if (obj1.status > obj2.status) {
                      return 1;
                    }
                    if (obj1.status < obj2.status) {
                      return -1;
                    }
                    return 0;
                  }
                );
                this.objAllSelectedOrders_cat.push(this.objSelectedOrders_cat);
              }
              this.loading = false;
            },
            (err) => {
              this.loading = false;
              this.clsUtility.LogError(err);
            }
          )
        );
      } else {
        this.toastr.warning("Please Select Year");
      }
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  reloadselecteddays() {
    try {
      if (this._selectedfolder != undefined && this._selectedfolder != null) {
        if (this._selectedfolder.length > 0) {
          this.objAllSelectedOrders = [];
          for (let i = 0; i < this._selectedfolder.length; i++) {
            const element = this._selectedfolder[i].foldername;
            this.get_DaywiseOrderStauslist(element);
          }
        }
      }
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  reloadselecteddays_cat() {
    try {
      if (
        this._selectedfolder_cat != undefined &&
        this._selectedfolder_cat != null
      ) {
        if (this._selectedfolder_cat.length > 0) {
          this.objAllSelectedOrders_cat = [];
          for (let i = 0; i < this._selectedfolder_cat.length; i++) {
            const element = this._selectedfolder_cat[i].foldername;
            this.get_DaywiseOrderCategorylist(element);
          }
        }
      }
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  statusdoubleclick(item: any) {
    try {
      if (this._selectedfolder != undefined && this._selectedfolder != null) {
        if (this._selectedfolder.length > 0) {
          var temp = this._selectedfolder.filter(
            (element) =>
              element.foldername.toString() === item.foldername.toString()
          );
          if (temp != undefined && temp != null) {
            if (temp.length >= 1) {
              this.toastr.warning("Duplicate Selection Not Allowed");
            } else {
              this._selectedfolder.push(item);
              this.get_DaywiseOrderStauslist(item.foldername.toString());
            }
          }
        } else {
          this._selectedfolder.push(item);
          this.get_DaywiseOrderStauslist(item.foldername.toString());
        }
      }
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  statusdoubleclick_cat(item: any) {
    try {
      if (
        this._selectedfolder_cat != undefined &&
        this._selectedfolder_cat != null
      ) {
        if (this._selectedfolder_cat.length > 0) {
          var temp = this._selectedfolder_cat.filter(
            (element) =>
              element.foldername.toString() === item.foldername.toString()
          );
          if (temp != undefined && temp != null) {
            if (temp.length >= 1) {
              this.toastr.warning("Duplicate Selection Not Allowed");
            } else {
              this._selectedfolder_cat.push(item);
              this.get_DaywiseOrderCategorylist(item.foldername.toString());
            }
          }
        } else {
          this._selectedfolder_cat.push(item);
          this.get_DaywiseOrderCategorylist(item.foldername.toString());
        }
      }
    } catch (error) {
      this.loading = false;
      this.clsUtility.LogError(error);
    }
  }

  filteritem(stringval: string) {
    if (this.OG_daymasterlist != undefined && this.OG_daymasterlist != null) {
      if (this.OG_daymasterlist.length > 0) {
        this.daymasterlist = this.OG_daymasterlist.filter(
          (s) =>
            s.foldername
              .toLowerCase()
              .indexOf(this.filterName.toLowerCase()) !== -1
        );
      }
    }
  }

  filteritem2(stringval: string) {
    if (
      this.OG_daymasterlist_cat != undefined &&
      this.OG_daymasterlist_cat != null
    ) {
      if (this.OG_daymasterlist_cat.length > 0) {
        this.daymasterlist_cat = this.OG_daymasterlist_cat.filter(
          (s) =>
            s.foldername
              .toLowerCase()
              .indexOf(this.filterName_cat.toLowerCase()) !== -1
        );
      }
    }
  }

  clear() {
    this.searching = false;
    this.filterName = "";
    this.daymasterlist = this.OG_daymasterlist;
  }

  clear2() {
    this.searching = false;
    this.filterName_cat = "";
    this.daymasterlist_cat = this.OG_daymasterlist_cat;
  }

  sortfiles() {
    if (this.OG_daymasterlist != null && this.OG_daymasterlist != undefined) {
      if (this.OG_daymasterlist.length > 0) {
        var re = /THMissing_\d+$/g;
        if (this.sortdirection) {
          this.OG_daymasterlist = this.OG_daymasterlist.sort(
            (a, b) =>
              Number(
                b.foldername.toString().replace(re, "").replace(/\D/g, "")
              ) -
              Number(a.foldername.toString().replace(re, "").replace(/\D/g, ""))
          );
          this.daymasterlist = this.OG_daymasterlist;
        } else {
          this.OG_daymasterlist = this.OG_daymasterlist.sort(
            (a, b) =>
              Number(
                a.foldername.toString().replace(re, "").replace(/\D/g, "")
              ) -
              Number(b.foldername.toString().replace(re, "").replace(/\D/g, ""))
          );
          this.daymasterlist = this.OG_daymasterlist;
        }
      }
    }
  }

  sortfiles2() {
    if (
      this.OG_daymasterlist_cat != null &&
      this.OG_daymasterlist_cat != undefined
    ) {
      if (this.OG_daymasterlist_cat.length > 0) {
        var re = /THMissing_\d+$/g;
        if (this.sortdirection2) {
          this.OG_daymasterlist_cat = this.OG_daymasterlist_cat.sort(
            (a, b) =>
              Number(
                b.foldername.toString().replace(re, "").replace(/\D/g, "")
              ) -
              Number(a.foldername.toString().replace(re, "").replace(/\D/g, ""))
          );
          this.daymasterlist_cat = this.OG_daymasterlist_cat;
        } else {
          this.OG_daymasterlist_cat = this.OG_daymasterlist_cat.sort(
            (a, b) =>
              Number(
                a.foldername.toString().replace(re, "").replace(/\D/g, "")
              ) -
              Number(b.foldername.toString().replace(re, "").replace(/\D/g, ""))
          );
          this.daymasterlist_cat = this.OG_daymasterlist_cat;
        }
      }
    }
  }

  removeSelected(item) {
    if (this._selectedfolder != undefined && this._selectedfolder != null) {
      if (this._selectedfolder.length > 0) {
        var index = this._selectedfolder.indexOf(item);
        this._selectedfolder.splice(index, 1);
      }
    }

    if (
      this.objAllSelectedOrders != undefined &&
      this.objAllSelectedOrders != null
    ) {
      if (this.objAllSelectedOrders.length > 0) {
        var index2 = this.objAllSelectedOrders.findIndex(
          (s) => s.folder_name === item.foldername
        );
        this.objAllSelectedOrders.splice(index2, 1);
      }
    }
  }

  removeSelected2(item) {
    if (
      this._selectedfolder_cat != undefined &&
      this._selectedfolder_cat != null
    ) {
      if (this._selectedfolder_cat.length > 0) {
        var index = this._selectedfolder_cat.indexOf(item);
        this._selectedfolder_cat.splice(index, 1);
      }
    }

    if (
      this.objAllSelectedOrders_cat != undefined &&
      this.objAllSelectedOrders_cat != null
    ) {
      if (this.objAllSelectedOrders_cat.length > 0) {
        var index2 = this.objAllSelectedOrders_cat.findIndex(
          (s) => s.folder_name === item.foldername
        );
        this.objAllSelectedOrders_cat.splice(index2, 1);
      }
    }
  }

  public onTabSelect(e) {
    //console.log(e);
    if (e != undefined && e != null) {
      if (e.title != undefined) {
        if (
          e.title.toString().trim().toLowerCase() == "year wise encounter view"
        ) {
          // this.get_Alldaylist_yearwise();
          this.get_daylist_yearwise("0", "0", "fromyearwise");
        } else if (
          e.title.toString().trim().toLowerCase() == "group wise encounter view"
        ) {
          this.expand = true;
          this.selectedFilter = "One week";
          //this.frmgroup_group.controls["fctlyear_range"].setValue(this.listItems[0]);
          this.getyearlist();
        } else if (
          e.title.toString().trim().toLowerCase() == "hourly user count"
        ) {
          this.expand_hh = true;
          this.hourselectedFilter = "One week";
          this.gethourlyusercount();
        }
      }
    }
  }

  public groups: GroupDescriptor[] = [
    { field: "Group", aggregates: this.aggregates },
  ];
  public groups_hh: GroupDescriptor[] = [
    { field: "ActivityDATE", aggregates: this.aggregates_hh },
  ];
  //public gridView: DataResult;
  public gridView;
  public hourgridView;

  public gridData: DataResult;

  // public state: State = {
  //   skip: 0,
  //   take: 100,
  //   group: [{ field: 'Group', aggregates: this.aggregates }]
  // };

  public state: State = {
    skip: 0,
    take: 500000,
    group: [{ field: "Group", aggregates: this.aggregates }],
  };

  public state_hh: State = {
    skip: 0,
    take: 500000,
    group: [{ field: "ActivityDATE", aggregates: this.aggregates_hh }],
  };

  //public gridData: any = process(this.data, this.state);

  public groupChange(groups: GroupDescriptor[]): void {
    //alert('Group Change');
    this.groupbysearchbar = "";
    this.groups = groups;
    //this.getGroupwiseorders();
    if (this.selectedFilter == "Custom") {
      if (this.range.start != null && this.range.end != null) {
        this.getGroupwiseorders(
          this.frmgroup_group.controls.fctlyear_group.value.toString(),
          moment(new Date(this.range.start)).format("YYYY/MM/DD"),
          moment(new Date(this.range.end)).format("YYYY/MM/DD")
        );
      } else {
      }
    } else if (this.selectedFilter == "One week") {
      this.getGroupwiseorders(
        this.frmgroup_group.controls.fctlyear_group.value.toString()
      );
    }
  }

  public groupChange_hh(groups: GroupDescriptor[]): void {
    this.hourseachbar = "";
    this.groups_hh = groups;
    // if (this.selectedFilter == "Custom") {
    //   if (this.range_hh.start != null && this.range_hh.end != null) {
    //     this.gethourlyusercount(moment(new Date(this.range_hh.start)).format('YYYY-MM-DD'), moment(new Date(this.range_hh.end)).format('YYYY-MM-DD'));
    //   }
    //   else {
    //   }
    // }
    // else if (this.selectedFilter == "One week") {
    //   this.gethourlyusercount();
    // }
  }

  getyearlist(stryear: string = "0", clientid: string = "0") {
    try {
      let seq: any;
      // seq = this.api.get("Document/FilterMaster/" + stryear + "/" + clientid);
      seq = this.filterService.getFolderCategoryAndYear(stryear, 0, clientid);
      if (seq != undefined && seq != null) {
        this.subscription.add(
          seq.subscribe(
            (res) => {
              if (res != undefined && res != null) {
                if (stryear == "0") {
                  this.years_group = res["year"];
                  this.clients_group = res["client"];
                  if (this.years_group == null) {
                    this.fbctlyear_group.reset();
                    this.fbctlyear_group.setValue("");
                  }
                  if (this.clients_group == null) {
                    this.fbctlclient_group.setValue(0);
                  } else {
                    if (this.clients_group.length == 1) {
                      this.fbctlclient_group.setValue(
                        this.clients_group[0].nclientid
                      );
                    }
                  }
                  if (
                    this.years_group != null &&
                    this.years_group != undefined
                  ) {
                    var temp = this.years_group.filter(
                      (element) => element.isdefault.toString() === "true"
                    );
                    if (temp != undefined && temp != null) {
                      if (temp.length > 0) {
                        this.frmgroup_group.controls["fctlyear_group"].setValue(
                          temp[0].year
                        );
                        this.min = new Date(
                          Number(
                            this.frmgroup_group.controls.fctlyear_group.value
                          ),
                          0,
                          1
                        );
                        this.max = new Date(
                          Number(
                            this.frmgroup_group.controls.fctlyear_group.value
                          ),
                          11,
                          31
                        );
                      } else {
                        this.frmgroup_group.controls["fctlyear_group"].setValue(
                          this.years_group[0].year
                        );
                        this.min = new Date(
                          Number(
                            this.frmgroup_group.controls.fctlyear_group.value
                          ),
                          0,
                          1
                        );
                        this.max = new Date(
                          Number(
                            this.frmgroup_group.controls.fctlyear_group.value
                          ),
                          11,
                          31
                        );
                      }
                    } else {
                      this.frmgroup_group.controls["fctlyear_group"].setValue(
                        this.years_group[0].year
                      );
                      this.min = new Date(
                        Number(
                          this.frmgroup_group.controls.fctlyear_group.value
                        ),
                        0,
                        1
                      );
                      this.max = new Date(
                        Number(
                          this.frmgroup_group.controls.fctlyear_group.value
                        ),
                        11,
                        31
                      );
                    }
                  }
                }
                this.getGroupwiseorders(
                  this.fbctlyear_group.value
                    ? this.fbctlyear_group.value.toString()
                    : "0"
                );
              }
            },
            (err) => {
              this.clsUtility.LogError(err);
            }
          )
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  public categoryAxis: any = {
    max: new Date(2000, 1, 0),
    maxDivisions: 10,
  };

  getGroupwiseorders(
    stryear: string = "0",
    fromdt: string = "",
    todt: string = ""
  ) {
    try {
      this.grouploading = true;
      let seq;
      if (fromdt == "" && todt == "") {
        seq = this.api.get(
          "Document/OrderInventoryFolderWiseDetails?year=" +
            stryear +
            "&clientid=" +
            this.fbctlclient_group.value
        );
      } else {
        seq = this.api.get(
          "Document/OrderInventoryFolderWiseDetails?year=" +
            stryear +
            "&fromDate=" +
            fromdt +
            "&toDate=" +
            todt +
            "&clientid=" +
            this.fbctlclient_group.value
        );
      }

      this.subscription.add(
        seq.subscribe(
          (res) => {
            if (res != undefined && res != null) {
              // if(res['result'] != null && res['total'] != null)
              // {
              this.groupwiseorder = res["result"];
              this.groupwiseorder_count = res["total"];
              if (
                this.groupwiseorder != null &&
                this.groupwiseorder.length > 0
              ) {
                this.groupwiseorder_total_count = Number(
                  this.groupwiseorder[0].totalcount
                );

                //this.groupwiseorder.forEach(item => item.Group = item['foldername'].toString().replace(/\D/g, ""));
                this.groupwiseorder.forEach(
                  (item) =>
                    (item.Group =
                      item["foldername"].toString().includes("THMissing") ==
                      true
                        ? "THMissing".replace(/\D/g, "")
                        : item["foldername"].toString().replace(/\D/g, ""))
                );
                this.chart_cateories = this.groupwiseorder.map(
                  (x) => x.foldername
                );
                this.gridView = process(this.groupwiseorder, this.state);
              } else {
                this.groupwiseorder_total_count = 0;
                this.chart_cateories = null;
                this.gridView = null;
              }

              // this.chart_lines = this.groupwiseorder.map(x => x.StatusReview);
              // this.chart_lines_new = this.chart_lines.map(x => x['New']);
              // this.chart_lines_void = this.chart_lines.map(x => x['Void']);
              // this.chart_lines_Assigned = this.chart_lines.map(x => x['Assigned']);
              // this.chart_lines_Completed = this.chart_lines.map(x => x['Completed']);

              // }
              // else
              // {
              //   this.groupwiseorder = null;
              //   this.groupwiseorder_count = null;
              //   this.groupwiseorder_total_count  = 0;
              // }
            }
            this.grouploading = false;
          },
          (err) => {
            this.grouploading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.grouploading = false;
      this.clsUtility.LogError(error);
    }
  }

  startDate;
  endDate;
  public searchstr: string = "";
  public logNames = [];

  public model3 = [];
  public model4 = [];
  public model5 = [];
  public model6 = [];
  public model7 = [];
  public model9 = [];
  public myseries = [];

  gethourlyusercount(fromdt: string = "", todt: string = "") {
    try {
      let obj = new auditLog();
      // obj.startDate = moment(new Date(this.range_hh.start)).format('YYYY-MM-DD');// "2019-11-13T07:19:07.482Z";
      // obj.endDate = moment(new Date(this.range_hh.end)).format('YYYY-MM-DD');// "2019-11-14T07:19:07.482Z";
      //obj.sortorder = "desc";
      obj.sortorder = "";
      obj.search = this.searchstr;
      this.logNames = ["Qonductor"];
      obj.logName = this.logNames;

      this.hourloading = true;
      //  let  seq = this.api.audit_post("audit/auditanalysis/hourlyusers", obj);
      this.model3 = [];
      this.model4 = [];
      this.model5 = [];
      this.model6 = [];
      this.model7 = [];
      this.model9 = [];
      this.myseries = [];

      var startdate = moment().subtract(7, "days").format("YYYY-MM-DD");
      var enddate = moment().format("YYYY-MM-DD");
      let seq;
      if (fromdt == "" && todt == "") {
        obj.startDate = startdate;
        obj.endDate = enddate;
      } else {
        obj.startDate = fromdt;
        obj.endDate = todt;
      }
      seq = this.api.audit_post("audit/auditanalysis/hourlyusers", obj);

      this.subscription.add(
        seq.subscribe(
          (res) => {
            if (res != undefined && res != null) {
              this.hourwiseusers = res;
              this.distinct_date = this.hourwiseusers.filter(
                (thing, i, arr) =>
                  arr.findIndex(
                    (t) => t.ActivityDATE === thing.ActivityDATE
                  ) === i
              );
              this.distinct_date = this.distinct_date.map(
                (x) => x.ActivityDATE
              );
              this.distinct_date = this.distinct_date.sort((a, b) => a - b);
              this.distinct_hours = this.hourwiseusers.filter(
                (thing, i, arr) =>
                  arr.findIndex(
                    (t) => t.ActivityHours === thing.ActivityHours
                  ) === i
              );
              this.distinct_hours = this.distinct_hours.map(
                (x) => x.ActivityHours
              );
              this.distinct_hours = this.distinct_hours.sort((a, b) => a - b);

              var lastdate = todt;
              var lastminus7 = moment(todt)
                .subtract(8, "days")
                .format("YYYY-MM-DD");
              var day_diff = 0;

              if (fromdt == "" && todt == "") {
                day_diff = 0;
              } else {
                var lastdate = todt;
                var lastminus7 = moment(todt)
                  .subtract(8, "days")
                  .format("YYYY-MM-DD");
                obj.startDate = fromdt;
                obj.endDate = todt;
                day_diff = moment(todt).diff(moment(fromdt), "days");
              }

              var custom_last7hours = this.hourwiseusers.filter(
                (element) =>
                  moment(element.ActivityDATE, "YYYY-MM-DD") >=
                    moment(lastminus7, "YYYY-MM-DD") &&
                  moment(element.ActivityDATE, "YYYY-MM-DD") <=
                    moment(lastdate, "YYYY-MM-DD")
              );

              for (let i = 0; i < this.distinct_date.length; i++) {
                const dt = this.distinct_date[i];
                if (fromdt == "" && todt == "" && day_diff == 0) {
                  var temp = this.hourwiseusers.filter(
                    (element) =>
                      element.ActivityDATE.toString() === dt.toString()
                  );
                  this.model3.push({ temp });
                } else if (fromdt != "" && todt != "" && day_diff <= 8) {
                  var temp = this.hourwiseusers.filter(
                    (element) =>
                      element.ActivityDATE.toString() === dt.toString()
                  );
                  this.model3.push({ temp });
                } else if (fromdt != "" && todt != "" && day_diff > 7) {
                  var temp = custom_last7hours.filter(
                    (element) =>
                      element.ActivityDATE.toString() === dt.toString()
                  );
                  this.model3.push({ temp });
                }
              }

              this.model4 = this.model3.map((x) => x.temp);
              for (let i = 0; i < this.distinct_hours.length; i++) {
                const hr = this.distinct_hours[i];
                this.model4.forEach((element) => {
                  var found = element.filter(
                    (el) => el.ActivityHours == hr.toString()
                  );
                  if (found != undefined && found != null && found.length > 0) {
                    this.model5.push(found[0]);
                  }
                });
              }

              this.model5.forEach(
                (item) => (item.ActivityDATE2 = new Date(item["ActivityDATE"]))
              );
              this.model5 = this.model5.sort(
                (a, b) => b.ActivityDATE2 - a.ActivityDATE2
              );

              for (let i = 0; i < this.distinct_hours.length; i++) {
                const hr = this.distinct_hours[i];
                var found = this.model5.filter(
                  (el) => el.ActivityHours == hr.toString()
                );
                if (found != undefined && found != null && found.length > 0) {
                  this.model6.push(found);
                }
              }

              this.distinct_date.forEach((objdt) => {
                var temptbl;
                temptbl = [];
                for (let i = 0; i < this.model6.length; i++) {
                  const element = this.model6[i];
                  var temp = this.model6[i].filter(
                    (element) =>
                      element.ActivityDATE.toString() === objdt.toString()
                  );
                  if (temp != undefined && temp != null && temp.length > 0) {
                    temptbl.push(temp);
                  }
                }
                this.model7.push(temptbl);
              });

              for (let k = 0; k < this.model7.length; k++) {
                var temptbl = [];
                const element = this.model7[k];
                for (let h = 0; h < element.length; h++) {
                  const temp = element[h];
                  for (let j = 0; j < temp.length; j++) {
                    const obj = temp[j];
                    temptbl.push(obj);
                    this.model9.push(obj);
                  }
                }
              }
              // var data2 = orderBy(this.model9, [{ field: "ActivityDATE2", dir: "asc" },{ field: "ActivityHours", dir: "asc" } ]);
              this.myseries = groupBy(this.model9, [
                { field: "ActivityHours" },
              ]);
              this.hourgridView = process(this.hourwiseusers, this.state_hh);
            } else {
              this.hourgridView = null;
            }
            this.hourloading = false;
          },
          (err) => {
            this.hourloading = false;
            this.clsUtility.LogError(err);
          }
        )
      );
    } catch (error) {
      this.hourloading = false;
      this.clsUtility.LogError(error);
    }
  }

  transposeme(a) {
    return (
      (a &&
        a.length &&
        a[0].map &&
        a[0].map(function (_, c) {
          return a.map(function (r) {
            return r[c];
          });
        })) ||
      []
    );
  }

  getArrayno(index: any) {
    var retdata;
    if (
      this.model7 != null &&
      this.model7 != undefined &&
      this.model7.length > 0
    ) {
      if (index != "") {
        console.log("index");
        console.log(index);
        var temp = this.model9.filter(
          (element) => element.ActivityDATE.toString() === index.toString()
        );
        //temp =  temp.map(x => x.ActivityHours);
        console.log(temp);
        return temp;
      }
    }
  }

  getcolor(no: any) {
    //var color = ['#CDCDD9', '#5C5C68', '#444653', '#50B0E3', '#2189D5', '#003B46', '#07575B', '#66A5AD', '#C4DFE6', '#90AFC5', '#336B87', '#2A3132', '#763626','#FD8550'];
    // #98DBC6 , #5BC8AC
    var color = [
      "#CDCDD9",
      "#5C5C68",
      "#98DBC6",
      "#50B0E3",
      "#2189D5",
      "#003B46",
      "#07575B",
      "#66A5AD",
      "#C4DFE6",
      "#90AFC5",
      "#336B87",
      "#2A3132",
      "#829CD0",
      "#375E97",
      "#20368F",
      "#51BBB5",
      "#349A96",
      "#206D7B",
    ];
    if (no == null) {
      return "red";
    }
    if (no <= 17) {
      return color[no];
    } else {
      return "#349A96";
    }
  }

  public onFilter(inputValue: string): void {
    if (this.groups.length > 0) {
      this.gridView = process(this.groupwiseorder, {
        filter: {
          logic: "or",
          filters: [
            {
              field: "foldername",
              operator: "contains",
              value: inputValue,
            },
            {
              field: "ordercount",
              operator: "contains",
              value: inputValue,
            },
          ],
        },
        group: [{ field: "Group", aggregates: this.aggregates }],
      }).data;
    } else {
      this.gridView = process(this.groupwiseorder, {
        filter: {
          logic: "or",
          filters: [
            {
              field: "foldername",
              operator: "contains",
              value: inputValue,
            },
            {
              field: "ordercount",
              operator: "contains",
              value: inputValue,
            },
          ],
        },
      }).data;
    }
  }

  public onFilter_hh(inputValue: string): void {
    if (this.groups_hh.length > 0) {
      this.hourgridView = process(this.hourwiseusers, {
        filter: {
          logic: "or",
          filters: [
            {
              field: "ActivityDATE",
              operator: "contains",
              value: inputValue,
            },
            {
              field: "UserCount",
              operator: "contains",
              value: inputValue,
            },
          ],
        },
        group: [{ field: "ActivityDATE", aggregates: this.aggregates_hh }],
      }).data;
    } else {
      this.hourgridView = process(this.hourwiseusers, {
        filter: {
          logic: "or",
          filters: [
            {
              field: "ActivityDATE",
              operator: "contains",
              value: inputValue,
            },
            {
              field: "UserCount",
              operator: "contains",
              value: inputValue,
            },
          ],
        },
      }).data;
    }
  }

  setradio(val: string) {
    //alert(val);
  }

  togglegroup(grid) {
    if (this.gridView.data == undefined) {
      this.gridView = process(this.groupwiseorder, this.state);
    }
    if (this.expand) {
      if (Array.isArray(this.gridView.data)) {
        this.gridView.data.forEach((_, idx) => {
          grid.expandGroup(idx.toString());
        });
      }
    } else {
      if (Array.isArray(this.gridView.data)) {
        this.gridView.data.forEach((_, idx) => {
          grid.collapseGroup(idx.toString());
        });
      }
    }
  }

  togglegroup_hh(grid) {
    if (this.hourgridView.data == undefined) {
      this.hourgridView = process(this.hourwiseusers, this.state_hh);
    }
    if (this.expand_hh) {
      if (Array.isArray(this.hourgridView.data)) {
        this.hourgridView.data.forEach((_, idx) => {
          grid.expandGroup(idx.toString());
        });
      }
    } else {
      if (Array.isArray(this.hourgridView.data)) {
        this.hourgridView.data.forEach((_, idx) => {
          grid.collapseGroup(idx.toString());
        });
      }
    }
  }

  // public dataStateChange(state: DataStateChangeEvent): void {
  //   if (state && state.group) {
  //     state.group.map(group => group.aggregates = this.aggregates);
  //   }
  //   this.state = state;
  //   this.gridView = process(this.groupwiseorder, this.state);
  // }

  public dataStateChange(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map((group) => (group.aggregates = this.aggregates));
    }

    this.state = state;
    this.gridView = process(this.groupwiseorder, this.state);
  }

  public dataStateChange_hh(state: DataStateChangeEvent): void {
    if (state && state.group) {
      state.group.map((group) => (group.aggregates = this.aggregates_hh));
    }
    this.state_hh = state;
    this.hourgridView = process(this.hourwiseusers, this.state_hh);
  }

  public shouldHide(fieldName) {
    return (
      this.groups.some((g) => g.field === fieldName) &&
      fieldName !== "ProductName"
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  transpose(obj) {
    let newObj = {};
    for (let [key, value] of Object.entries(obj)) {
      for (let [k, v] of Object.entries(value)) {
        newObj[k] = newObj[k] || {};
        newObj[k][key] = v;
      }
    }
    return newObj;
  }
  checkIsNaN(no: number) {
    return isNaN(no);
  }

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild("grid") private grid;

  @ViewChild("grid_hh") private grid_hh;

  // this.subs.add(this.dragulaService.drag("first-bag")
  //   .subscribe(({ name, el, source }) => {
  //   })
  // );

  // this.subs.add(this.dragulaService.drop("first-bag")
  //   .subscribe(({ name, el, target, source, sibling }) => {
  //   })
  // );

  // this.subs.add(this.dragulaService.drag("second-bag")
  //   .subscribe(({ name, el, source }) => {
  //   })
  // );

  ////----------------- Group By Grid Implementation ---------------

  // @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  //   @ViewChild('grid') private grid;

  //   public aggregates: any[] = [{ field: 'ordercount', aggregate: 'sum' }, { field: 'foldername', aggregate: 'count' }];
  //   public state: State = {
  //     skip: 0,
  //     take: 100,
  //     group: [{ field: 'foldername', aggregates: this.aggregates }]
  //   };

  //   //  public gridData: any[] = orderstatusdata;
  //   public gridView: any[];
  //   public mySelection: string[] = [];

  // public gridData;

  // public onFilter(inputValue: string): void {
  //   this.gridData = process(this.orderstatuslist, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: 'status',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'ordercount',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'foldername',
  //           operator: 'contains',
  //           value: inputValue
  //         },
  //         {
  //           field: 'percentage',
  //           operator: 'contains',
  //           value: inputValue
  //         }
  //       ],
  //     },
  //     group: [{ field: 'foldername', aggregates: this.aggregates }]
  //   }).data;
  //   //this.dataBinding.skip = 0;
  // }

  // public collapseGroups(grid) {
  //   if (Array.isArray(this.gridData.data)) {
  //     this.gridData.data.forEach((_, idx) => {
  //       grid.collapseGroup(idx.toString());
  //     })
  //   }
  // }

  // public expandall(grid) {
  //   if (Array.isArray(this.gridData.data)) {
  //     this.gridData.data.forEach((_, idx) => {
  //       grid.expandGroup(idx.toString());
  //     })
  //   }
  // }

  // togglegroup(grid) {
  //   if (this.gridData.data == undefined) {
  //     console.log('undefined true');
  //     this.gridData = process(this.orderstatuslist, this.state);
  //   }
  //   if (this.expand) {
  //     console.log('expand');
  //     console.log(this.gridData.data);
  //     if (Array.isArray(this.gridData.data)) {
  //       this.gridData.data.forEach((_, idx) => {
  //         grid.expandGroup(idx.toString());
  //       })
  //     }
  //   }
  //   else {
  //     console.log('Collapse');
  //     console.log(this.gridData.data);

  //     if (Array.isArray(this.gridData.data)) {
  //       this.gridData.data.forEach((_, idx) => {
  //         grid.collapseGroup(idx.toString());
  //       })
  //     }
  //   }
  // }

  // public dataStateChange(state: DataStateChangeEvent): void {
  //   if (state && state.group) {
  //     state.group.map(group => group.aggregates = this.aggregates);
  //   }
  //   this.state = state;
  //   this.gridData = process(this.orderstatuslist, this.state);
  // }

  // public groups: GroupDescriptor[] = [
  //   { field: 'foldername', aggregates: this.aggregates }
  // ];

  // public shouldHide(fieldName) {
  //   return this.groups.some(g => g.field === fieldName) && fieldName !== 'ProductName';
  // }

  // public groupChange(groups: GroupDescriptor[]): void {
  //   this.groups = groups;
  //   this.gridData = process(this.orderstatuslist, this.state);
  //   //this.loadProducts();
  // }

  // get_orderlist() {
  //   try {
  //     this.loading = true;
  //     let seq = this.api.get("Document/OrderInventoryFolderCount/0");
  //     this.subscription.add(seq.subscribe(
  //       res => {
  //         if (res != undefined && res != null) {
  //           this.orderstatuslist = res;
  //           this.gridData = process(this.orderstatuslist, this.state);
  //         }
  //         this.loading = false;
  //       },
  //       err => {
  //         this.loading = false;
  //         this.clsUtility.LogError(err);
  //       }
  //     ));
  //   } catch (error) {
  //     this.loading = false;
  //     this.clsUtility.LogError(error);
  //   }
  // }

  ////--------------------------

  //   this.subs.add(this.dragulaService.drag("first-bag")
  //   .subscribe(({ name, el, source }) => {
  //   })
  // );

  // this.subs.add(this.dragulaService.drop("first-bag")
  //   .subscribe(({ name, el, target, source, sibling }) => {
  //   })
  // );

  // alreadyseleted(stringval: string): boolean {
  //   var found = false;
  //   try {

  //     if (this._selectedfolder != undefined && this._selectedfolder != null && stringval != '') {
  //       if (this._selectedfolder.length > 0) {
  //         var temp = this._selectedfolder.filter(element => element.foldername.toString() === stringval.toString());
  //         console.log('temp');
  //         console.log(temp);
  //         if (temp != undefined && temp != null) {
  //           if (temp.length > 0) {
  //             found = true;
  //           }
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     return false;
  //   }
  //   finally {
  //     return found;
  //   }
  // }
}

export class auditLog {
  "endDate": string = "";
  "logName": any[] = [];
  "startDate": string = "";
  "search": string = "";
  "size": string;
  "sortorder": string;
  "pageToken": string;
  "jobId": string;
}

// let personId = 0;

// class Person {
//   id: number;
//   constructor(public name: string) {
//     this.id = personId++;
//   }
// }

//// In Constructor
// this.dragulaService.createGroup(this.MANY_ITEMS, {
//   direction: 'vertical',             // Y axis is considered when determining where an element would be dropped
//   copy: false,                       // elements are moved by default, not copied
//   copySortSource: false,             // elements in copy-source containers can be reordered
//   revertOnSpill: false,              // spilling will put the element back where it was dragged from, if this is true
//   removeOnSpill: false,              // spilling will `.remove` the element, if this is true
//   mirrorContainer: document.body,    // set the element that gets mirror elements appended
//   ignoreInputTextSelection: true     // allows users to select input text, see details below
// });

// this.subs.add(dragulaService.dropModel(this.MANY_ITEMS)
//   .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
//     console.log('dropModel:');
//     console.log(el);
//     console.log(source);
//     console.log(target);
//     console.log(sourceModel);
//     console.log(targetModel);
//     console.log(item);

//     console.log(this.many);
//     console.log(this.many2);
//   })
// );
// this.subs.add(dragulaService.removeModel(this.MANY_ITEMS)
//   .subscribe(({ el, source, item, sourceModel }) => {
//     console.log('removeModel:');
//     console.log(el);
//     console.log(source);
//     console.log(sourceModel);
//     console.log(item);
//   })
// // );

// vamps = [
//   { name: "Bad Vamp" },
//   { name: "Petrovitch the Slain" },
//   { name: "Bob of the Everglades" },
//   { name: "The Optimistic Reaper" }
// ];

// vamps2 = [
//   { name: "Dracula" },
//   { name: "Kurz" },
//   { name: "Vladislav" },
//   { name: "Deacon" }
// ];

// // use these if you want
// this.dragulaService.createGroup("VAMPIRES", {
//   invalid: (el, handle) => el.classList.contains('donotdrag'),
//   copy: true,
//   //copySortSource: true,

//   copyItem: (item: any) => {
//     return new (item);
//   }
//   //copyItem: (item: any) => ({ ...item })
// });

// this.dragulaService.dropModel("VAMPIRES").subscribe(args => {
//   console.log(args);
// });

// this.dragulaService.createGroup('PERSON', {
//   copy: (el, source) => {
//     return source.id === 'left';
//   },
//   copyItem: (person: Person) => {
//     return new Person(person.name);
//   },
//   accepts: (el, target, source, sibling) => {
//     // To avoid dragging from right to left container
//     return target.id !== 'left';
//   }
// });

// this.dragulaService.createGroup('first-bag', {
//   invalid: (el, handle) => el.classList.contains('donotdrag'),
//   moves: function (el, source, handle, sibling) {
//     return true; // elements are always draggable by default
//   },
//   copy: (el, source) => {
//     return source.id === 'left';
//   },
//   copyItem: (person: any) => {
//     return person;
//   }
// });
