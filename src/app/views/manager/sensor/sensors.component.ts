import { Component, Input, OnInit } from '@angular/core';
import { GreenhouseList } from '../farm/farms.component';
import { ZoneData, ZoneList } from '../zone/zones.component';
import { FormBuilder, Validators } from '@angular/forms';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerSensorsService } from 'src/app/services/api/manager-sensors/manager-sensors.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { TelemetryWebsocketService } from 'src/app/services/websocket/telemetry-websocket.service';

export interface SensorData{
  id: string,
  name: string,
  active: boolean,
  timeUpdate: number,
  type: number,
  max: number,
  min: number,
  paramA: number,
  paramB: number,
  paramC: number,
  mac: string,
  battery: number,
  currentValue: any,
  isConfig: boolean,
  createdAt: string,
  greenhouseId: string,
  greenhouseName: string,
  zoneId: string,
  zoneName: string,
  updatedAt: string
}

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.scss']
})
export class SensorsComponent implements OnInit {
  timeScan: any = 0;
  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  buttonAddNew = true;
  idSensorDeleted = "";
  delSensor: any = {}

  ZoneList: ZoneData[] = [];

  optionGreenhouse: GreenhouseList[] = [
    {id: "", name: ""}
  ];

  optionGreenhouseAll: GreenhouseList[] = [
    {id: "", name: "Tất cả"}
  ];

  optionZone: ZoneList[] = [
    {id: "", name: ""}
  ];

  optionZoneAll: ZoneList[] = [
    {id: "", name: "Tất cả"}
  ];

  greenhouseSelected: any = this.optionGreenhouseAll[0];
  filterGreenhouseAll: any = this.optionGreenhouseAll[0].id;
  filterZoneAll: any = this.optionZoneAll[0].id;
  SensorList: SensorData[] = [];
  sensors = this.SensorList;


  constructor(private fb: FormBuilder,
    private alerts: ShowAlertsService,
    private authObj: AuthService,
    private obj: ManagerSensorsService,
    private greenhouseObj: ManagerGreenhousesService,
    private zoneObj: ManagerZonesService,
    private telemetryService: TelemetryWebsocketService
  ) { 
    telemetryService.messages?.subscribe(msg => {
      // console.log("Response from websocket: " + msg);
      // console.log("Relay: " + this.telemetryService.relayStatus.relay0)
      let telemetrySensor = this.telemetryService.telemetrySensor;
      console.log(this.optionGreenhouse)
      let greenhouseIdMapByIndexSensor = this.optionGreenhouse[telemetrySensor.index].id;
      
      this.sensors.forEach(function(item, index){
        if((item.greenhouseId == greenhouseIdMapByIndexSensor) && (item.mac == telemetrySensor.mac)){
          item.name = telemetrySensor.name;
          item.timeUpdate = telemetrySensor.update;
          item.updatedAt = telemetrySensor.updatedAt;
          item.battery = telemetrySensor.pin;
          item.active = telemetrySensor.active;
          item.isConfig = telemetrySensor.config;
          item.paramA = telemetrySensor.calibA;
          item.paramB = telemetrySensor.calibB;
          item.paramC = telemetrySensor.calibC;

          switch(telemetrySensor.type){
            case 0:
              item.currentValue.temp = telemetrySensor.temp;
              item.currentValue.hum = telemetrySensor.hum;
              console.log("SOKET TEMPHUMI")
            break;

            case 2:
              item.currentValue.mois = telemetrySensor.mois;
              console.log("SOKET MOIS")
            break;

            case 3:
              item.currentValue.lux = telemetrySensor.lux;
              console.log("SOKET LUX")
            break;

            case 4:
              item.currentValue.co2 = telemetrySensor.co2;
              console.log("SOKET CO2")
            break;

            case 5:
              item.currentValue.ec = telemetrySensor.ec;
              item.currentValue.temp = telemetrySensor.temp;
              item.currentValue.mois = telemetrySensor.mois;
              console.log("SOKET EC")
            break;
            
            case 6:
              item.currentValue.ph = telemetrySensor.ph;
              console.log("SOKET PH")
            break;
          }

          console.log(item)
        }
      })

      console.log(this.SensorList)
    })
  }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    // this.getSensors(this.currentFarm, this.currentUser);
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

