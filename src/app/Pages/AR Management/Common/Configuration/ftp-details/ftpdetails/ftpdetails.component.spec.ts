import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpdetailsComponent } from './ftpdetails.component';

describe('FtpdetailsComponent', () => {
  let component: FtpdetailsComponent;
  let fixture: ComponentFixture<FtpdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtpdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
