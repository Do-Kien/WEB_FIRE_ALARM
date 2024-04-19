import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { DeviceData } from '../../manager/device/devices.component';
import { GreenhouseList } from '../../manager/farm/farms.component';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ZoneData, ZoneList } from '../../manager/zone/zones.component';
import { TelemetryWebsocketService } from 'src/app/services/websocket/telemetry-websocket.service';

export interface ControlData{
  greenhouseId: string,
  pin: string,
  status: boolean
}

@Component({
  selector: 'app-controldevices',
  templateUrl: './controldevices.component.html',
  styleUrls: ['./controldevices.component.scss']
})

export class ControldevicesComponent implements OnInit {
  optionControl = [
    {value: "0", viewValue: 'Thiết bị'},
    {value: "1", viewValue: 'Lịch'},
    {value: "2", viewValue: 'Kịch bản'},
    {value: "3", viewValue: 'Luật'}
  ];

  selectedControl: any = this.optionControl[0].value;

  value = 50;

  visibility = {'display': 'block'}
  unVisibility = {'display': 'none'}
  displayDevices: any = this.visibility;
  displaySchedules: any = this.unVisibility;
  displayScripts: any = this.unVisibility;
  displayRules: any = this.unVisibility;


  greenhouses: Array<any> = [];
  ZoneList: ZoneData[] = [];
  zones = this.ZoneList;
  devices: DeviceData[] = [];
  DeviceList: DeviceData[] = [];
  currentFarm: string = '';
  currentUser: string = '';
  optionGreenhouseAll: GreenhouseList[] = [{id: "", name: "Tất cả"}];
  optionZoneAll: ZoneList[] = [{id: "", name: "Tất cả"}];
  controlRelayObject: ControlData = {greenhouseId: "", pin: "", status: true};
  optionGreenhouse: GreenhouseList[] = [{id: "", name: ""}];
  filterGreenhouse: any = this.optionGreenhouse[0].id;
  filterZoneAll: any = this.optionZoneAll[0].id;
  currentGreenhouse: string = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private deviceObj: ManagerDeviceService,
    private greenhouseObj: ManagerGreenhousesService,
    private authObj: AuthService,
    private zoneObj: ManagerZonesService,
    private alerts: ShowAlertsService,
    private telemetryService: TelemetryWebsocketService
  ) { 
    telemetryService.messages?.subscribe(msg => {
      console.log("Response from websocket: " + msg);
      console.log("Relay: " + this.telemetryService.relayStatus.relay0)
      let obj = this.telemetryService.relayStatus
      let greenhouseId = this.optionGreenhouse[obj.index].id;
      console.log(greenhouseId, obj.index)
      this.DeviceList.forEach(function(item,index){
        if(item.greenhouseId == greenhouseId){
          if(item.pin == 'relay0'){
            item.active = obj.relay0;
          } else if (item.pin == 'relay1'){
            item.active = obj.relay1;
          } else if (item.pin == 'relay2'){
            item.active = obj.relay2;
          } else if (item.pin == 'relay3'){
            item.active = obj.relay3;
          } else if (item.pin == 'relay4'){
            item.active = obj.relay4;
          } else if (item.pin == 'relay5'){
            item.active = obj.relay5;
          } else if (item.pin == 'relay6'){
            item.active = obj.relay6;
          } else if (item.pin == 'relay7'){
            item.active = obj.relay7;
          }
        }
      })

      this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.currentGreenhouse);
    })
  }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    // this.getDeviceList(this.currentFarm);
    // this.getZoneList(this.currentFarm);
    // this.getDevicesValue(this.currentGreenhouse);
  }

  sendMsg(entityId: string, index: number) {
    let message = {
      tsSubCmds: [
          {
              entityType: "DEVICE",
              entityId: entityId,
              scope: "LATEST_TELEMETRY",
              cmdId: index
          }
      ],
      historyCmds: [],
      attrSubCmds: []
    }
    console.log("new message from client to websocket: ", message);
    this.telemetryService.messages?.next(message);
  }

  btnRadioGroup2 = this.formBuilder.group({
    radio2: this.formBuilder.control({ value: 'Radio2' })
  });

  setRadioValue(value: string): void {
    this.btnRadioGroup2.setValue({ radio2: value });
  }

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    if(this.currentFarm == ''){
      // this.buttonAddNew = false;
      this.alerts.showAlerts(titleType.farm, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
    } else {
      // this.buttonAddNew = true;
    }
  }

  getGreenhouseList(currentFarm: string, currentUser:string ){
    if(currentFarm != '' && currentUser != ''){
      this.greenhouseObj.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("GREEN LIST")
          this.optionGreenhouse = res;
          this.optionGreenhouseAll = this.optionGreenhouseAll.concat(res);
          console.log(this.optionGreenhouseAll)
  
          if (res.length == 0){
            localStorage.setItem('greenhouse', '');
          } else if ((this.currentGreenhouse == '') && (res.length > 0)){
            localStorage.setItem('greenhouse', res[0].id)
          } else {
            // this.currentGreenhouse = this.optionGreenhouse[0].id;
            this.filterGreenhouse = this.currentGreenhouse;
            console.log(this.currentGreenhouse)
          }
          for(let i = 0; i < this.optionGreenhouse.length; i++){
            this.sendMsg(this.optionGreenhouse[i].id, i);
          }
          this.getDeviceList(this.currentFarm);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getZoneList(currentFarm: string){
    if(currentFarm != ''){
      this.zoneObj.getZones(currentFarm).subscribe({
        next: (res: any) =>{
          console.log("Zone LIST")
          console.log(res)
          this.ZoneList = res
          this.zones = res; 
          this.optionZoneAll = this.optionZoneAll.concat(res);
          console.log(this.optionZoneAll);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeviceList(currentFarm: string){
    if(currentFarm != ''){
      this.deviceObj.getDevices(currentFarm).subscribe({
        next: (res: any) =>{
          this.DeviceList = res;
          // this.devices = res;
          console.log("DEVICE LIST")
          console.log(res);
          this.getZoneList(this.currentFarm);
          this.getDevicesValue(this.currentGreenhouse);
          this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.currentGreenhouse);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDevicesValue(currentGreenhouse: string){
    if(currentGreenhouse != ''){
      this.deviceObj.getValues(currentGreenhouse).subscribe({
        next: (res: any) =>{
          // this.devices = res;
          console.log("VALUES LIST")
          console.log(res);
          console.log(res.value);
          let obj = JSON.parse(res.value);
          this.devices.forEach(function(item,index){
            if(item.pin == 'relay0'){
              item.active = obj.relay0;
            } else if (item.pin == 'relay1'){
              item.active = obj.relay1;
            } else if (item.pin == 'relay2'){
              item.active = obj.relay2;
            } else if (item.pin == 'relay3'){
              item.active = obj.relay3;
            } else if (item.pin == 'relay4'){
              item.active = obj.relay4;
            } else if (item.pin == 'relay5'){
              item.active = obj.relay5;
            } else if (item.pin == 'relay6'){
              item.active = obj.relay6;
            } else if (item.pin == 'relay7'){
              item.active = obj.relay7;
            }
          })
          console.log(this.devices)
        },
        error: (e) => console.error(e)
      })
    }
  }

  controlRelay(greenhouseId: string, pin: string, status: boolean){
    console.log(greenhouseId, pin, status);

    this.controlRelayObject.greenhouseId = greenhouseId;
    this.controlRelayObject.pin = pin;
    this.controlRelayObject.status = status;

    this.deviceObj.controlRelays(this.controlRelayObject).subscribe({
      next: (res: any) =>{
        console.log("CONTROL")
        console.log(res);

        for(let i = 0; i < this.devices.length; i++){
          if(this.devices[i].pin == res.pin){
            this.devices[i].active = res.status;
            break;
          }
        }
      },
      error: (e) => console.error(e)
    })
  }

  selectControl(){
    switch(this.selectedControl){
      case '0':
        this.displayDevices = this.visibility;
        this.displaySchedules = this.unVisibility;
        this.displayScripts = this.unVisibility;
        this.displayRules = this.unVisibility;
        break;
      case '1':
        this.displayDevices = this.unVisibility;
        this.displaySchedules = this.visibility;
        this.displayScripts = this.unVisibility;
        this.displayRules = this.unVisibility;
        break;
      case '2':
        this.displayDevices = this.unVisibility;
        this.displaySchedules = this.unVisibility;
        this.displayScripts = this.visibility;
        this.displayRules = this.unVisibility;
        break;
      case '3':
        this.displayDevices = this.unVisibility;
        this.displaySchedules = this.unVisibility;
        this.displayScripts = this.unVisibility;
        this.displayRules = this.visibility;
        break;
      default:
        this.displayDevices = this.visibility;
        this.displaySchedules = this.unVisibility;
        this.displayScripts = this.unVisibility;
        this.displayRules = this.unVisibility;
        break;
    }
  }

  onSelectedGreenhouseChange(e:any){
    console.log("changeGW")
    console.log(this.filterGreenhouse, this.filterZoneAll)
    this.currentGreenhouse = e;
    console.log(this.currentGreenhouse)
    // this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.currentGreenhouse);
    if((this.filterGreenhouse == '')){
      console.log("None")
      this.devices = [];
    } else if((this.filterGreenhouse != '') && (this.filterZoneAll == '')){
      console.log("Green")
      this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.currentGreenhouse);
    } else {
      console.log("Both")
      this.devices = this.DeviceList.filter((u) => (u.greenhouseId === this.currentGreenhouse) && (u.zoneId === this.filterZoneAll));
    }
  }

  onSelectedZoneChange(e:any){
    console.log("changeZone")
    console.log(this.filterGreenhouse, this.filterZoneAll)
    console.log(this.currentGreenhouse)
    if((this.filterZoneAll == '') && (this.filterGreenhouse == '')){
      console.log("None1")
      this.devices = [];
    } else if((this.filterZoneAll == '') && (this.filterGreenhouse != '')){
      console.log("Green")
      this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.filterGreenhouse);
    } else if((this.filterZoneAll != '') && (this.filterGreenhouse == '')){
      console.log("None2")
      this.devices = [];
    } else {
      console.log("Both")
      this.devices = this.DeviceList.filter((u) => (u.greenhouseId === this.currentGreenhouse) && (u.zoneId === this.filterZoneAll));
    }
  }
}
