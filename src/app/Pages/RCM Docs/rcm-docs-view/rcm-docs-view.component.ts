import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { ToastrService } from "ngx-toastr";
import { Utility } from "src/app/Model/utility";
import { SubSink } from "subsink";
import { GridComponent } from "@progress/kendo-angular-grid";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
// import { RcmEncounterDocumentsComponent } from "../../Order Action/rcm-encounter-documents/rcm-encounter-documents.component";
import { FliterClient } from "src/app/Model/AR Management/Common/Filter/filter";
import { WriteAuditLogService } from "src/app/Pages/Services/Common/write-audit-log.service";
import { RcmEncounterDocumentsComponent } from "../rcm-encounter-documents/rcm-encounter-documents.component";
import { ImportDocumentsComponent } from "../rcmdocsimport/import-documents/import-documents.component";
import { MoveRcmDocumentsComponent } from "../move-rcm-documents/move-rcm-documents.component";
import { DeleteRCMDocsComponent } from "../delete-rcmdocs/delete-rcmdocs.component";
declare var $: any;
@Component({
  selector: "app-rcm-docs-view",
  templateUrl: "./rcm-docs-view.component.html",
  styleUrls: ["./rcm-docs-view.component.css"],
})
export class RcmDocsViewComponent implements OnInit, OnDestroy {
  clsUtility: Utility;
  subscription: SubSink = new SubSink();
  categoryGridItems: any[] = [];
  AllCategoryGridItems: any[] = [];
  folderGridItems: any[] = [];
  AllFolderGridItems: any[] = [];
  documentList: any[] = [];
  showGrids: boolean = true;
  showFilters: boolean = false;
  showCategories: boolean = true;
  category: string = "";
  verticalText: string = "";
  public EncounterClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  public monthDefaultValue = { month: 0, displayname: "All" };
  lstEncounterClients: any = [];
  AllLstEncounterClients: any[] = [];
  years: any = [];
  months: any[] = [
    {
      displayname: "1 - JAN",
      month: 1,
    },
    {
      displayname: "2 - FEB",
      month: 2,
    },
    {
      displayname: "3 - MAR",
      month: 3,
    },
    {
      displayname: "4 - APR",
      month: 4,
    },
    {
      displayname: "5 - MAY",
      month: 5,
    },
    {
      displayname: "6 - JUN",
      month: 6,
    },
    {
      displayname: "7 - JUL",
      month: 7,
    },
    {
      displayname: "8 - AUG",
      month: 8,
    },
    {
      displayname: "9 - SEP",
      month: 9,
    },
    {
      displayname: "10 - OCT",
      month: 10,
    },
    {
      displayname: "11 - NOV",
      month: 11,
    },
    {
      displayname: "12 - DEC",
      month: 12,
    },
  ];
  clientname: string = "All";
  fullscreen = false;
  categoryLoader: boolean;
  folderLoader: boolean;
  masterLoader: boolean;
  monthname: string = "All";
  vwImportDocumentsBtn: boolean = false;
  vwMoveDocumentsBtn: boolean = false;
  vwDeleteDocumentsBtn: boolean = false;
  @ViewChild("importDocuments")
  private importDocuments: ImportDocumentsComponent;
  @ViewChild("moveDocuments")
  private moveDocuments: MoveRcmDocumentsComponent;
  @ViewChild("deleteDocuments")
  private deleteDocuments: DeleteRCMDocsComponent;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private toastr: ToastrService,
    private dataService: DataTransferService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    this.subscription.add(
      this.dataService.isMarkedAcknowledged.subscribe((data) => {
        if (data) {
          this.categoryLoader = true;
          this.retrieveEncounterList(this.fbcYear.value);
        }
      })
    );
    this.subscription.add(
      this.dataService.navSubject.subscribe((data) => {
        if (data != null || data != undefined) {
          this.vwImportDocumentsBtn = data.viewImportDocumentsBtn;
          this.vwMoveDocumentsBtn = data.viewMoveDocumentsBtn;
          this.vwDeleteDocumentsBtn = data.viewDeleteDocumentsBtn;
        }
      })
    );
    this.getFilterMaster();
    this.formValueChanged();
  }
  FilterFormGroup = this.fb.group({
    fcEncounterClient: [0],
    fcMonth: [0],
    fcYear: [""],
    fcCategorySearch: [""],
    fcFolderSearch: [""],
    fcViewAck: [false],
  });
  get fbcYear() {
    return this.FilterFormGroup.get("fcYear");
  }
  get fbcEncounterClient() {
    return this.FilterFormGroup.get("fcEncounterClient");
  }
  get fbcMonth() {
    return this.FilterFormGroup.get("fcMonth");
  }
  get fbcCategorySearch() {
    return this.FilterFormGroup.get("fcCategorySearch");
  }
  get fbcFolderSearch() {
    return this.FilterFormGroup.get("fcFolderSearch");
  }
  get fbcViewAck() {
    return this.FilterFormGroup.get("fcViewAck");
  }

  formValueChanged() {
    try {
      this.fbcCategorySearch.valueChanges.subscribe((data) => {
        if (this.AllCategoryGridItems) {
          this.categoryGridItems = this.AllCategoryGridItems.filter((ele) =>
            ele.category.toLowerCase().includes(data.toLowerCase().trim())
          );
        }
      });
      this.fbcFolderSearch.valueChanges.subscribe((data) => {
        // if (this.AllFolderGridItems) {
        //   this.folderGridItems = this.AllFolderGridItems.filter((ele) =>
        //     ele.createdon.toLowerCase().includes(data.toLowerCase())
        //   );
        // }
        // if (this.folderGridItems) {
        //   if (!!document.getElementById("expandBtn"))
        //     document.getElementById("expandBtn").click();
        //   this.folderGridItems.forEach((item, idx) => {
        //     if (item.allDocumentList) {
        //       item.documentlist = item.allDocumentList.filter((ele) =>
        //         ele.documentname
        //           .toLowerCase()
        //           .includes(data.toLowerCase().trim())
        //       );
        //     }
        //   });
        // }
        if (this.AllFolderGridItems) {
          if (!!document.getElementById("expandBtn"))
            document.getElementById("expandBtn").click();
          this.folderGridItems = this.AllFolderGridItems.slice(0);
          this.AllFolderGridItems.forEach((item, idx) => {
            if (item.allDocumentList) {
              let doclist = item.allDocumentList.filter((ele) =>
                ele.documentname
                  .toLowerCase()
                  .includes(data.toLowerCase().trim())
              );
              let index = this.folderGridItems.findIndex(
                (ele) => item.folder == ele.folder
              );
              if (index !== -1) {
                if (doclist && doclist.length > 0) {
                  this.folderGridItems[index].documentlist = doclist;
                } else {
                  this.folderGridItems.splice(index, 1);
                }
              }
            }
          });
        }
      });
      this.fbcViewAck.valueChanges.subscribe((data) => {
        this.verticalText = "";
        // this.RcmDocumentComponent.ResetDocuments();
        this.dataService.SelectedMasterDocId.next(null);
        if (this.category) {
          this.folderLoader = true;
          this.retrieveEncounterList(this.fbcYear.value);
          this.fbcFolderSearch.setValue(""); //to reset folder search input control
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  ngOnDestroy() {
    try {
      this.dataService.isMarkedAcknowledged.next(false);
      this.dataService.SelectedMasterDocId.next(null);
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  retrieveEncounterList(year: string, month: number = 0) {
    try {
      this.folderGridItems = [];
      this.AllFolderGridItems = [];
      const SelectedClient = this.lstEncounterClients.find(
        (x) => x.nclientid === this.fbcEncounterClient.value.toString()
      );
      var client = [];
      if (SelectedClient) {
        const filterclient = new FliterClient();
        filterclient.clientname = SelectedClient.clientcodename;
        filterclient.clientid = SelectedClient.nclientid;
        client.push(filterclient);
      } else {
        this.lstEncounterClients.forEach((ele) => {
          let filterclient = new FliterClient();
          filterclient.clientname = ele.clientcodename;
          filterclient.clientid = ele.nclientid;
          client.push(filterclient);
        });
      }

      let inputJson = {
        cabinet: year ? year : "0",
        category: this.category ? this.category : "0",
        // clientid: this.fbcEncounterClient.value.toString(),
        client: client,
        folder: "0",
        isacknowledged: this.fbcViewAck.value,
        month: month,
      };
      this.subscription.add(
        this.filterService.retrieveEncounterMaster(inputJson).subscribe(
          (queue) => {
            if (queue != null) {
              if (queue["categorylist"] != null) {
                this.categoryGridItems = queue["categorylist"];
                this.AllCategoryGridItems = queue["categorylist"];
              } else {
                this.categoryGridItems = [];
                this.AllCategoryGridItems = [];
              }
              if (queue["folderlist"] != null) {
                this.folderGridItems = queue["folderlist"];
                this.AllFolderGridItems = queue["folderlist"].slice(0);
                if (queue["originalfiles"] != null) {
                  this.documentList = queue["originalfiles"];
                } else {
                  this.documentList = [];
                }
                // if (!!document.getElementById("collapseBtn"))
                //   document.getElementById("collapseBtn").click();
                this.AllFolderGridItems.forEach((item, idx) => {
                  if (!item.documentlist && this.documentList) {
                    item.documentlist = this.documentList.filter(
                      (ele) => ele.folder === item.folder
                    );
                    if (item.documentlist) {
                      item.allDocumentList = item.documentlist.slice(0);
                    } else {
                      item.allDocumentList = [];
                    }
                  }
                });
                if (!!document.getElementById("expandBtn"))
                  document.getElementById("expandBtn").click();
              }
              //added below lines to call valuechange of search
              this.fbcCategorySearch.setValue(this.fbcCategorySearch.value);
              this.fbcFolderSearch.setValue(this.fbcFolderSearch.value);
            }
            this.categoryLoader = false;
            this.folderLoader = false;
          },
          (err) => {
            this.categoryLoader = false;
            this.folderLoader = false;
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public collapseAll(mastergrid: GridComponent) {
    try {
      if (this.folderGridItems) {
        this.folderGridItems.forEach((item, idx) => {
          mastergrid.collapseRow(idx);
        });
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public expandAll(mastergrid: GridComponent) {
    try {
      if (this.folderGridItems) {
        this.folderGridItems.forEach((item, idx) => {
          mastergrid.expandRow(idx);
          if (!item.documentlist && this.documentList) {
            item.documentlist = this.documentList.filter(
              (ele) => ele.folder === item.folder
            );
            if (item.documentlist) {
              item.allDocumentList = item.documentlist.slice(0);
            } else {
              item.allDocumentList = [];
            }
          }
        });
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public showOnlyMasterDetails(dataItem: any, index: number): boolean {
    return dataItem.generateencounter === false;
  }
  // ApplyFilter(event: any) {
  //   try {
  //     // this.appliedFilters = this.dataService.SelectedFilter; //for displaying names of selected filters
  //     if (event) {
  //       document.getElementById("collapseBtn").click();
  //       this.verticalText = "";
  //       this.categoryGridItems = [];
  //       this.AllCategoryGridItems = [];
  //       this.folderGridItems = [];
  //       this.AllFolderGridItems = [];
  //       this.documentList = [];
  //       if (event.categorylist) {
  //         this.categoryGridItems = event.categorylist;
  //         this.AllCategoryGridItems = event.categorylist;
  //       }
  //       // if (event.folderlist) {
  //       //   this.folderGridItems = event.folderlist;
  //       // }
  //       // if (event.originalfiles) {
  //       //   this.documentList = event.originalfiles;
  //       // }
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  // onExpandDetail(evt) {
  //   if (!this.folderGridItems[evt.index].documentlist && this.documentList) {
  //     this.folderGridItems[evt.index].documentlist = this.documentList.filter(
  //       (ele) => ele.folder === evt.dataItem.folder
  //     );
  //     // this.getDocumentsByMaster(evt.dataItem, evt.index);
  //   }
  // }
  // getDocumentsByMaster(dataItem: any, index: number) {
  //   try {
  //     let body = {
  //       accessionno: "0",
  //       cabinet: this.lstFilter.orderyear ? this.lstFilter.orderyear : "0",
  //       category: this.lstFilter.orderCategory
  //         ? this.lstFilter.orderCategory
  //         : "0",
  //       clientid:
  //         this.lstFilter.client.length == 0
  //           ? "0"
  //           : this.lstFilter.client[0].clientid.toString(),
  //       folder: dataItem.folder,
  //       masterfile: "0",
  //     };
  //     this.subscription.add(
  //       this.filterService
  //         .getDocumentsByMaster(0, this.clsUtility.pagesize, body)
  //         .subscribe(
  //           (data) => {
  //             console.log(data);
  //             if (data) {
  //               this.folderGridItems[index].documentlist = data.content;
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
  onCategoryClick(category: string) {
    try {
      this.category = category;
      this.verticalText = "";
      // this.RcmDocumentComponent.ResetDocuments();
      this.dataService.SelectedMasterDocId.next(null);
      this.folderLoader = true;
      this.retrieveEncounterList(this.fbcYear.value, this.fbcMonth.value);
      this.fbcFolderSearch.setValue(""); //to reset folder search input control
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  @ViewChild("RcmDocumentComponent")
  private RcmDocumentComponent: RcmEncounterDocumentsComponent;
  onDocumentClick(dataItem: any) {
    try {
      this.verticalText =
        "Encounter: " + dataItem.createdon + ", " + dataItem.documentname;
      this.dataService.SelectedMasterDocId.next(dataItem.masterdocid);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  clientChanged(evt: any) {
    if (evt) {
      // this.getFolderCategoryAndYear(0, 0, false, true, evt.nclientid);
      this.clientname = evt.clientcodename;
      this.getFilterMaster("0", "0", evt.nclientid.toString());
      this.fbcMonth.setValue(0);
    }
  }
  yearChanged(evt: any) {
    if (evt) {
      this.resetFields();
      this.categoryLoader = true;
      this.retrieveEncounterList(evt.year);
      this.fbcCategorySearch.setValue(""); //to reset category search control on change of year
      this.fbcFolderSearch.setValue(""); //to reset folder search control on change of year
      this.fbcMonth.setValue(0);
    }
  }
  monthChanged(evt: any) {
    if (evt) {
      this.resetFields();
      this.categoryLoader = true;
      this.retrieveEncounterList(this.fbcYear.value, evt.month);
      this.monthname = evt.displayname;
      this.fbcCategorySearch.setValue(""); //to reset category search control on change of year
      this.fbcFolderSearch.setValue(""); //to reset folder search control on change of year
    }
  }
  handleClientFilter(searchkey: string) {
    try {
      if (this.AllLstEncounterClients) {
        this.lstEncounterClients = this.AllLstEncounterClients.filter(
          (ele) =>
            ele.clientcodename
              .toLowerCase()
              .includes(searchkey.toLowerCase()) == true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  private SetDefaultYear() {
    if (this.years != undefined && this.years != null) {
      if (this.years.length > 0) {
        var temp = this.years.filter(
          (element) => element.isdefault.toString() === "true"
        );
        if (temp != undefined && temp != null) {
          if (temp.length > 0) {
            this.fbcYear.setValue(temp[0].year);
          } else {
            this.fbcYear.setValue(this.years[0].year);
          }
        } else {
          this.fbcYear.setValue(this.years[0].year);
        }
      }
    }
  }
  getFilterMaster(
    yearDefault: string = "0",
    statusid: string = "0",
    clientid: string = "0"
  ) {
    try {
      this.masterLoader = true;
      this.subscription.add(
        this.filterService
          .getFolderCategoryAndYear(yearDefault, statusid, clientid)
          .subscribe(
            (response) => {
              if (response) {
                if (response.client == null) {
                  this.clsUtility.showInfo(
                    "Login user is not associated with client"
                  );
                  this.lstEncounterClients = [];
                  this.AllLstEncounterClients = [];
                  this.masterLoader = false;
                  return;
                } else {
                  this.lstEncounterClients = response.client;
                  this.AllLstEncounterClients = response.client;
                  if (this.lstEncounterClients.length == 1) {
                    this.fbcEncounterClient.setValue(
                      this.lstEncounterClients[0].nclientid
                    );
                    this.clientname = this.lstEncounterClients[0].clientcodename;
                  }
                }
                this.years = response.year;
                if (this.years == null) {
                  this.fbcYear.reset();
                  this.fbcYear.setValue("");
                }
                if (yearDefault == "0") {
                  this.SetDefaultYear();
                }
                this.categoryLoader = true;
                this.resetFields();
                this.retrieveEncounterList(this.fbcYear.value);
                this.fbcCategorySearch.setValue(""); //to reset category search control on change on client
                this.fbcFolderSearch.setValue("");
              }
              this.masterLoader = false;
            },
            (error) => {
              this.masterLoader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.masterLoader = false;
      this.clsUtility.LogError(error);
    }
  }
  resetFields() {
    this.category = "";
    this.folderGridItems = [];
    this.AllFolderGridItems = [];
    this.fbcViewAck.setValue(false);
    this.verticalText = "";
    // this.RcmDocumentComponent.ResetDocuments();
    this.dataService.SelectedMasterDocId.next(null);
  }
  onMoveOrDeleteDocuments(evt: any) {
    try {
      if (evt) {
        this.dataService.SelectedMasterDocId.next(null);
        this.category = "";
        this.verticalText = "";
        this.retrieveEncounterList(this.fbcYear.value, this.fbcMonth.value);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onImportDocuments() {
    try {
      this.writeLog("Import Documents button clicked", "CLICK");
      this.importDocuments.getFilterMaster();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onMoveDocuments() {
    try {
      this.writeLog("Move Documents button clicked", "CLICK");
      this.moveDocuments.getFilterMaster(0);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onDeleteDocuments() {
    try {
      this.writeLog("Delete Documents button clicked", "CLICK");
      this.deleteDocuments.getFilterMaster();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSubmitDocuments(evt: boolean) {
    try {
      if (evt) {
        $("#importDocumentsModal").modal("hide");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  writeLog(msg: string, useraction: string) {
    try {
      this.auditLog.writeLog(msg, useraction, "RCM Docs", "Documents");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
