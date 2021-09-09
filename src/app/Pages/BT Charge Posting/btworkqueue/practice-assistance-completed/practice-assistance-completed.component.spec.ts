import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeAssistanceCompletedComponent } from './practice-assistance-completed.component';

describe('PracticeAssistanceCompletedComponent', () => {
  let component: PracticeAssistanceCompletedComponent;
  let fixture: ComponentFixture<PracticeAssistanceCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeAssistanceCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeAssistanceCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
