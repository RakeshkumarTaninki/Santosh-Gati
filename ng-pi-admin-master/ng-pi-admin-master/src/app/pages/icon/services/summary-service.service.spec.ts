import { TestBed } from '@angular/core/testing';

import { SummaryServiceService } from './summary-service.service';

describe('SummaryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummaryServiceService = TestBed.get(SummaryServiceService);
    expect(service).toBeTruthy();
  });
});
