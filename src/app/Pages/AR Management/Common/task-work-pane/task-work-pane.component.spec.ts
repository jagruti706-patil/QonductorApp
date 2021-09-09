import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskWorkPaneComponent } from './task-work-pane.component';

describe('TaskWorkPaneComponent', () => {
  let component: TaskWorkPaneComponent;
  let fixture: ComponentFixture<TaskWorkPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskWorkPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskWorkPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
