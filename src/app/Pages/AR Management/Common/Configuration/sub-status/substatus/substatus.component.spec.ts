import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstatusComponent } from './substatus.component';

describe('SubstatusComponent', () => {
  let component: SubstatusComponent;
  let fixture: ComponentFixture<SubstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
