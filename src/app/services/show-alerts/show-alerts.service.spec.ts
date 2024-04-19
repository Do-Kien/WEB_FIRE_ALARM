import { TestBed } from '@angular/core/testing';

import { ShowAlertsService } from './show-alerts.service';

describe('ShowAlertsService', () => {
  let service: ShowAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
