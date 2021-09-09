import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientusermappingComponent } from './clientusermapping.component';

describe('ClientusermappingComponent', () => {
  let component: ClientusermappingComponent;
  let fixture: ComponentFixture<ClientusermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientusermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientusermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
