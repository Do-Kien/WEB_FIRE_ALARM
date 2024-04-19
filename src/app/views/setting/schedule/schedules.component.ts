import { Component, OnInit } from '@angular/core';
import { GreenhouseList } from '../../manager/farm/farms.component';
import { ZoneList } from '../../manager/zone/zones.component';
import { FormBuilder } from '@angular/forms';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { SettingScheduleService } from 'src/app/services/api/setting-schedule/setting-schedule.service';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';

export interface ScheduleData {
  id: Number,
  name: string,
  active: boolean,
  farmId: string,
  greenhouseId: string,
  greenhouseName: string,
  zoneId: string,
  zoneName: string,
  start: string,
  stop: string,
  loop: Number,
  textLoop: string
  timer: any
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {

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

  filterGreenhouseAll: any = this.optionGreenhouseAll[0].id;
  filterZoneAll: any = this.optionZoneAll[0].id;
  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  buttonAddNew = true;
  ScheduleList: ScheduleData[] = [];
  schedules: ScheduleData[] = [];
  idScheduleDeleted: Number = 0;

  constructor(private fb: FormBuilder,
    private alerts: ShowAlertsService,
    private greenhouseObj: ManagerGreenhousesService,
    private zoneObj: ManagerZonesService,
    private authObj: AuthService,
    // private obj: SettingScheduleService  
    private obj: SettingRuleService
  ) { 
    
  }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    this.filterOption();
  }

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    if(this.currentFarm == ''){
      this.buttonAddNew = false;
      this.alerts.showAlerts(titleType.schedule, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
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
          // optionGreenList = this.optionGreenhouse;
          this.optionGreenhouseAll = this.optionGreenhouseAll.concat(res);
          console.log(this.optionGreenhouse)
          this.getScheduleList(this.currentFarm);
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
          this.optionZone = res;
          this.optionZoneAll = this.optionZoneAll.concat(res);
          // optionZoneList = this.optionZoneAll
          // console.log(this.optionZoneAll);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getScheduleList(currentFarm: string){
    if(currentFarm != ''){
      this.obj.getRuleByType(currentFarm, "schedule").subscribe({
        next: (res: any) =>{
          console.log("Schedule LIST")
          this.ScheduleList = res;
          this.schedules = this.ScheduleList;
          let greenhouseList = this.optionGreenhouse;
          let zoneList = this.optionZone;

          this.schedules.map(function(item, index){
            let greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name;
            let zoneName = "";
            if (greenhouseName == null || undefined){
              item.greenhouseName = "Loading";
              
            } else {
              item.greenhouseName = greenhouseList.filter((u) => u.id === item.greenhouseId)[0].name;
            }

            if(item.zoneId == ""){
              item.zoneName = "----------";
            } else{
              zoneName = zoneList.filter((u) => u.id === item.zoneId)[0].name;
              if (zoneName == null || undefined){
                item.zoneName = "Loading";
                
              } else {
                item.zoneName = zoneList.filter((u) => u.id === item.zoneId)[0].name; 
              }
            }

            item.textLoop = convertNumbertoDay(item.loop);
          })

          console.log(this.schedules)
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeleteIdSchedule(id: Number){
    this.idScheduleDeleted = id;
  }

  getEditIdSchedule(id: Number){
    localStorage.setItem('schedule', id.toString()); 
  }

  deleteSchedule(){
    this.obj.deleteRule(this.idScheduleDeleted).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.schedules = this.schedules.filter((u) => u.id !== this.idScheduleDeleted);
        this.alerts.showAlerts(titleType.schedule, "Xóa lịch điều khiển thành công", toastType.success);
      },
      error: (e) => {
        console.error(e);
        this.alerts.showAlerts(titleType.schedule, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
      }
    })
  }

  filterOption(){
    console.log("Filter");
    console.log(this.filterGreenhouseAll, this.filterZoneAll)
    let record: any = [];
    if((this.filterGreenhouseAll == '') && (this.filterZoneAll == '')){
      this.schedules = this.ScheduleList;
      console.log("all")
    } else if ((this.filterGreenhouseAll == '') && (this.filterZoneAll != '')){
      record = this.ScheduleList.filter((u) => u.zoneId === this.filterZoneAll);
      console.log("Zone" + record)
      this.schedules = record;
    } else if ((this.filterGreenhouseAll != '') && (this.filterZoneAll == '')){
      record = this.ScheduleList.filter((u) => u.greenhouseId === this.filterGreenhouseAll);
      console.log("Green" + record)
      this.schedules = record;
    } else {
      record = this.ScheduleList.filter((u) => (u.greenhouseId === this.filterGreenhouseAll) && (u.zoneId === this.filterZoneAll));
      console.log("ELSE" + record)
      this.schedules = record;
    }
    
  }

}

export function convertNumbertoDay(number: Number): string{
  let textLoop = "";
  let arr = ['T2, ', 'T3, ', 'T4, ', 'T5, ', 'T6, ', 'T7, ', 'CN']
  let text = number.toString(2).padStart(7,"0")
  if(number == 0){
    return "Không lặp lại"
  } else if(number == 127) {
    return " Hàng ngày "
  } else{
    for(let i = 0; i < 7; i++){
      if(text[i] == "1"){
        textLoop = textLoop.concat(arr[i]);
      }
    }
    return textLoop;
  }
}