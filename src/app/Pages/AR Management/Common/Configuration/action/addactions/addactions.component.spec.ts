import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddactionsComponent } from './addactions.component';

describe('AddactionsComponent', () => {
  let component: AddactionsComponent;
  let fixture: ComponentFixture<AddactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
