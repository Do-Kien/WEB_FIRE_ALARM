import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileDeviceService {

  private url = '/api/v3';
  private domain?:string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;
  }

  getProfileDevices() : Observable<any> {
    return this.http.get<any>(
      this.domain + this.url + '/deviceProfiles',
    )
  }
}
