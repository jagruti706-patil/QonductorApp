import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayercrosswalkComponent } from './payercrosswalk.component';

describe('PayercrosswalkComponent', () => {
  let component: PayercrosswalkComponent;
  let fixture: ComponentFixture<PayercrosswalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayercrosswalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayercrosswalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
