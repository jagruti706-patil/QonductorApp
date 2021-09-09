import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Utility } from "src/app/Model/utility";

@Component({
  selector: "app-yes-no-cancel-confirmation",
  templateUrl: "./yes-no-cancel-confirmation.component.html",
  styleUrls: ["./yes-no-cancel-confirmation.component.css"],
})
export class YesNoCancelConfirmationComponent implements OnInit {
  private clsUtility: Utility;

  // Received Input from parent component
  @Input() InputConfirmationMessage: string;
  @Input() InputConfirmationTitle: string;
  @Input() InputButtonInformation: ButtonInformation;
  // Send Output to parent component
  @Output() OutputConfirmationResult: EventEmitter<number> = new EventEmitter<
    number
  >();

  constructor() {
    this.clsUtility = new Utility();
  }

  ngOnInit() {}

  // onYes() {
  //   try {
  //     this.OutputConfirmationResult.emit(true);
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }

  onButtonClick(value: number) {
    try {
      this.OutputConfirmationResult.emit(value);
    } catch (error) {
      this.clsUtility.LogError(error);
    }
  }

  // onNo() {
  //   try {
  //     this.OutputConfirmationResult.emit(false);
  //   } catch (error) {
  //     this.clsUtility.LogError(error);
  //   }
  // }
}
export class ButtonInformation {
  "Yes": string;
  "No": string;
  "Cancel": string;
}
