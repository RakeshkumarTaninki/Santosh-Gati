import { TestBed } from '@angular/core/testing';

import { TransserviceService } from './transservice.service';

describe('TransserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransserviceService = TestBed.get(TransserviceService);
    expect(service).toBeTruthy();
  });
});
