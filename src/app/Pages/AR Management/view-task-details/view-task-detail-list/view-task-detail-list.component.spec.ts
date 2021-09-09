import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskDetailListComponent } from './view-task-detail-list.component';

describe('ViewTaskDetailListComponent', () => {
  let component: ViewTaskDetailListComponent;
  let fixture: ComponentFixture<ViewTaskDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTaskDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTaskDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
