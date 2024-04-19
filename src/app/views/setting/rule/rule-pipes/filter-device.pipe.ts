import { Pipe, PipeTransform } from '@angular/core';
import {Device} from '../../../../models/device.model';
import { DeviceData } from 'src/app/views/manager/device/devices.component';
@Pipe({
  name: 'filterDevice'
})
export class FilterDevicePipe implements PipeTransform {

  transform(devices: DeviceData[], filterGreenhouse: string, filterZone: string): DeviceData[] {
    if (!devices|| devices.length == 0) {
      return devices
    }
    else{
      if(filterGreenhouse === "" && filterZone === ""){
        return devices
      }
      else if(filterGreenhouse === "" && filterZone !== ""){
        return devices.filter(device => device.zoneId === filterZone)
      }
      else if(filterZone === "" && filterGreenhouse !== ""){
        return devices.filter(device => device.greenhouseId === filterGreenhouse)
      }
      else{
        return devices.filter(device => device.greenhouseId === filterGreenhouse && device.zoneId === filterZone)
      }
    }
  }
}
