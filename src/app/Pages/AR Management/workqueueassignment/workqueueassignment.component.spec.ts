import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkqueueassignmentComponent } from './workqueueassignment.component';

describe('WorkqueueassignmentComponent', () => {
  let component: WorkqueueassignmentComponent;
  let fixture: ComponentFixture<WorkqueueassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkqueueassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkqueueassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
