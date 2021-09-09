import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedEncountersComponent } from './archived-encounters.component';

describe('ArchivedEncountersComponent', () => {
  let component: ArchivedEncountersComponent;
  let fixture: ComponentFixture<ArchivedEncountersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedEncountersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedEncountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
