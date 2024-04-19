import { TestBed } from '@angular/core/testing';

import { ProfileDeviceService } from './profile-device.service';

describe('ProfileDeviceService', () => {
  let service: ProfileDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
