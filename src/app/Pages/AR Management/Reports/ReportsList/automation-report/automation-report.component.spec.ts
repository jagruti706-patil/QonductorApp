import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomationReportComponent } from './automation-report.component';

describe('AutomationReportComponent', () => {
  let component: AutomationReportComponent;
  let fixture: ComponentFixture<AutomationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
