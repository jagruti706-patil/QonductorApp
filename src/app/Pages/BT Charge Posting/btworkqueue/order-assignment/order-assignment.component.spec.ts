import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAssignmentComponent } from './order-assignment.component';

describe('OrderAssignmentComponent', () => {
  let component: OrderAssignmentComponent;
  let fixture: ComponentFixture<OrderAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
