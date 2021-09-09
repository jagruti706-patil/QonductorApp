import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BiotechReportComponent } from './biotech-report.component';

describe('BiotechReportComponent', () => {
  let component: BiotechReportComponent;
  let fixture: ComponentFixture<BiotechReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BiotechReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BiotechReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
