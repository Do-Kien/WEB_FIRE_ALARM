import { TestBed } from '@angular/core/testing';

import { SettingRuleService } from './setting-rule.service';

describe('SettingRuleService', () => {
  let service: SettingRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingRuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
