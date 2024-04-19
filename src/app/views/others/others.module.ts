import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OthersRoutingModule } from './others-routing.module';
import { AlertModule, ButtonModule, FormModule, ModalModule, ProgressModule, ToastModule, TooltipModule } from '@coreui/angular';
import { ShowAlertsComponent } from './show-alerts/show-alerts.component';
import { FilterFormComponent } from './filter-form/filter-form.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ShowAlertsComponent,
    FilterFormComponent
  ],
  imports: [
    CommonModule,
    OthersRoutingModule,
    AlertModule,
    ToastModule,
    ProgressModule,
    ModalModule,
    FormsModule,
    FormModule
  ],
  exports: [
    ShowAlertsComponent,
    FilterFormComponent
  ]
})
export class OthersModule { }
