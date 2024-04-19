import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ManagerGreenhousesService {
  private url = '/api/v3';
  private domain?:string;
  private sshDomain?: string;

  constructor(private http: HttpClient) {
    this.domain = environment.domain;  
    this.sshDomain = environment.SSH_DOMAIN;
  }

  getGreenhouses(farmId: string, userId: string) : Observable<any> {
    let farmID = new HttpParams()
    .set('id', farmId)
    .set('user', userId);
    return this.http.get<any>(
      this.domain + this.url + '/greenhouses', {params: farmID}
    )
  }

  getGateways(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)

    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/' + userId, {params: params}
    )
  }

  filterGatewayByProfile(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string ) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('deviceProfileId', deviceProfileId)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterProfile/' + userId, {params: params}
    )
  }

  filterGatewayByText(userId: string, pageSize: number, page: number, textSearch: string, sortProperty: string, sortOrder: string) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('textSearch',textSearch)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterText/' + userId, {params: params}
    )
  }

  filterGatewayByProfileAndText(userId: string, pageSize: number, page: number, textSearch: string, sortProperty: string, sortOrder: string, deviceProfileId: string ) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('textSearch',textSearch)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('deviceProfileId', deviceProfileId)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterProfileAndText/' + userId, {params: params}
    )
  }

  filterGatewayByState(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string, active: boolean) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('active', active)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterState/' + userId, {params: params}
    )
  }

  filterGatewayByProfileAndState(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string, active: boolean) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('deviceProfileId', deviceProfileId)
    .set('active', active)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterProfileAndState/' + userId, {params: params}
    )
  }

  filterGatewayByTextAndState(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string, textSearch: string, active: boolean) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('textSearch', textSearch)
    .set('active', active)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterTextAndState/' + userId, {params: params}
    )
  }

  filterGatewayByProfileAndTextAndState(userId: string, pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string, textSearch: string, active: boolean) : Observable<any> {
    let params = new HttpParams()
    .set('pageSize', pageSize)
    .set('page', page)
    .set('sortProperty', sortProperty)
    .set('sortOrder', sortOrder)
    .set('deviceProfileId', deviceProfileId)
    .set('textSearch', textSearch)
    .set('active', active)
    
    return this.http.get<any>(
      this.domain + this.url + '/gateways/filterProfileAndTextAndState/' + userId, {params: params}
    )
  }

  addNewGreenhouse(data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/greenhouses', data
    )
  }

  addNewGateway(data: any) : Observable<any> {
    console.log(data)
    return this.http.post<any>(
      this.domain + this.url + '/gateways', data
    )
  }

  switchGreenhouseMode(data: any) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/greenhouses/mode', data
    )
  }

  updateGateway(data: any) : Observable<any> {
    console.log(data)
    return this.http.put<any>(
      this.domain + this.url + '/gateways', data
    )
  }

  deleteGateway(gatewayId: string) : Observable<any> {
    return this.http.delete<any>(
      this.domain + this.url + '/gateway/' + gatewayId
    )
  }

  getConfigSSHServer() : Observable<any> {
    return this.http.get<any>(
      this.domain + this.url + '/server/config'
    )
  }

  configSSHServer(data: any) : Observable<any> {
    console.log(data)
    return this.http.post<any>(
      this.domain + this.url + '/server/config', data
    )
  }

  connectSSHRemote(gatewayId: string, userId: String) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/gateway/remote/' + gatewayId, userId
    )
  }

  disconnectSSHRemote(gatewayId: string, typeCancelRemote: string) : Observable<any> {
    return this.http.post<any>(
      this.domain + this.url + '/gateway/disconnect/' + gatewayId, typeCancelRemote
    )
  }

  mapADBPort(gatewayId: string, dataPort: any) : Observable<any>{
    return this.http.post<any>(
      this.domain + this.url + '/gateway/remoteADB/' + gatewayId, dataPort
    )
  }

  getGreenhousesByPage(page: number, pageSize: number){
    return this.http.get<any>(
      this.domain + this.url + '/greenhouses/currentPage=' + page + '&pageSize=' + pageSize
    )
  }
}
