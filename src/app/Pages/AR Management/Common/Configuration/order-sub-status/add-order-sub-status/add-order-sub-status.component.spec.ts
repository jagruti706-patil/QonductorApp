import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderSubStatusComponent } from './add-order-sub-status.component';

describe('AddOrderSubStatusComponent', () => {
  let component: AddOrderSubStatusComponent;
  let fixture: ComponentFixture<AddOrderSubStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderSubStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderSubStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
