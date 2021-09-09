import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArManagerComponent } from './ar-manager.component';

describe('ArManagerComponent', () => {
  let component: ArManagerComponent;
  let fixture: ComponentFixture<ArManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
