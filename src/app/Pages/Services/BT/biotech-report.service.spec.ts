import { TestBed } from '@angular/core/testing';

import { BiotechReportService } from './biotech-report.service';

describe('BiotechReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BiotechReportService = TestBed.get(BiotechReportService);
    expect(service).toBeTruthy();
  });
});
