import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PrintFilterComponent } from "./print-filter.component";

describe("PracticePrintFilterComponent", () => {
  let component: PrintFilterComponent;
  let fixture: ComponentFixture<PrintFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
