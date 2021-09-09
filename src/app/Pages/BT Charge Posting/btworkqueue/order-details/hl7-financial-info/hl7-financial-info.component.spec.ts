import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HL7FinancialInfoComponent } from './hl7-financial-info.component';

describe('HL7FinancialInfoComponent', () => {
  let component: HL7FinancialInfoComponent;
  let fixture: ComponentFixture<HL7FinancialInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HL7FinancialInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HL7FinancialInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
