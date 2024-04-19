import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ShowAlertsService, titleType,toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { GreenhouseList } from 'src/app/views/manager/farm/farms.component';
import { ZoneList } from 'src/app/views/manager/zone/zones.component';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { DeviceData, DeviceList } from 'src/app/views/manager/device/devices.component';
import { SettingScheduleService } from 'src/app/services/api/setting-schedule/setting-schedule.service'
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent implements OnInit {

  optionGreenhouse: GreenhouseList[] = [
    {id: "", name: ""}
  ];

  optionZoneAll: ZoneList[] = [
    {id: "", name: "Tất cả"}
  ];

  optionDeviceType = [
    // {value: "", viewValue: 'Tất cả'},
    {value: "0", viewValue: 'Thiết bị'},
    {value: "1", viewValue: 'Đèn LED (BLE)'},
    {value: "2", viewValue: 'Chiết áp (0 - 10V)'},
    {value: "3", viewValue: 'Thiết bị mở rộng'},
  ];

  key = 'pin';
  display = 'name'
  // source = [ 'Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King' ];
  source = [{pin: "", name: ""}];
	target = [];
  format = { add: 'Thêm', remove: 'Xóa', all: 'Tất cả', none: 'Bỏ chọn', direction: 'left-to-right', draggable: true, locale: 'da'};

  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  DeviceList: DeviceData[] = [];
  devices: DeviceData[] = [];
  filterGreenhouse: any = this.optionGreenhouse[0].id;
  filterZoneAll: any = this.optionZoneAll[0].id;

  dropdownListDay: Array<any> = [
    {id: 0, name: "Thứ Hai"},
    {id: 1, name: "Thứ Ba"},
    {id: 2, name: "Thứ Tư"},
    {id: 3, name: "Thứ Năm"},
    {id: 4, name: "Thứ Sáu"},
    {id: 5, name: "Thứ Bảy"},
    {id: 6, name: "Chủ Nhật"}
  ];
  selectedDayItems: Array<any> = [];
  dropdownSettings: any = {};

  constructor(private fb: FormBuilder,
    private alerts: ShowAlertsService,
    private greenhouseObj: ManagerGreenhousesService,
    private zoneObj: ManagerZonesService,
    private authObj: AuthService,
    private deviceObj: ManagerDeviceService,
    private obj: SettingRuleService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.addTimeForm();
    this.checkCurrentData();
    // this.optionGreenhouse = optionGreenList;
    // this.optionZoneAll = optionZoneList;
    // console.log(this.optionGreenhouse);
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    this.getDeviceList(this.currentFarm);
    
    this.dropdownSettings = {
      singleSelection: false,
      noDataAvailablePlaceholderText: 'Không có lựa chọn',
      idField: 'id',
      textField: 'name',
      selectAllText: 'Hàng ngày',
      unSelectAllText: ' Bỏ chọn',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
  }

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    this.filterGreenhouse = this.currentGreenhouse;
  }

  getGreenhouseList(currentFarm: string, currentUser:string ){
    if(currentFarm != '' && currentUser != ''){
      this.greenhouseObj.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) =>{
          console.log("GREEN LIST")
          this.optionGreenhouse = res;
          // optionGreenList = this.optionGreenhouse;
          // this.optionGreenhouseAll = this.optionGreenhouseAll.concat(res);
          console.log(this.optionGreenhouse)

          // for(let i = 0; i < this.optionGreenhouse.length; i++){
          //   this.sendMsg(this.optionGreenhouse[i].id, i);
          // }
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
          // this.ZoneList = res
          // this.zones = res; 
          // this.optionZone = res;
          this.optionZoneAll = this.optionZoneAll.concat(res);
          // optionZoneList = this.optionZoneAll
          // console.log(this.optionZoneAll);
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
          // this.devices = this.DeviceList;
          console.log("DEVICE LIST")
          console.log(this.DeviceList);
          let record: any = [];
          let result: any = {};
          this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.filterGreenhouse);
          
          this.devices.forEach(function(item, index){
            result = {
              pin: item.pin,
              name: item.name
            }
            record.push(result)
          })

          // record = this.devices;
          this.source = record;

          console.log(this.source)
        },
        error: (e) => console.error(e)
      })
    }
  }

  formSchedule = this.fb.group({
    id: this.fb.control(""),
    ruleName: this.fb.control("", [Validators.required]),
    active: this.fb.control(false),
    farmId: this.fb.control(this.currentFarm),
    greenhouseId: this.fb.control(""),
    zoneId: this.fb.control(""),
    loop: this.fb.control(0),
    start: this.fb.control("00:00"),
    stop: this.fb.control("23:59"),
    logic: this.fb.control("or"),
    type: this.fb.control("schedule"),
    update: this.fb.control(-1),
    timer: this.fb.array([]),
    listRelay: this.fb.array([]),
    listLed: this.fb.array([]),
    listModbus: this.fb.array([]),
    listSensor: this.fb.array([])
  })

  addSchedule(){
    // console.log(this.form.value)
    let result: any = [];
    let checkTime: boolean = true;
    
    this.formSchedule.value.farmId = this.currentFarm;
    this.formSchedule.value.greenhouseId = this.filterGreenhouse;
    this.formSchedule.value.zoneId = this.filterZoneAll;
    this.formSchedule.value.loop = this.convertDaytoNumber(this.selectedDayItems);
    this.formSchedule.value.listRelay = this.target
    result = this.form.get("timer")?.value;
    this.formSchedule.value.timer = result;
    console.log(result)

    if((result[0].timeStart == '') || (result[0].timeStop == '')){
      console.log("ERROR 0")
      checkTime = false;
      this.alerts.showAlerts(titleType.schedule, "Thời gian cài đặt không được để trống !", toastType.error);
    } 
    if(!this.formSchedule.valid){
      this.alerts.showAlerts(titleType.schedule, "Vui lòng nhập tên lịch !", toastType.error);
    }
    for(let i = 1; i < result.length; i++){
      console.log(result[i])
      if((result[i].timeStart == '') || (result[i].timeStop == '')){
        console.log("ERROR 0")
        checkTime = false;
        this.alerts.showAlerts(titleType.schedule, "Thời gian cài đặt không được để trống !", toastType.error);
        break;
      } 
      else if((result[i].timeStart) > ((result[i].timeStop))){
        console.log("ERROR 1")
        checkTime = false;
        this.alerts.showAlerts(titleType.schedule, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc !", toastType.error);
        break;
      } else if((result[i].timeStart) < ((result[i-1].timeStop))){
        console.log("ERROR 2")
        checkTime = false;
        this.alerts.showAlerts(titleType.schedule, "Thời gian kết thúc phải nhỏ hơn thời gian bắt đầu của mốc kế tiếp !", toastType.error);
        break;
      }
    }

    if((checkTime == true) && (this.formSchedule.valid)){
      console.log(this.formSchedule.value)
      this.obj.addRule(this.formSchedule.value).subscribe({
        next: (res: any) =>{
          console.log(res);
          this.alerts.showAlerts(titleType.schedule, "Thêm lịch thành công", toastType.success);
          this.route.navigate(['../setting/schedules']);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.schedule, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    }
  }

  convertDaytoNumber(dayArr: any[]): number{
    let arr = ['0', '0', '0', '0', '0', '0', '0']
    let numberOfBin = ''
    for(let i = 0; i < dayArr.length; i++){
      arr[dayArr[i].id] = '1';
    }
    
    for(let i = 0; i< arr.length; i++){
      numberOfBin = numberOfBin.concat(arr[i])
    }

    return parseInt(numberOfBin,2);
  }

  onSelectedGreenhouseChange(e: string){
    let record: any = [];
    let result: any = {};
    this.target = [];
    if(this.filterGreenhouse == ''){
      record = [];
    } else if ((this.filterGreenhouse != '') && (this.filterZoneAll == '')){
      this.devices = this.DeviceList.filter((u) => u.greenhouseId === this.filterGreenhouse);
      this.devices.forEach(function(item, index){
        result = {
          pin: item.pin,
          name: item.name
        }
        record.push(result)
      })
    } else {
      this.devices = this.DeviceList.filter((u) => (u.greenhouseId === this.filterGreenhouse) && (u.zoneId === this.filterZoneAll));
      this.devices.forEach(function(item, index){
        result = {
          pin: item.pin,
          name: item.name
        }
        record.push(result)
      })
    }
    this.source = record;
  }

  public get time(){
    return (this.form.controls["timer"] as FormArray).controls as FormGroup[];
  }

  // timeline = new FormArray([])
  items!: FormArray;
  form = this.fb.group({
    timer: this.fb.array([])
  });

  addTimeForm(){
    // console.log(this.form.get("time")?.value)
    this.items = this.form.get("timer") as FormArray;

    if(this.items.length < 5){
      const timeForm = this.fb.group({
        timeStart: this.fb.control("", Validators.required),
        timeStop: this.fb.control("", Validators.required)
      });
      
      this.items.push(timeForm);  
    }
  }

  deleteTimeForm(index: number){
    if(this.items.length > 1){
      this.items.controls.splice(index,1);
      this.form.get("timer")?.value.splice(index,1);
    }
  }
}
