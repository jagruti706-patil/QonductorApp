import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCanceledTaskComponent } from './my-canceled-task.component';

describe('MyCanceledTaskComponent', () => {
  let component: MyCanceledTaskComponent;
  let fixture: ComponentFixture<MyCanceledTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCanceledTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCanceledTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
