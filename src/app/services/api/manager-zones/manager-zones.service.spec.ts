import { TestBed } from '@angular/core/testing';

import { ManagerZonesService } from './manager-zones.service';

describe('ManagerZonesService', () => {
  let service: ManagerZonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerZonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
