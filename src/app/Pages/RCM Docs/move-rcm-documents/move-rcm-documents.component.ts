import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { FilterService } from "src/app/Pages/Services/Common/filter.service";
import { FliterClient } from "src/app/Model/AR Management/Common/Filter/filter";
import { DragulaService } from "ng2-dragula";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { MoveDocumentSave } from "src/app/Model/BT Charge Posting/Order/rcmdoc-note";
import { CoreOperationService } from "../../Services/BT/core-operation.service";
import { WriteAuditLogService } from "../../Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-move-rcm-documents",
  templateUrl: "./move-rcm-documents.component.html",
  styleUrls: ["./move-rcm-documents.component.css"],
})
export class MoveRcmDocumentsComponent implements OnInit, OnDestroy {
  clsUtility: Utility;
  subscription: SubSink = new SubSink();
  @Output() onSaveMoveDocuments: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();
  public monthDefaultValue = { month: 0, displayname: "All" };
  lstEncounterClients: any[] = [];
  AllLstEncounterClients: any[] = [];
  years_1: any = [];
  years_2: any = [];
  months: any[] = [];
  documentList_1: any[] = [];
  documentList_2: any[] = [];
  allCategories_1: any[] = [];
  categories_1: any[] = [];
  allCategories_2: any[] = [];
  categories_2: any[] = [];
  saveJsonArray: any[] = [];
  allDocumentList_1: any[] = [];
  allDocumentList_2: any[] = [];
  loader: boolean;
  valueBeforeConfirmation: string;
  appliedFilterBeforeConfirmation: number;
  documentListWithoutMovedDocs_2: any[] = [];
  documentListWithoutMovedDocs_1: any[] = [];
  changedIn: string = "";

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private dragulaService: DragulaService,
    private dataService: DataTransferService,
    private coreService: CoreOperationService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    // this.getFilterMaster(0);
    this.formValueChanged();
    const bag: any = this.dragulaService.find("drag-bag");
    if (bag) {
      this.dragulaService.destroy("drag-bag");
    }
    let thisvar = this;
    this.dragulaService.createGroup("drag-bag", {
      accepts: function (el, target, source, sibling) {
        if (
          source.id !== target.id &&
          thisvar.fbcCategory_1.value &&
          thisvar.fbcCategory_2.value
        ) {
          return true; // elements can be dropped in any of the `containers` by default
        } else {
          return false; //should not be dropped within same container
        }
      },
    });
    this.subscription.add(
      this.dragulaService.dropModel("drag-bag").subscribe((data) => {
        data.item.ismoved = true;
        const droppedItem = data.item;
        let filter: number = data.target.id == "side1" ? 1 : 2;
        this["allDocumentList_" + filter] = data.targetModel;
        let saveObject = {
          oldcategoryname: droppedItem.category,
          newcategoryname: this.getValueOfControl(
            this["fbcCategory_" + filter]
          ),
          masterdocid: droppedItem.masterdocid,
          documentname: droppedItem.documentname,
          categoryInfo: droppedItem,
          clientid: droppedItem.clientid,
          clientname: droppedItem.clientname,
        };
        if (saveObject.oldcategoryname == saveObject.newcategoryname) {
          data.item.ismoved = false;
          let index: number = this.saveJsonArray.findIndex(
            (ele) => ele.masterdocid == saveObject.masterdocid
          );
          this.saveJsonArray.splice(index, 1);
        } else {
          let index = this.saveJsonArray.findIndex(
            (ele) => ele.masterdocid == saveObject.masterdocid
          );
          if (index !== -1) this.saveJsonArray.splice(index, 1);
          this.saveJsonArray.push(saveObject);
        }
      })
    );
  }
  MoveDocumentsFormGroup = this.fb.group({
    fcEncounterClient: ["", Validators.required],
    fcMonth_1: [0, Validators.required],
    fcYear_1: ["", Validators.required],
    fcCategory_1: ["", Validators.required],
    fcMonth_2: [0, Validators.required],
    fcYear_2: ["", Validators.required],
    fcCategory_2: ["", Validators.required],
    fcSearchByDoc_1: [""],
    fcSearchByDoc_2: [""],
  });
  formValueChanged() {
    try {
      this.fbcSearchByDoc_1.valueChanges.subscribe((data) => {
        if (data) {
          this.documentList_1 = this.allDocumentList_1.filter((ele) =>
            ele.documentname.toLowerCase().includes(data.toLowerCase().trim())
          );
        } else {
          this.documentList_1 = this.allDocumentList_1.slice(0);
        }
      });
      this.fbcSearchByDoc_2.valueChanges.subscribe((data) => {
        if (data) {
          this.documentList_2 = this.allDocumentList_2.filter((ele) =>
            ele.documentname.toLowerCase().includes(data.toLowerCase().trim())
          );
        } else {
          this.documentList_2 = this.allDocumentList_2.slice(0);
        }
      });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  get fbcYear_1() {
    return this.MoveDocumentsFormGroup.get("fcYear_1");
  }
  get fbcYear_2() {
    return this.MoveDocumentsFormGroup.get("fcYear_2");
  }
  get fbcEncounterClient() {
    return this.MoveDocumentsFormGroup.get("fcEncounterClient");
  }
  get fbcMonth_1() {
    return this.MoveDocumentsFormGroup.get("fcMonth_1");
  }
  get fbcMonth_2() {
    return this.MoveDocumentsFormGroup.get("fcMonth_2");
  }
  get fbcCategory_1() {
    return this.MoveDocumentsFormGroup.get("fcCategory_1");
  }
  get fbcCategory_2() {
    return this.MoveDocumentsFormGroup.get("fcCategory_2");
  }
  get fbcSearchByDoc_1() {
    return this.MoveDocumentsFormGroup.get("fcSearchByDoc_1");
  }
  get fbcSearchByDoc_2() {
    return this.MoveDocumentsFormGroup.get("fcSearchByDoc_2");
  }

  categoryChanged(evt: any, filter: number) {
    try {
      if (this.saveJsonArray.length > 0) {
        this.changedIn = "category";
        this.valueBeforeConfirmation = this.getValueOfControl(
          this["fbcCategory_" + filter]
        );
        this.appliedFilterBeforeConfirmation = filter;
        $("#confirmationModal").modal("show");
      } else {
        let otherFilter: number = filter == 1 ? 2 : 1;
        let otherCategorySelected = this.getValueOfControl(
          this["fbcCategory_" + otherFilter]
        );
        if (evt.category == otherCategorySelected) {
          this.clsUtility.showInfo(
            "User can not move documents in between same category"
          );
        }
        this.retrieveEncounterList(
          filter,
          this.getValueOfControl(this["fbcYear_" + filter]),
          this.getValueOfControl(this["fbcMonth_" + filter]),
          evt.category
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  clientChanged(evt: any) {
    if (evt) {
      if (this.saveJsonArray.length > 0) {
        this.changedIn = "client";
        this.valueBeforeConfirmation = this.fbcEncounterClient.value;
        $("#confirmationModal").modal("show");
      } else {
        this.getFilterMaster(0, "0", "0", evt.nclientid.toString());
        this.fbcMonth_1.setValue(0);
        this.fbcMonth_2.setValue(0);
      }
    }
  }
  yearChanged(evt: any, filter: number) {
    if (evt) {
      if (this.saveJsonArray.length > 0) {
        this.changedIn = "year";
        this.valueBeforeConfirmation = this.getValueOfControl(
          this["fbcYear_" + filter]
        );
        this.appliedFilterBeforeConfirmation = filter;
        $("#confirmationModal").modal("show");
      } else {
        this.retrieveEncounterList(filter, evt.year);
        this["fbcMonth_" + filter].setValue(0);
        this.setValueOfControl(this["fbcMonth_" + filter], 0);
      }
    }
  }
  monthChanged(evt: any, filter: number) {
    if (evt) {
      if (this.saveJsonArray.length > 0) {
        this.changedIn = "month";
        this.valueBeforeConfirmation = this.getValueOfControl(
          this["fbcMonth_" + filter]
        );
        this.appliedFilterBeforeConfirmation = filter;
        $("#confirmationModal").modal("show");
      } else {
        this.retrieveEncounterList(
          filter,
          this.getValueOfControl(this["fbcYear_" + filter]),
          evt.month
        );
      }
    }
  }
  onYesClick() {
    try {
      if (this.fbcCategory_1.value == this.fbcCategory_2.value) {
        this.clsUtility.showInfo(
          "User can not move documents in between same category"
        );
      }
      let otherFilter: number =
        this.appliedFilterBeforeConfirmation == 1 ? 2 : 1;
      this["documentListWithoutMovedDocs_" + otherFilter].forEach(
        (item) => (item.ismoved = false)
      );
      this["documentList_" + otherFilter] = this[
        "documentListWithoutMovedDocs_" + otherFilter
      ].slice(0);
      this["allDocumentList_" + otherFilter] = this[
        "documentListWithoutMovedDocs_" + otherFilter
      ].slice(0);
      this.setValueOfControl(this["fbcSearchByDoc_" + otherFilter], "");
      this.saveJsonArray = [];
      if (this.changedIn == "client") {
        this.getFilterMaster(
          0,
          "0",
          "0",
          this.fbcEncounterClient.value.toString()
        );
        this.fbcMonth_1.setValue(0);
        this.fbcMonth_2.setValue(0);
      } else if (this.changedIn == "year") {
        this.retrieveEncounterList(
          this.appliedFilterBeforeConfirmation,
          this.getValueOfControl(
            this["fbcYear_" + this.appliedFilterBeforeConfirmation]
          )
        );
        // this["fbcMonth_" + this.appliedFilterBeforeConfirmation].setValue(0);
        this.setValueOfControl(
          this["fbcMonth_" + this.appliedFilterBeforeConfirmation],
          0
        );
      } else if (this.changedIn == "month") {
        this.retrieveEncounterList(
          this.appliedFilterBeforeConfirmation,
          this.getValueOfControl(
            this["fbcYear_" + this.appliedFilterBeforeConfirmation]
          ),
          this.getValueOfControl(
            this["fbcMonth_" + this.appliedFilterBeforeConfirmation]
          )
        );
      } else if (this.changedIn == "category") {
        this.retrieveEncounterList(
          this.appliedFilterBeforeConfirmation,
          this.getValueOfControl(
            this["fbcYear_" + this.appliedFilterBeforeConfirmation]
          ),
          this.getValueOfControl(
            this["fbcMonth_" + this.appliedFilterBeforeConfirmation]
          ),
          this.getValueOfControl(
            this["fbcCategory_" + this.appliedFilterBeforeConfirmation]
          )
        );
      }
      this.addModalOpenClass();
      $("#confirmationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  addModalOpenClass() {
    try {
      $("#confirmationModal")
        .modal()
        .on("hidden.bs.modal", function (e) {
          $("body").addClass("modal-open");
        });
    } catch (error) {
      this.clsUtility.LogError(error);
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
  handleCategoryFilter(searchkey: string, filter: number) {
    try {
      if (this["allCategories_" + filter]) {
        this["categories_" + filter] = this["allCategories_" + filter].filter(
          (ele) =>
            ele.category.toLowerCase().includes(searchkey.toLowerCase()) == true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onClose() {
    try {
      this.MoveDocumentsFormGroup.reset();
      this.fbcMonth_1.setValue(0);
      this.fbcMonth_2.setValue(0);
      this.years_1 = [];
      this.years_2 = [];
      this.months = [];
      this.categories_1 = [];
      this.categories_2 = [];
      this.allCategories_1 = [];
      this.allCategories_2 = [];
      this.documentList_1 = [];
      this.documentList_2 = [];
      this.allDocumentList_1 = [];
      this.allDocumentList_2 = [];
      this.saveJsonArray = [];
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onSaveClick() {
    try {
      let createdby = this.dataService.loginUserName;
      let modifiedon = this.clsUtility.currentDateTime();
      if (this.saveJsonArray.length == 0) {
        this.clsUtility.showInfo(
          "There is no exchange of document(s) between categories"
        );
        return;
      }
      let saveMoveDocs: MoveDocumentSave[] = [];
      this.saveJsonArray.forEach((ele) => {
        let moveDocSaveItem: MoveDocumentSave = new MoveDocumentSave();
        moveDocSaveItem.oldcategoryname = ele.oldcategoryname;
        moveDocSaveItem.newcategoryname = ele.newcategoryname;
        moveDocSaveItem.createdby = createdby;
        moveDocSaveItem.modifiedon = modifiedon;
        moveDocSaveItem.masterdocid = ele.masterdocid;
        moveDocSaveItem.clientid = ele.clientid;
        moveDocSaveItem.clientname = ele.clientname;
        moveDocSaveItem.documentname = ele.documentname;
        saveMoveDocs.push(moveDocSaveItem);
      });
      this.loader = true;
      this.subscription.add(
        this.coreService.saveMoveDocuments(saveMoveDocs).subscribe(
          (data) => {
            if (data) {
              this.clsUtility.showSuccess("Document(s) moved successfully");
              this.writeLog(
                "Successful Moved Document List: " +
                  JSON.stringify(saveMoveDocs),
                "UPDATE"
              );
              this.onClose();
              this.onSaveMoveDocuments.next(true);
              $("#moveDocumentsModal").modal("hide");
            } else {
              this.writeLog(
                "Error Moved Document List: " + JSON.stringify(saveMoveDocs),
                "UPDATE"
              );
              this.clsUtility.LogError("Error while moving document(s)");
            }
            this.loader = false;
          },
          (error) => {
            this.loader = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.loader = false;
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
  assignAllMonths() {
    try {
      this.months = [
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
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getFilterMaster(
    filter: number,
    yearDefault: string = "0",
    statusid: string = "0",
    clientid: string = "0"
  ) {
    try {
      this.loader = true;
      this.subscription.add(
        this.filterService
          .getFolderCategoryAndYear(yearDefault, statusid, clientid)
          .subscribe(
            (response) => {
              this.loader = false;
              if (response) {
                if (response.client == null) {
                  this.clsUtility.showInfo(
                    "Login user is not associated with client"
                  );
                  this.lstEncounterClients = [];
                  this.AllLstEncounterClients = [];
                  return;
                } else {
                  this.lstEncounterClients = response.client;
                  this.AllLstEncounterClients = response.client;
                  if (this.lstEncounterClients.length == 1) {
                    this.fbcEncounterClient.setValue(
                      this.lstEncounterClients[0].nclientid
                    );
                    this.years_1 = response.year;
                    this.years_2 = response.year;
                    if (response.year != null) {
                      this.assignAllMonths();
                    }
                    this.SetDefaultYear(1);
                    this.SetDefaultYear(2);
                    this.retrieveEncounterList(filter, this.fbcYear_1.value);
                  }
                }
                if (clientid == "0") {
                  //on ngoninit
                  return;
                }
                this.years_1 = response.year;
                if (this.years_1 == null) {
                  this.fbcYear_1.reset();
                  this.fbcYear_1.setValue("");
                } else {
                  this.assignAllMonths();
                }
                this.years_2 = response.year;
                if (this.years_2 == null) {
                  this.fbcYear_2.reset();
                  this.fbcYear_2.setValue("");
                }
                this.SetDefaultYear(1);
                this.SetDefaultYear(2);
                this.retrieveEncounterList(filter, this.fbcYear_1.value);
              }
            },
            (error) => {
              this.loader = false;
              this.clsUtility.LogError(error);
            }
          )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  retrieveEncounterList(
    filter: number,
    year: string,
    month: number = 0,
    category: string = "0"
  ) {
    try {
      let SelectedClient: any;
      SelectedClient = this.lstEncounterClients.find(
        (x) => x.nclientid === this.fbcEncounterClient.value.toString()
      );
      if (filter != 0) {
        this["documentList_" + filter] = [];
      }
      var client = [];
      if (SelectedClient) {
        const filterclient = new FliterClient();
        filterclient.clientname = SelectedClient.clientcodename;
        filterclient.clientid = SelectedClient.nclientid;
        client.push(filterclient);
      }

      let inputJson = {
        cabinet: year ? year : "0",
        category: category ? category : "0",
        client: client,
        folder: "0",
        isacknowledged: true,
        month: month,
      };
      this.loader = true;
      this.subscription.add(
        this.filterService.retrieveEncounterMaster(inputJson).subscribe(
          (queue) => {
            this.loader = false;
            if (queue != null) {
              if (filter == 0) {
                //on ngoninit
                if (category == "0") {
                  this.fbcSearchByDoc_1.setValue("");
                  this.fbcSearchByDoc_2.setValue("");
                  this.fbcCategory_1.reset();
                  this.fbcCategory_2.reset();
                  this.documentList_1 = [];
                  this.documentList_2 = [];
                  this.allDocumentList_1 = [];
                  this.allDocumentList_2 = [];
                  if (queue["categorylist"] != null) {
                    this.categories_1 = queue["categorylist"];
                    this.allCategories_1 = queue["categorylist"];
                    this.categories_2 = queue["categorylist"];
                    this.allCategories_2 = queue["categorylist"];
                  } else {
                    this.categories_1 = [];
                    this.allCategories_1 = [];
                    this.categories_2 = [];
                    this.allCategories_2 = [];
                  }
                }
              } else {
                if (category == "0") {
                  this.resetFormControl(this["fbcCategory_" + filter]);
                  if (queue["categorylist"] != null) {
                    this["categories_" + filter] = queue["categorylist"];
                    this["allCategories_" + filter] = queue["categorylist"];
                  } else {
                    this["categories_" + filter] = [];
                    this["allCategories_" + filter] = [];
                  }
                }
                if (queue["originalfiles"] != null) {
                  this["allDocumentList_" + filter] = queue["originalfiles"];
                  this["documentList_" + filter] = queue["originalfiles"];
                  this["documentListWithoutMovedDocs_" + filter] = queue[
                    "originalfiles"
                  ].slice(0);
                } else {
                  this["allDocumentList_" + filter] = [];
                  this["documentList_" + filter] = [];
                  this["documentListWithoutMovedDocs_" + filter] = [];
                }
                this.setValueOfControl(this["fbcSearchByDoc_" + filter], "");
              }
            }
          },
          (err) => {
            this.loader = false;
          }
        )
      );
    } catch (error) {
      this.loader = false;
      this.clsUtility.LogError(error);
    }
  }
  private SetDefaultYear(filter: number) {
    if (
      this["years_" + filter] != undefined &&
      this["years_" + filter] != null
    ) {
      if (this["years_" + filter].length > 0) {
        var temp = this["years_" + filter].filter(
          (element) => element.isdefault.toString() === "true"
        );
        if (temp != undefined && temp != null) {
          if (temp.length > 0) {
            this.setValueOfControl(this["fbcYear_" + filter], temp[0].year);
          } else {
            this.setValueOfControl(
              this["fbcYear_" + filter],
              this["years_" + filter][0].year
            );
          }
        } else {
          this.setValueOfControl(
            this["fbcYear_" + filter],
            this["years_" + filter][0].year
          );
        }
      }
    }
  }
  getValueOfControl(formControl: FormControl): any {
    return formControl.value;
  }
  setValueOfControl(formControl: FormControl, value: any): void {
    formControl.setValue(value);
  }
  resetFormControl(formControl: FormControl): void {
    formControl.reset();
  }
  onCloseConfirmation() {
    try {
      if (this.changedIn == "category") {
        this.setValueOfControl(
          this["fbcCategory_" + this.appliedFilterBeforeConfirmation],
          this.valueBeforeConfirmation
        );
      } else if (this.changedIn == "client") {
        this.fbcEncounterClient.setValue(this.valueBeforeConfirmation);
      } else if (this.changedIn == "year") {
        this.setValueOfControl(
          this["fbcYear_" + this.appliedFilterBeforeConfirmation],
          this.valueBeforeConfirmation
        );
      } else if (this.changedIn == "month") {
        this.setValueOfControl(
          this["fbcMonth_" + this.appliedFilterBeforeConfirmation],
          this.valueBeforeConfirmation
        );
      }
      this.addModalOpenClass();
      $("#confirmationModal").modal("hide");
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
  // checkConfirmationModalOpen(): boolean {
  //   try {
  //     let element: HTMLElement = document.getElementById("confirmationModal");
  //     if (element.style.display == "" || element.style.display == "none") {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
}
