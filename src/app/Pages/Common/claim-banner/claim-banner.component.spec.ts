import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimBannerComponent } from './claim-banner.component';

describe('ClaimBannerComponent', () => {
  let component: ClaimBannerComponent;
  let fixture: ComponentFixture<ClaimBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
