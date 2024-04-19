import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSensorCardComponent } from './dashboard-sensor-card.component';

describe('DashboardSensorCardComponent', () => {
  let component: DashboardSensorCardComponent;
  let fixture: ComponentFixture<DashboardSensorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardSensorCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSensorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
