import { Component, OnInit, OnDestroy } from "@angular/core";
import { SubSink } from "subsink";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import {
  Cabinet,
  SaveCabinet,
} from "src/app/Model/AR Management/Configuration/cabinet";
import { Utility } from "src/app/Model/utility";
import { DataTransferService } from "../../../../Services/Common/data-transfer.service";
import { ToastrService } from "ngx-toastr";
import {
  SelectableSettings,
  GridDataResult,
  PageChangeEvent,
} from "@progress/kendo-angular-grid";
import { AuthLogs } from "src/app/Model/Common/logs";
import { HttpClient } from "@angular/common/http";
import {
  SortDescriptor,
  orderBy,
  CompositeFilterDescriptor,
  filterBy,
} from "@progress/kendo-data-query";
const flatten = (filter) => {
  const filters = filter.filters;
  if (filters) {
    return filters.reduce(
      (acc, curr) => acc.concat(curr.filters ? flatten(curr) : [curr]),
      []
    );
  }
  return [];
};

@Component({
  selector: "app-docsvault",
  templateUrl: "./docsvault.component.html",
  styleUrls: ["./docsvault.component.css"],
})
export class DocsvaultComponent implements OnInit, OnDestroy {
  pagesize: number = 0;
  public cabinetDefaultValue = { externalid: "0", cabinetname: "All" };
  gridData: any;
  foldergridData: any;
  public selectableSettings: SelectableSettings;
  cabinet: Cabinet;
  saveCabinet: SaveCabinet = new SaveCabinet();
  public CabinetsSelected: any = [];
  public checkboxOnly = true;
  public mode = "multiple";
  private clsUtility: Utility;
  loadingProcessedFolders: boolean = false;
  loadingFolders: boolean = false;
  loadingCabinets: boolean = false;
  viewAddCabinets = false;
  viewProcessFolders = false;
  clsAuthLogs: AuthLogs;
  LoginUsername = null;
  private subscription = new SubSink();
  loader: boolean = false;
  public foldersSort: SortDescriptor[] = [];
  OrderSkip = 0;
  OrderGridData: any[] = [];
  OrderGridView: GridDataResult;
  externalid: string = "0";
  filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  filterDropdownValue: any;
  constructor(
    private coreService: ConfigurationService,
    private dataservice: DataTransferService,
    private toaster: ToastrService,
    private dataService: DataTransferService,
    private http: HttpClient
  ) {
    this.setSelectableSettings();
    this.clsUtility = new Utility(toaster);
    this.clsAuthLogs = new AuthLogs(http);
  }

