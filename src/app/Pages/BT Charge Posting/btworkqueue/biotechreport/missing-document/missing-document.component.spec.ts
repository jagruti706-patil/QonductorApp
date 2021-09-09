import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDocumentComponent } from './missing-document.component';

describe('MissingDocumentComponent', () => {
  let component: MissingDocumentComponent;
  let fixture: ComponentFixture<MissingDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
