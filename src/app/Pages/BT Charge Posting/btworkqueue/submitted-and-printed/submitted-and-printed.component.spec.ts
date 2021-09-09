import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedAndPrintedComponent } from './submitted-and-printed.component';

describe('SubmittedAndPrintedComponent', () => {
  let component: SubmittedAndPrintedComponent;
  let fixture: ComponentFixture<SubmittedAndPrintedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedAndPrintedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedAndPrintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
