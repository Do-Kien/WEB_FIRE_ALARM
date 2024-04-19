import { Pipe, PipeTransform } from '@angular/core';
import { SensorData } from 'src/app/views/manager/sensor/sensors.component';
@Pipe({
  name: 'filterSensor'
})
export class FilterSensorPipe implements PipeTransform {

  transform(sensors: SensorData[], filterGreenhouse: string, filterZone: string): SensorData[] {
    if (!sensors || sensors.length == 0) {
      return sensors
    }
    else {
      if (filterGreenhouse === "" && filterZone === "") {
        return sensors
      }
      else if (filterGreenhouse === "" && filterZone !== "") {
        return sensors.filter(sensor => sensor.zoneId === filterZone)
      }
      else if (filterZone === "" && filterGreenhouse !== "") {
        return sensors.filter(sensor => sensor.greenhouseId === filterGreenhouse)
      }
      else {
        return sensors.filter(sensor => sensor.greenhouseId === filterGreenhouse && sensor.zoneId === filterZone)
      }
    }
  }

}
