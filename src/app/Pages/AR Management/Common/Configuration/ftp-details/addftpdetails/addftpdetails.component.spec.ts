import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddftpdetailsComponent } from './addftpdetails.component';

describe('AddftpdetailsComponent', () => {
  let component: AddftpdetailsComponent;
  let fixture: ComponentFixture<AddftpdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddftpdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddftpdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
