import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPatientBannerComponent } from './order-patient-banner.component';

describe('OrderPatientBannerComponent', () => {
  let component: OrderPatientBannerComponent;
  let fixture: ComponentFixture<OrderPatientBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPatientBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPatientBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
