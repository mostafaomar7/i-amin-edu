import { TestBed } from '@angular/core/testing';

import { NgxLiteVideoGeneralService } from './ngx-lite-video-general-service.service';

describe('NgxLiteVideoGeneralServiceService', () => {
  let service: NgxLiteVideoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxLiteVideoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
