import { TestBed } from '@angular/core/testing';

import { LivesessionService } from './livesession.service';

describe('LivesessionService', () => {
  let service: LivesessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivesessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
