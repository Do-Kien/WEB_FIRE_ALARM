import { Component, Input, OnInit } from '@angular/core';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
@Component({
  selector: 'app-rule-container',
  templateUrl: './rule-container.component.html',
  styleUrls: ['./rule-container.component.scss']
})
export class RuleContainerComponent implements OnInit {
  currentFarm:string = ''
  currentUser:string = ''
  currentGreenhouse:string = ''

  listRules: any = [];

  constructor(private ruleService:SettingRuleService,
    private authSerVice:AuthService) { }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getRuleListData(this.currentFarm);
  }

  checkCurrentData() {
    this.currentUser = this.authSerVice.getCurrentUser();
    this.currentFarm = this.authSerVice.getCurrentFarm();
    this.currentGreenhouse = this.authSerVice.getCurrentGreenhouse();
  }

  getRuleListData(currentFarm: string) {
    if (currentFarm != '') {
      this.ruleService.getRuleByType(currentFarm, "rule").subscribe((response: any) => {
        this.listRules = response;
        if(this.listRules != null){
          for (let i = 0; i < this.listRules.length; i++) {
            this.listRules[i].sensor = JSON.stringify(this.listRules[i].sensor);
            this.listRules[i].relay = JSON.stringify(this.listRules[i].relay);
            this.listRules[i].led = JSON.stringify(this.listRules[i].led);
            this.listRules[i].modbus = JSON.stringify(this.listRules[i].modbus);
          }
        }
        console.log('LIST RULES');
        console.log(this.listRules);
      },
        (error: any) => {
          console.log(error);
        })
    }
  }
}