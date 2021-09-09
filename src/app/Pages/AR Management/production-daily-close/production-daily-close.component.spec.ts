import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionDailyCloseComponent } from './production-daily-close.component';

describe('ProductionDailyCloseComponent', () => {
  let component: ProductionDailyCloseComponent;
  let fixture: ComponentFixture<ProductionDailyCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionDailyCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionDailyCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
