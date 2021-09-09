import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderExportComponent } from './order-export.component';

describe('OrderExportComponent', () => {
  let component: OrderExportComponent;
  let fixture: ComponentFixture<OrderExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
