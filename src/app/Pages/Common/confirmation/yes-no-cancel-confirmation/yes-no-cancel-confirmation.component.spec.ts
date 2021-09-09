import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoCancelConfirmationComponent } from './yes-no-cancel-confirmation.component';

describe('YesNoCancelConfirmationComponent', () => {
  let component: YesNoCancelConfirmationComponent;
  let fixture: ComponentFixture<YesNoCancelConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YesNoCancelConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoCancelConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
