import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { SubSink } from "subsink";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { Utility } from "src/app/Model/utility";
import { ToastrService } from "ngx-toastr";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import {
  GridDataResult,
  RowClassArgs,
  GridComponent,
  FilterService,
} from "@progress/kendo-angular-grid";
import {
  SortDescriptor,
  orderBy,
  filterBy,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import { AddCommentComponent } from "src/app/Pages/Common/add-comment/add-comment.component";
declare var $: any;
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
  encapsulation: ViewEncapsulation.None,
  selector: "app-document-history",
  templateUrl: "./document-history.component.html",
  styleUrls: ["./document-history.component.css"],
})
export class DocumentHistoryComponent implements OnInit, OnDestroy {
  subscription: SubSink = new SubSink();
  masterdocid: string = "";
  clsUtility: Utility;
  loadingGrid: boolean;
  documentHistoryGridView: GridDataResult;
  sort: SortDescriptor[] = [
    {
      field: "createdon",
      dir: "desc",
    },
  ];
  filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };
  documentHistoryItems: any[] = [];
  deleteNoteId: string;
  @ViewChild("AddCommentComponent")
  private AddCommentComponent: AddCommentComponent;
  queAnswersCount: {
    answeredquestions: number;
    questions: number;
    unansweredquestions: number;
  } = {
    answeredquestions: 0,
    questions: 0,
    unansweredquestions: 0,
  };
  inputDeleteMsg: string;
  msgFor: string = "";
  @Input() showAddtoPracticeBucket: boolean = false;
  @Input() calledFrom: string = "";
  accessionnumber: string;
  originalDocumentInfo: any = [];
  vwDeleteRcmDocNote: boolean = false;
  vwDeleteRcmDocAnswer: boolean = false;

  constructor(
    private dataService: DataTransferService,
    private toastr: ToastrService,
    private coreService: CoreOperationService,
    private cdr: ChangeDetectorRef
  ) {
    this.clsUtility = new Utility(toastr);
  }

  ngOnInit() {
    if (this.calledFrom == "viewmasterdocument") {
      this.subscription.add(
        this.dataService.ViewDocMasterDocId.subscribe((data) => {
          this.ResetDocumentHistory();
          if (data) {
            this.masterdocid = data;
            this.getDocumentHistory();
          }
        })
      );
    } else {
      this.subscription.add(
        this.dataService.SelectedOrderQueueGroupCode.subscribe((data) => {
          if (data) {
            // this.accessionnumber = data;
            // this.getDocumentHistoryByAccession();
            if (this.calledFrom == "assistance") {
              var datasource = data.split(":");
              if (datasource[0] == "SendToPractice") {
                this.accessionnumber = data.substring(data.indexOf(":") + 1);
                this.getDocumentHistoryByAccession();
              }
            } else {
              this.accessionnumber = data;
              this.getDocumentHistoryByAccession();
            }
          }
        })
      );
      this.subscription.add(
        this.dataService.SelectedMasterDocId.subscribe((data) => {
          this.ResetDocumentHistory();
          if (data != "" && data != null) {
            if (
              this.calledFrom == "encounteraction" ||
              this.calledFrom == "assistance"
            ) {
              this.masterdocid = data;
            } else {
              this.masterdocid = data;
              this.getDocumentHistory();
            }
          }
        })
      );
      this.subscription.add(
        this.dataService.navSubject.subscribe((data) => {
          if (data != null || data != undefined) {
            this.vwDeleteRcmDocNote = data.viewDeleteRcmDocNote;
            this.vwDeleteRcmDocAnswer = data.viewDeleteRcmDocAnswer;
          }
        })
      );
    }
  }
  public showExpandOnlyForQuestion(dataItem: any, index: number): boolean {
    return dataItem.commentcode == "que";
  }
  ResetDocumentHistory() {
    try {
      if (!!document.getElementById("historyCollapseBtn"))
        document.getElementById("historyCollapseBtn").click();
      this.filter = {
        logic: "and",
        filters: [],
      };
      this.sort = [
        {
          field: "createdon",
          dir: "desc",
        },
      ];
      this.documentHistoryItems = [];
      this.documentHistoryGridView = null;
      this.resetCount();
      this.dataService.isMarkedAcknowledged.next(false);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  resetCount() {
    try {
      this.queAnswersCount.answeredquestions = 0;
      this.queAnswersCount.questions = 0;
      this.queAnswersCount.unansweredquestions = 0;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  public collapseAll(mastergrid: GridComponent) {
    try {
      if (this.documentHistoryGridView) {
        this.documentHistoryGridView.data.forEach((item, idx) => {
          mastergrid.collapseRow(idx);
        });
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  getDocumentHistory() {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.coreService.getDocumentHistory(this.masterdocid).subscribe(
          (data) => {
            if (data) {
              if (data.notes) {
                this.documentHistoryItems = data.notes;
                this.loadGridView();
              } else {
                this.documentHistoryItems = [];
                this.documentHistoryGridView = null;
              }
              this.queAnswersCount = data.queCount;
            } else {
              this.documentHistoryItems = [];
              this.documentHistoryGridView = null;
              this.resetCount();
            }
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  getDocumentHistoryByAccession() {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.coreService.getNotesByAccession(this.accessionnumber).subscribe(
          (data) => {
            if (data) {
              if (data.notes) {
                this.documentHistoryItems = data.notes;
                this.loadGridView();
              } else {
                this.documentHistoryItems = [];
                this.documentHistoryGridView = null;
              }
              this.queAnswersCount = data.queCount;
              this.originalDocumentInfo = data.originalDocInfo;
            } else {
              this.documentHistoryItems = [];
              this.documentHistoryGridView = null;
              this.resetCount();
            }
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
            this.clsUtility.LogError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sortChange(sort: SortDescriptor[]): void {
    try {
      this.sort = sort;
      this.collapseBtnClick();
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  loadGridView(): void {
    try {
      this.documentHistoryGridView = {
        data: orderBy(
          filterBy(this.documentHistoryItems, this.filter),
          this.sort
        ),
        total: this.documentHistoryItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onDeleteNote(evt: any) {
    try {
      this.msgFor = "Note";
      this.inputDeleteMsg = "Are you sure you want to delete note?";
      this.deleteNoteId = evt.dataItem.noteid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onDeleteAnswer(evt: any) {
    try {
      this.msgFor = "Answer";
      this.inputDeleteMsg = "Are you sure you want to delete answer?";
      this.deleteNoteId = evt.dataItem.noteid;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputDeleteResult(evt: boolean) {
    try {
      if (this.calledFrom == "assistance") {
        $("#deleteNoteConfirmationModal")
          .modal()
          .on("hidden.bs.modal", function (e) {
            $("body").addClass("modal-open");
          });
      }
      $("#deleteNoteConfirmationModal").modal("hide");
      if (evt) {
        this.inactivateNote();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  inactivateNote() {
    try {
      this.subscription.add(
        this.coreService
          .updateDocumentNoteStatus(this.deleteNoteId, false)
          .subscribe(
            (data) => {
              if (data) {
                this.clsUtility.showSuccess(
                  this.msgFor + " deleted successfully"
                );
                let selectedNoteItem = this.documentHistoryItems.find(
                  (ele) => ele.noteid == this.deleteNoteId
                );
                if (selectedNoteItem) {
                  if (selectedNoteItem.commentcode == "ackw")
                    this.dataService.isMarkedAcknowledged.next(true);
                }
                if (
                  this.calledFrom == "encounteraction" ||
                  this.calledFrom == "assistance"
                ) {
                  this.getDocumentHistoryByAccession();
                } else {
                  this.getDocumentHistory();
                }
              } else {
                this.clsUtility.LogError(
                  "Error while deleting " + this.msgFor.toLowerCase()
                );
              }
            },
            (error) => {
              this.clsUtility.LogError(error);
            }
          )
      );
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
  public rowCallback(context: RowClassArgs) {
    const isdeleted = context.dataItem.notestatus == false;
    return {
      deleted: isdeleted,
    };
  }
  outputCommentResult(event: boolean) {
    try {
      //call on save and cancel click
      if (event) {
        if (
          this.calledFrom == "encounteraction" ||
          this.calledFrom == "assistance"
        ) {
          this.getDocumentHistoryByAccession();
        } else {
          this.getDocumentHistory();
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddAnswer(dataItem: any) {
    try {
      dataItem.isExpand = !dataItem.isExpand;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  onAddtoPracticeBucket(dataItem: any, ispracticebucket: boolean) {
    try {
      // console.log(JSON.stringify(dataItem));
      try {
        this.subscription.add(
          this.coreService
            .updateQuestionToPracticeBucket(
              dataItem.noteid,
              !ispracticebucket,
              this.originalDocumentInfo.accessionreferenceno
            )
            .subscribe(
              (data) => {
                if (data) {
                  if (ispracticebucket)
                    this.clsUtility.showSuccess(
                      "Page removed from practice bucket"
                    );
                  else
                    this.clsUtility.showSuccess(
                      "Page added to practice bucket"
                    );
                  // let selectedNoteItem = this.documentHistoryItems.find(
                  //   (ele) => ele.noteid == this.deleteNoteId
                  // );
                  // if (selectedNoteItem) {
                  //   if (selectedNoteItem.commentcode == "ackw")
                  //     this.dataService.isMarkedAcknowledged.next(true);
                  // }
                  if (
                    this.calledFrom == "encounteraction" ||
                    this.calledFrom == "assistance"
                  ) {
                    this.getDocumentHistoryByAccession();
                  } else {
                    this.getDocumentHistory();
                  }
                  // this.getDocumentHistory();
                } else {
                  this.clsUtility.LogError(
                    "Error while adding page to practice bucket " +
                      this.msgFor.toLowerCase()
                  );
                }
              },
              (error) => {
                this.clsUtility.LogError(error);
              }
            )
        );
      } catch (error) {
        this.clsUtility.LogError(error);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  gridFilter(evt: CompositeFilterDescriptor) {
    try {
      // console.log(evt);
      this.filter = evt;
      this.filter.filters.forEach((element) => {
        if (element["field"] != "notetype")
          element["value"] = element["value"].trim();
      });
      this.collapseBtnClick();
      this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  collapseBtnClick() {
    try {
      if (!!document.getElementById("historyCollapseBtn"))
        document.getElementById("historyCollapseBtn").click();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  noteTypeChange(evt: any, filterService: FilterService) {
    try {
      // console.log(evt);
      // this.filter.filters.forEach((element, ind, object) => {
      //   if (element["field"] == "notetype") {
      //     object.splice(ind, 1);
      //   }
      // });
      // let index = this.filter.filters.findIndex(
      //   (ele) => ele["field"] == "notetype"
      // );
      // if (index != -1) {
      //   this.filter.filters.splice(index, 1);
      // }
      // if (evt.value != -1) {
      //   this.filter.filters.push({
      //     field: "notetype",
      //     value: evt.value,
      //     operator: "eq",
      //   });
      // }
      // filterService.filter({
      //   filters: [
      //     {
      //       field: "notetype",
      //       value: evt.value,
      //       operator: "eq",
      //     },
      //   ],
      //   logic: "and",
      // });
      const root = { logic: "and", filters: [], ...this.filter };

      const [filter] = flatten(root).filter((x) => x.field === "notetype");
      if (evt.value == -1) {
        let ind: number = root.filters.findIndex(
          (ele) => ele["field"] == "notetype"
        );
        if (ind != -1) {
          root.filters.splice(ind, 1);
        }
      } else {
        if (!filter) {
          root.filters.push({
            field: "notetype",
            operator: "eq",
            value: evt.value,
          });
        } else {
          filter.value = evt.value;
        }
      }

      //  this.checked = checked;
      this.gridFilter(root);
      // this.loadGridView();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  refreshData() {
    try {
      if (
        this.calledFrom == "encounteraction" ||
        this.calledFrom == "assistance"
      ) {
        if (this.accessionnumber) this.getDocumentHistoryByAccession();
      } else {
        if (this.masterdocid) this.getDocumentHistory();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
