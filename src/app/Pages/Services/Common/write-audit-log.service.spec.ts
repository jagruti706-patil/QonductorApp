import { TestBed } from "@angular/core/testing";

import { WriteAuditLogService } from "./write-audit-log.service";

describe("WriteAuditLogService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: WriteAuditLogService = TestBed.get(WriteAuditLogService);
    expect(service).toBeTruthy();
  });
});
