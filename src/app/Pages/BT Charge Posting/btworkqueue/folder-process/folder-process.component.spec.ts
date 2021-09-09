import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderProcessComponent } from './folder-process.component';

describe('FolderProcessComponent', () => {
  let component: FolderProcessComponent;
  let fixture: ComponentFixture<FolderProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolderProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
