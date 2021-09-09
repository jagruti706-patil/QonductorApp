import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAdditionalInfoComponent } from './pending-additional-info.component';

describe('PendingAdditionalInfoComponent', () => {
  let component: PendingAdditionalInfoComponent;
  let fixture: ComponentFixture<PendingAdditionalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingAdditionalInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
