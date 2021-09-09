import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpayercrosswalkComponent } from './addpayercrosswalk.component';

describe('AddpayercrosswalkComponent', () => {
  let component: AddpayercrosswalkComponent;
  let fixture: ComponentFixture<AddpayercrosswalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpayercrosswalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpayercrosswalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
