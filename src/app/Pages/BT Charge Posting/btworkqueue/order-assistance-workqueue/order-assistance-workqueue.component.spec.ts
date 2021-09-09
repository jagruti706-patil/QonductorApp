import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssistanceWorkqueueComponent } from './order-assistance-workqueue.component';

describe('OrderAssistanceWorkqueueComponent', () => {
  let component: OrderAssistanceWorkqueueComponent;
  let fixture: ComponentFixture<OrderAssistanceWorkqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAssistanceWorkqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAssistanceWorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
