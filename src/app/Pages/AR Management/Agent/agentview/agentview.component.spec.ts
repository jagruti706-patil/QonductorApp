import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentviewComponent } from './agentview.component';

describe('AgentviewComponent', () => {
  let component: AgentviewComponent;
  let fixture: ComponentFixture<AgentviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
