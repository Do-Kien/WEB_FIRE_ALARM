import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingScheduleService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) { 
    this.domain = environment.domain;
  }

  getSchedules(farmId: string) : Observable<any> {
    let farmID = new HttpParams().set('id', farmId);
    return this.http.get<any>(
      this.domain + this.url + '/schedules', {params: farmID}
    )
  }

  getScheduleInfo(id: string) : Observable<any> {
    return this.http.get<any>(
      this.domain + this.url + '/schedules/' + id
    )
  }

  addSchedule(data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/schedules', data
    )
  }

  updateSchedule(id: String, data: any) : Observable<any> {
    return this.http.put<any>(
      this.domain + this.url + '/schedules/' + id, data
    )
  }

  deleteSchedule(id: Number) : Observable<any> {
    return this.http.delete<any>(
      this.domain + this.url + '/schedules/' + id
    )
  }
}
