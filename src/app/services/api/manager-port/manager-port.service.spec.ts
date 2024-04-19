import { TestBed } from '@angular/core/testing';

import { ManagerPortService } from './manager-port.service';

describe('ManagerPortService', () => {
  let service: ManagerPortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerPortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
