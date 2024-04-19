import { Component, OnInit, Input } from '@angular/core';
import { ShowAlertsService } from 'src/app/services/show-alerts/show-alerts.service';
@Component({
  selector: 'app-show-alerts',
  templateUrl: './show-alerts.component.html',
  styleUrls: ['./show-alerts.component.scss']
})
export class ShowAlertsComponent implements OnInit {

  constructor(public alert: ShowAlertsService) { 
  }

  ngOnInit(): void {
  }
  
  visible:boolean = this.alert.visible;
  title:string = this.alert.title;
  content:string = this.alert.content;
  type:string = "success";
  
  position = 'bottom-end';
  percentage = 0;
  closeButton = true;

  onVisibleChange($event: boolean) {
    this.alert.visible = $event;
    this.percentage = !this.alert.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
}
