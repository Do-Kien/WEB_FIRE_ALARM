import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
}) 

export class ManagerPortService {

  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  getPorts(userId: string) : Observable<any> {
    let params = new HttpParams()
    .set('userId', userId)
  
    return this.http.get<any>(
      this.domain + this.url + '/ports', {params: params}
    )
  }

  deletePort(port : number) : Observable<any>{
    return this.http.delete<any>(
      this.domain + this.url + '/ports/' + port
    )
  }
}