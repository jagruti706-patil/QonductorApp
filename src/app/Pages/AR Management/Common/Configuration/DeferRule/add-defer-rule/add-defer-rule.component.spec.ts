import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeferRuleComponent } from './add-defer-rule.component';

describe('AddDeferRuleComponent', () => {
  let component: AddDeferRuleComponent;
  let fixture: ComponentFixture<AddDeferRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDeferRuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeferRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
