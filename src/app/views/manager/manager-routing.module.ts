import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmsComponent } from './farm/farms.component';
import { GreenhousesComponent } from './greenhouse/greenhouses.component';
import { ZonesComponent } from './zone/zones.component';
import { SensorsComponent } from './sensor/sensors.component';
import { DevicesComponent } from './device/devices.component';
import { UsersComponent } from './user/users.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Quản lý'
    },
    children:[
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'greenhouses'
      },
      {
        path: 'farms',
        component: FarmsComponent,
        data:{
          title: 'Nhà kính'
        }
      },
      {
        path: 'gateway',
        component: GreenhousesComponent,
        data:{
          title: 'Gateway'
        }
      },
      {
        path: 'zones',
        component: ZonesComponent,
        data:{
          title: 'Khu vực'
        }
      },
      {
        path: 'sensors',
        component: SensorsComponent,
        data:{
          title: 'Cảm biến'
        }
      },
      {
        path: 'devices',
        component: DevicesComponent,
        data:{
          title: 'Thiết bị'
        }
      },
      {
        path: 'users',
        component: UsersComponent,
        data:{
          title: 'Tài khoản'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
