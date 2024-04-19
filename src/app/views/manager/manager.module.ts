import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { FarmsComponent } from './farm/farms.component';
import { GreenhousesComponent } from './greenhouse/greenhouses.component';
import { ZonesComponent } from './zone/zones.component';
import { SensorsComponent } from './sensor/sensors.component';
import { DevicesComponent } from './device/devices.component';
import { UsersComponent } from './user/users.component';
import { AlertModule, ButtonModule, FormModule, ModalModule, ProgressModule, SpinnerModule, ToastModule, TooltipModule } from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { OthersModule } from '../others/others.module';
import { FilterGreenhousePipe } from './greenhouse/greenhouse-pipes/filter-greenhouse.pipe';
import { PaginationModule } from '@coreui/angular';

@NgModule({
  declarations: [
    FarmsComponent,
    GreenhousesComponent,
    ZonesComponent,
    SensorsComponent,
    DevicesComponent,
    UsersComponent,
    FilterGreenhousePipe,
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    ModalModule,
    FormModule,
    ButtonModule,
    TooltipModule,
    SpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    AlertModule,
    ToastModule,
    OthersModule,
    ProgressModule,
    PaginationModule
  ]
})
export class ManagerModule { }
