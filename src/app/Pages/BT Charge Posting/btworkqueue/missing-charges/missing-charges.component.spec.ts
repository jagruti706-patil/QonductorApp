import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingChargesComponent } from './missing-charges.component';

describe('MissingChargesComponent', () => {
  let component: MissingChargesComponent;
  let fixture: ComponentFixture<MissingChargesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingChargesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