  ngOnInit() {
    this.pagesize = this.clsUtility.pagesize;
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.viewAddCabinets = data.viewAddCabinets;
          this.viewProcessFolders = data.viewProcessFolders;
        }
      })
    );
    this.saveCabinet = new SaveCabinet();
    this.retriveCabinets();
    // this.retriveFolders();
    // this.retriveFolderData("0");
  }

  public selectionChange(item: any): void {
    this.externalid = item.externalid;
    this.resetFilter();
    this.retriveFolders();
  }

  retriveFolderData(externalid: string) {
    try {
      // console.log(this.dataService.SelectedGCPUserid);
      this.loadingFolders = true;
      this.subscription.add(
        this.coreService.Getfolderdata(externalid).subscribe(
          (data) => {
            if (data != undefined || data != null) {
              this.foldergridData = data;
              this.CabinetsSelected = [];
              for (let i = 0; i < this.gridData.length; i++) {
                for (let j = 0; j < this.foldergridData.length; j++) {
                  if (
                    this.gridData[i].folderID ==
                      this.foldergridData[j].externalid &&
                    this.foldergridData[j].status
                  ) {
                    this.CabinetsSelected.push(this.gridData[i]);
                    break;
                  }
                }
              }
            } else {
              this.foldergridData = null;
            }
            this.loadingFolders = false;
          },
          (err) => {
            this.loadingFolders = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  ////////////////////
  public selectedCallback = (args) => args.dataItem;
  ///////////////////

  retriveCabinets() {
    //debugger;
    try {
      // console.log(this.dataService.SelectedGCPUserid);
      this.gridData = null;
      this.foldergridData = null;
      this.loadingCabinets = true;
      this.subscription.add(
        this.coreService.Getcabinets().subscribe(
          (data) => {
            if (data != undefined || data != null) {
              this.gridData = data;
              this.retriveFolderData("0");
            }
            this.loadingCabinets = false;
          },
          (err) => {
            this.loadingCabinets = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onAddClick() {
    try {
      this.writeLog("Add cabinets clicked.", "UPDATE");
      this.saveCabinet = new SaveCabinet();
      for (const cab of this.CabinetsSelected) {
        this.cabinet = new Cabinet();
        this.cabinet.status = true;
        this.cabinet.externalid = cab.folderID;
        this.cabinet.cabinetname = cab.folderName;
        this.saveCabinet.cabinet.push(this.cabinet);
      }
      this.saveCabinet.createdby = this.dataservice.loginUserName;

      this.saveCabinet.createdon = this.clsUtility.currentDateTime();

      this.subscription.add(
        this.coreService.Savecabinets(this.saveCabinet).subscribe((data) => {
          if (data == 1) {
            this.clsUtility.showSuccess("Cabinets Configured Successfully");
            this.dataservice.OrderDetailsDone.next(true);
          } else {
            this.clsUtility.showError("Failed To Configure Cabinets");
            this.dataservice.OrderDetailsDone.next(false);
          }
          this.retriveFolderData("0"); //edited by harish     this.cabinet.externalid
          // this.cabinet = new Cabinet();
          // this.saveCabinet = new SaveCabinet();
        })
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  onCheck(event: any, dataitem: any) {
    // console.log(dataitem);
    // let isobjpresent: boolean = false;
    // for (const checkcabinet of this.saveCabinet.cabinet) {
    //   if (checkcabinet.externalid == dataitem.folderID) {
    //     checkcabinet.status = event.target.checked;
    //     isobjpresent = true;
    //     break;
    //   }
    // }
    // if (!isobjpresent) {
    //   this.cabinet = new Cabinet();
    //   this.cabinet.status = event.target.checked;
    //   this.cabinet.externalid = dataitem.folderID;
    //   this.cabinet.cabinetname = dataitem.folderName;
    //   this.saveCabinet.cabinet.push(this.cabinet);
    // }
    // // this.cabinet.createdon = currentDateTime;
    // // this.cabinet.createdby = this.dataservice.loginUserName;
    // //console.log(event);
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      // mode: this.mode
    };
  }

  processFolderData: any;
  public FoldersSelected: any = [];
  retriveFolders() {
    try {
      this.OrderGridView = null;
      this.FoldersSelected = [];
      this.loadingProcessedFolders = true;
      this.subscription.add(
        this.coreService
          .Getfolders(this.externalid ? this.externalid : "0")
          .subscribe(
            (data) => {
              if (data != undefined || data != null) {
                // this.processFolderData = data;
                this.OrderGridData = data;
              } else {
                // this.processFolderData = null;
                this.OrderGridData = null;
              }
              this.OrderSkip = 0;
              this.OrderloadItems();
              this.loadingProcessedFolders = false;
            },
            (err) => {
              this.loadingProcessedFolders = false;
            }
          )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OrderloadItems() {
    try {
      if (this.OrderGridData) {
        let data: any[] = orderBy(
          filterBy(this.OrderGridData, this.filter),
          this.foldersSort
        );
        // let page = data.length/this.clsUtility.pagesize;
        // this.OrderSkip =
        //   Math.trunc(data.length / this.clsUtility.pagesize) *
        //   this.clsUtility.pagesize;
        this.OrderGridView = {
          data: data.slice(this.OrderSkip, this.OrderSkip + this.pagesize),
          total: data.length,
        };
        // this.OrderGridView.total = this.OrderGridView.data.length;
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  processStatusChange(evt: any) {
    try {
      const root = { logic: "and", filters: [], ...this.filter };

      const [filter] = flatten(root).filter(
        (x) => x.field === "processedstatus"
      );
      if (evt == -1) {
        let ind: number = root.filters.findIndex(
          (ele) => ele["field"] == "processedstatus"
        );
        if (ind != -1) {
          root.filters.splice(ind, 1);
        }
      } else {
        if (!filter) {
          root.filters.push({
            field: "processedstatus",
            operator: "eq",
            value: evt,
          });
        } else {
          filter.value = evt;
        }
      }

      //  this.checked = checked;
      this.gridFilter(root);
      // this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onProcessClick() {
    let showmsg: boolean = false;
    try {
      let stringOfFailed = "";
      let stringOfAlreadyProcessed = "";
      let myPromiseArray = [];
      if (this.FoldersSelected.length == 0) {
        this.clsUtility.showInfo("Select folder to process");
        return;
      }
      this.writeLog("Process folder clicked.", "UPDATE");
      this.loader = true;
      for (const folder of this.FoldersSelected) {
        myPromiseArray.push(
          this.coreService.processFolders(folder.externalid).toPromise()
        );
      }
      Promise.all(myPromiseArray)
        .then((alltheValuesInAnArray) => {
          for (let i = 0; i < alltheValuesInAnArray.length; i++) {
            if (alltheValuesInAnArray[i] == 0) {
              if (stringOfFailed)
                stringOfFailed =
                  stringOfFailed + ", " + this.FoldersSelected[i].foldername;
              else stringOfFailed = this.FoldersSelected[i].foldername;
            } else if (alltheValuesInAnArray[i] == 2) {
              if (stringOfAlreadyProcessed)
                stringOfAlreadyProcessed =
                  stringOfAlreadyProcessed +
                  ", " +
                  this.FoldersSelected[i].foldername;
              else
                stringOfAlreadyProcessed = this.FoldersSelected[i].foldername;
            }
          }
          if (stringOfFailed || stringOfAlreadyProcessed) {
            if (stringOfFailed)
              this.clsUtility.showError(
                "Failed to process following folders: " + stringOfFailed
              );
            if (stringOfAlreadyProcessed)
              this.clsUtility.showError(
                "Folders already processed: " + stringOfAlreadyProcessed
              );
          } else {
            this.clsUtility.showSuccess(
              "Selected folder(s) processed successfully"
            );
          }
          this.FoldersSelected = [];
          this.loader = false;
          this.retriveFolders();
        })
        .catch((error) => {
          this.loader = false;
          this.clsUtility.showError(error);
        });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OrderSortChange(sort: SortDescriptor[]): void {
    // this.foldersSort = sort;
    // if (this.processFolderData) {
    //   this.processFolderData = orderBy(
    //     this.processFolderData,
    //     this.foldersSort
    //   );
    // }
    if (this.OrderGridData != null) {
      this.foldersSort = sort;
      this.OrderloadItems();
    }
  }

  writeLog(Message: string, UserAction: string) {
    let ModuleName = "Qonductor-Biotech";
    let para: {
      application: string;
      clientip: string;
      clientbrowser: number;
      loginuser: string;
      module: string;
      screen: string;
      message: string;
      useraction: string;
      transactionid: string;
    } = {
      application: "Qonductor",
      clientip: "",
      clientbrowser: null,
      loginuser: this.dataService.loginUserName,
      module: ModuleName,
      screen: "Edocs Manager",
      message: Message,
      useraction: UserAction,
      transactionid: "12345678",
    };
    this.clsAuthLogs.callApi(para);
  }

  OrderPageChange(event: PageChangeEvent): void {
    this.OrderGridView = null;
    this.OrderSkip = event.skip;
    this.OrderloadItems();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  gridFilter(evt: CompositeFilterDescriptor) {
    try {
      // console.log(evt);
      this.filter = evt;
      this.filter.filters.forEach((element) => {
        if (element["field"] != "processedstatus")
          element["value"] = element["value"].trim();
      });
      this.OrderSkip = 0;
      this.OrderloadItems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  resetFilter() {
    try {
      this.filter = {
        logic: "and",
        filters: [],
      };
      this.filterDropdownValue = -1;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public onTabSelect(e: any) {
    if (e.index == 0) {
      this.retriveCabinets();
    } else if (e.index == 1) {
      this.externalid = "0";
      this.resetFilter();
      this.retriveFolders();
    }
  }
}
