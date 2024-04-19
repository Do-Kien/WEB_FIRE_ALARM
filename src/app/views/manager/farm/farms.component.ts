import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { ManagerFarmsService} from 'src/app/services/api/manager-farms/manager-farms.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';

export interface GreenhouseList{
  id: string,
  name: string
}

export interface FarmData{
  id: string,
  name: string,
  description: string,
  numberOfGreenhouse: number,
  createdAt: string
}

export let FarmList: FarmData[] = [];

@Component({
  selector: 'app-farms',
  templateUrl: './farms.component.html',
  styleUrls: ['./farms.component.scss']
})
export class FarmsComponent implements OnInit {
  farms = FarmList;
  idFarmDeleted: string = '';
  numberGwOfFarmDeleted: number = 0;
  currentFarm: string = '';
  currentUser: string = '';
  greenhouses: Array<any> = []

  constructor(private fb: FormBuilder, 
    private alerts: ShowAlertsService, 
    private obj: ManagerFarmsService, 
    private greenhouseObj: ManagerGreenhousesService,
    private authObj: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.getFarmList();
  }

  formFarm = this.fb.group({
    id: this.fb.control(this.currentFarm),
    userId: this.fb.control(this.currentUser),
    farmName: this.fb.control('', [Validators.required]),
    farmDescription: this.fb.control('', [Validators.maxLength(50)]),
    numberOfGreenhouse: this.fb.control(0)
  })

  getFarmList(){
    if(this.currentUser != ''){
      this.obj.getFarms(this.currentUser).subscribe({
        next: (res: any) =>{
          console.log(res)
          FarmList = res;
          this.farms = FarmList;
  
          if(this.farms.length == 0){
            localStorage.setItem('farm', '');
            this.alerts.showAlerts(titleType.farm, "Tài khoản hiện tại chưa có Nhà kính nào. Vui lòng tạo một Nhà kính!", toastType.warning);
          } else if((this.currentFarm == '') && (this.farms.length > 0)){
            localStorage.setItem('farm', this.farms[0].id);
          }  
  
          for(let i = 0; i < this.farms.length; i++){
            this.greenhouseObj.getGreenhouses(this.farms[i].id, this.currentUser).subscribe({
              next: (res: any) =>{
                console.log(res)
                console.log(res.length)
                // this.greenhouses = res;
              },
              error: (e) => console.error(e)
            });
          }
        },
        error: (e) => console.error(e)
      })
    }
  }

  addFarm(){
    console.log(this.formFarm.value)
    let result = this.farms.filter((u:any) => u.name === this.formFarm.value.farmName);
    console.log(result.length);
    if(this.formFarm.valid && (result.length == 0)){
      this.obj.addNewFarm(this.formFarm.value).subscribe({
        next: (res: any) =>{
          console.log(res);
          this.farms.push(res);
          if((this.currentFarm == '') && (this.farms.length > 0)){
            localStorage.setItem('farm', this.farms[0].id);
          }
          this.alerts.showAlerts(titleType.farm, "Thêm nhà kính thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.farm, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    } else{
      this.alerts.showAlerts(titleType.farm, "Nhà kính đã có. Vui lòng đăng kí nhà kính khác !", toastType.error);
    }
  }

  editFarm(){
    console.log(this.formFarm.value)
    if(this.formFarm.valid){
      this.obj.updateFarm(this.formFarm.value).subscribe({
        next: (res: any) =>{
          console.log(res);
          this.farms.every(function(item, index){
              if(item.id == res.id){
                item.name = res.name;
                item.description = res.description;
                // item.createdAt = res.createdAt;
                return false;
              } else return true;
          })
          this.alerts.showAlerts(titleType.farm, "Cập nhật nhà kính thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.farm, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    }
  }

  deleteFarm(){
    
    if(this.numberGwOfFarmDeleted == 0){
      this.obj.deleteFarm(this.idFarmDeleted).subscribe({
        next: (res: any) =>{
          
          this.farms = this.farms.filter((u) => u.id !== this.idFarmDeleted);
          console.log(this.farms)
          if(this.farms.length == 0){
            localStorage.setItem('farm', '');
          } else if((this.currentFarm == this.idFarmDeleted) && (this.farms.length > 0)){
            console.log("Delete" + this.idFarmDeleted);
            localStorage.setItem('farm', this.farms[0].id);
          }
          this.alerts.showAlerts(titleType.farm, "Xóa nhà kính thành công", toastType.success);
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.farm, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      })
    } else {
      this.alerts.showAlerts(titleType.farm, "Vui lòng xóa tất cả Tủ điều khiển đang có trong Nhà kính !", toastType.error);

    }
    
  }

  getDeleteIdFarm(id:string, numberOfDevice: number){
    this.idFarmDeleted = id;
    this.numberGwOfFarmDeleted = numberOfDevice;
  }

  getEditIdFarm(id:string, name: string, description: string, numberOfGreenhouse: number){
    this.formFarm.patchValue({
      id: id,
      farmName: name,
      farmDescription: description,
      numberOfGreenhouse: numberOfGreenhouse
    })
    this.greenhouseObj.getGreenhouses(id, this.currentUser).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.greenhouses = res;
      },
      error: (e) => console.error(e)
    });
  }

  resetFormFarm(){
    this.formFarm.setValue({
      id: '',
      userId: this.currentUser,
      farmName: '',
      farmDescription: '',
      numberOfGreenhouse: 0
    })
  }
}
