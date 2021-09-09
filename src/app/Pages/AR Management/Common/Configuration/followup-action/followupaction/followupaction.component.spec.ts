import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowupactionComponent } from './followupaction.component';

describe('FollowupactionComponent', () => {
  let component: FollowupactionComponent;
  let fixture: ComponentFixture<FollowupactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowupactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowupactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
