import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { mockUsers, mockFarmList } from 'src/app/services/mock-data/mock-data.service'

export interface AccountData {
  id: string,
  name: string,
  username: string,
  role: number,
  currentFarm: string,
  active: boolean
}

export let AccountList: AccountData[] = [];

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dropdownList: Array<any> = [];
  selectedItems: Array<any> = [];
  dropdownSettings: any = {};
  rePassword:boolean = true;
  hidePassword = true;
  hideRePassword = true;
  accounts = AccountList;
  idAccount: string = '';
  searchUser: string = '';
  filterText:string = '';
  optionFarm:any = [{id: "", farmName: "Tất cả"}]
  farmSelected: any = this.optionFarm[0];
  recordUser: AccountData[] = []
  optionRole = [
    {value: 1, viewValue: 'Admin'},
    {value: 2, viewValue: 'User'},
  ];

  constructor(private fb: FormBuilder, private alerts: ShowAlertsService) { }

  ngOnInit(): void {
    AccountList = mockUsers;
    // this.accounts = mockUsers;
    this.accounts = AccountList;
    this.dropdownList = mockFarmList;
    this.optionFarm = this.optionFarm.concat(mockFarmList)
    this.filterOption();
    // console.log(this.optionFarm)

    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'farmName',
      selectAllText: 'Chọn tất cả',
      unSelectAllText: ' Bỏ chọn tất cả',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  formUser = this.fb.group({
    userName: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    account: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    password: this.fb.control('', [Validators.required, 
      Validators.pattern('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,}$')]),
    rePassword: this.fb.control('', [Validators.required]),
    role: this.fb.control(this.optionRole[0].value),
    managerFarm: this.fb.array([])
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

  addAccount(){
    this.formUser.value.managerFarm = this.selectedItems;
    if(this.formUser.valid && this.selectedItems.length > 0){
      //send API data 
      // console.log(this.formUser.value)
      this.alerts.showAlerts(titleType.account, "Thêm tài khoản thành công", toastType.success);
    }
    else{
      this.alerts.showAlerts(titleType.account, "Vui lòng kiểm tra lại thông tin", toastType.error);
    }
  }

  editAccount(){
    this.formUser.value.managerFarm = this.selectedItems;
    if(this.formUser.valid && this.selectedItems.length > 0){
      //send API data 
      // console.log(this.formUser.value)
      // window.location.reload()
      this.alerts.showAlerts(titleType.account, "Cập nhật tài khoản thành công", toastType.success);
    }
    else{
      this.alerts.showAlerts(titleType.account, "Vui lòng kiểm tra lại thông tin", toastType.error);
    }
  }

  getDeleteIdAcount(id:string){
    this.idAccount = id;
  }

  getEditIdAcount(id:string, userName: string, account: string, role: number){
    this.idAccount = id;
    // console.log(this.idAccount)
    this.formUser.patchValue({
      userName: userName,
      account: account,
      role: role
    })
    let result = mockUsers.filter((u:any) => u.id === this.idAccount);
    // console.log(result[0].farmList)
    this.selectedItems = result[0].farmList
  }

  deleteAccount(){
    //send API Delete
    this.accounts = this.accounts.filter((u) => u.id !== this.idAccount);
    this.alerts.showAlerts(titleType.account, "Xóa tài khoản thành công", toastType.success);
  }

  resetFormUser(){
    this.formUser.setValue({
      userName: '',
      account: '',
      password: '', 
      rePassword: '',
      role: this.optionRole[1].value,
      managerFarm: []
    })
    this.selectedItems = []
  }

  getFilterText(account:string){
    this.filterText = account;
    let record: any = []
    account = account.trim();
    account = account.toLowerCase();

    if(account == ''){
      this.accounts = this.recordUser;
    }
    else{
      this.recordUser.forEach(element => {
        if(element.username.includes(this.filterText)){
          record.push(element);
        }
      });
      this.accounts = record;
    }
  }
  
  filterOption(){
    this.filterText = '';
    let record: any = []
    // console.log(this.farmSelected.id)
    if(this.farmSelected.id == ''){
      this.accounts = mockUsers;
    }
    else{
      AccountList.forEach(element => {
        if(element.currentFarm.includes(this.farmSelected.id)){
          record.push(element);
        }
      });
      this.accounts = record;
    }
    this.recordUser = this.accounts;
  }

}
