import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddqsuiteusermappingComponent } from './addqsuiteusermapping.component';

describe('AddqsuiteusermappingComponent', () => {
  let component: AddqsuiteusermappingComponent;
  let fixture: ComponentFixture<AddqsuiteusermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddqsuiteusermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddqsuiteusermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
