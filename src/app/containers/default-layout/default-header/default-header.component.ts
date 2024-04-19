import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService) {
    super();
  }

  @Input() visible: boolean = true;
  @Output() updateProfile: EventEmitter<boolean> = new EventEmitter();
  @Output() changeFarm: EventEmitter<boolean> = new EventEmitter();

  showModalProfile(){
    this.updateProfile.emit(this.visible);
  }

  showModalChangeFarm(){
    console.log("changeeee" + this.visible)
    this.changeFarm.emit(this.visible);
  }
}
