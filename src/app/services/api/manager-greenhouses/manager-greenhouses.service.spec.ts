import { TestBed } from '@angular/core/testing';

import { ManagerGreenhousesService } from './manager-greenhouses.service';

describe('ManagerGreenhousesService', () => {
  let service: ManagerGreenhousesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerGreenhousesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
