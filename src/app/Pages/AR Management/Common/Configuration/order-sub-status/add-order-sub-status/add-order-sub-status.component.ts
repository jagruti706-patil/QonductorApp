import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { SubSink } from "subsink";
import { Utility } from "src/app/Model/utility";
import { DataTransferService } from "src/app/Pages/Services/Common/data-transfer.service";
import { OrderSubStatusModel } from "src/app/Model/AR Management/Configuration/ordersubstatusmodel";
import { CoreOperationService } from "src/app/Pages/Services/BT/core-operation.service";
import { ToastrService } from "ngx-toastr";
import { ConfigurationService } from "src/app/Pages/Services/Common/configuration.service";
declare var $: any;
@Component({
  selector: "app-add-order-sub-status",
  templateUrl: "./add-order-sub-status.component.html",
  styleUrls: ["./add-order-sub-status.component.css"],
})
export class AddOrderSubStatusComponent implements OnInit {
  @Output() OutputSubStatusEditResult = new EventEmitter<boolean>();
  subscription: SubSink = new SubSink();
  clsUtility: Utility;
  statusData: any[] = [];
  public InputStatusMessage: string;
  SubStatusGroup = this.fb.group({
    fcStatus: ["", Validators.required],
    fcSubStatusName: ["", Validators.required],
    fcSubStatusDescription: [""],
  });
  objsubstatus: OrderSubStatusModel;
  isupdate: boolean = false;
  systemdefined: boolean = false;
  subStatusDataItem: any;

