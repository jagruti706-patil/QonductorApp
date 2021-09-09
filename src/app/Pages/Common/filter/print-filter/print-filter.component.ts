import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Workgroup } from "src/app/Model/AR Management/Workgroup/workgroup";
import { FormBuilder } from "@angular/forms";
import {
  GetCategory,
  GetProviderList,
  FolderCategoryAndYearModel,
  GetFolders,
  InsuranceCompanyName,
} from "src/app/Model/AR Management/Configuration/cabinet";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { ToastrService } from "ngx-toastr";
import { Utility, enumFilterCallingpage } from "src/app/Model/utility";
import { PrintFilterInputModel } from "src/app/Model/AR Management/Common/Filter/filter";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { SubSink } from "subsink";
import { CoreauthService } from "src/app/Pages/Services/Common/coreauth.service";
import { Observable, Subject } from "rxjs";
import { debounceTime, switchMap } from "rxjs/operators";
import { GenericSearchModel } from "src/app/Model/BT Charge Posting/Order/order-note";

@Component({
  selector: "app-print-filter",
  templateUrl: "./print-filter.component.html",
  styleUrls: ["./print-filter.component.css"],
})
export class PrintFilterComponent implements OnInit, OnDestroy {
  @Input() CallingPage: string;
  @Output() FilterData = new EventEmitter<Workgroup[]>();
  providersList: GetProviderList[];
  allProvidersList: GetProviderList[];
  public providerDefaultValue = { npi: "0", providername: "All" };
  categories: { displayname: string; categorytype: string }[] = [
    {
      displayname: "Blood",
      categorytype: "Blood",
    },
    {
      displayname: "Toxicology",
      categorytype: "Toxicology",
    },
  ];
  insuranceType: { id: number; insurancetype: string }[] = [
    {
      id: 0,
      insurancetype: "Commercial",
    },
    {
      id: 1,
      insurancetype: "Medicare",
    },
  ];
  private subscription = new SubSink();
  years: any = [];
  folders: GetFolders[];
  public categoryDefaultValue = { displayname: "All", categorytype: "All" };
  public insuranceTypeDefaultValue = { id: -1, insurancetype: "All" };
  public insuranceDefaultValue = { insurancecompanyname: "All" };
  public subcategoryDefaultValue = { categoryid: -1, categoryname: "All" };
  public folderDefaultValue = { foldername: "All" };
  public orderuserDefaultValue = { userid: "0", displayname: "All" };
  public batchDefaultValue = { batchcode: "0", displayname: "All" };
  public yearDefaultValue = { year: "All" };
  public ordergroupDefaultValue = { groupid: "", groupname: "All" };
  subcategories: GetCategory[];
  clsUtility: Utility;
  printInputFilter: PrintFilterInputModel = new PrintFilterInputModel();
  loader: boolean = false;
  orderInsurance: InsuranceCompanyName[];
  GroupUsers: any;
  loginUserGroup: any;
  batchArray: any;
  bIsFromReadyForPrinting: boolean = false;
  bIsFromSubmittedAndPrinted: boolean = false;
  allLstPractice: any[] = [];
  lstPractice: any[] = [];
  public PracticeDefaultValue = { clientid: "0", client: "All" };
  searchField: string;
  searchTextChanged: Subject<string> = new Subject<string>();
  status: number;
  practiceFilterLoader: boolean;
  providerFilterLoader: boolean;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private authService: CoreauthService,
    private toastr: ToastrService,
    private dataService: DataTransferService
  ) {
    this.clsUtility = new Utility();
  }

  ngOnInit() {
    try {
      // this.subscription.add(
      //   this.searchTextChanged
      //     .pipe(debounceTime(750))
      //     .subscribe((searchValue) => {
      //       // console.log(searchValue);
      //       if (searchValue) this.getGenericSearchData(searchValue);
      //     })
      // );
      this.subscription.add(
        this.searchTextChanged
          .pipe(
            debounceTime(750),
            switchMap((searchValue) => {
              if (this.searchField == "practice")
                this.practiceFilterLoader = true;
              else if (this.searchField == "provider")
                this.providerFilterLoader = true;
              if (searchValue && searchValue.trim() && searchValue.length > 2) {
                let reqbody: GenericSearchModel = new GenericSearchModel();
                reqbody.searchfield = this.searchField;
                reqbody.searchtext = searchValue;
                reqbody.group = this.dataService.groupIds
                  ? this.dataService.groupIds.split(",")
                  : [];
                return this.filterService.getGenericSearchData(reqbody);
              } else {
                if (this.searchField == "practice") {
                  return Observable.of({ practice: this.allLstPractice });
                } else if (this.searchField == "provider") {
                  return Observable.of({ provider: this.allProvidersList });
                }
              }
            })
          )
          .subscribe(
            (data) => {
              if (data) {
                if (this.searchField == "practice") {
                  this.lstPractice = data.practice;
                  this.practiceFilterLoader = false;
                } else if (this.searchField == "provider") {
                  this.providersList = data.provider;
                  this.providerFilterLoader = false;
                }
              } else {
                if (this.searchField == "practice") {
                  this.lstPractice = [];
                  this.practiceFilterLoader = false;
                }
                if (this.searchField == "provider") {
                  this.providersList = [];
                  this.providerFilterLoader = false;
                }
              }
            },
            (error) => {
              this.clsUtility.LogError(error);
            }
          )
      );

      this.RetriveFilterData();
      this.formValueChanged();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  RetriveFilterData() {
    try {
      switch (this.CallingPage.toLowerCase()) {
        case enumFilterCallingpage.ReadyForPrinting:
          this.bIsFromReadyForPrinting = true;
          this.status = 8;
          this.getFolderCategoryAndYear(0, this.status);
          break;
        case enumFilterCallingpage.SubmittedAndPrinted:
          this.bIsFromSubmittedAndPrinted = true;
          this.status = 10;
          this.getLoginUserGroup();
          this.getFolderCategoryAndYear(0, this.status);
          break;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  FilterFormGroup = this.fb.group({
    fcYear: ["All"],
    // fcFolder: ["All"],
    fcCategory: ["All"],
    fcSubCategory: ["All"],
    fcInsuranceType: [-1],
    fcAccessionNumber: [""],
    fcProvider: [[]],
    fcOrderInsurance: ["All"],
    fcOrderUser: ["0"],
    fcOrderGroup: [""],
    fcBatch: [""],
    fcPractice: [[]],
  });

  get fbcYear() {
    return this.FilterFormGroup.get("fcYear");
  }
  // get fbcFolder() {
  //   return this.FilterFormGroup.get("fcFolder");
  // }
  get fbcCategory() {
    return this.FilterFormGroup.get("fcCategory");
  }
  get fbcSubCategory() {
    return this.FilterFormGroup.get("fcSubCategory");
  }
  get fbcProvider() {
    return this.FilterFormGroup.get("fcProvider");
  }
  get fbcInsuranceType() {
    return this.FilterFormGroup.get("fcInsuranceType");
  }
  get fbcAccessionNumber() {
    return this.FilterFormGroup.get("fcAccessionNumber");
  }
  get fbcOrderInsurance() {
    return this.FilterFormGroup.get("fcOrderInsurance");
  }
  get fbcOrderGroup() {
    return this.FilterFormGroup.get("fcOrderGroup");
  }
  get fbcOrderUser() {
    return this.FilterFormGroup.get("fcOrderUser");
  }
  get fbcBatch() {
    return this.FilterFormGroup.get("fcBatch");
  }
  get fbcPractice() {
    return this.FilterFormGroup.get("fcPractice");
  }

  formValueChanged(): any {
    try {
      this.fbcYear.valueChanges.subscribe((data: string) => {
        if (data != null && data != undefined) {
          this.printInputFilter.orderyear =
            data.toLowerCase() == "all" ? [] : [data];
        }
      });
      // this.fbcFolder.valueChanges.subscribe((data: string) => {
      //   if (data == "All") {
      //     this.printInputFilter.orderday = "";
      //   } else {
      //     this.printInputFilter.orderday = data;
      //   }
      // });
      this.fbcCategory.valueChanges.subscribe((data) => {
        if (data == "All") {
          this.printInputFilter.orderCategory = [];
        } else {
          this.printInputFilter.orderCategory = [data];
        }
      });
      this.fbcSubCategory.valueChanges.subscribe((data) => {
        if (data == "All") {
          this.printInputFilter.ordersubcategory = "";
        } else {
          this.printInputFilter.ordersubcategory = data;
        }
      });
      this.fbcProvider.valueChanges.subscribe((data: string[]) => {
        this.printInputFilter.npi = data;
      });
      this.fbcInsuranceType.valueChanges.subscribe((data) => {
        this.printInputFilter.medicare = data;
      });
      this.fbcAccessionNumber.valueChanges.subscribe((data) => {
        this.printInputFilter.accessionNo = data;
      });
      this.fbcOrderInsurance.valueChanges.subscribe((data: string) => {
        this.printInputFilter.insurancecompanyname = [];
        if (data != "All" && data != null && data != undefined && data != "") {
          this.printInputFilter.insurancecompanyname.push(data);
        }
      });
      this.fbcOrderUser.valueChanges.subscribe((data: string) => {
        if (data == "All") {
          this.printInputFilter.userid = "0";
        } else {
          this.printInputFilter.userid = data;
        }
      });
      this.fbcBatch.valueChanges.subscribe((data: string) => {
        if (data == "All") {
          this.printInputFilter.batchcode = "0";
        } else {
          this.printInputFilter.batchcode = data;
        }
      });
      this.fbcOrderGroup.valueChanges.subscribe((group) => {
        if (group && group > 0) {
          this.fbcOrderUser.setValue("0");
          this.subscription.add(
            this.authService.getGroupsUser(group).subscribe(
              (users) => {
                if (users != null || users != undefined) {
                  this.GroupUsers = users;
                }
              },
              (err) => {}
            )
          );
        } else {
          this.GroupUsers = null;
          this.fbcOrderUser.setValue("0");
        }
      });
      this.fbcPractice.valueChanges.subscribe((data: string[]) => {
        this.printInputFilter.practicecode = data;
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  btnApplyFilter_Click(
    page = 0,
    pagesize = this.clsUtility.printOrdersPageSize
  ) {
    try {
      if (this.fbcAccessionNumber.value) {
        this.fbcAccessionNumber.setValue(this.fbcAccessionNumber.value.trim());
      }
      this.dataService.SelectedPrintFilter = this.printInputFilter;
      this.loader = true;
      this.subscription.add(
        this.filterService
          .applyPrintFilter(
            this.CallingPage,
            page,
            pagesize,
            this.printInputFilter
          )
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                this.FilterData.emit(data);
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
            }
          )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  async ClearFilter(page = 0, pagesize = this.clsUtility.printOrdersPageSize) {
    try {
      this.loader = true;
      this.printInputFilter = new PrintFilterInputModel();
      await this.getFolderCategoryAndYear(0, this.status);
      this.dataService.SelectedPrintFilter = this.printInputFilter;
      this.subscription.add(
        this.filterService
          .applyPrintFilter(
            this.CallingPage,
            page,
            pagesize,
            this.printInputFilter
          )
          .subscribe(
            (data) => {
              if (data != null || data != undefined) {
                this.FilterData.emit(data);
                this.ClearControls();
              }
              this.loader = false;
            },
            (error) => {
              this.loader = false;
            }
          )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }

  ClearControls() {
    try {
      this.fbcYear.setValue("All");
      this.fbcCategory.setValue("All");
      this.fbcSubCategory.setValue("All");
      this.fbcProvider.setValue([]);
      this.fbcInsuranceType.setValue(-1);
      this.fbcAccessionNumber.setValue("");
      // this.fbcYear.setValue("");   already set this value in getFolderCategoryAndYear call
      // this.fbcFolder.setValue("");
      this.fbcOrderInsurance.setValue("All");
      this.fbcPractice.setValue([]);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  async getFolderCategoryAndYear(yearDefault: any = 0, statusid: any = 0) {
    try {
      if (yearDefault == 0 || yearDefault == null) {
        yearDefault = 0;
      }

      const res = await this.getfolder(yearDefault, statusid);
      // console.log("res", res);
      let response = <FolderCategoryAndYearModel>res;
      if (response) {
        this.years = response.year;
        //this.folders = response.folder;
        //this.subcategories = response.category;
        this.providersList = response.providernpi;
        this.allProvidersList = response.providernpi;
        //this.orderInsurance = response.insurancecompanyname;
        this.allLstPractice = response.practice;
        // this.lstPractice = response.practice;
        if (this.allLstPractice) {
          this.allLstPractice.splice(0, 0, {
            clientid: "-1",
            client: "NOPRACTICE-Practice Provider not configured",
          });
          this.lstPractice = this.allLstPractice.slice();
        }

        if (yearDefault == "0") {
          this.SetDefaultYear();
        }
        // //for default folder set
        // let julianDay = moment().dayOfYear(); // Julian day
        // // let julianDay = 360; // Julian day
        // let julianDayObj: GetFolders;
        // if (this.folders) {
        //   julianDayObj = this.folders.find(
        //     element => +element.foldername <= julianDay
        //   );
        // }

        // if (julianDayObj) {
        //   this.fbcFolder.setValue(julianDayObj.foldername);
        // } else {
        //   this.fbcFolder.setValue("All");
        // }
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  getfolder(yearDefault: any, statusid: any = 0) {
    return this.filterService
      .getFolderCategoryAndYear(yearDefault, statusid)
      .toPromise();
  }
  yearChanged(evt: any) {
    try {
      if (evt) {
        this.getFolderCategoryAndYear(evt.year, this.status);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getLoginUserGroup() {
    this.subscription.add(
      this.authService
        .getLoginUserGroups(this.dataService.loginGCPUserID.getValue())
        .subscribe(
          (data) => {
            if (data != null || data != undefined) {
              this.loginUserGroup = data;
            }
          },
          (err) => {}
        )
    );
  }
  private SetDefaultYear() {
    try {
      if (this.years != undefined && this.years != null) {
        // if (this.years.length > 0) {
        //   var temp = this.years.filter(
        //     element => element.isdefault.toString() === "true"
        //   );
        //   if (temp != undefined && temp != null) {
        //     if (temp.length > 0) {
        //       this.fbcYear.setValue(temp[0].year);
        //     } else {
        //       this.fbcYear.setValue(this.years[0].year);
        //     }
        //   } else {
        //     this.fbcYear.setValue(this.years[0].year);
        //   }
        // }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  // handleProviderFilter(value) {
  //   if (value && value.trim() && value.length > 2) {
  //     this.searchField = "provider";
  //     this.searchTextChanged.next(value.trim());
  //   } else {
  //     this.providersList = this.allProvidersList.slice();
  //   }
  //   // if (this.allProvidersList) {
  //   //   this.providersList = this.allProvidersList.filter(
  //   //     (s) =>
  //   //       s.providername.toLowerCase().includes(value.toLowerCase()) === true
  //   //   );
  //   // }
  // }

  // handlePracticeFilter(value: string) {
  //   if (value && value.trim() && value.length > 2) {
  //     this.searchField = "practice";
  //     this.searchTextChanged.next(value.trim());
  //   } else {
  //     this.lstPractice = this.allLstPractice.slice();
  //   }
  // }
  handleGenericSearchFilter(value: string, searchField: string) {
    this.searchField = searchField;
    this.searchTextChanged.next(value);
  }
  // getGenericSearchData(searchText: string) {
  //   try {
  //     this.subscription.add(
  //       this.filterService
  //         .getGenericSearchData(this.searchField, searchText)
  //         .subscribe(
  //           (data) => {
  //             if (data) {
  //               if (this.searchField == "practice")
  //                 this.lstPractice = data.practice;
  //               else if (this.searchField == "provider")
  //                 this.providersList = data.provider;
  //               else if (this.searchField == "insurance")
  //                 this.orderInsurance = data.insurance;
  //             } else {
  //               if (this.searchField == "practice") this.lstPractice = [];
  //               if (this.searchField == "provider") this.providersList = [];
  //               if (this.searchField == "insurance") this.orderInsurance = [];
  //             }
  //           },
  //           (error) => {
  //             this.clsUtility.LogError(error);
  //           }
  //         )
  //     );
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  ngOnDestroy() {
    try {
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public isItemSelected(
    selectedFormControlArray: any[],
    itemText: string
  ): boolean {
    return selectedFormControlArray.some((item) => item === itemText);
  }
  public summaryTagSelectedValues(dataItems: any[], key: string): string {
    return dataItems.map((ele) => ele[key]).join(",");
  }
}
