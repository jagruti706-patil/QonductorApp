import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmailconfigurationComponent } from './addmailconfiguration.component';

describe('AddmailconfigurationComponent', () => {
  let component: AddmailconfigurationComponent;
  let fixture: ComponentFixture<AddmailconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmailconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmailconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
