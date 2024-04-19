import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-card',
  templateUrl: './schedule-card.component.html',
  styleUrls: ['./schedule-card.component.scss']
})
export class ScheduleCardComponent implements OnInit {

  @Input() scheduleName: any;
  @Input() scheduleStart: any;
  @Input() scheduleStop: any;
  @Input() scheduleLoop: any;

  constructor() { }

  ngOnInit(): void {
  }

}
