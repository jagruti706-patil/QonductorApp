import { Component, OnInit, ViewChild } from "@angular/core";
import { GridDataResult, PageChangeEvent } from "@progress/kendo-angular-grid";
import { Utility } from "src/app/Model/utility";
import { SortDescriptor, orderBy } from "@progress/kendo-data-query";
import { SubSink } from "subsink";
import { AddOrderNoteComponent } from "../add-order-note/add-order-note.component";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { ToastrService } from "ngx-toastr";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { OrderNoteModel } from "src/app/Model/AR Management/Configuration/ordersubstatusmodel";
declare var $: any;
@Component({
  selector: "app-order-note",
  templateUrl: "./order-note.component.html",
  styleUrls: ["./order-note.component.css"],
})
export class OrderNoteComponent implements OnInit {
  public orderNoteGridView: GridDataResult;
  clsUtility: Utility;
  public orderNotePageSize = 0;
  public orderNoteSkip = 0;
  public orderNoteSort: SortDescriptor[] = [];
  private orderNoteItems: any[] = [];
  loadingGrid: boolean = false;
  private subscription = new SubSink();
  public InputEditMessage: string;
  public InputDeleteMessage: string;
  public InputStatusMessage: string;
  public SelectedDataItem: string;
  deleteorderNoteid: number = 0;
  @ViewChild("AddOrderNoteChild", { static: true })
  private AddOrderNoteChild: AddOrderNoteComponent;
  constructor(
    private configurationService: ConfigurationService,
    private toaster: ToastrService,
    private objDataTransfer: DataTransferService
  ) {
    this.clsUtility = new Utility(toaster);
    this.orderNotePageSize = this.clsUtility.configPageSize;
  }

  ngOnInit() {
    this.getOrderNotes("0");
  }
  getOrderNotes(ordernoteid: string) {
    try {
      this.loadingGrid = true;
      this.subscription.add(
        this.configurationService.getOrderNotes(ordernoteid).subscribe(
          (data) => {
            if (data && data.length > 0) {
              this.orderNoteItems = data;
            } else {
              this.orderNoteItems = [];
              this.orderNoteGridView = null;
            }
            this.loadorderNoteitems();
            this.loadingGrid = false;
          },
          (error) => {
            this.loadingGrid = false;
          }
        )
      );
    } catch (error) {
      this.loadingGrid = false;
      this.clsUtility.LogError(error);
    }
  }

  private loadorderNoteitems(): void {
    try {
      this.orderNoteGridView = {
        data: orderBy(
          this.orderNoteItems.slice(
            this.orderNoteSkip,
            this.orderNoteSkip + this.orderNotePageSize
          ),
          this.orderNoteSort
        ),
        total: this.orderNoteItems.length,
      };
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  pageChangeOrderNote(event: PageChangeEvent): void {
    try {
      this.orderNoteSkip = event.skip;
      this.loadorderNoteitems();
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  sortOrderNoteChange(sort: SortDescriptor[]): void {
    try {
      if (sort) {
        this.orderNoteSort = sort;
        this.loadorderNoteitems();
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  AddOrderNote() {
    try {
      this.AddOrderNoteChild.resetComponents();
      this.AddOrderNoteChild.isupdate = false;
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  EditOrderNote({ sender, rowIndex, dataItem }) {
    try {
      this.AddOrderNoteChild.resetComponents();
      this.AddOrderNoteChild.isupdate = true;
      this.AddOrderNoteChild.getOrderNoteById(dataItem.ordernoteid);
      this.InputEditMessage = "Do you want to edit encounter note?";
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OnUpdateOrderNoteStatus(dataItem: any, status: boolean) {
    try {
      this.SelectedDataItem = dataItem;
      if (status) {
        this.InputStatusMessage =
          "Encounter note will be mark as active and it will available for futher use.<br> Do you want to continue?";
      } else {
        this.InputStatusMessage =
          "Encounter note will be mark as inactive and it will not available for futher use.<br> Do you want to continue?";
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  updateOrderNoteStatus(objOrderNote: OrderNoteModel) {
    try {
      this.configurationService.updateOrderNote(objOrderNote).subscribe(
        (data) => {
          if (data == 1) {
            this.clsUtility.showSuccess("Status updated successfully");
            this.getOrderNotes("0");
          } else {
            this.clsUtility.showError("Error while updating status");
          }
        },
        (error) => {
          this.clsUtility.showError(error);
        }
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  OutputEditResult(event: any) {
    try {
      if (event) {
        $("#addOrderNoteModal").modal("show");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  OutputOrderNoteEditResult(event: any) {
    try {
      if (event) {
        this.getOrderNotes("0");
        this.AddOrderNoteChild.resetComponents();
        $("#addOrderNoteModal").modal("hide");
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
  OutputStatusResult(event: any, dataItem: any) {
    try {
      // alert(event);
      // alert(JSON.stringify(dataItem));
      if (event && dataItem != undefined) {
        let objOrderNote: OrderNoteModel = new OrderNoteModel();
        objOrderNote.isactive = !dataItem.isactive;
        objOrderNote.modifiedon = this.clsUtility.currentDateTime();
        objOrderNote.ordernoteid = dataItem.ordernoteid;
        objOrderNote.statusid = dataItem.statusid;
        objOrderNote.statusname = dataItem.statusname;
        objOrderNote.userid = this.objDataTransfer.SelectedUserid;
        objOrderNote.username = this.objDataTransfer.loginUserName;
        this.updateOrderNoteStatus(objOrderNote);
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
