import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrderQueueComponent } from './my-order-queue.component';

describe('MyOrderQueueComponent', () => {
  let component: MyOrderQueueComponent;
  let fixture: ComponentFixture<MyOrderQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyOrderQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrderQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
