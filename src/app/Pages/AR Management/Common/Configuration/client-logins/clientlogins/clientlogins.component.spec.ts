import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientloginsComponent } from './clientlogins.component';

describe('ClientloginsComponent', () => {
  let component: ClientloginsComponent;
  let fixture: ComponentFixture<ClientloginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientloginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientloginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
