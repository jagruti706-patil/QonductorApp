import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-custom-confirmation",
  templateUrl: "./custom-confirmation.component.html",
  styleUrls: ["./custom-confirmation.component.css"],
})
export class CustomConfirmationComponent implements OnInit {
  @Input() ConfirmationMessage: string = "";
  @Input() ConfirmationTitle: string = "Confirmation";
  @Output() OutputCustomConfirmation: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  constructor() {}

  ngOnInit() {}

  onYes() {
    this.OutputCustomConfirmation.next(true);
  }
  onNo() {
    this.OutputCustomConfirmation.next(false);
  }
}
