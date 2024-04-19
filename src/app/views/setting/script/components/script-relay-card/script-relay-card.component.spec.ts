import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptRelayCardComponent } from './script-relay-card.component';

describe('ScriptRelayCardComponent', () => {
  let component: ScriptRelayCardComponent;
  let fixture: ComponentFixture<ScriptRelayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptRelayCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptRelayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
