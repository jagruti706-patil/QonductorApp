import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmEncounterDocumentsComponent } from './rcm-encounter-documents.component';

describe('RcmEncounterDocumentsComponent', () => {
  let component: RcmEncounterDocumentsComponent;
  let fixture: ComponentFixture<RcmEncounterDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcmEncounterDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmEncounterDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
