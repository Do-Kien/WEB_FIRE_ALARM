import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service'
import { GreenhouseList } from '../../manager/farm/farms.component';
import { ZoneList } from '../../manager/zone/zones.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface RuleData {
  id: Number,
  name: string,
  active: boolean,
  farmId: string,
  greenhouseId: string,
  greenhouseName: string,
  zoneId: string,
  zoneName: string,
  startTime: string,
  stopTime: string,
  loop: Number,
  textLoop: string,
  logic: string
}

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

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
  //list rules
  listRules:any = [];
  // idRule todo sth
  idRule:number = 0;
  constructor(private fb: FormBuilder,
    private alerts: ShowAlertsService,
    private greenhouseObj: ManagerGreenhousesService,
    private zoneObj: ManagerZonesService,
    private authObj: AuthService,
    private ruleService: SettingRuleService,
    private router:Router,
    private showAlertService:ShowAlertsService
  ) { }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    this.getRuleListData(this.currentFarm);
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

  getRuleListData(currentFarm:string){
    if (currentFarm != '') {
      this.ruleService.getRuleByType(currentFarm, "rule").subscribe((response:any)=>{
        this.listRules = response;
        if(this.listRules != null){
          for (let i = 0; i < this.listRules.length; i++) {
            const gateway = this.optionGreenhouse.find(item => item.id == this.listRules[i].greenhouseId);
            this.listRules[i].greenhouseName = gateway?.name;
            this.listRules[i].sensor = JSON.stringify(this.listRules[i].sensor);
            this.listRules[i].relay = JSON.stringify(this.listRules[i].relay);
            this.listRules[i].led = JSON.stringify(this.listRules[i].led);
            this.listRules[i].modbus = JSON.stringify(this.listRules[i].modbus);

            if (this.listRules[i].zoneId !== "") {
              const zone = this.optionZone.find(item => item.id == this.listRules[i].zoneId);
              this.listRules[i].zoneName = zone?.name;
            }
            else {
              this.listRules[i].zoneName = "Tất cả";
            }
          }
        }
        console.log('LIST RULES');
        console.log(this.listRules);
      },
      (error:any)=>{
        console.log(error);
      })
    }
  }

  goToEditRule(rule:any){
    this.router.navigate(['./setting/rules/update', rule]);
  }
  setIdRule(id:number){
    this.idRule = id
  }
  deleteRule(){
    this.ruleService.deleteRule(this.idRule).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.showAlertService.showAlerts(titleType.rule, "Xóa thành công luật điều khiển", toastType.success);
      },
      error: (e) => {
        this.showAlertService.showAlerts(titleType.rule, "Có lỗi xảy ra, vui lòng thử lại sau", toastType.error);
        console.error(e)
      }
    })
  }
}
