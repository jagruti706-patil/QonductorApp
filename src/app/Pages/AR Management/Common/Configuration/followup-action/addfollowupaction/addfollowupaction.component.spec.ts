import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfollowupactionComponent } from './addfollowupaction.component';

describe('AddfollowupactionComponent', () => {
  let component: AddfollowupactionComponent;
  let fixture: ComponentFixture<AddfollowupactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfollowupactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfollowupactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
