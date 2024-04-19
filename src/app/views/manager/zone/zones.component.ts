import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ShowAlertsService, toastType, titleType  } from 'src/app/services/show-alerts/show-alerts.service';
import { GreenhouseList } from '../farm/farms.component';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { DeviceData } from '../device/devices.component';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerSensorsService } from 'src/app/services/api/manager-sensors/manager-sensors.service';
import { SensorData } from '../sensor/sensors.component';
export interface ZoneData {
  id: string,
  name: string,
  greenhouseId: string,
  description: any,
  createdAt: string,
  listDevice: any,
  listSensor: any,
  numberOfDevice: number
}

export interface ZoneList {
  id: string,
  name: string
}

export let ZoneList: ZoneData[] = [];
@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {
  zones = ZoneList;
  optionAllGreenhouse: any = [{id: "", name: "Tất cả", active: true}];
  // optionGreenhouse:any = [];
  // greenhouseSelected: any = this.optionGreenhouse[0];
  greenhouseAllSelected: any = this.optionAllGreenhouse[0];
  selectSensor: any = [];
  selectDevice: any= [];
  addSensorArray: any = [];
  addDeviceArray: any = [];
  recordZone: ZoneData[] = [];
  idZone: string = '';
  filterText:string = '';
  
  greenhouseList: GreenhouseList[] = [];
  
  devices: DeviceData [] = [];
  DeviceList: DeviceData [] = [];
  sensors: SensorData[] = [];
  SensorList: DeviceData[] = [];


  optionGreenhouse: GreenhouseList[] = [
    {id: "", name: ""}
  ];

  optionGreenhouseAll: GreenhouseList[] = [
    {id: "", name: "Tất cả"}
  ];

  greenhouseSelected: any = this.optionGreenhouseAll[0];
  selectedOptionGreenhouse: any = this.optionGreenhouseAll[0];
  dropdownListSensor: Array<any> = [];
  dropdownListDevice: Array<any> = [];
  selectedSensorItems: Array<any> = [];
  selectedDeviceItems: Array<any> = [];
  dropdownSettings: any = {};
  buttonAddNew = true;
  currentFarm: string = '';
  currentUser: string = '';

  constructor( private fb: FormBuilder,
    private alerts: ShowAlertsService,
    private greenhouseObj: ManagerGreenhousesService,
    private deviceObj: ManagerDeviceService,
    private obj: ManagerZonesService,
    private authObj: AuthService,
    private sensorObj: ManagerSensorsService
    ) { }

  ngOnInit(): void {
    this.checkCurrentData();
    // this.getZoneList(this.currentFarm); 

    this.greenhouseSelected = this.optionGreenhouseAll[0];
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getSensorList(this.currentFarm, this.currentUser);
    this.filterOption();
    // this.dropdownListSensor = [];

    this.selectedSensorItems = [];
    this.selectedDeviceItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      noDataAvailablePlaceholderText: 'Không có lựa chọn',
      idField: 'id',
      textField: 'name',
      selectAllText: 'Chọn tất cả thiết bị tủ điều khiển này',
      unSelectAllText: ' Bỏ chọn tất cả thiết bị tủ điều khiển này',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }

  formZone = this.fb.group({
    id: this.fb.control(''),
    zoneName: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    greenhouse: this.fb.control(this.optionGreenhouse[0], [this.checkOptionGreenhouse]),
    farmId: this.fb.control(this.currentFarm),
    listDevice: this.fb.array([]),
    listSensor: this.fb.array([])
    // params: this.fb.array([]),
  })

  formZoneDetails = this.fb.group({
    // greenhouseId: this.fb.control(this.optionGreenhouse[0].id),
    greenhouse: this.fb.control(this.optionGreenhouse[0], [this.checkOptionGreenhouse]),
    listDevice: this.fb.array([]),
    listSensor: this.fb.array([])
  })

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();

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
          
          for(let i = 0; i < res.length; i++){
            let resObj: GreenhouseList[] = [{id: "", name: "Tất cả"}];
  
            resObj[0].id = res[i].id;
            resObj[0].name = res[i].name;
            this.greenhouseList.push(resObj[0])
          }  
  
          this.optionGreenhouse = this.greenhouseList;
          this.optionGreenhouseAll = this.optionGreenhouseAll.concat(this.greenhouseList);
          console.log(this.optionGreenhouse)
          this.getDeviceList(this.currentFarm);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeviceList(currentFarm: string){
    if(currentFarm != ''){
      this.deviceObj.getDevices(currentFarm).subscribe({
        next: (res: any) =>{
          console.log("DEVICE LIST")
          this.DeviceList = res;
          this.devices = res;
          console.log(this.devices);
          this.getZoneList(this.currentFarm); 
          // this.dropdownListDevice = this.devices.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getSensorList(currentFarm: string, currentUser: string){
    if((currentFarm != '') && (currentFarm != '')){
      // this.sensorObj.getSensorList(currentFarm, currentUser).subscribe({
        this.sensorObj.getSensorList(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("SENSOR LIST")
          this.SensorList = res;
          this.sensors = res;
          console.log(this.SensorList);
          
          let newSensorList: any[] = [];
          this.zones.forEach(function(item, index){
            if(item.listSensor.length > 0){
              for(let i = 0; i < item.listSensor.length; i++){
                newSensorList.push(item.listSensor[i].id)
              }
            }
          })

          for(let i = 0; i < newSensorList.length; i++){
            this.sensors = this.sensors.filter((u) => u.id !== newSensorList[i]);
          }

          console.log(newSensorList)
          console.log(this.sensors);

          this.dropdownListSensor = this.sensors.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);

          // console.log(this.optionGreenhouse[0])
          // this.getZoneList(this.currentFarm); 
          // this.dropdownListDevice = this.devices.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getZoneList(currentFarm: string){
    if(currentFarm != ''){
      this.obj.getZones(currentFarm).subscribe({
        next: (res: any) =>{
          console.log("Zone LIST")
          console.log(res)
          ZoneList = res
          this.zones = ZoneList; 
          // for (let i = 0; i < res.length; i++){
          //   let obj = res[i].description;
          //   if(obj.length < 5) {
          //     this.zones[i].description = 0;
          //   } else if ((obj.length > 5) && (obj.includes(","))){
          //     let data = obj.substring(1, (obj.length) - 1)
          //     console.log(data.split(","))
          //     this.zones[i].description = data.split(",").length
          //   } else {
          //     this.zones[i].description = 1;
          //   }
          // }
          this.zones.forEach(function(item, index){
            item.numberOfDevice = item.listDevice.length + item.listSensor.length
          })
  
          let newDeviceList: any[] = [];

          this.zones.forEach(function(item, index){
            if(item.listDevice.length > 0){
              for(let i = 0; i < item.listDevice.length; i++){
                newDeviceList.push(item.listDevice[i].id)
              }
            }
          })  
  
          for(let i = 0; i < newDeviceList.length; i++){
            this.devices = this.devices.filter((u) => u.id !== newDeviceList[i]);
          }
          
          console.log(this.devices)
          
          this.dropdownListDevice = this.devices.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
          // this.dropdownListSensor = this.sensors.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
        },
        error: (e) => console.error(e)
      }) 
    }
  }

  addZone(){
    this.formZone.value.farmId = this.currentFarm;
    this.formZone.value.listDevice = this.selectedDeviceItems;
    this.formZone.value.listSensor = this.selectedSensorItems;
    
    let dropdownDevice = this.devices;
    let dropdownSensor = this.sensors;
    let selectedGreenhouseList1: any = []
    let selectedGreenhouseList2: any = []

    console.log(dropdownDevice)
    console.log(this.selectedSensorItems)
    console.log(this.selectedDeviceItems)
    let x: string = '';
    this.selectedDeviceItems.forEach(function(item, index){
      let greenhouseId = dropdownDevice.filter((u) => u.id === item.id)[0].greenhouseId;
      if(x != greenhouseId){
        selectedGreenhouseList1.push(greenhouseId);
        x = greenhouseId;
      }
    })

    console.log(dropdownSensor)
    this.selectedSensorItems.forEach(function(item, index){
      let greenhouseId = dropdownSensor.filter((u) => u.id === item.id)[0].greenhouseId;
      if(x != greenhouseId){
        selectedGreenhouseList2.push(greenhouseId);
        x = greenhouseId;
      }
    })

    let arrSelectedGreenhouse: any = [...new Set(selectedGreenhouseList1.concat(selectedGreenhouseList2))]

    this.formZone.value.greenhouse = arrSelectedGreenhouse
    console.log(this.formZone.value)

    let result = this.zones.filter((u:any) => u.name === this.formZone.value.zoneName);
    console.log(result.length);

    if((this.formZone.valid) && (result.length == 0)){
      this.obj.addNewZone(this.formZone.value).subscribe({
        next: (res: any) =>{
          console.log(res);
          res.numberOfDevice = res.listDevice.length + res.listSensor.length;
          this.zones.push(res);
          for(let i = 0; i < res.listDevice.length; i++){
            this.devices = this.devices.filter((u) => u.id !== res.listDevice[i].id);
          }
          for(let i = 0; i < res.listSensor.length; i++){
            this.sensors = this.sensors.filter((u) => u.id !== res.listSensor[i].id);
          }

          this.alerts.showAlerts(titleType.zone, "Thêm khu vực thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.zone, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    } else{
      this.alerts.showAlerts(titleType.zone, "Khu vực đã có. Vui lòng đăng kí khu vực khác !", toastType.error);
    }
  }
  
  editZone(){
    this.formZone.value.farmId = this.currentFarm;
    this.formZone.value.listDevice = this.selectedDeviceItems;
    this.formZone.value.listSensor = this.selectedSensorItems;
    
    let dropdownDevice = this.devices;
    let dropdownSensor = this.sensors;
    let selectedGreenhouseList1: any = []
    let selectedGreenhouseList2: any = []

    console.log(this.selectedDeviceItems)
    console.log(dropdownDevice)
    let x: string = '';
    this.selectedDeviceItems.forEach(function(item, index){
      console.log(dropdownDevice.filter((u) => u.id === item.id))
      let greenhouseId = dropdownDevice.filter((u) => u.id === item.id)[0].greenhouseId;
      console.log(greenhouseId)
      if(x != greenhouseId){
        selectedGreenhouseList1.push(greenhouseId);
        x = greenhouseId;
      }
    })

    this.selectedSensorItems.forEach(function(item, index){
      let greenhouseId = dropdownSensor.filter((u) => u.id === item.id)[0].greenhouseId;
      if(x != greenhouseId){
        selectedGreenhouseList2.push(greenhouseId);
        x = greenhouseId;
      }
    })

    let arrSelectedGreenhouse: any = [...new Set(selectedGreenhouseList1.concat(selectedGreenhouseList2))]

    this.formZone.value.greenhouse = arrSelectedGreenhouse
    console.log(this.formZone.value)

    if(this.formZone.valid){
      this.obj.updateZone(this.formZone.value).subscribe({
        next: (res: any) =>{
          console.log("Update Zone")
          console.log(res)
        },
        error: (e) => console.error(e)
      })
    }
  }

  deleteZone(){
    //send API Delete
    this.obj.deleteZone(this.idZone).subscribe({
      next: (res: any) =>{
        this.zones = this.zones.filter((u) => u.id !== this.idZone);
        this.alerts.showAlerts(titleType.zone, "Xóa khu vực thành công", toastType.success);    
      },
      error: (e) => {
        console.error(e)
        this.alerts.showAlerts(titleType.zone, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  checkOptionGreenhouse(value: AbstractControl):ValidationErrors | null{
    const greenhouseValue = value.value;
    if(greenhouseValue == undefined) return{'undefined': true}
    return null;
  }

  onSelectedGreenhouseChange(e:any){
    console.log("changeGW")
    console.log(e)
    this.addSensorArray = [];
    this.addDeviceArray = [];
    console.log(this.selectedDeviceItems)
    this.dropdownListDevice = this.devices.filter((u) => u.greenhouseId === e.id);
    this.dropdownListSensor = this.sensors.filter((u) => u.greenhouseId === e.id);
    console.log(this.dropdownListSensor)

  }

  getDeleteIdZone(id:string){
    this.idZone = id;
  }

  getEditIdZone(id:string, name: string, description: string, listDevice: any, listSensor: any){
    console.log(id, name, description, listDevice, listSensor);
    this.dropdownListSensor = this.sensors.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
    this.selectedDeviceItems = listDevice;
    this.selectedSensorItems = listSensor;

    this.formZone.patchValue({
      id: id,
      zoneName: name,
    })
  }

  getFilterText(zone:string){
    this.filterText = zone;
    let record: any = []
    zone = zone.trim();
    zone = zone.toLowerCase();

    if(zone == ''){
      this.zones = this.recordZone;
    }
    else{
      this.recordZone.forEach(element => {
        if(element.name.includes(this.filterText)){
          record.push(element);
        }
      });
      this.zones = record;
    }
  }

  filterOption(){
    this.filterText = '';
    let record: any = []
    console.log(this.selectedOptionGreenhouse.id)
    if(this.selectedOptionGreenhouse.id == ''){
      this.zones = ZoneList;
    }
    else{
      ZoneList.forEach(element => {
        
        if(element.description.length < 5){
          console.log("EMPTY")
          this.zones = [];
        } else if ((element.description.length > 5) && (element.description.includes(","))){
          let data = element.description.substring(1, (element.description.length) - 1).split(",");
          console.log(data)
          for(let i = 0; i < data.length; i ++){
            if(data[i].includes(this.selectedOptionGreenhouse.id)){
              record.push(element);
            }
          }
        } else {
          let data = element.description.substring(1, (element.description.length) - 1);
          if(data.includes(this.selectedOptionGreenhouse.id)){
            record.push(element);
          }
          console.log(data)
        }
      });
      this.zones = record;
    }
    this.recordZone = this.zones;
  }

  resetFormZone(){
    
    this.selectedDeviceItems = [];
    this.selectedSensorItems = [];
    this.formZone.patchValue({
      greenhouse: this.optionGreenhouse[0],
      zoneName: '',
      listDevice: [],
      listSensor: []
    })
    // this.dropdownListDevice = this.devices.filter((u) => u.greenhouseId === this.optionGreenhouse[0].id);
  }
}
