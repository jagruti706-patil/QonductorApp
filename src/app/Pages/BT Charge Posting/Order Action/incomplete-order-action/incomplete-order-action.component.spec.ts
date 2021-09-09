import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteOrderActionComponent } from './incomplete-order-action.component';

describe('IncompleteOrderActionComponent', () => {
  let component: IncompleteOrderActionComponent;
  let fixture: ComponentFixture<IncompleteOrderActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncompleteOrderActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteOrderActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
