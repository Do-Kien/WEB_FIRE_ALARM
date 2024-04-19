import { Component, OnInit, Input } from '@angular/core';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { ShowAlertsService } from 'src/app/services/show-alerts/show-alerts.service';
import { titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Led, Modbus, Relay, Sensor } from 'src/app/models/rule.model';
@Component({
  selector: 'app-rule-card',
  templateUrl: './rule-card.component.html',
  styleUrls: ['./rule-card.component.scss']
})
export class RuleCardComponent implements OnInit {

  ruleName = '';
  ruleStart = '';
  ruleStop = '';

  ruleStatus: boolean = false;

  listRelay: any[] = [];
  listModbus: any[] = [];
  listSensor: any[] = [];
  listLed: any[] = [];

  @Input() ruleInfor: any = {};
  constructor(private ruleService: SettingRuleService,
    private showAlertsService: ShowAlertsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ruleName = this.ruleInfor.name;
    this.ruleStart = this.ruleInfor.start;
    this.ruleStop = this.ruleInfor.stop;
    this.ruleStatus = this.ruleInfor.active;
    this.listRelay =  JSON.parse(this.ruleInfor.relay);
    this.listModbus =  JSON.parse(this.ruleInfor.modbus);
    this.listSensor =  JSON.parse(this.ruleInfor.sensor);
    this.listLed =  JSON.parse(this.ruleInfor.led);
    const relayArray = this.formBuilder.array([]);
    this.formRule.setControl('listRelay', relayArray);
    for (const relay of this.listRelay) {
      //loop qua từng relay trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listRelay
      const relayGroup = this.formBuilder.control({
        pin: relay.pin,
        name: relay.name,
        status: relay.status,
        id: relay.id,
        level: relay.level,
      });
      relayArray.push(relayGroup);
    }

    const sensorArray = this.formBuilder.array([]);
    this.formRule.setControl('listSensor', sensorArray);
    for (const sensor of this.listSensor) {
      //loop qua từng relay trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listRelay
      const sensorGroup = this.formBuilder.control({
        id: sensor.id,
        name: sensor.name,
        mac: sensor.mac,
        min: sensor.min,
        max: sensor.max,
        type: sensor.type,

      });
      sensorArray.push(sensorGroup);
    }
  }
  //form control status rule
  formRule = this.formBuilder.group({
    id: this.formBuilder.control(0),
    active: this.formBuilder.control(false),
    update: this.formBuilder.control(0),
    ruleName: this.formBuilder.control("", [Validators.required]),
    farmId: this.formBuilder.control(""),
    greenhouseId: this.formBuilder.control(""),
    zoneId: this.formBuilder.control(""),
    loop: this.formBuilder.control(0),
    start: this.formBuilder.control(""),
    stop: this.formBuilder.control(""),
    logic: this.formBuilder.control(""),
    type: this.formBuilder.control("rule"),
    timer: this.formBuilder.array([]),
    listRelay: this.formBuilder.array([]),
    listLed: this.formBuilder.array([]),
    listModbus: this.formBuilder.array([]),
    listSensor: this.formBuilder.array([])
  },)
  onStatusChange(): void {
    // this.ruleInfor.active = !this.ruleInfor.active;
    // this.ruleInfor.relay = JSON.parse(this.ruleInfor.relay);
    // this.ruleInfor.sensor = JSON.parse(this.ruleInfor.sensor);
    // this.ruleInfor.led = JSON.parse(this.ruleInfor.led);
    // this.ruleInfor.modbus = JSON.parse(this.ruleInfor.modbus);
    this.formRule.patchValue({
      active: !this.ruleInfor.active,
      farmId: this.ruleInfor.farmId,
      greenhouseId: this.ruleInfor.greenhouseId,
      id: this.ruleInfor.id,
      logic: this.ruleInfor.logic,
      loop: this.ruleInfor.loop,
      ruleName: this.ruleInfor.name,
      start: this.ruleInfor.start,
      stop: this.ruleInfor.stop,
      type: this.ruleInfor.type,
      update: this.ruleInfor.update,
      zoneId: this.ruleInfor.zoneId
    })
    console.log(this.formRule.value);
    
    this.ruleService.activeRule(this.formRule.value).subscribe({
      next: (res: any) => {
        this.showAlertsService.showAlerts(titleType.rule, "Điều khiển rule thành công", toastType.success);
        console.log(res);
      },
      error: (e) => {
        console.error(e)
        this.showAlertsService.showAlerts(titleType.rule, "Điều khiển rule thành công", toastType.success);
      }
    }
    )
  }
}