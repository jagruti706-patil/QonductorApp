import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { Validators, FormBuilder } from "@angular/forms";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
import { OrderNoteModel } from "src/app/Model/AR Management/Configuration/ordersubstatusmodel";

@Component({
  selector: "app-add-order-note",
  templateUrl: "./add-order-note.component.html",
  styleUrls: ["./add-order-note.component.css"],
})
export class AddOrderNoteComponent implements OnInit {
  @Output() OutputOrderNoteEditResult = new EventEmitter<boolean>();
  subscription: SubSink = new SubSink();
  clsUtility: Utility;
  statusData: any[] = [];

  OrderNoteGroup = this.fb.group({
    fcStatus: ["", Validators.required],
    fcNoteTitle: ["", Validators.required],
    fcNote: ["", Validators.required],
  });
  objordernote: OrderNoteModel;
  isupdate: boolean = false;

  get fbcStatus() {
    return this.OrderNoteGroup.get("fcStatus");
  }
  get fbcNoteTitle() {
    return this.OrderNoteGroup.get("fcNoteTitle");
  }
  get fbcNote() {
    return this.OrderNoteGroup.get("fcNote");
  }
  constructor(
    private fb: FormBuilder,
    private datatransfer: DataTransferService,
    private coreService: CoreOperationService,
    private toaster: ToastrService,
    private configurationService: ConfigurationService
  ) {
    this.clsUtility = new Utility(toaster);
  }

  ngOnInit() {
    this.getOrderStatus("-3");
  }

  getOrderNoteById(ordernoteid: string) {
    try {
      this.subscription.add(
        this.configurationService.getOrderNotes(ordernoteid).subscribe(
          (data) => {
            if (data) {
              this.objordernote = <OrderNoteModel>data;
              this.fbcStatus.setValue(+this.objordernote.statusid);
              this.fbcNoteTitle.setValue(this.objordernote.notetitle);
              this.fbcNote.setValue(this.objordernote.note);
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  getOrderStatus(status: string) {
    try {
      this.subscription.add(
        this.coreService.OrderInventoryStatus(status).subscribe(
          (data) => {
            if (data) {
              this.statusData = data;
            }
          },
          (error) => {
            this.clsUtility.showError(error);
          }
        )
      );
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  resetComponents() {
    try {
      this.OrderNoteGroup.reset();
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  saveUpdateOrderNote() {
    try {
      if (this.validateFields()) {
        if (this.isupdate) {
          this.objordernote.modifiedon = this.clsUtility.currentDateTime();
          this.objordernote.note = this.fbcNote.value.trim();
          this.objordernote.notetitle = this.fbcNoteTitle.value.trim();
          this.configurationService
            .updateOrderNote(this.objordernote)
            .subscribe(
              (data) => {
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    "Encounter note updated successfully"
                  );
                  this.OutputOrderNoteEditResult.emit(true);
                } else if (data == 2) {
                  this.clsUtility.showWarning("Encounter note already exists");
                  this.OutputOrderNoteEditResult.emit(false);
                } else {
                  this.clsUtility.showError(
                    "Error while updating encounter note"
                  );
                  this.OutputOrderNoteEditResult.emit(false);
                }
              },
              (error) => {
                this.clsUtility.showError(error);
              }
            );
        } else {
          this.objordernote = new OrderNoteModel();
          this.objordernote.modifiedon = this.clsUtility.currentDateTime();
          this.objordernote.statusid = this.fbcStatus.value;
          let objSelectedStatus = this.statusData.find(
            (element) => element.statuscode === this.fbcStatus.value
          );
          this.objordernote.statusname = objSelectedStatus.status;
          this.objordernote.note = this.fbcNote.value.trim();
          this.objordernote.notetitle = this.fbcNoteTitle.value.trim();
          this.objordernote.userid = this.datatransfer.SelectedUserid;
          this.objordernote.username = this.datatransfer.loginUserName;
          this.objordernote.isactive = true;
          this.configurationService.saveOrderNote(this.objordernote).subscribe(
            (data) => {
              if (data == 1) {
                this.clsUtility.showSuccess(
                  "Encounter note saved successfully"
                );
                this.OutputOrderNoteEditResult.emit(true);
              } else if (data == 2) {
                this.clsUtility.showWarning("Encounter note already exists");
                this.OutputOrderNoteEditResult.emit(false);
              } else {
                this.clsUtility.showError("Error while saving Encounter note");
                this.OutputOrderNoteEditResult.emit(false);
              }
            },
            (error) => {
              this.clsUtility.showError(error);
            }
          );
        }
      }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  validateFields(): boolean {
    let valid: boolean = false;
    if (
      this.OrderNoteGroup.valid &&
      this.fbcNoteTitle.value.trim() &&
      this.fbcNote.value.trim()
    ) {
      valid = true;
    }
    return valid;
  }

  onCloseClick() {
    this.OutputOrderNoteEditResult.emit(false);
    this.resetComponents();
  }
}
