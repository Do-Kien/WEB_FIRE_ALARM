import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { ShowAlertsService, toastType, titleType } from 'src/app/services/show-alerts/show-alerts.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { GreenhouseData } from '../../../models/greenhouse.model';
import { ManagerPortService } from 'src/app/services/api/manager-port/manager-port.service';
import { PortData } from 'src/app/models/port.model'; 
import { ProfileDevice } from 'src/app/models/profiledevice.model';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service'; 
import { ProfileDeviceService } from 'src/app/services/api/profile-device/profile-device.service';
import { HCData, HCDataOld } from 'src/app/models/device.model';
import { Console } from 'console';

@Component({
  selector: 'app-greenhouses',
  templateUrl: './greenhouses.component.html',
  styleUrls: ['./greenhouses.component.scss']
})
export class GreenhousesComponent implements OnInit {
  GreenhouseList: GreenhouseData[] = [];
  greenhouses: GreenhouseData[] = [];
  idGreenhouse: string = '';
  modeGreenhouse: string = '0';
  currentFarm: string = '';
  currentUser:string = '';
  filterText:string = '';
  recordGreenhouse: GreenhouseData[] = []
  optionFarm:any = []
  farmSelected: any = this.optionFarm[0];
  buttonAddNew = true;
  PortList: PortData[] = [];
  ports = this.PortList;
  searchProfileDevice: string = '';
  filterState: any = '';

  sortProperty: string = "label";
  sortOrder: string = "ASC"
  public isSortASC: boolean = true;
  public activeColumn: number = 1;

  currentPage: number = 0;
  pageSize: number = 10;
  pagesList: number[] = [];
  totalPage: number = 0;
  totalReport: number = 0;
  isClickEnabled: boolean = true;

  optionStatus = [
    {value: "", viewValue: 'Tất cả'},
    {value: "1", viewValue: 'Đang hoạt động'},
    {value: "2", viewValue: 'Ngưng hoạt động'},
  ];

  optionCancelTerminal = [
    {value: "ssh", viewValue: 'SSH Remote'},
    {value: "adb", viewValue: 'ADB Remote'},
  ];

  optionProfile : ProfileDevice[] = [{id: "", name: ""}];
  optionState = [
    {value: true, viewValue: 'Đang hoạt động'},
    {value: false, viewValue: 'Ngưng hoạt động'},
  ];
  profileId = this.optionProfile[0].id;  

  typeCancelRemote: string = this.optionCancelTerminal[0].value;
  statusGreenhouse: any = this.optionStatus[0].value;

  //SSH Remote
  public visible = false;
  public visibleADB = false;
  currentForwardPort = 22222;
  currentIP = "";
  //finish SSH remote 

  constructor(private fb: FormBuilder, 
    private alerts: ShowAlertsService, 
    private obj: ManagerGreenhousesService, 
    private authObj: AuthService,
    private portObj: ManagerPortService,
    private profileDeviceObj: ProfileDeviceService
  ) { }

  ngOnInit(): void {
    this.checkCurrentData();
    // this.getListProfileDevice();
    //this.getGatewayList();
    this.getSSHConfigData();  
  }

  formGateway = this.fb.group({
    id: this.fb.control(''),
    gatewayName: this.fb.control('', [Validators.required]),
    gatewayMAC: this.fb.control('', [Validators.required]),
    farmId: this.fb.control(this.currentFarm),
    userId: this.fb.control(this.currentUser),
    deviceProfileId: this.fb.control('')
  })

// SSH Remote

  formConfigSSH = this.fb.group({
    user: this.fb.control('', [Validators.required]),
    host: this.fb.control('', [Validators.required]),
    serverPort: this.fb.control(22, [Validators.required]),
    forwardPort: this.fb.control(22222, [Validators.required]),
    key: this.fb.control('', [Validators.required]),
  })

