import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTriarqAssistanceComponent } from './order-triarq-assistance.component';

describe('OrderTriarqAssistanceComponent', () => {
  let component: OrderTriarqAssistanceComponent;
  let fixture: ComponentFixture<OrderTriarqAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderTriarqAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTriarqAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
