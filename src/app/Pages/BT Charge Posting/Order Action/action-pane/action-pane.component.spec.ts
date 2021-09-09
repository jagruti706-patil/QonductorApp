import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPaneComponent } from './action-pane.component';

describe('ActionPaneComponent', () => {
  let component: ActionPaneComponent;
  let fixture: ComponentFixture<ActionPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
