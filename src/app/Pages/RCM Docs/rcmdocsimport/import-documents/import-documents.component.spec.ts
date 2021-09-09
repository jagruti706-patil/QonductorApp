import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDocumentsComponent } from './import-documents.component';

describe('ImportDocumentsComponent', () => {
  let component: ImportDocumentsComponent;
  let fixture: ComponentFixture<ImportDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
