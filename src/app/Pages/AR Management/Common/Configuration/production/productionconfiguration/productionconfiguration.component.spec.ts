import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionconfigurationComponent } from './productionconfiguration.component';

describe('ProductionconfigurationComponent', () => {
  let component: ProductionconfigurationComponent;
  let fixture: ComponentFixture<ProductionconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
