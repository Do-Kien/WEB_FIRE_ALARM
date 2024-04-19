import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerZonesService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  getZones(farmId: string) : Observable<any> {
    let farmID = new HttpParams().set('id', farmId);
    return this.http.get<any>(
      this.domain + this.url + '/zones', {params: farmID}
    )
  }

  addNewZone(data: any) : Observable<any> {
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/zones', data
    )
  }

  updateZone(data: any) : Observable<any> {
    console.log(data);
    return this.http.put<any>(
      this.domain + this.url + '/zones', data
    )
  }

  deleteZone(zoneId: string) : Observable<any> {
    return this.http.delete<any>(
      this.domain + this.url + '/zones/' + zoneId
    )
  }
}
