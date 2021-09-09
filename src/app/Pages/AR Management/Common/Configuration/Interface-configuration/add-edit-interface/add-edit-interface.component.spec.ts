import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInterfaceComponent } from './add-edit-interface.component';

describe('AddEditInterfaceComponent', () => {
  let component: AddEditInterfaceComponent;
  let fixture: ComponentFixture<AddEditInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
