import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsvaultUploadComponent } from './docsvault-upload.component';

describe('DocsvaultUploadComponent', () => {
  let component: DocsvaultUploadComponent;
  let fixture: ComponentFixture<DocsvaultUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsvaultUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsvaultUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
