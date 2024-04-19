import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AuthService } from '../api/auth/auth.service';

export interface Message {
  author: string,
  message: string
}

export interface RelayStatus {
  index: number,
  relay0: boolean,
  relay1: boolean,
  relay2: boolean,
  relay3: boolean,
  relay4: boolean,
  relay5: boolean,
  relay6: boolean,
  relay7: boolean
}

export interface TelemetrySensor {
  index: number,
  name: string,
  mac: string,
  temp: number,
  hum: number,
  lux: number,
  mois: number,
  co2: number,
  ec: number,
  ph: number,
  pin: number,
  type: number,
  update: number,
  config: boolean,
  calibA: number,
  calibB: number,
  calibC: number,
  active: boolean,
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class TelemetryWebsocketService {
  public relayStatus: RelayStatus = {
    index: 0,
    relay0: false,
    relay1: false,
    relay2: false,
    relay3: false,
    relay4: false,
    relay5: false,
    relay6: false,
    relay7: false
  };

  public telemetrySensor: TelemetrySensor = {
    index: 0,
    name: "",
    mac: "",
    temp: 30,
    hum: 70,
    lux: 500,
    mois: 1,
    co2: 400,
    ec: 1,
    ph: 1,
    pin: 100,
    type: 0,
    update: 1,
    config: true,
    calibA: 0,
    calibB: 0,
    calibC: 1,
    active: true,
    updatedAt: ""
  }

  public messages?: Subject<any>;
  token?: string;

  constructor(private wsService: WebsocketService,
    private authObj: AuthService
    ) {
    this.token = this.authObj.getAccessToken();  
    this.messages = <Subject<any>>wsService.connect(environment.THINGSBOARD_WEBSOCKET_URL + this.token).pipe(
      map(
        (response: MessageEvent): any => {
          // console.log("RESPONSE" + response.data)
          // console.log(response)
          let data = JSON.parse(response.data);
          // console.log(data.data.relay[0])
          // console.log(typeof(data.data.relay[0]))
          // console.log(data['subscriptionId'])
          // console.log(Object.keys(data.data))

          for(let i = 0; i < Object.keys(data.data).length; i++){
            // console.log(Object.keys(data.data)[i])
            if(Object.keys(data.data)[i].includes("Lora_",0)){
              let arr:any =  Object.values(data.data)[i];

              let sensorData: any = Object.values(arr[0])[1];
              let sensorMac: any = Object.keys(data.data)[i];
              // console.log(Object.values(arr[0])[0])
              let sensorUpdatedAt: any = Object.values(arr[0])[0];
              let dataSensor = JSON.parse(sensorData);
              // console.log("DATASENSORRRR" + dataSensor.type)

              this.telemetrySensor.index = data['subscriptionId'];
              this.telemetrySensor.name = dataSensor.name;
              this.telemetrySensor.mac = sensorMac;
              this.telemetrySensor.pin = dataSensor.pin;
              this.telemetrySensor.type = dataSensor.type;
              this.telemetrySensor.update = dataSensor.update;
              this.telemetrySensor.config = dataSensor.config;
              this.telemetrySensor.calibA = dataSensor.calibA;
              this.telemetrySensor.calibB = dataSensor.calibB;
              this.telemetrySensor.calibC = dataSensor.calibC;
              this.telemetrySensor.active = dataSensor.active;
              this.telemetrySensor.updatedAt = sensorUpdatedAt;

              switch(dataSensor.type){
                case 0: 
                  this.telemetrySensor.temp = dataSensor.temp;
                  this.telemetrySensor.hum = dataSensor.hum;
                break; 

                case 2: 
                this.telemetrySensor.mois = dataSensor.mois;
                break; 

                case 3: 
                this.telemetrySensor.lux = dataSensor.lux;
                break; 

                case 4: 
                this.telemetrySensor.co2 = dataSensor.co2;
                break; 

                case 5: 
                this.telemetrySensor.ec = dataSensor.ec;
                this.telemetrySensor.temp = dataSensor.temp;
                this.telemetrySensor.mois = dataSensor.mois;
                break; 

                case 6: 
                  this.telemetrySensor.ph = dataSensor.ph;
                break; 
              }
            }

            if(Object.keys(data.data)[i] == "relay"){
              let relay:any = Object.values(data.data.relay[0])[1];
              let dataRelay = JSON.parse(relay);
              this.relayStatus.index = data['subscriptionId'];
              this.relayStatus.relay0 = Boolean(dataRelay.relay0);
              this.relayStatus.relay1 = Boolean(dataRelay.relay1);
              this.relayStatus.relay2 = Boolean(dataRelay.relay2);
              this.relayStatus.relay3 = Boolean(dataRelay.relay3);
              this.relayStatus.relay4 = Boolean(dataRelay.relay4);
              this.relayStatus.relay5 = Boolean(dataRelay.relay5);
              this.relayStatus.relay6 = Boolean(dataRelay.relay6);
              this.relayStatus.relay7 = Boolean(dataRelay.relay7);
            }
          }
          return data;
        }
      )
    )
  }
}
