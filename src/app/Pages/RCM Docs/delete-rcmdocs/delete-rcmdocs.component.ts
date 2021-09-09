import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { SubSink } from "subsink";
import { FormBuilder, Validators } from "@angular/forms";
import { FilterService } from "../../Services/Common/filter.service";
import { FliterClient } from "src/app/Model/AR Management/Common/Filter/filter";
import {
  GridDataResult,
  SelectableSettings,
  DataStateChangeEvent,
} from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { CoreOperationService } from "../../Services/BT/core-operation.service";
import { DeleteMasterDoc } from "src/app/Model/BT Charge Posting/Order/rcmdoc-note";
import { DataTransferService } from "../../Services/Common/data-transfer.service";
import { WriteAuditLogService } from "../../Services/Common/write-audit-log.service";
declare var $: any;

@Component({
  selector: "app-delete-rcmdocs",
  templateUrl: "./delete-rcmdocs.component.html",
  styleUrls: ["./delete-rcmdocs.component.css"],
})
export class DeleteRCMDocsComponent implements OnInit {
  @Output() onDeleteDocs: EventEmitter<boolean> = new EventEmitter<boolean>();
  loader: boolean;
  selectedDocs: any[] = [];
  private clsUtility: Utility;
  lstEncounterClients: any = [];
  AllLstEncounterClients: any[] = [];
  EncounterClientDefaultValue = { nclientid: 0, clientcodename: "All" };
  monthDefaultValue = { month: 0, displayname: "All" };
  subscription: SubSink = new SubSink();
  years: any[] = [];
  categories: any[] = [];
  allCategories: any[] = [];
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
  changedIn: string = "";
  valueBeforeConfirmation: string;
  documentList: any[] = [];
  public state: State = {
    // Initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
  };
  public selectableSettings: SelectableSettings;
  public documentGridView: GridDataResult;
  confirmation: string;

  constructor(
    private toaster: ToastrService,
    private fb: FormBuilder,
    private filterService: FilterService,
    private coreService: CoreOperationService,
    private dataService: DataTransferService,
    private auditLog: WriteAuditLogService
  ) {
    this.clsUtility = new Utility(toaster);
    this.setSelectableSettings();
    this.setDefaultSorting();
  }

  ngOnInit() {
    // this.getFilterMaster();
  }
  public setSelectableSettings(): void {
    this.selectableSettings = {
      checkboxOnly: true,
    };
  }
  public selectedCallback = (args) => args.dataItem;

  DeleteDocsFormGroup = this.fb.group({
    fcEncounterClient: [0],
    fcMonth: [0],
    fcYear: [""],
    fcCategory: ["", Validators.required],
  });

  get fbcYear() {
    return this.DeleteDocsFormGroup.get("fcYear");
  }
  get fbcEncounterClient() {
    return this.DeleteDocsFormGroup.get("fcEncounterClient");
  }
  get fbcMonth() {
    return this.DeleteDocsFormGroup.get("fcMonth");
  }
  get fbcCategory() {
    return this.DeleteDocsFormGroup.get("fcCategory");
  }

