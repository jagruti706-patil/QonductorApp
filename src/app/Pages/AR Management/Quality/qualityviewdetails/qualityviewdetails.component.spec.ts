import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityviewdetailsComponent } from './qualityviewdetails.component';

describe('QualityviewdetailsComponent', () => {
  let component: QualityviewdetailsComponent;
  let fixture: ComponentFixture<QualityviewdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityviewdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityviewdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
