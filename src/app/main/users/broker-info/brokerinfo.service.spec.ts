import { TestBed } from '@angular/core/testing';

import { BrokerinfoService } from './brokerinfo.service';

describe('BrokerinfoService', () => {
  let service: BrokerinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrokerinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
