import { TestBed } from '@angular/core/testing';

import { ManagerSensorsService } from './manager-sensors.service';

describe('ManagerSensorsService', () => {
  let service: ManagerSensorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerSensorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
