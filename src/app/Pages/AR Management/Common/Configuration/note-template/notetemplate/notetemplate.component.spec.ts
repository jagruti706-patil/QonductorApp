import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotetemplateComponent } from './notetemplate.component';

describe('NotetemplateComponent', () => {
  let component: NotetemplateComponent;
  let fixture: ComponentFixture<NotetemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotetemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotetemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
