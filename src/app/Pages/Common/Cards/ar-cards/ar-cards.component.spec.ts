import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArCardsComponent } from './ar-cards.component';

describe('ArCardsComponent', () => {
  let component: ArCardsComponent;
  let fixture: ComponentFixture<ArCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
