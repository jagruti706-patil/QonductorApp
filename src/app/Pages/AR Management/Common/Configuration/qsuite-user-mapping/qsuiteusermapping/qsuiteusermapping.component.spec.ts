import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QsuiteusermappingComponent } from './qsuiteusermapping.component';

describe('QsuiteusermappingComponent', () => {
  let component: QsuiteusermappingComponent;
  let fixture: ComponentFixture<QsuiteusermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QsuiteusermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QsuiteusermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
