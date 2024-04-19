import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BleCardComponent } from './ble-card.component';

describe('BleCardComponent', () => {
  let component: BleCardComponent;
  let fixture: ComponentFixture<BleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BleCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
