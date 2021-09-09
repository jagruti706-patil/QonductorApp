import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityReviewComponent } from './quality-review.component';

describe('QualityReviewComponent', () => {
  let component: QualityReviewComponent;
  let fixture: ComponentFixture<QualityReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
