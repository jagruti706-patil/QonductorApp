import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddclientusermappingComponent } from './addclientusermapping.component';

describe('AddclientusermappingComponent', () => {
  let component: AddclientusermappingComponent;
  let fixture: ComponentFixture<AddclientusermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddclientusermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddclientusermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
