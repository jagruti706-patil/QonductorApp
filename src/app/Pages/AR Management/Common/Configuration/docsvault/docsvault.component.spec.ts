import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsvaultComponent } from './docsvault.component';

describe('DocsvaultComponent', () => {
  let component: DocsvaultComponent;
  let fixture: ComponentFixture<DocsvaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsvaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsvaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
