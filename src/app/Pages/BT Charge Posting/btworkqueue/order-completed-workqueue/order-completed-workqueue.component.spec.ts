import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCompletedWorkqueueComponent } from './order-completed-workqueue.component';

describe('OrderCompletedWorkqueueComponent', () => {
  let component: OrderCompletedWorkqueueComponent;
  let fixture: ComponentFixture<OrderCompletedWorkqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCompletedWorkqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCompletedWorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
