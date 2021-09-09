import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeAssignedComponent } from './practice-assigned.component';

describe('PracticeAssignedComponent', () => {
  let component: PracticeAssignedComponent;
  let fixture: ComponentFixture<PracticeAssignedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeAssignedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
