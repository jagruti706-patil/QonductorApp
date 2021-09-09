import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityReviewCompletedComponent } from './quality-review-completed.component';

describe('QualityReviewCompletedComponent', () => {
  let component: QualityReviewCompletedComponent;
  let fixture: ComponentFixture<QualityReviewCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityReviewCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityReviewCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
