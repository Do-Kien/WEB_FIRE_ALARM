import { TestBed } from '@angular/core/testing';

import { SettingScheduleService } from './setting-schedule.service';

describe('SettingScheduleService', () => {
  let service: SettingScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
