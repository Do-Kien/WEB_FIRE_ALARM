import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { DashboardsComponent } from './dashboard/dashboards.component';
import { ControldevicesComponent } from './greenhouse/controldevices.component';
import { AlertModule, ButtonModule, DropdownModule, FormModule, GridModule, ListGroupModule, ProgressModule, TableModule, ToastModule, UtilitiesModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { NgApexchartsModule } from "ng-apexcharts";
import { IconModule } from '@coreui/icons-angular';
import { OthersModule } from '../others/others.module';
import { DashboardSensorCardComponent } from './dashboard/dashboard-sensor-card/dashboard-sensor-card.component';
import { RuleCardComponent } from './greenhouse/components/rule-card/rule-card.component';
import { ScheduleCardComponent } from './greenhouse/components/schedule-card/schedule-card.component';
import { ScriptCardComponent } from './greenhouse/components/script-card/script-card.component';
import { RuleContainerComponent } from './greenhouse/rule-container/rule-container.component';
import { ScheduleContainerComponent } from './greenhouse/schedule-container/schedule-container.component';

@NgModule({
  declarations: [
    DashboardsComponent,
    ControldevicesComponent,
    DashboardSensorCardComponent,
    RuleCardComponent,
    ScheduleCardComponent,
    ScriptCardComponent,
    RuleContainerComponent,
    ScheduleContainerComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ListGroupModule,
    GridModule,
    ChartjsModule,
    NgApexchartsModule,
    TableModule,
    UtilitiesModule,
    IconModule,
    DropdownModule,
    AlertModule,
    ToastModule,
    OthersModule,
    ProgressModule
  ]
})
export class HomeModule { }
