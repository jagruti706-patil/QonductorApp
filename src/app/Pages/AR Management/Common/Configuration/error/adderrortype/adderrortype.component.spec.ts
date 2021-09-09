import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdderrortypeComponent } from './adderrortype.component';

describe('AdderrortypeComponent', () => {
  let component: AdderrortypeComponent;
  let fixture: ComponentFixture<AdderrortypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdderrortypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdderrortypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
