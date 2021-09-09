import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcriberComponent } from './qcriber.component';

describe('QcriberComponent', () => {
  let component: QcriberComponent;
  let fixture: ComponentFixture<QcriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
