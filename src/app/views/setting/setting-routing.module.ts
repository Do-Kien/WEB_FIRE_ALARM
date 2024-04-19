import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesComponent } from './schedule/schedules.component';
import { ScriptsComponent } from './script/scripts.component';
import { RulesComponent } from './rule/rules.component';
import { AddRuleComponent } from './rule/add-rule/add-rule.component';
import { EditRuleComponent } from './rule/edit-rule/edit-rule.component';
import { AddScriptComponent } from './script/add-script/add-script.component';
import { EditScriptComponent } from './script/edit-script/edit-script.component';
import { AddScheduleComponent } from './schedule/add-schedule/add-schedule.component';
import { EditScheduleComponent } from './schedule/edit-schedule/edit-schedule.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cài đặt'
    },
    children:[
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'schedules'
      },
      {
        path: 'schedules',
        component: SchedulesComponent,
        data:{
          title: 'Lịch'
        }
      },
      {
        path: 'scripts',
        component: ScriptsComponent,
        data:{
          title: 'Kịch bản'
        }
      },
      {
        path: 'rules',
        component: RulesComponent,
        data:{
          title: 'Luật điều khiển'
        },
      },
      {
        path: 'rules/add',
        component: AddRuleComponent,
        data:{
          title: 'Thêm luật'
        }
      },
      {
        path: 'rules/update',
        component: EditRuleComponent,
        data:{
          title: 'Cập nhật luật'
        }
      },
      {
        path: 'scripts/add',
        component: AddScriptComponent,
        data:{
          title: 'Thêm kịch bản'
        }
      },
      {
        path: 'scripts/update',
        component: EditScriptComponent,
        data:{
          title: 'Cập nhật kịch bản'
        }
      },
      {
        path: 'schedules/add',
        component: AddScheduleComponent,
        data:{
          title: 'Thêm lịch'
        }
      },
      {
        path: 'schedules/update',
        component: EditScheduleComponent,
        data:{
          title: 'Cập nhật lịch'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
