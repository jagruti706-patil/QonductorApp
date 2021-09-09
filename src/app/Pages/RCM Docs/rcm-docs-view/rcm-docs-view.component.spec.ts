import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RcmDocsViewComponent } from './rcm-docs-view.component';

describe('RcmDocsViewComponent', () => {
  let component: RcmDocsViewComponent;
  let fixture: ComponentFixture<RcmDocsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RcmDocsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RcmDocsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
