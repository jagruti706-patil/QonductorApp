import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityInformationComponent } from './eligibility-information.component';

describe('EligibilityInformationComponent', () => {
  let component: EligibilityInformationComponent;
  let fixture: ComponentFixture<EligibilityInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibilityInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
