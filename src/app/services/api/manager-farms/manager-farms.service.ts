import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerFarmsService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  getFarms(userId: string) : Observable<any> {
    let userID = new HttpParams().set('id', userId);
    return this.http.get<any>(
      this.domain + this.url + '/farms', {params: userID}
    )
  }

  addNewFarm(data: any) : Observable<any> {
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/farms', data
    )
  }

  deleteFarm(farmId: string) : Observable<any> {
    return this.http.delete<any>(
      this.domain + this.url + '/farms/' + farmId
    )
  }

  updateFarm(data: any) : Observable<any> {
    return this.http.put<any>(
      this.domain + this.url + '/farms', data
    )
  }
}
