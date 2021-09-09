import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArRepresentativeComponent } from './ar-representative.component';

describe('ArRepresentativeComponent', () => {
  let component: ArRepresentativeComponent;
  let fixture: ComponentFixture<ArRepresentativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArRepresentativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArRepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
