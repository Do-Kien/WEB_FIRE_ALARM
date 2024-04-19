import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingRuleService {
  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) { 
    this.domain = environment.domain;
  }

  getRules(farmId: string) : Observable<any> {
    let farmID = new HttpParams().set('id', farmId);
    return this.http.get<any>(
      this.domain + this.url + '/rules', {params: farmID}
    )
  }

  getRuleByType(farmId: string, type: string) : Observable<any> {
    let params = new HttpParams().set('id', farmId).set('type', type);
    return this.http.get<any>(
      this.domain + this.url + '/rule', {params: params}
    )
  }

  getRuleInfo(id: string) : Observable<any> {
    return this.http.get<any>(
      this.domain + this.url + '/rules/' + id
    )
  }

  addRule(data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/rules', data
    )
  }

  activeRule(data: any) : Observable<any> {
    return this.http.put<any>(
      this.domain + this.url + '/rules/trigger', data
    )
  }

  updateRule(id: String, data: any) : Observable<any> {
    return this.http.put<any>(
      this.domain + this.url + '/rules/' + id, data
    )
  }

  deleteRule(id: Number) : Observable<any> {
    return this.http.delete<any>(
      this.domain + this.url + '/rules/' + id
    )
  }
}
