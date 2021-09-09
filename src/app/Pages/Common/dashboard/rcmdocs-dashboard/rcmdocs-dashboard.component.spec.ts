import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RCMDocsDashboardComponent } from './rcmdocs-dashboard.component';

describe('RCMDocsDashboardComponent', () => {
  let component: RCMDocsDashboardComponent;
  let fixture: ComponentFixture<RCMDocsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RCMDocsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RCMDocsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
