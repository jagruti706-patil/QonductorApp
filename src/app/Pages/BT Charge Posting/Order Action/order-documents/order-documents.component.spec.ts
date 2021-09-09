import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDocumentsComponent } from './order-documents.component';

describe('OrderDocumentsComponent', () => {
  let component: OrderDocumentsComponent;
  let fixture: ComponentFixture<OrderDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
