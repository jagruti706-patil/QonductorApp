import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSubStatusComponent } from './order-sub-status.component';

describe('OrderSubStatusComponent', () => {
  let component: OrderSubStatusComponent;
  let fixture: ComponentFixture<OrderSubStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSubStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSubStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
