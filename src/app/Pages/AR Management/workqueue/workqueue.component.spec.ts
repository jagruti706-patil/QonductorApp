import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkqueueComponent } from './workqueue.component';

describe('WorkqueueComponent', () => {
  let component: WorkqueueComponent;
  let fixture: ComponentFixture<WorkqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
