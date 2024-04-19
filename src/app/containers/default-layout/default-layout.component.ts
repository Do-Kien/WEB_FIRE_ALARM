import { Component } from '@angular/core';

import { navItems } from './_nav';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { UserService } from 'src/app/services/api/user/user.service';
import { ManagerFarmsService } from 'src/app/services/api/manager-farms/manager-farms.service';
import { FarmData } from 'src/app/views/manager/farm/farms.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  currentUser: string = '';
  currentFarm: string = '';
  farms: FarmData[] = [];
  currentFarmInfo: FarmData[] = [{id: "", name: '', description: "", numberOfGreenhouse: 0, createdAt: ""}];
  active?: string;

  constructor(private fb: FormBuilder,
    private authObj: AuthService,
    private farmObj: ManagerFarmsService,
    private obj: UserService
  ) {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
  }

  public visible = false;
  public visibleFarm = false;
  disableInput = true;
  hidePassword = true;
  hideNewPassword = true;
  hideRePassword = true;
  url = "./assets/img/avatars/8.jpg";

  passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}/;

  formUserInfo = this.fb.group({
    username: this.fb.control("", [Validators.required]),
    email: this.fb.control({value: "example@gmail.com", disabled: true },[Validators.required]),
    password: this.fb.control({value: "", disabled: this.disableInput}, [Validators.required]),
    newPassword: this.fb.control({value: "", disabled: this.disableInput}, [Validators.required, 
      Validators.pattern(this.passwordRegex)]),
    rePassword: this.fb.control({value: "", disabled: this.disableInput}, [Validators.required]),
  }, {
    validators: this.mustMatch('password', 'rePassword')
  })

  mustMatch(password: any, rePassword:any){
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const rePasswordControl = formGroup.controls[rePassword];
      if(rePasswordControl.errors && !rePasswordControl.errors['mustMatch']){
        return;
      }
      if(passwordControl.value != rePasswordControl.value){
        rePasswordControl.setErrors({ mustMatch: true});
      }
      else{
        rePasswordControl.setErrors(null);
      }
    }
  }

  getVisibleProfile(visible: boolean){
    this.obj.getUserInfo(this.currentUser).subscribe({
      next: (res: any) =>{
        this.formUserInfo.patchValue({
          username: res.title,
          email: res.email
        })
        this.visible = visible;
      },
      error: (e) => console.error(e)
    })

  }

  getVisibleFarm(visible: boolean){
    if(this.currentUser != ''){
      this.farmObj.getFarms(this.currentUser).subscribe({
        next: (res: any) =>{
          this.farms = res;
          this.currentFarmInfo = this.farms.filter((u) => u.id === this.currentFarm);
          this.active = this.currentFarmInfo[0].id
          this.visibleFarm = visible;
        },
        error: (e) => console.error(e)
      })
    }
  }

  toggleProfile() {
    this.visible = !this.visible;
  }

  handleProfileChange(event: any) {
    this.visible = event;
  }

  toggleFarm() {
    this.visibleFarm = !this.visibleFarm;
  }

  handleFarmChange(event: any) {
    this.visibleFarm = event;
  }

  changeFarmActive(farmId: string){
    this.active = farmId;
    localStorage.setItem('farm', farmId);
    window.location.href = "../home" 
  }

  getCheckBoxValue(event: any){
    if(event.target.checked){
      this.disableInput = false;
      this.formUserInfo.get("password")?.enable();
      this.formUserInfo.get("newPassword")?.enable();
      this.formUserInfo.get("rePassword")?.enable();
    } else {
      this.disableInput = true;
      this.formUserInfo.get("password")?.disable();
      this.formUserInfo.get("newPassword")?.disable();
      this.formUserInfo.get("rePassword")?.disable();
      this.formUserInfo.patchValue({
        password: "",
        newPassword: "",
        rePassword: ""
      })
    }
  }

  onselectFile(e:any){
    if(e.target.files){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any) => {
        this.url = event.target.result;
      }
    }
  }
}
