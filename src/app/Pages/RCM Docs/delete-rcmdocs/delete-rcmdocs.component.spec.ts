import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRCMDocsComponent } from './delete-rcmdocs.component';

describe('DeleteRCMDocsComponent', () => {
  let component: DeleteRCMDocsComponent;
  let fixture: ComponentFixture<DeleteRCMDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRCMDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRCMDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
