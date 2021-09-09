import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupClientMappingComponent } from './group-client-mapping.component';

describe('GroupClientMappingComponent', () => {
  let component: GroupClientMappingComponent;
  let fixture: ComponentFixture<GroupClientMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupClientMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupClientMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
