import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailconfigurationComponent } from './mailconfiguration.component';

describe('MailconfigurationComponent', () => {
  let component: MailconfigurationComponent;
  let fixture: ComponentFixture<MailconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
