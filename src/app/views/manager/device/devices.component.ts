import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerDeviceService} from 'src/app/services/api/manager-device/manager-device.service';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { GreenhouseList } from '../farm/farms.component';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ZoneData, ZoneList } from '../zone/zones.component';
import { TelemetryWebsocketService } from 'src/app/services/websocket/telemetry-websocket.service';

export let optionIcons = [
  {value: "icon TT22 (1).png", viewValue: 'icon TT22 (1).png'},
  {value: "icon TT22 (2).png", viewValue: 'icon TT22 (2).png'},
  {value: "icon TT22 (4).png", viewValue: 'icon TT22 (4).png'},
  {value: "icon TT22 (7).png", viewValue: 'icon TT22 (7).png'},
  {value: "icon TT22 (10).png", viewValue: 'icon TT22 (10).png'},
  {value: "icon TT22 (11).png", viewValue: 'icon TT22 (11).png'},
  {value: "icon TT22 (14).png", viewValue: 'icon TT22 (14).png'},
  {value: "icon TT22 (16).png", viewValue: 'icon TT22 (16).png'},
  {value: "icon TT22 (21).png", viewValue: 'icon TT22 (21).png'},
  {value: "icon TT22 (22).png", viewValue: 'icon TT22 (22).png'},
  {value: "icon TT22 (23).png", viewValue: 'icon TT22 (23).png'},
  {value: "icon TT22 (25).png", viewValue: 'icon TT22 (25).png'},
  {value: "icon TT22 (26).png", viewValue: 'icon TT22 (26).png'},
  {value: "icon TT22 (27).png", viewValue: 'icon TT22 (27).png'},
  {value: "icon TT22 (28).png", viewValue: 'icon TT22 (28).png'},
  {value: "icon TT22 (29).png", viewValue: 'icon TT22 (29).png'},
]

export interface DeviceData{
  id: string,
  name: string,
  active: boolean,
  greenhouseId: string,
  greenhouseName: string,
  zoneId: string,
  zoneName: string,
  avatar:string,
  pin: string
}

export interface DeviceList{
  id: string,
  name: string,
}

