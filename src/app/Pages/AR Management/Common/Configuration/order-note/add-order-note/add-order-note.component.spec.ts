import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderNoteComponent } from './add-order-note.component';

describe('AddOrderNoteComponent', () => {
  let component: AddOrderNoteComponent;
  let fixture: ComponentFixture<AddOrderNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
