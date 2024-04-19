import { TestBed } from '@angular/core/testing';

import { TelemetryWebsocketService } from './telemetry-websocket.service';

describe('TelemetryWebsocketService', () => {
  let service: TelemetryWebsocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelemetryWebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
