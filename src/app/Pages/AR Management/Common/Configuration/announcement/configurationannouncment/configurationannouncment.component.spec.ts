import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationannouncmentComponent } from './configurationannouncment.component';

describe('ConfigurationannouncmentComponent', () => {
  let component: ConfigurationannouncmentComponent;
  let fixture: ComponentFixture<ConfigurationannouncmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationannouncmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationannouncmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