export let greenhouse: GreenhouseList[] = []
export let DeviceList: DeviceData[] = [] 

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent implements OnInit {
  optionImages = optionIcons

  optionDeviceType = [
    {value: "0", viewValue: 'Thiết bị'},
    {value: "1", viewValue: 'Đèn LED (BLE)'},
    {value: "2", viewValue: 'Chiết áp ( 0 - 10 V)'},
    {value: "3", viewValue: 'Thiết bị mở rộng'}  
  ]

  optionIndexRelay = [
    {value: "relay0", viewValue: '0'},
    {value: "relay1", viewValue: '1'},
    {value: "relay2", viewValue: '2'},
    {value: "relay3", viewValue: '3'},
    {value: "relay4", viewValue: '4'},
    {value: "relay5", viewValue: '5'},
    {value: "relay6", viewValue: '6'},
    {value: "relay7", viewValue: '7'},
  ]

  optionIndexLed = [
    {value: "Led", viewValue: 'LED'},
  ]

  optionIndexDim = [
    {value: "Dim", viewValue: 'DIM'},
  ]

  optionIndexKey = this.optionIndexRelay;

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

  selectedType: any = this.optionDeviceType[0].value;
  greenhouseSelected: any = this.optionGreenhouseAll[0];
  filterGreenhouseAll: any = this.optionGreenhouseAll[0].id;
  filterZoneAll: any = this.optionZoneAll[0].id;
  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  greenhouses: Array<any> = [];
  devices = DeviceList;
  idDeviceDeleted: string = '';
  buttonAddNew = true;
  ZoneList: ZoneData[] = [];
  zones = this.ZoneList;
  greenhouseId: string = "";
  pin: string = "";

  constructor(private fb: FormBuilder,
    private alerts: ShowAlertsService, 
    private obj: ManagerDeviceService, 
    private greenhouseObj: ManagerGreenhousesService,
    private authObj: AuthService,
    private zoneObj: ManagerZonesService,
    private telemetryService: TelemetryWebsocketService
  ) { 
    telemetryService.messages?.subscribe(msg => {
      console.log("Response from websocket: " + msg);
      let obj = this.telemetryService.relayStatus;
      let greenhouseId = this.optionGreenhouse[obj.index].id;
      console.log(greenhouseId, obj.index)
      this.devices.forEach(function(item,index){
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
    })
  }

  ngOnInit(): void {
    this.checkCurrentData();
    this.greenhouseSelected = this.optionGreenhouseAll[0];
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    // this.getZoneList(this.currentFarm);
    this.filterOption();
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

  formDevice = this.fb.group({
    id: this.fb.control(''),
    greenhouseId: this.fb.control({value: this.optionGreenhouse[0].id, disabled:false}),
    farmId: this.fb.control(this.currentFarm),
    deviceName: this.fb.control('', [Validators.required]),
    deviceType: this.fb.control({value: this.optionDeviceType[0].value, disabled: false}),
    indexKey: this.fb.control({value: this.optionIndexKey[0].value, disabled: false}),
    description: this.fb.control(this.optionImages[0].value)
  })

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    if(this.currentFarm == ''){
      this.buttonAddNew = false;
      this.alerts.showAlerts(titleType.farm, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
    } else {
      this.buttonAddNew = true;
    }
  }

  getGreenhouseList(currentFarm: string, currentUser:string ){
    if(currentFarm != '' && currentUser != ''){
      this.greenhouseObj.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("GREEN LIST")
          this.optionGreenhouse = res;
          this.optionGreenhouseAll = this.optionGreenhouseAll.concat(res);
          console.log(this.optionGreenhouse)
          this.getDeviceList(this.currentFarm);

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
          this.ZoneList = res
          this.zones = res; 
          this.optionZone = res;
          this.optionZoneAll = this.optionZoneAll.concat(res);
          // console.log(this.optionZoneAll);
          let zonesMap = this.ZoneList;
          console.log(this.devices)
          this.devices.map(function(item, index){
            if(item.zoneId == null){
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
          // this.filterOption();
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeviceList(currentFarm: string){
    if(currentFarm != ''){
      this.obj.getDevices(currentFarm).subscribe({
        next: (res: any) =>{
          DeviceList = res;
          this.devices = res;
          console.log("DEVICE LIST")
          console.log(res);
          let greenhouseList = this.optionGreenhouse;
          console.log(greenhouseList);
  
          this.devices.map(function(item, index){
            // console.log(greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name)
            let greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name;
            if (greenhouseName == null || undefined){
              return item.greenhouseName = "Loading"
            } else{
              return item.greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name
            }
          })
          this.getZoneList(this.currentFarm);
        },
        error: (e) => console.error(e)
      })
    }
  }

  addDevice(){
    if(this.formDevice.valid){
      console.log(this.formDevice.value);
      this.obj.addNewDevice(this.formDevice.value).subscribe({
        next: (res: any) =>{
          console.log(res);
          res.zoneName = "Chưa có";
          res.greenhouseName = this.optionGreenhouse.filter((u) => u.id === res.greenhouseId)[0].name;
          
          if((this.filterGreenhouseAll == '') && (this.filterZoneAll == '')){
            this.devices.push(res);
          } else {
            DeviceList.push(res)
          }
          this.alerts.showAlerts(titleType.device, "Thêm thiết bị thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.device, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    }
  }

  editDevice(){
    this.formDevice.value.greenhouseId = this.greenhouseId;
    this.formDevice.value.indexKey = this.pin;
    console.log(this.formDevice.value);
    this.obj.updateDevices(this.formDevice.value).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.getDeviceList(this.currentFarm);
        this.alerts.showAlerts(titleType.device, "Cập nhật thiết bị thành công", toastType.success);
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.device, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  getEditDevice(id: string, name: string, greenhouseId: string, avatar: string, pin: string){
    this.greenhouseId = greenhouseId;
    this.pin = pin;

    this.formDevice.get("greenhouseId")?.disable();
    this.formDevice.get("deviceType")?.disable();
    this.formDevice.get("indexKey")?.disable();
    this.formDevice.patchValue({
      id: id,
      deviceName: name,
      greenhouseId: greenhouseId,
      description: avatar,
      indexKey: pin,
      deviceType: '0'
    })
    this.selectEditIcon(avatar);
  }

  deleteDevice(){
    this.formDevice.value.greenhouseId = this.greenhouseId;
    this.formDevice.value.indexKey = this.pin;
    
    this.obj.deleteDevice(this.idDeviceDeleted, this.formDevice.value).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.devices = this.devices.filter((u) => u.id !== this.idDeviceDeleted);
        this.alerts.showAlerts(titleType.device, "Xóa thiết bị thành công", toastType.success);
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.device, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  getDeleteIdDevice(id: string, greenhouseId: string, pin: string){
    this.idDeviceDeleted = id;
    this.greenhouseId = greenhouseId;
    this.pin = pin;
  }

  selectIcon(value: string){
    this.formDevice.value.description = value;

    let imageGallery = document.getElementsByClassName('relay__add__image-gallery')[0];
    this.optionImages.forEach(function(item, index){
      if(item.value == value){
        imageGallery.getElementsByClassName('relay__add__image-gallery__image-container')[index]
        .setAttribute('style', "box-shadow: 1px 1px 3px 0px rgb(62, 240, 43);border-radius: 5px;background-color: rgb(241, 254, 241);")
      } else {
        imageGallery.getElementsByClassName('relay__add__image-gallery__image-container')[index]
        .setAttribute('style', "background-color:none;")
      }
    })
  }

  selectEditIcon(value: string){
    this.formDevice.value.description = value;

    let imageGallery = document.getElementsByClassName('relay__edit__image-gallery')[0];
    this.optionImages.forEach(function(item, index){
      if(item.value == value){
        imageGallery.getElementsByClassName('relay__edit__image-gallery__image-container')[index]
        .setAttribute('style', "box-shadow: 1px 1px 3px 0px rgb(62, 240, 43);border-radius: 5px;background-color: rgb(241, 254, 241);")
      } else {
        imageGallery.getElementsByClassName('relay__edit__image-gallery__image-container')[index]
        .setAttribute('style', "background-color:none;")
      }
    })
  }

  selectType(){
    console.log(this.selectedType)

    if(this.selectedType == '1'){
      this.optionIndexKey = [    
        {value: "Led", viewValue: 'LED'}
      ]
    } else if (this.selectedType == '2'){
      this.optionIndexKey = [    
        {value: "Dim", viewValue: 'DIM'}
      ]
    }

    switch(this.selectedType){
      case '0':
        this.onSelectedGreenhouseChange(this.greenhouseSelected)
        // this.optionIndexKey = this.optionIndexRelay;
        this.formDevice.patchValue({
          indexKey: this.optionIndexRelay[0].value
        })
        
        break;
      case '1':
        this.optionIndexKey = this.optionIndexLed;
        this.formDevice.patchValue({
          indexKey: this.optionIndexLed[0].value
        })
        break;
      case '2':
        this.optionIndexKey = this.optionIndexDim;
        this.formDevice.patchValue({
          indexKey: this.optionIndexDim[0].value
        })
        break;
      case '3':
        this.optionIndexKey = this.optionIndexRelay;
        this.formDevice.patchValue({
          indexKey: this.optionIndexRelay[0].value
        })
        break;
      default:
        this.optionIndexKey = this.optionIndexRelay;
        this.formDevice.patchValue({
          indexKey: this.optionIndexRelay[0].value
        })
        break;
    }
  }

  onSelectedGreenhouseChange(e:any){
    console.log("changeGW")
    console.log(e)
    let selectDeviceList: DeviceData[] = [];
    let selectOptionList = this.optionIndexRelay;
    selectDeviceList = DeviceList.filter((u) => u.greenhouseId === e);
    // this.optionIndexRelay = 
    for(let i = 0; i < selectDeviceList.length; i++){
      selectOptionList = selectOptionList.filter((u) => u.value != selectDeviceList[i].pin);
    }
    this.optionIndexKey = selectOptionList
    this.formDevice.patchValue({
      indexKey: this.optionIndexKey[0].value,
    })
    console.log(selectDeviceList)
    console.log(this.optionIndexKey)
  }

  filterOption(){
    console.log("Filter");
    console.log(this.filterGreenhouseAll, this.filterZoneAll)
    let record: any = [];
    if((this.filterGreenhouseAll == '') && (this.filterZoneAll == '')){
      this.devices = DeviceList;
      console.log("all")
    } else if ((this.filterGreenhouseAll == '') && (this.filterZoneAll != '')){
      record = DeviceList.filter((u) => u.zoneId === this.filterZoneAll);
      console.log("Zone" + record)
      this.devices = record;
    } else if ((this.filterGreenhouseAll != '') && (this.filterZoneAll == '')){
      record = DeviceList.filter((u) => u.greenhouseId === this.filterGreenhouseAll);
      console.log("Green" + record)
      this.devices = record;
    } else {
      record = DeviceList.filter((u) => (u.greenhouseId === this.filterGreenhouseAll) && (u.zoneId === this.filterZoneAll));
      console.log("ELSE" + record)
      this.devices = record;
    }
    
  }


  resetFormDevice(){
    console.log(this.devices)
    this.formDevice.get("greenhouseId")?.enable();
    this.formDevice.get("deviceType")?.enable();
    this.formDevice.get("indexKey")?.enable();
    this.formDevice.patchValue({
      id: '',
      greenhouseId: this.optionGreenhouse[0].id,
      farmId: this.currentFarm,
      deviceName: '',
      deviceType: this.optionDeviceType[0].value,
      description: this.optionImages[0].value
    })
    this.selectIcon(this.optionImages[0].value);
    this.onSelectedGreenhouseChange(this.optionGreenhouse[0].id);
  }
}
