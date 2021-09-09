import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsfromdocvaultComponent } from './docsfromdocvault.component';

describe('DocsfromdocvaultComponent', () => {
  let component: DocsfromdocvaultComponent;
  let fixture: ComponentFixture<DocsfromdocvaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsfromdocvaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsfromdocvaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
