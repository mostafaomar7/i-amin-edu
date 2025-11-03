import { TestBed } from '@angular/core/testing';

import { ReportanalysisServService } from './reportanalysis-serv.service';

describe('ReportanalysisServService', () => {
  let service: ReportanalysisServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportanalysisServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
