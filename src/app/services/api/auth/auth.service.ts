import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = '/api/v3';
  private domain?: string;

  constructor(private http: HttpClient) { 
    this.domain = environment.domain;
  }

  isLoggedIn(){
    return localStorage.getItem('accessToken') != null;
  }

  getAccessToken(){
    return localStorage.getItem('accessToken') || '';
  }

  getCurrentUser(){
    return localStorage.getItem('user') || '';
  }

  getCurrentFarm(){
    return localStorage.getItem('farm') || '';
  }

  getCurrentGreenhouse(){
    return localStorage.getItem('greenhouse') || '';
  }

  getCurrentSchedule(){
    return localStorage.getItem('schedule') || '';
  }

  getUserSSH(){
    return localStorage.getItem('userSSH') || '';
  }

  getHostSSH(){
    return localStorage.getItem('hostSSH') || '';
  }

  getServerPortSSH(){
    return localStorage.getItem('portSSH') || '';
  }

  getKeySSH(){
    return localStorage.getItem('keySSH') || '';
  }

  getForwardPort(gatewayId: string){
    return localStorage.getItem(gatewayId) || '';
  }

  postLogin(data: any): Observable<any>{
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/users/signin', data
    )
  }

  postRegister(data: any): Observable<any>{
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/users', data
    )
  }

  postResetPassword(data: any): Observable<any>{
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/users/forgotpassword', data
    )
  }

  uploadFile(data:any): Observable<any>{
    console.log(data);
    return this.http.post<any>(
      this.domain + this.url + '/upload', data
    )
  }

}
