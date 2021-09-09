import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeCompletedComponent } from './practice-completed.component';

describe('PracticeCompletedComponent', () => {
  let component: PracticeCompletedComponent;
  let fixture: ComponentFixture<PracticeCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
