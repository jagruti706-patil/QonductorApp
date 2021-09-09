import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeUserQueueComponent } from './practice-user-queue.component';

describe('PracticeUserQueueComponent', () => {
  let component: PracticeUserQueueComponent;
  let fixture: ComponentFixture<PracticeUserQueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeUserQueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeUserQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
