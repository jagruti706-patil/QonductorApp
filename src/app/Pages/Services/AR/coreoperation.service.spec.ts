import { TestBed } from '@angular/core/testing';

import { CoreoperationService } from './coreoperation.service';

describe('CoreoperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreoperationService = TestBed.get(CoreoperationService);
    expect(service).toBeTruthy();
  });
});
