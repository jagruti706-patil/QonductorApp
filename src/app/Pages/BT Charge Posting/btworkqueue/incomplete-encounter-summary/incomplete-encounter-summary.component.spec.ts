import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncompleteEncounterSummaryComponent } from './incomplete-encounter-summary.component';

describe('IncompleteEncounterSummaryComponent', () => {
  let component: IncompleteEncounterSummaryComponent;
  let fixture: ComponentFixture<IncompleteEncounterSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncompleteEncounterSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteEncounterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
