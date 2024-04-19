import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardsComponent } from './dashboard/dashboards.component';
import { ControldevicesComponent } from './greenhouse/controldevices.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Home'
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboards'
      },
      {
        path: 'dashboards',
        component: DashboardsComponent,
        data:{
          title: 'Dashboard'
        }
      },
      {
        path: 'controls',
        component: ControldevicesComponent,
        data:{
          title: 'Điều khiển'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
