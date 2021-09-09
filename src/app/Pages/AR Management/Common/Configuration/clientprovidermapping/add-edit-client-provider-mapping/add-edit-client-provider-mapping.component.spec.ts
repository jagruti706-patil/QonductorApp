import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditClientProviderMappingComponent } from './add-edit-client-provider-mapping.component';

describe('AddEditClientProviderMappingComponent', () => {
  let component: AddEditClientProviderMappingComponent;
  let fixture: ComponentFixture<AddEditClientProviderMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditClientProviderMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditClientProviderMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
