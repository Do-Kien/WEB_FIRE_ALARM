import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SchedulesComponent } from './schedule/schedules.component';
import { ScriptsComponent } from './script/scripts.component';
import { RulesComponent } from './rule/rules.component';
import { AddRuleComponent } from './rule/add-rule/add-rule.component';
import { EditRuleComponent } from './rule/edit-rule/edit-rule.component';
import { AlertModule, ButtonModule, FormModule, ModalModule, ProgressModule, ToastModule, TooltipModule } from '@coreui/angular';
import { AddScriptComponent } from './script/add-script/add-script.component';
import { EditScriptComponent } from './script/edit-script/edit-script.component';
import { AddScheduleComponent } from './schedule/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './schedule/edit-schedule/edit-schedule.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OthersModule } from '../others/others.module';
import { BleCardComponent } from './rule/components/ble-card/ble-card.component';
import { RelayCardComponent } from './rule/components/relay-card/relay-card.component';
import { DimmingCardComponent } from './rule/components/dimming-card/dimming-card.component';
import { SensorCardComponent } from './rule/components/sensor-card/sensor-card.component';
import { FilterDevicePipe } from './rule/rule-pipes/filter-device.pipe';
import { FilterSensorPipe } from './rule/rule-pipes/filter-sensor.pipe';
import { ScriptRelayCardComponent } from './script/components/script-relay-card/script-relay-card.component';
import { FilterScriptDevicePipe } from './script/scripts-pipes/filter-script-device.pipe';

@NgModule({
  declarations: [
    SchedulesComponent,
    ScriptsComponent,
    RulesComponent,
    AddRuleComponent,
    EditRuleComponent,
    AddScriptComponent,
    EditScriptComponent,
    AddScheduleComponent,
    EditScheduleComponent,
    BleCardComponent,
    RelayCardComponent,
    DimmingCardComponent,
    SensorCardComponent,
    FilterDevicePipe,
    FilterSensorPipe,
    ScriptRelayCardComponent,
    FilterScriptDevicePipe
  ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    ModalModule,
    FormModule,
    ButtonModule,
    TooltipModule,
    AngularDualListBoxModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    FormModule,
    ReactiveFormsModule,
    AlertModule,
    ToastModule,
    OthersModule,
    ProgressModule
  ]
})
export class SettingModule { }
