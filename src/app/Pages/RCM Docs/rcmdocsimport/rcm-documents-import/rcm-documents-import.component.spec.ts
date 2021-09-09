import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmDocumentsImportComponent } from './rcm-documents-import.component';

describe('RcmDocumentsImportComponent', () => {
  let component: RcmDocumentsImportComponent;
  let fixture: ComponentFixture<RcmDocumentsImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcmDocumentsImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmDocumentsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
