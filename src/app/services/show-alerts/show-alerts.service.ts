import { Injectable } from '@angular/core';

export enum toastType {
  error = 'danger',
  success = 'success',
  warning = 'warning'
}

export enum titleType {
  account = "Tài khoản",
  device = "Thiết bị",
  sensor = "Cảm biến",
  zone = "Khu vực",
  gateway = "Tủ điều khiển",
  farm = "Nhà kính",
  rule = "Luật điều khiển",
  script = "Kịch bản",
  schedule = "Lịch",
  control = "Điều khiển",
  download = "Tải dữ liệu"
}

@Injectable({
  providedIn: 'root'
})
export class ShowAlertsService {

  constructor() { }

  public title = '';
  public content = '';
  public color = ''; 
  public visible = false;

  showAlerts(title: string, content: string, type: string){
    this.title = title;
    this.content = content;
    this.color = type;
    this.visible = true;
  }
}
