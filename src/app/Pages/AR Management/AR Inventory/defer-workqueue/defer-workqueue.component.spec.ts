import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferWorkqueueComponent } from './defer-workqueue.component';

describe('DeferWorkqueueComponent', () => {
  let component: DeferWorkqueueComponent;
  let fixture: ComponentFixture<DeferWorkqueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferWorkqueueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferWorkqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
