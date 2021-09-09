import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWorkqueueComponent } from './order-workqueue.component';

describe('OrderWorkqueueComponent', () => {
  let component: OrderWorkqueueComponent;
  let fixture: ComponentFixture<OrderWorkqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderWorkqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderWorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
