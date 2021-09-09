import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsubstatusComponent } from './addsubstatus.component';

describe('AddsubstatusComponent', () => {
  let component: AddsubstatusComponent;
  let fixture: ComponentFixture<AddsubstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsubstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsubstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