  clientChanged(evt: any) {
    if (evt) {
      if (this.selectedDocs.length > 0) {
        this.changedIn = "client";
        this.valueBeforeConfirmation = this.fbcEncounterClient.value;
        this.confirmation = "selection";
        $("#deleteDocConfirmationModal").modal("show");
      } else {
        this.getFilterMaster("0", "0", evt.nclientid.toString());
        this.fbcMonth.setValue(0);
      }
    }
  }
  yearChanged(evt: any) {
    if (evt) {
      if (this.selectedDocs.length > 0) {
        this.changedIn = "year";
        this.valueBeforeConfirmation = this.fbcYear.value;
        this.confirmation = "selection";
        $("#deleteDocConfirmationModal").modal("show");
      } else {
        this.retrieveEncounterList(evt.year);
        this.fbcMonth.setValue(0);
      }
    }
  }
  monthChanged(evt: any) {
    if (evt) {
      if (this.selectedDocs.length > 0) {
        this.changedIn = "month";
        this.valueBeforeConfirmation = this.fbcMonth.value;
        this.confirmation = "selection";
        $("#deleteDocConfirmationModal").modal("show");
      } else {
        this.retrieveEncounterList(this.fbcYear.value, evt.month);
      }
    }
  }
  categoryChanged(evt: any) {
    try {
      if (this.selectedDocs.length > 0) {
        this.changedIn = "category";
        this.valueBeforeConfirmation = this.fbcCategory.value;
        this.confirmation = "selection";
        $("#deleteDocConfirmationModal").modal("show");
      } else {
        this.retrieveEncounterList(
          this.fbcYear.value,
          this.fbcMonth.value,
          evt.category
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  handleCategoryFilter(searchkey: string) {
    try {
      if (this.allCategories) {
        this.categories = this.allCategories.filter(
          (ele) =>
            ele.category.toLowerCase().includes(searchkey.toLowerCase()) == true
        );
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  retrieveEncounterList(
    year: string,
    month: number = 0,
    category: string = "0"
  ) {
    try {
      if (this.state.filter != null && this.state.filter != undefined) {
        this.state.filter = {
          logic: "and",
          filters: [],
        };
      }
      if (category == "0") {
        this.fbcCategory.reset();
      }
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
        category: category,
        client: client,
        folder: "0",
        isacknowledged: true,
        month: month,
      };
      this.loader = true;
      this.subscription.add(
        this.filterService.retrieveEncounterMaster(inputJson).subscribe(
          (queue) => {
            if (queue != null) {
              if (queue["categorylist"] != null) {
                this.categories = queue["categorylist"];
                this.allCategories = queue["categorylist"];
              } else {
                this.categories = [];
                this.allCategories = [];
              }
              if (queue["originalfiles"] != null) {
                this.documentList = queue["originalfiles"];
                this.documentGridView = process(this.documentList, this.state);
              } else {
                this.documentList = [];
                this.documentGridView = null;
              }
            }
            this.loader = false;
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
  getFilterMaster(
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
              if (response) {
                if (response.client == null) {
                  this.clsUtility.showInfo(
                    "Login user is not associated with client"
                  );
                  this.lstEncounterClients = [];
                  this.AllLstEncounterClients = [];
                  this.loader = false;
                  return;
                } else {
                  this.lstEncounterClients = response.client;
                  this.AllLstEncounterClients = response.client;
                  if (this.lstEncounterClients.length == 1) {
                    this.fbcEncounterClient.setValue(
                      this.lstEncounterClients[0].nclientid
                    );
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
                this.retrieveEncounterList(this.fbcYear.value);
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
  onDeleteClick() {
    try {
      this.confirmation = "delete";
      $("#deleteDocConfirmationModal").modal("show");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  async deleteDocument() {
    try {
      this.loader = true;
      let successcount: number = 0;
      let errorcount: number = 0;
      let successDocsName: string[] = [];
      let errorDocsName: string[] = [];
      let totalSelectedCount: number = this.selectedDocs.length;
      for (let i = 0; i < totalSelectedCount; i++) {
        let inputJson = new DeleteMasterDoc();
        inputJson.masterdocid = this.selectedDocs[i].masterdocid;
        inputJson.modifiedon = this.clsUtility.currentDateTime();
        inputJson.ordernote = "Duplicate accessions";
        inputJson.status = false;
        inputJson.userid = this.dataService.SelectedGCPUserid.toString();
        inputJson.username = this.dataService.loginUserName;
        await this.coreService
          .deleteMasterDocument(inputJson)
          .toPromise()
          .then(
            (data) => {
              if (data) {
                this.writeLog(
                  "Document deleted successfully: " + JSON.stringify(inputJson),
                  "UPDATE"
                );
                successcount++;
                successDocsName.push(this.selectedDocs[i].documentname);
              } else {
                this.writeLog(
                  "Error while deleting document: " + JSON.stringify(inputJson),
                  "UPDATE"
                );
                errorcount++;
                errorDocsName.push(this.selectedDocs[i].documentname);
              }
            },
            (error) => {
              this.clsUtility.LogError(error);
            }
          );
      }
      $("#deleteDocumentsModal").modal("hide");
      this.onClose();
      this.onDeleteDocs.next(true);
      if (totalSelectedCount == successcount) {
        this.clsUtility.showSuccess("Document(s) deleted successfully");
      } else if (totalSelectedCount == errorcount) {
        this.clsUtility.LogError("Error while deleting document(s)");
      } else {
        this.clsUtility.showInfo(
          "Successfully deleted documents: " +
            successDocsName.join(", ") +
            "\n Error while deleting documents: " +
            errorDocsName.join(", ")
        );
      }
      this.loader = false;
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
  onClose() {
    try {
      this.selectedDocs = [];
      this.fbcCategory.reset();
      this.state = {};
      this.setDefaultSorting();
      this.categories = [];
      this.allCategories = [];
      this.documentList = [];
      this.documentGridView = null;
      this.fbcMonth.setValue(0);
      this.fbcEncounterClient.setValue(0);
      // this.getFilterMaster();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseSelectionConfirmation() {
    try {
      if (this.changedIn == "category") {
        this.fbcCategory.setValue(this.valueBeforeConfirmation);
      } else if (this.changedIn == "client") {
        this.fbcEncounterClient.setValue(this.valueBeforeConfirmation);
      } else if (this.changedIn == "year") {
        this.fbcYear.setValue(this.valueBeforeConfirmation);
      } else if (this.changedIn == "month") {
        this.fbcMonth.setValue(this.valueBeforeConfirmation);
      }
      this.addModalOpenClass();
      $("#deleteDocConfirmationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onYesSelectionConfirmation() {
    try {
      this.selectedDocs = [];
      if (this.changedIn == "client") {
        this.getFilterMaster(
          "0",
          "0",
          this.fbcEncounterClient.value.toString()
        );
        this.fbcMonth.setValue(0);
      } else if (this.changedIn == "year") {
        this.retrieveEncounterList(this.fbcYear.value);
        this.fbcMonth.setValue(0);
      } else if (this.changedIn == "month") {
        this.retrieveEncounterList(this.fbcYear.value, this.fbcMonth.value);
      } else if (this.changedIn == "category") {
        this.retrieveEncounterList(
          this.fbcYear.value,
          this.fbcMonth.value,
          this.fbcCategory.value
        );
      }
      this.addModalOpenClass();
      $("#deleteDocConfirmationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onYesDeleteConfirmation() {
    try {
      this.addModalOpenClass();
      $("#deleteDocConfirmationModal").modal("hide");
      this.deleteDocument();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onCloseDeleteConfirmation() {
    try {
      this.addModalOpenClass();
      $("#deleteDocConfirmationModal").modal("hide");
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  addModalOpenClass() {
    try {
      $("#deleteDocConfirmationModal")
        .modal()
        .on("hidden.bs.modal", function (e) {
          $("body").addClass("modal-open");
        });
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    if (state.filter != undefined && state.filter != null) {
      state.filter.filters.forEach((f) => {
        if (f["field"] == "documentname") {
          if (f["value"] != null) {
            f["value"] = f["value"].trim();
          }
        }
      });
    }
    this.documentGridView = process(this.documentList, this.state);
  }
  // checkConfirmationModalOpen(): boolean {
  //   try {
  //     let element: HTMLElement = document.getElementById(
  //       "deleteDocConfirmationModal"
  //     );
  //     if (element.style.display == "" || element.style.display == "none") {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
  setDefaultSorting() {
    try {
      this.state.sort = [
        {
          field: "documentname",
          dir: "asc",
        },
      ];
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
