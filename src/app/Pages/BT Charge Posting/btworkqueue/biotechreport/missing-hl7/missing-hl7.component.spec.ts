import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingHL7Component } from './missing-hl7.component';

describe('MissingHL7Component', () => {
  let component: MissingHL7Component;
  let fixture: ComponentFixture<MissingHL7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingHL7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingHL7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
