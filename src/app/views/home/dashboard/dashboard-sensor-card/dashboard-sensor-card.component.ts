import { Component, Input, OnInit } from '@angular/core';
import { SensorData } from 'src/app/views/manager/sensor/sensors.component';

@Component({
  selector: 'app-dashboard-sensor-card',
  templateUrl: './dashboard-sensor-card.component.html',
  styleUrls: ['./dashboard-sensor-card.component.scss']
})
export class DashboardSensorCardComponent implements OnInit {

  constructor() { }

  @Input() sensors: SensorData[] = [];
  ngOnInit(): void {
  }

}
