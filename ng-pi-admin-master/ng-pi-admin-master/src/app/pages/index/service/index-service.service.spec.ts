import { TestBed } from '@angular/core/testing';

import { IndexServiceService } from './index-service.service';

describe('IndexServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexServiceService = TestBed.get(IndexServiceService);
    expect(service).toBeTruthy();
  });
});
