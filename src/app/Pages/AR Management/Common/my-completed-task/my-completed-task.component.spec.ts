import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCompletedTaskComponent } from './my-completed-task.component';

describe('MyCompletedTaskComponent', () => {
  let component: MyCompletedTaskComponent;
  let fixture: ComponentFixture<MyCompletedTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCompletedTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCompletedTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
