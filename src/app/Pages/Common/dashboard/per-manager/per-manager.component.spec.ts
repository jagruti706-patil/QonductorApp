import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerManagerComponent } from './per-manager.component';

describe('PerManagerComponent', () => {
  let component: PerManagerComponent;
  let fixture: ComponentFixture<PerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
