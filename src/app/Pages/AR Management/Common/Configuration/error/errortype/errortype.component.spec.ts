import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrortypeComponent } from './errortype.component';

describe('ErrortypeComponent', () => {
  let component: ErrortypeComponent;
  let fixture: ComponentFixture<ErrortypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrortypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrortypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
