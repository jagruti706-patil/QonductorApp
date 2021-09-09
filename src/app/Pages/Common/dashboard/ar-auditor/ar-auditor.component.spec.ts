import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArAuditorComponent } from './ar-auditor.component';

describe('ArAuditorComponent', () => {
  let component: ArAuditorComponent;
  let fixture: ComponentFixture<ArAuditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArAuditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
