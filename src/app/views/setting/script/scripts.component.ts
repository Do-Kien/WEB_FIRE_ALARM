import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { GreenhouseList } from '../../manager/farm/farms.component';
import { ZoneList } from '../../manager/zone/zones.component';
import { Router } from '@angular/router';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
@Component({
  selector: 'app-scripts',
  templateUrl: './scripts.component.html',
  styleUrls: ['./scripts.component.scss']
})
export class ScriptsComponent implements OnInit {
  currentFarm: string = ''
  currentGreenhouse: string = ''
  currentUser: string = ''
  listScript: any[] = [];

  optionGreenhouse: GreenhouseList[] = [
    { id: "", name: "" }
  ];

  optionZone: ZoneList[] = [
    { id: "", name: "" }
  ];

  optionZoneAll: ZoneList[] = [
    { id: "", name: "Tất cả" }
  ];

  //idScript todo sth
  idScript: number = 0;

  constructor(private authService: AuthService,
    private ruleService: SettingRuleService,
    private greenhouseService: ManagerGreenhousesService,
    private zoneService: ManagerZonesService,
    private router:Router,
    private showAlertService: ShowAlertsService) { }

  ngOnInit(): void {
    this.checkCurrentData()
    this.getScripts()
    this.getGreenhouseList(this.currentFarm, this.currentUser)
    this.getZoneList(this.currentFarm)
  }
  goToEditScript(script: any) {
    this.router.navigate(['./setting/scripts/update', script]);
  }
  checkCurrentData() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentFarm = this.authService.getCurrentFarm();
    this.currentGreenhouse = this.authService.getCurrentGreenhouse();
    // if (this.currentFarm == '') {
    //   this.buttonAddNew = false;
    //   this.alerts.showAlerts(titleType.schedule, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
    // } else {
    //   this.buttonAddNew = true;
    // }
  }

  getGreenhouseList(currentFarm: string, currentUser: string) {
    if (currentFarm != '' && currentUser != '') {
      this.greenhouseService.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) => {
          console.log("GREEN LIST")
          this.optionGreenhouse = res;
          console.log(this.optionGreenhouse)
        },
        error: (e) => console.error(e)
      })
    }
  }

  getZoneList(currentFarm: string) {
    if (currentFarm != '') {
      this.zoneService.getZones(currentFarm).subscribe({
        next: (res: any) => {
          console.log("Zone LIST")
          console.log(res)
          this.optionZone = res;
          this.optionZoneAll = this.optionZoneAll.concat(res);
          // optionZoneList = this.optionZoneAll
          // console.log(this.optionZoneAll);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getScripts() {
    this.ruleService.getRuleByType(this.currentFarm, 'script').subscribe({
      next: (res: any) => {
        this.listScript = res;
        console.log('LIST SCRIPTs');
        console.log(this.listScript);
        if(this.listScript != null){
          for (let i = 0; i < this.listScript.length; i++) {
            const gateway = this.optionGreenhouse.find(item => item.id == this.listScript[i].greenhouseId);
            this.listScript[i].greenhouseName = gateway?.name;
            this.listScript[i].sensor = JSON.stringify(this.listScript[i].sensor);
            this.listScript[i].relay = JSON.stringify(this.listScript[i].relay);
            this.listScript[i].led = JSON.stringify(this.listScript[i].led);
            this.listScript[i].modbus = JSON.stringify(this.listScript[i].modbus);
  
            if (this.listScript[i].zoneId !== "") {
              const zone = this.optionZone.find(item => item.id == this.listScript[i].zoneId);
              this.listScript[i].zoneName = zone?.name;
            }
            else {
              this.listScript[i].zoneName = "Tất cả";
            }
          }
        }
      },
      error: (err: any) => {
        console.log(err);

      }
    })
  }

  setScriptId(id: number) {
    this.idScript = id
  }

  deleteScript() {
    this.ruleService.deleteRule(this.idScript).subscribe({
      next: (res: any) => {
        console.log(res);
        this.showAlertService.showAlerts(titleType.rule, "Xóa thành công kịch bản", toastType.success);
      },
      error: (err: any) => {
        console.log(err);
        this.showAlertService.showAlerts(titleType.rule, "Có lỗi xảy ra, vui lòng thử lại sau", toastType.error);
      }
    })
  }
}