  formDeviceAccount = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required])
  })

  configServer(){
    this.obj.configSSHServer(this.formConfigSSH.value).subscribe({
      next: (res: any) =>{
        console.log("Config Server")
        console.log(res);
        localStorage.setItem('hostSSH', res.host);
      },
      error: (e) => {
        console.error(e)
        this.alerts.showAlerts(titleType.gateway, "Kết nối thất bại!", toastType.error);
      }
    })
  }

  // Danh sách loại Gateway
  getListProfileDevice(){
    this.profileDeviceObj.getProfileDevices().subscribe({
      next: (res: any) =>{
        console.log(res)
        this.optionProfile = res;
        this.getGatewayList(this.pageSize, 0, this.sortProperty, this.sortOrder);
      },
      error: (e) => console.error(e)
    });
  }
  
  getSSHConfigData(){
    this.obj.getConfigSSHServer().subscribe({
      next: (res: any) =>{
        console.log("Config Server")
        console.log(res);
        this.formConfigSSH.patchValue({
          user: res.user,
          host: res.host,
          serverPort: res.serverPort,
          key: res.key,
        })
        localStorage.setItem('hostSSH', res.host);
        this.currentIP = res.host;
      },
      error: (e) => {
        console.error(e)
        this.alerts.showAlerts(titleType.gateway, "Kết nối thất bại!", toastType.error);
      }
    })
  }

  mapADBPort(formInput: NgForm, event: MouseEvent){
    console.log("CLick")
    console.log(formInput.value.port);
    if (this.isClickEnabled){
      this.isClickEnabled = false;
      let dataPort = {
        userId: this.currentUser,
        localPort: formInput.value.port
      }
      this.obj.mapADBPort(this.idGreenhouse, dataPort).subscribe({
        next: (res: any) =>{
          console.log(res);
          this.currentForwardPort = res;
          // localStorage.setItem(gatewayId, res);
          this.isClickEnabled = true;
          this.visibleADB = true;
        },
        error: (e) => {
          this.isClickEnabled = true;
          console.error(e)
          this.alerts.showAlerts(titleType.gateway, "Kết nối thất bại!", toastType.error);
        }
      })
    }else{
      event.preventDefault();
    }    
  }

  connectSSHRemote(gatewayId: string, event: MouseEvent){
    if (this.isClickEnabled) {
      this.isClickEnabled = false;
      if(gatewayId != ''){
        this.obj.connectSSHRemote(gatewayId, this.currentUser).subscribe({
          next: (res: any) =>{
            console.log(res);
            this.currentForwardPort = res;
            // localStorage.setItem(gatewayId, res);
            this.visible = true;
            this.isClickEnabled = true;  
          },
          error: (e) => {
            this.isClickEnabled = true;  
            console.error(e)
            this.alerts.showAlerts(titleType.gateway, "Kết nối thất bại!", toastType.error);
          }
        })
      } else {
        this.alerts.showAlerts(titleType.gateway, "Bad Request!", toastType.error);
      }
    } else{
      event.preventDefault();
    }   
  }

  disconnectSSHRemote(greenhouseId: string, event: MouseEvent){
    if (this.isClickEnabled){
      this.isClickEnabled = false;
      this.obj.disconnectSSHRemote(greenhouseId, this.typeCancelRemote).subscribe({
        next: (res: any) =>{
          console.log(res);
          this.isClickEnabled = true;
          this.alerts.showAlerts(titleType.gateway, "Disconnect Terminal Success!", toastType.success);
        },
        error: (e) => {
          console.error(e)
          this.isClickEnabled = true;
          this.alerts.showAlerts(titleType.gateway, "Gateway đang không được kết nối tới SSH Server!", toastType.error);
        }
      })
    }else{
      event.preventDefault();
    }   
  }

  openTerminal(){
    let protocol = window.location.protocol;
    let port = 8888;
    let host = window.location.hostname;
    let hostname = this.authObj.getHostSSH();
    let username = this.formDeviceAccount.value.username?.trim();
    let password: any = this.formDeviceAccount.value.password?.trim();
    let base64Password = btoa(password);

    let url = protocol +"//" + host + ":" + port + "/?hostname=" + hostname + "&port=" + this.currentForwardPort + "&username=" + username + "&password=" + base64Password;
    console.log("URL" + url)
    window.open(url, "_blank");
  }


  toggleSSHRemote() {
    this.visible = !this.visible;
  }

  toggleADBRemote() {
    this.visibleADB = !this.visibleADB;
  }

  getGatewayList(pageSize: number, page: number, sortProperty: string, sortOrder: string){
    this.obj.getGateways(this.currentUser, pageSize, page, sortProperty, sortOrder).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByProfile(pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string){
    this.obj.filterGatewayByProfile(this.currentUser, pageSize, page, sortProperty, sortOrder, deviceProfileId).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByText(pageSize: number, page: number, textSearch: string, sortProperty: string, sortOrder: string){
    this.obj.filterGatewayByText(this.currentUser, pageSize, page, textSearch, sortProperty, sortOrder).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByProfileAndText(pageSize: number, page: number, textSearch: string, sortProperty: string, sortOrder: string, deviceProfileId: string){
    this.obj.filterGatewayByProfileAndText(this.currentUser, pageSize, page, textSearch, sortProperty, sortOrder, deviceProfileId).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByState(pageSize: number, page: number, sortProperty: string, sortOrder: string, active: boolean){
    this.obj.filterGatewayByState(this.currentUser, pageSize, page, sortProperty, sortOrder, active).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByProfileAndState(pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string, active: boolean){
    this.obj.filterGatewayByProfileAndState(this.currentUser, pageSize, page, sortProperty, sortOrder, deviceProfileId, active).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByTextAndState(pageSize: number, page: number, sortProperty: string, sortOrder: string, textSearch: string, active: boolean){
    this.obj.filterGatewayByTextAndState(this.currentUser, pageSize, page, sortProperty, sortOrder, textSearch, active).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  filterGatewayByProfileAndTextAndState(pageSize: number, page: number, sortProperty: string, sortOrder: string, deviceProfileId: string, textSearch: string, active: boolean){
    this.obj.filterGatewayByProfileAndTextAndState(this.currentUser, pageSize, page, sortProperty, sortOrder, deviceProfileId, textSearch, active).subscribe({
      next: (res: any) =>{
        console.log(res)
        this.processGatewayListData(res);
      },
      error: (e) => console.error(e)
    })
  }

  processGatewayListData(data: any){
    this.GreenhouseList = data.data;
        this.greenhouses = this.GreenhouseList;
        // this.greenhouses.sort(function(a: any, b: any){
        //   return b.createdAt - a.createdAt;
        // });
        this.mappingDeviceProfile();    
        console.log(this.greenhouses);
        this.totalPage = data.totalPages;
        this.getListPages();
        this.totalReport = data.totalElements
  }

  mappingDeviceProfile(){
    let deviceProfileList = this.optionProfile;
    this.greenhouses.map(function(item, index){
      let deviceProfile = deviceProfileList.filter((u) => u.id === item.deviceProfileId)[0];
        if (deviceProfile == null || undefined){
          return item.deviceProfileName = "Loading"
        } else{
          return item.deviceProfileName = deviceProfile.name
        }
    })
  }

  addGatewayToPlatform(){
    console.log(this.formGateway.value);     
    let result = this.greenhouses.filter((u:any) => u.mac === this.formGateway.value.gatewayMAC); 
    if(this.formGateway.valid && (result.length == 0)){
      //send API data 
      this.obj.addNewGateway(this.formGateway.value).subscribe({
        next: (res: any) =>{
          console.log(res)
          this.greenhouses.push(res);
          this.greenhouses.sort((a,b) => parseInt(b.createdAt) - parseInt(a.createdAt));

          this.mappingDeviceProfile();

          this.updatePageAfterSearch(0);          
          
          this.alerts.showAlerts(titleType.gateway, "Thêm Gateway thành công", toastType.success);          
        },
        error: (e) => {
          console.error(e);
          if(e.status == 500){
            this.alerts.showAlerts(titleType.gateway, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
          }else{
            this.alerts.showAlerts(titleType.gateway, "Không thể đăng kí Gateway này. Vui lòng đăng kí Gateway khác !", toastType.error);
          }
        }
      });

    }else{
      this.alerts.showAlerts(titleType.gateway, "Gateway đã có. Vui lòng đăng kí Gateway khác !", toastType.error);
    }
  }

//finish SSH remote
  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.getListProfileDevice();
  }

  editGreenhouse(){
    console.log(this.formGateway.value);
    if(this.formGateway.valid){
      this.obj.updateGateway(this.formGateway.value).subscribe({
        next: (res: any) =>{
          console.log(res)
          this.greenhouses.every(function(item, index){
            if(item.id == res.id){
              item.name = res.name;
              item.active = res.active;
              item.mode = res.mode;
              item.deviceProfileId = res.deviceProfileId;
              return false;
            } else return true;
          })
          console.log(this.greenhouses);
          this.mappingDeviceProfile();

          console.log(this.greenhouses);
          this.updatePageAfterSearch(0);

          this.alerts.showAlerts(titleType.gateway, "Cập nhật Gateway thành công", toastType.success);          
        },
        error: (e) => {
          console.error(e);
          this.alerts.showAlerts(titleType.gateway, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }
      });
    }
  }

  deleteGreenhouse(){
    console.log(this.GreenhouseList);
    //send API Delete
    this.obj.deleteGateway(this.idGreenhouse).subscribe({
      next: (res: any) =>{
        console.log(res)

        this.greenhouses = this.greenhouses.filter((u) => u.id !== this.idGreenhouse); 

        this.updatePageAfterSearch(0);

        this.alerts.showAlerts(titleType.gateway, "Xóa Gateway thành công", toastType.success);        
      },
      error: (e) => {
        console.error(e);
        if(e.status == 500){
          this.alerts.showAlerts(titleType.gateway, "Hệ thống đang bị lỗi. Vui lòng thử lại sau !", toastType.error);
        }else{
          this.alerts.showAlerts(titleType.gateway, "Xóa Gateway thất bại", toastType.error);
        }
      }
    });
  }

  getDeleteIdGreenhouse(id: string){
    this.idGreenhouse = id;
  }

  getEditIdGreenhouse(id:string, name: string, mac: string, idFarm: string, mode: string, deviceProfileId: string){
    // this.idGreenhouse = id;
    this.modeGreenhouse = mode;
    console.log(idFarm);
    this.formGateway.patchValue({
      id: id,
      gatewayName: name,
      gatewayMAC: mac,
      deviceProfileId: deviceProfileId,
      userId: this.currentUser
    })
  }

  resetFormGreenhouse(){
    this.formGateway.patchValue({
      id: '',
      gatewayName: '',
      gatewayMAC: '',
      farmId: this.currentFarm,
      userId: this.currentUser,
      deviceProfileId: this.optionProfile[0].id
      // greenhouseOfFarm: ''
    })
  }

  getFilterText(greenhouse: string){
    this.filterText = greenhouse;
    this.updatePageAfterSearch(0);
  }

  // Lay danh sach port
  getListPort(){
    this.portObj.getPorts(this.currentUser).subscribe({
      next: (res: any) =>{
        this.ports = res;
        this.ports.sort(function(a: any, b: any){
          return a.port - b.port;
        });
        console.log(this.ports)
        let greenhouseList = this.greenhouses;
        this.ports.map(function(item, index){
          let greenhouse = greenhouseList.filter((u) => u.id === item.deviceId)[0];
          item.name = greenhouse.name;
          item.mac = greenhouse.mac;
        })
      },
      error: (e) => console.error(e)
    });
  }

  deletePort(port : number){
    this.portObj.deletePort(port).subscribe({
      next: (res : any) =>{
        this.ports = this.ports.filter((u) => u.port !== port);
        console.log(this.ports)
      },
      error: (e) => console.error(e)
    })
  }

  getListPages(){
    console.log("TOTAL:" + this.totalPage);
    this.pagesList = [];
    if (this.totalPage > 0) {  
      console.log("TOTAL:" + this.totalPage);
      for(let i = 0 ; i < this.totalPage; i++) {  
        this.pagesList.push(i);  
      }  
    }  
  }

  onClickPage(page : number){
    this.currentPage = page;
    console.log(this.currentPage)
    this.updatePageAfterSearch(this.currentPage)
  }

  onClickPrev(){
    if(this.currentPage > 0){
      console.log(this.currentPage)
      this.currentPage = this.currentPage - 1;
      this.updatePageAfterSearch(this.currentPage)
    }      
  }

  onClickNext(){
    if(this.currentPage < this.totalPage - 1){
      console.log(this.currentPage)
      this.currentPage = this.currentPage + 1;
      this.updatePageAfterSearch(this.currentPage)
    }      
  }

  onClickFirst(){
    this.currentPage = 0;
    this.updatePageAfterSearch(this.currentPage)
  }

  onClickLast(){
    this.currentPage = this.totalPage - 1;
    this.updatePageAfterSearch(this.currentPage)
  }

  comfirmDeviceProfile(){
    this.formGateway.patchValue({
      deviceProfileId: this.profileId
    })
  }

  getProfileDeviceSearch(){
    this.currentPage = 0;
    console.log(this.filterState)
    this.updatePageAfterSearch(0);
  }

  updatePageAfterSearch(page: number){
    if(this.searchProfileDevice == "" && this.filterText == "" && this.filterState === ""){
      console.log("1");
      this.getGatewayList(this.pageSize, page, this.sortProperty, this.sortOrder);
    }
    else if(this.searchProfileDevice == "" && this.filterText == "" && this.filterState !== ""){
      //search state
      console.log("2");
      this.filterGatewayByState(this.pageSize, page, this.sortProperty, this.sortOrder, this.filterState)
    }
    else if(this.searchProfileDevice == "" && this.filterText != "" && this.filterState === ""){
      //search text
      console.log("3");
      this.filterGatewayByText(this.pageSize, page, this.filterText, this.sortProperty, this.sortOrder);
    }
    else if(this.searchProfileDevice != "" && this.filterText == "" && this.filterState === ""){
      //search profile
      console.log("4");
      this.filterGatewayByProfile(this.pageSize, page, this.sortProperty, this.sortOrder, this.searchProfileDevice);
    }
    else if(this.searchProfileDevice != "" && this.filterText == "" && this.filterState !== ""){
      //search profile+state
      console.log("5");
      this.filterGatewayByProfileAndState(this.pageSize, page, this.sortProperty, this.sortOrder, this.searchProfileDevice, this.filterState)
    }
    else if(this.searchProfileDevice != "" && this.filterText != "" && this.filterState === ""){
      //search profile+text
      console.log("6");
      this.filterGatewayByProfileAndText(this.pageSize, page, this.filterText, this.sortProperty, this.sortOrder, this.searchProfileDevice);
    }
    else if(this.searchProfileDevice == "" && this.filterText != "" && this.filterState !== ""){
      //search state+text
      console.log("7");
      this.filterGatewayByTextAndState(this.pageSize, page, this.sortProperty, this.sortOrder, this.filterText, this.filterState)
    }
    else if(this.searchProfileDevice != "" && this.filterText != "" && this.filterState !== ""){
      //search all
      console.log("8");
      this.filterGatewayByProfileAndTextAndState(this.pageSize, page, this.sortProperty, this.sortOrder, this.searchProfileDevice, this.filterText, this.filterState)
    }


    // else{
    //   if(this.searchProfileDevice != "" && this.filterText == ""){
    //     this.filterGatewayByProfile(this.pageSize, page, this.sortProperty, this.sortOrder, this.searchProfileDevice);
    //   }else{
    //     if(this.searchProfileDevice == "" && this.filterText != ""){
    //       this.filterGatewayByText(this.pageSize, page, this.filterText, this.sortProperty, this.sortOrder);
    //     }else{
    //       this.filterGatewayByProfileAndText(this.pageSize, page, this.filterText, this.sortProperty, this.sortOrder, this.searchProfileDevice);
    //     }
    //   }      
    // }
  }

/**
   * 
   * @param propertyName - which column want to sort > - present by property name
   * @param columnIndex - the index of column which user click
   */
public onColumnSortClick(propertyName: string, columnIndex: number): void {
  let previous = this.activeColumn // save the last column index

  this.activeColumn = columnIndex; // assign the new column index to the current active column

  if (previous == this.activeColumn) { // check if the current column is new or not
    this.isSortASC = !this.isSortASC;
  } else {
    this.isSortASC = true;  // ASC when come to new column
  }

  // change the sortProperty
  this.sortProperty = propertyName

  // change the sortOrder
  if (this.isSortASC) this.sortOrder = 'ASC'
  else this.sortOrder = 'DESC'

  // update the page after sort
  this.updatePageAfterSearch(0)
}
/* Sorting table by column ======= END ======= */

  addListGW(){

    let dataNew = HCData;
    let dataOld = HCDataOld;
    
    //ProfileDeviceId
    // this.formGateway.value.deviceProfileId = "f2b918d0-5db3-11ee-929a-6544e85a2454"; //PC
    this.formGateway.value.deviceProfileId = "ef59c130-5db3-11ee-929a-6544e85a2454"; //HC SmartHome
    // this.formGateway.value.deviceProfileId = "ebd94d00-5db3-11ee-929a-6544e85a2454"; //HC Android
    // this.formGateway.value.deviceProfileId = "e86a3df0-5db3-11ee-929a-6544e85a2454"; //Nong nghiep
    // this.formGateway.value.deviceProfileId = "e3699260-5db3-11ee-929a-6544e85a2454"; //Den duong
    // this.formGateway.value.deviceProfileId = "ded60080-5db3-11ee-929a-6544e85a2454"; //AI hub
    
    //CustomerId
    this.formGateway.value.userId = "7a592b10-5db2-11ee-929a-6544e85a2454";

    let data: any;
    data = dataNew.filter(({ greenhouseMAC: mac1 }) => !dataOld.some(({ greenhouseMAC: mac2 }) => mac2 === mac1));
    console.log(data);


    for(let i = 0; i < data.length; i++){
      this.formGateway.value.gatewayName = data[i].greenhouseName;
      this.formGateway.value.gatewayMAC = data[i].greenhouseMAC.toString();

      this.obj.addNewGateway(this.formGateway.value).subscribe({
        next: (res: any) =>{
          console.log(i + "-" + data[i].greenhouseName + "- OK");
        },
        error: (e) => {
          console.log(i + "-" + data[i].greenhouseName + "- FAIL");
        }
      });
    }
  }
}