  get fbcStatus() {
    return this.SubStatusGroup.get("fcStatus");
  }
  get fbcSubStatusName() {
    return this.SubStatusGroup.get("fcSubStatusName");
  }
  get fbcSubStatusDescription() {
    return this.SubStatusGroup.get("fcSubStatusDescription");
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

  OutputSubstatusEditResult(data: any) {
    let outSubStatusEditResult = data;
    this.OutputSubStatusEditResult.emit(outSubStatusEditResult);
  }

  getSubStatusById(id: string) {
    try {
      this.configurationService.getOrderSubStatus(id).subscribe(
        (data) => {
          if (data) {
            this.objsubstatus = <OrderSubStatusModel>data;
            this.fbcStatus.setValue(+this.objsubstatus.statusid);
            this.fbcSubStatusName.setValue(this.objsubstatus.substatusname);
            this.fbcSubStatusDescription.setValue(
              this.objsubstatus.substatusdescription
            );
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
      this.systemdefined = false;
      this.subStatusDataItem = null;
      this.SubStatusGroup.reset();
      this.subscription.unsubscribe();
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }
  isSubStatusNameChange = false;
  saveSubStatus() {
    try {
      if (
        this.objsubstatus != null &&
        this.objsubstatus.substatusname != this.fbcSubStatusName.value
      ) {
        this.isSubStatusNameChange = true;
      } else {
        this.isSubStatusNameChange = false;
      }
      if (
        this.validateFields() &&
        this.isupdate &&
        this.isSubStatusNameChange
      ) {
        this.InputStatusMessage =
          "Change in sub-status name will update the encounter where selected sub-status is used.<br>Do you want to continue?";
      } else {
        this.OutputStatusResult(true);
      }

      // if (this.validateFields()) {
      //   if (this.isupdate) {
      //     this.objsubstatus.modifiedon = this.clsUtility.currentDateTime();
      //     this.objsubstatus.substatusdescription = this.fbcSubStatusDescription.value.trim();
      //     this.objsubstatus.substatusname = this.fbcSubStatusName.value.trim();
      //     this.configurationService
      //       .UpdateOrderSubStatus(this.objsubstatus)
      //       .subscribe(
      //         data => {
      //           if (data == 1) {
      //             this.clsUtility.showSuccess(
      //               "Order substatus updated successfully"
      //             );
      //             this.OutputSubStatusEditResult.emit(true);
      //           } else if (data == 2) {
      //             this.clsUtility.showWarning("Order substatus already exists");
      //             this.OutputSubStatusEditResult.emit(false);
      //           } else {
      //             this.clsUtility.showError(
      //               "Error while updating order substatus"
      //             );
      //             this.OutputSubStatusEditResult.emit(false);
      //           }
      //         },
      //         error => {
      //           this.clsUtility.showError(error);
      //         }
      //       );
      //   } else {
      //     this.objsubstatus = new OrderSubStatusModel();
      //     this.objsubstatus.modifiedon = this.clsUtility.currentDateTime();
      //     this.objsubstatus.statusid = this.fbcStatus.value;
      //     let objSelectedStatus = this.statusData.find(
      //       element => element.statuscode === this.fbcStatus.value
      //     );
      //     this.objsubstatus.statusname = objSelectedStatus.status;
      //     this.objsubstatus.substatusdescription = this.fbcSubStatusDescription.value.trim();
      //     this.objsubstatus.substatusname = this.fbcSubStatusName.value.trim();
      //     this.objsubstatus.userid = this.datatransfer.SelectedUserid;
      //     this.objsubstatus.username = this.datatransfer.loginUserName;
      //     this.objsubstatus.isactive = true;
      //     this.configurationService
      //       .saveOrderSubStatus(this.objsubstatus)
      //       .subscribe(
      //         data => {
      //           if (data == 1) {
      //             this.clsUtility.showSuccess(
      //               "Order substatus saved successfully"
      //             );
      //             this.OutputSubStatusEditResult.emit(true);
      //           } else if (data == 2) {
      //             this.clsUtility.showWarning("Order substatus already exists");
      //             this.OutputSubStatusEditResult.emit(false);
      //           } else {
      //             this.clsUtility.showError(
      //               "Error while saving order substatus"
      //             );
      //             this.OutputSubStatusEditResult.emit(false);
      //           }
      //         },
      //         error => {
      //           this.clsUtility.showError(error);
      //         }
      //       );
      //   }
      // }
    } catch (error) {
      this.clsUtility.showError(error);
    }
  }

  validateFields(): boolean {
    let valid: boolean = false;
    if (
      this.SubStatusGroup.valid &&
      this.fbcSubStatusName.value.trim()
      // && this.fbcSubStatusDescription.value.trim()
    ) {
      valid = true;
    }
    return valid;
  }

  onCloseClick() {
    this.resetComponents();
    this.OutputSubStatusEditResult.emit(false);
  }
  OutputStatusResult(event: any) {
    try {
      if (event) {
        if (this.isupdate) {
          this.objsubstatus.modifiedon = this.clsUtility.currentDateTime();
          if (this.fbcSubStatusDescription.value) {
            this.objsubstatus.substatusdescription = this.fbcSubStatusDescription.value.trim();
          } else {
            this.objsubstatus.substatusdescription = "";
          }

          this.objsubstatus.substatusname = this.fbcSubStatusName.value.trim();
          this.configurationService
            .UpdateOrderSubStatus(this.objsubstatus)
            .subscribe(
              (data) => {
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    "Encounter substatus updated successfully"
                  );
                  this.OutputSubStatusEditResult.emit(true);
                } else if (data == 2) {
                  this.clsUtility.showWarning(
                    "Encounter substatus already exists"
                  );
                  this.OutputSubStatusEditResult.emit(false);
                } else {
                  this.clsUtility.showError(
                    "Error while updating encounter substatus"
                  );
                  this.OutputSubStatusEditResult.emit(false);
                }
              },
              (error) => {
                this.clsUtility.showError(error);
              }
            );
        } else {
          this.objsubstatus = new OrderSubStatusModel();
          this.objsubstatus.modifiedon = this.clsUtility.currentDateTime();
          this.objsubstatus.statusid = this.fbcStatus.value;
          let objSelectedStatus = this.statusData.find(
            (element) => element.statuscode === this.fbcStatus.value
          );
          this.objsubstatus.statusname = objSelectedStatus.status;
          if (this.fbcSubStatusDescription.value) {
            this.objsubstatus.substatusdescription = this.fbcSubStatusDescription.value.trim();
          } else {
            this.objsubstatus.substatusdescription = "";
          }
          this.objsubstatus.substatusname = this.fbcSubStatusName.value.trim();
          this.objsubstatus.userid = this.datatransfer.SelectedUserid;
          this.objsubstatus.username = this.datatransfer.loginUserName;
          this.objsubstatus.isactive = true;
          this.configurationService
            .saveOrderSubStatus(this.objsubstatus)
            .subscribe(
              (data) => {
                if (data == 1) {
                  this.clsUtility.showSuccess(
                    "Encounter substatus saved successfully"
                  );
                  this.OutputSubStatusEditResult.emit(true);
                } else if (data == 2) {
                  this.clsUtility.showWarning(
                    "Encounter substatus already exists"
                  );
                  this.OutputSubStatusEditResult.emit(false);
                } else {
                  this.clsUtility.showError(
                    "Error while saving encounter substatus"
                  );
                  this.OutputSubStatusEditResult.emit(false);
                }
              },
              (error) => {
                this.clsUtility.showError(error);
              }
            );
        }
      }
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }
}
