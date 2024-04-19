import { Component, OnInit } from '@angular/core';
import { ScheduleData } from 'src/app/views/setting/schedule/schedules.component';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
@Component({
  selector: 'app-schedule-container',
  templateUrl: './schedule-container.component.html',
  styleUrls: ['./schedule-container.component.scss']
})
export class ScheduleContainerComponent implements OnInit {

  constructor(private ruleService: SettingRuleService,
    private authService:AuthService) { }

  currentFarm:string = ''
  currentUser:string = ''
  currentGreenhouse:string = ''
  ScheduleList: ScheduleData[] = [];
  ngOnInit(): void {
    this.checkCurrentData()
    this.getScheduleList(this.currentFarm);
  }

  checkCurrentData() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentFarm = this.authService.getCurrentFarm();
    this.currentGreenhouse = this.authService.getCurrentGreenhouse();
  }

  getScheduleList(currentFarm: string) {
    if (currentFarm != '') {
      this.ruleService.getRuleByType(currentFarm, "schedule").subscribe({
        next: (res: any) => {
          console.log("Schedule LIST")
          this.ScheduleList = res;
          console.log(this.ScheduleList)
        },
        error: (err:any) => console.error(err)
      })
    }
  }

}