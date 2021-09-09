import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclientloginComponent } from './addclientlogin.component';

describe('AddclientloginComponent', () => {
  let component: AddclientloginComponent;
  let fixture: ComponentFixture<AddclientloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddclientloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclientloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
