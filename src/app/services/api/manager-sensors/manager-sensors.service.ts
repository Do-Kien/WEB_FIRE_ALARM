import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerSensorsService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) { 
    this.domain = environment.domain;
  }

  getSensorList(currentFarm: string, currentUser:string) : Observable<any> {
    let params = new HttpParams()
    .set('id', currentFarm)
    .set('user', currentUser);
    return this.http.get<any>(
      this.domain + this.url + '/sensors/all', {params: params}
    )
  }

  getSensors(currentUser:string, greenhouseId: string) : Observable<any> {
    let params = new HttpParams()
    .set('customerId', currentUser)
    .set('gatewayId', greenhouseId);

    console.log(params)
    return this.http.get<any>(
      this.domain + this.url + '/sensors', {params: params}
    )
  }

  getSensorValues(greenhouseId: string, startTs: string, endTs: string) : Observable<any> {
    let params = new HttpParams()
    .set('greenhouseId', greenhouseId)
    .set('startTs', startTs)
    .set('endTs', endTs)

    console.log(params)
    return this.http.get<any>(
      this.domain + this.url + '/sensors/values', {params: params}
    )
  }

  scanSensor(greenhouseId: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/sensors/scan', greenhouseId
    )
  }

  stopScanSensor(greenhouseId: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/sensors/stop', greenhouseId
    )
  }

  updateSensor(userId: string, data: any) : Observable<any> {
    console.log(data)
    return this.http.put<any>(
      this.domain + this.url + '/sensors/' +userId, data
    )
  }

  deleteSensor(delSensor: any) : Observable<any> {
    const options = {
      body: {
        id: delSensor.id,
        mac: delSensor.mac,
        greenhouseId: delSensor.greenhouseId
      }
    }
    return this.http.delete<any>(
      this.domain + this.url + '/sensors', options 
    )
  }

  // deleteSensor(sensorId: string, mac: string) : Observable<any> {
  //   return this.http.post<any>(
  //     this.domain + this.url + '/sensors/' + sensorId, mac
  //   )
  // }
}
