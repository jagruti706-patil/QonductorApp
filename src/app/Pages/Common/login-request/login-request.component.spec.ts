import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequestComponent } from './login-request.component';

describe('LoginRequestComponent', () => {
  let component: LoginRequestComponent;
  let fixture: ComponentFixture<LoginRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
