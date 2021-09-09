import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArSummaryCardsComponent } from './ar-summary-cards.component';

describe('ArSummaryCardsComponent', () => {
  let component: ArSummaryCardsComponent;
  let fixture: ComponentFixture<ArSummaryCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArSummaryCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArSummaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
