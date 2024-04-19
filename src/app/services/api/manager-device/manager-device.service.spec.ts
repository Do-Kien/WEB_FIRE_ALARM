import { TestBed } from '@angular/core/testing';

import { ManagerDeviceService } from './manager-device.service';

describe('ManagerDeviceService', () => {
  let service: ManagerDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
