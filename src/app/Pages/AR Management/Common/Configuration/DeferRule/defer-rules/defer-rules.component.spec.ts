import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferRulesComponent } from './defer-rules.component';

describe('DeferRulesComponent', () => {
  let component: DeferRulesComponent;
  let fixture: ComponentFixture<DeferRulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferRulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
