import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeUserComponent } from './practice-user.component';

describe('PracticeUserComponent', () => {
  let component: PracticeUserComponent;
  let fixture: ComponentFixture<PracticeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
