import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartassignmentComponent } from './smartassignment.component';

describe('SmartassignmentComponent', () => {
  let component: SmartassignmentComponent;
  let fixture: ComponentFixture<SmartassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
