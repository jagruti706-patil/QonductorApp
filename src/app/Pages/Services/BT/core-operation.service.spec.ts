import { TestBed } from '@angular/core/testing';

import { CoreOperationService } from './core-operation.service';

describe('CoreOperationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreOperationService = TestBed.get(CoreOperationService);
    expect(service).toBeTruthy();
  });
});
