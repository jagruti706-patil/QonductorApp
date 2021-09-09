import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnotetemplateComponent } from './addnotetemplate.component';

describe('AddnotetemplateComponent', () => {
  let component: AddnotetemplateComponent;
  let fixture: ComponentFixture<AddnotetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnotetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnotetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
