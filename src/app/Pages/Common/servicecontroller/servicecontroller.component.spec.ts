import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicecontrollerComponent } from './servicecontroller.component';

describe('ServicecontrollerComponent', () => {
  let component: ServicecontrollerComponent;
  let fixture: ComponentFixture<ServicecontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicecontrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicecontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
