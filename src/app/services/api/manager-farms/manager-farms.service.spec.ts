import { TestBed } from '@angular/core/testing';

import { ManagerFarmsService } from './manager-farms.service';

describe('ManagerFarmsService', () => {
  let service: ManagerFarmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerFarmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
