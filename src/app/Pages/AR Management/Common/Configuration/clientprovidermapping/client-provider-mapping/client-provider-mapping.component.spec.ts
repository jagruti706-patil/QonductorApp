import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProviderMappingComponent } from './client-provider-mapping.component';

describe('ClientProviderMappingComponent', () => {
  let component: ClientProviderMappingComponent;
  let fixture: ComponentFixture<ClientProviderMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProviderMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProviderMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
