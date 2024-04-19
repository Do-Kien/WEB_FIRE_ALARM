import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerDeviceService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  addNewDevice(data: any) : Observable<any> {
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/devices', data
    )
  }

  getDevices(farmId: string) : Observable<any> {
    let farmID = new HttpParams().set('id', farmId);
    return this.http.get<any>(
      this.domain + this.url + '/devices', {params: farmID}
    )
  }

  updateDevices(data: any) : Observable<any> {
    console.log(data);
    return this.http.put<any>(
      this.domain + this.url + '/devices', data
    )
  }

  deleteDevice(deviceId: string, data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/devices/' + deviceId, data
    )
  }

  getValues(greenhouseId: string) : Observable<any> {
    let greenhouseID = new HttpParams().set('id', greenhouseId);
    return this.http.get<any>(
      this.domain + this.url + '/values', {params: greenhouseID}
    )
  }

  controlRelays(data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/controls', data
    )
  }
}
