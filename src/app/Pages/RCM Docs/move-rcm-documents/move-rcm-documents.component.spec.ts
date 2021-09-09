import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveRcmDocumentsComponent } from './move-rcm-documents.component';

describe('MoveRcmDocumentsComponent', () => {
  let component: MoveRcmDocumentsComponent;
  let fixture: ComponentFixture<MoveRcmDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveRcmDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveRcmDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
