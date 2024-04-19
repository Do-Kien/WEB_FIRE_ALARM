import { Pipe, PipeTransform } from '@angular/core';
import { GreenhouseData } from 'src/app/models/greenhouse.model';

@Pipe({
  name: 'filterGreenhouse',
  pure: false
})
export class FilterGreenhousePipe implements PipeTransform {

  transform(greenhouses: GreenhouseData[], filterText: string, searchProfileDevice: string): GreenhouseData[] {
    if (greenhouses.length == 0) {
      return greenhouses;
    }else{
      if(searchProfileDevice === "" && filterText === ""){
        return greenhouses;
      }else if(searchProfileDevice === "" && filterText !== ""){
        return greenhouses.filter(u => (u.mac.indexOf(filterText)) !== -1);
      }else if(searchProfileDevice && filterText === ""){
        return greenhouses.filter(u => u.deviceProfileId === searchProfileDevice);    
      }else{
        return greenhouses.filter(u => u.deviceProfileId === searchProfileDevice && (u.mac.indexOf(filterText)) !== -1);          
      }          
    }
  }

}