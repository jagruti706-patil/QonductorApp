import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGroupClientMappingComponent } from './add-edit-group-client-mapping.component';

describe('AddEditGroupClientMappingComponent', () => {
  let component: AddEditGroupClientMappingComponent;
  let fixture: ComponentFixture<AddEditGroupClientMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditGroupClientMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGroupClientMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
