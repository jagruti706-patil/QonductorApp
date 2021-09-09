import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsCountComponent } from './documents-count.component';

describe('DocumentsCountComponent', () => {
  let component: DocumentsCountComponent;
  let fixture: ComponentFixture<DocumentsCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