  formSensor = this.fb.group({
    id: this.fb.control(''),
    name: this.fb.control('', [Validators.required]),
    mac: this.fb.control(''),
    // greenhouseId: this.fb.control({value: this.greenhouseSelected, disabled: true}),
    greenhouseId: this.fb.control(''),
    greenhouseName: this.fb.control({value: "", disabled: true}),
    timeUpdate: this.fb.control(0, [Validators.min(1), Validators.max(120)]),
    min: this.fb.control({value: 0, disabled: true},[Validators.min(1)]),
    max: this.fb.control({value: 0, disabled: true},[Validators.max(100000)]),
    paramA: this.fb.control(0),
    paramB: this.fb.control(0),
    paramC: this.fb.control(0),
    type: this.fb.control(""),
    isConfig: this.fb.control(true),
    battery: this.fb.control(100),
    active: this.fb.control(true),
    currentValue: this.fb.control("")
  })

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    if(this.currentFarm == ''){
      this.buttonAddNew = false;
      this.alerts.showAlerts(titleType.sensor, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
    } else {
      this.buttonAddNew = true;
    }
  }

  getGreenhouseList(currentFarm: string, currentUser:string ){
    if(currentFarm != '' && currentUser != ''){
      this.greenhouseObj.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("GREEN LIST")
          console.log(res)
          this.optionGreenhouse = res;
          this.optionGreenhouseAll = this.optionGreenhouseAll.concat(res);
          console.log(this.optionGreenhouse)
          this.greenhouseSelected = this.optionGreenhouse[0];
          this.getSensors(this.currentFarm, this.currentUser);

          for(let i = 0; i < this.optionGreenhouse.length; i++){
            this.sendMsg(this.optionGreenhouse[i].id, i);
          }
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
          this.ZoneList = res;
          this.optionZone = res;
          this.optionZoneAll = this.optionZoneAll.concat(res);
          // this.getSensors(this.currentFarm, this.currentUser);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getSensors(currentFarm: string, currentUser: string) {
    if(currentFarm != '' && currentUser != ''){
      this.obj.getSensorList(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("SENSORS LIST")
          this.SensorList = res;
          this.sensors = this.SensorList;
          console.log(res)
          let greenhouseList = this.optionGreenhouse;
          let zonesMap = this.ZoneList;
          console.log(greenhouseList);
          if(this.sensors != null){
            this.sensors.map(function(item, index){
              // console.log(greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name)
              let greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name;
              if (greenhouseName == null || undefined){
                return item.greenhouseName = "Loading"
              } else{
                return item.greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name
              }
            })

            this.sensors.map(function(item, index){
              if(!item.hasOwnProperty('zoneId')){
                return item.zoneName = "Chưa có"
              }else {
                let zoneName = zonesMap.filter((u) => u.id === item.zoneId)[0].name;
              if (zoneName == null || undefined){
                return item.zoneName = "Chưa có"
              } else{
                return item.zoneName = zonesMap.filter((u) => u.id === item.zoneId)[0].name;
              }
              }
            })
          }


          // console.log(this.currentGreenhouse)
          // this.getDeviceList(this.currentFarm);
        },
        error: (e) => console.error(e)
      })
    }
  }

  scanSensor(){
    const numb = document.getElementById("timeScan");
    const spinner = document.getElementById("spinnerScan");
    const retry = document.getElementById("retryScan");
    const cancelBtn = document.getElementById("cancelButton");

    let timeSec = 60;
    this.timeScan = setInterval(function(){
      if(numb != undefined && numb != null && spinner != undefined && spinner != null && retry != undefined && retry != null && cancelBtn != undefined && cancelBtn != null){
        if(timeSec == 0){
          numb.textContent = "Không tìm thấy thiết bị mới";
          numb.style.marginLeft = '-30%';
          spinner.style.display = 'none';
          retry.style.display = 'block';
          cancelBtn.style.marginRight = '5%';
        }
        else{
          timeSec -=1;
          numb.textContent = timeSec + "s còn lại";
        }  
      }
    }, 1000);

    // TODO HTTP Request
    console.log("SCAN" + this.greenhouseSelected.id)
    this.obj.scanSensor(this.greenhouseSelected.id).subscribe({
      next: (res: any) =>{
        console.log(res)
        // this.devices = this.devices.filter((u) => u.id !== this.idDeviceDeleted);
        // this.alerts.showAlerts(titleType.sensor, "Đang quét cảm biến !", toastType.success);
        window.location.reload();
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.sensor, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  cancelScan(){
    const numb = document.getElementById("timeScan");
    const spinner = document.getElementById("spinnerScan");
    const retry = document.getElementById("retryScan");

    if(numb != undefined && numb != null && spinner != undefined && spinner != null && retry != undefined && retry != null){
      spinner.style.display = 'block';
      retry.style.display = 'none';
      numb.style.marginLeft = '0%';
      numb.textContent = "60s còn lại";
    }
    clearInterval(this.timeScan);

    console.log("STOP" + this.greenhouseSelected.id)
    this.obj.stopScanSensor(this.greenhouseSelected.id).subscribe({
      next: (res: any) =>{
        console.log(res)
        // this.devices = this.devices.filter((u) => u.id !== this.idDeviceDeleted);
        // this.alerts.showAlerts(titleType.sensor, "Đã dừng quét cảm biến !", toastType.success);
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.sensor, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  editSensor(){

    if(this.formSensor.valid){
      this.obj.updateSensor(this.currentUser, this.formSensor.value).subscribe({
        next: (res: any) =>{
          console.log(res)
          this.sensors.every(function(item, index){
            if(item.id == res.id){
              console.log("herehere")
              item.name = res.name;
              item.timeUpdate = res.timeUpdate;
              item.isConfig = res.isConfig;
              item.paramA = res.paramA;
              item.paramB = res.paramB;
              item.paramC = res.paramC;
              return false;
            } else return true;
          }) 
          this.alerts.showAlerts(titleType.sensor, "Cập nhật cảm biến thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.sensor, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    }
  }

  getEditIdSensor(id:string, name: string, mac: string, greenhouseId: string, timeUpdate: number,
     minValue: number, maxValue: number, paramA: number, paramB: number, paramC: number, type: number,
     isConfig: boolean, battery: number, active: boolean, currentValue: string){
    
    console.log(type, isConfig, battery, active, currentValue, mac, maxValue, minValue);
      
    let greenhouseName = this.optionGreenhouseAll.filter((u) => u.id == greenhouseId)[0].name; 
    console.log(greenhouseName) 
    this.formSensor.patchValue({
      id: id,
      name: name,
      mac: mac,
      greenhouseId: greenhouseId,
      greenhouseName: greenhouseName,
      timeUpdate: timeUpdate,
      min: minValue,
      max: maxValue,
      paramA: paramA,
      paramB: paramB,
      paramC: paramC,
      type: String(type),
      isConfig: false,
      battery: battery,
      active: true,
      currentValue: currentValue
    })

    this.formSensor.value.min = minValue;
    this.formSensor.value.max = maxValue;
  }

  deleteSensor(){
    this.obj.deleteSensor(this.delSensor).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.sensors = this.sensors.filter((u) => u.id !== this.idSensorDeleted);
        this.alerts.showAlerts(titleType.sensor, "Xóa cảm biến thành công", toastType.success);
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.sensor, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  getDeleteIdSensor(id: string, mac: string, greenhouseId: string){
    this.idSensorDeleted = id;
    this.delSensor = {
      id: id,
      mac: mac,
      greenhouseId: greenhouseId
    }
  }

  retryScan(){
    this.cancelScan();
    this.scanSensor();
  }

  filterOption(){
    console.log("Filter");
    console.log(this.filterGreenhouseAll, this.filterZoneAll)
    let record: any = [];
    if((this.filterGreenhouseAll == '') && (this.filterZoneAll == '')){
      this.sensors = this.SensorList;
      console.log("all")
    } else if ((this.filterGreenhouseAll == '') && (this.filterZoneAll != '')){
      record = this.SensorList.filter((u) => u.zoneId === this.filterZoneAll);
      console.log("Zone" + record)
      this.sensors = record;
    } else if ((this.filterGreenhouseAll != '') && (this.filterZoneAll == '')){
      record = this.SensorList.filter((u) => u.greenhouseId === this.filterGreenhouseAll);
      console.log("Green" + record)
      this.sensors = record;
    } else {
      record = this.SensorList.filter((u) => (u.greenhouseId === this.filterGreenhouseAll) && (u.zoneId === this.filterZoneAll));
      console.log("ELSE" + record)
      this.sensors = record;
    }
    
  }
}
