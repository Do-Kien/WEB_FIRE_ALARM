import { Component, OnInit } from '@angular/core';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Relay } from 'src/app/models/rule.model';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
@Component({
  selector: 'app-add-script',
  templateUrl: './add-script.component.html',
  styleUrls: ['./add-script.component.scss']
})
export class AddScriptComponent implements OnInit {
  typeDeviceOptions = [
    'Thiết bị',
    'Chiết áp (0 - 10V)',
    'Đèn LED (BLE)',
  ]
  selectedTypeDevice = this.typeDeviceOptions[0]
  //cac thong so hien tai
  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  //cac list thong tin
  listGateways: any = []
  selectedGateway: string = ''
  listZones: any = [
    {id:'' , name: 'Tất cả'},
  ]
  selectedZone: string = ''
  listDevices: any = []

  //list relay de add
  listRelayToAdd: Relay[] = [];
  
  constructor(private greenhouseService: ManagerGreenhousesService,
    private zoneService: ManagerZonesService,
    private deviceService: ManagerDeviceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private settingRuleService: SettingRuleService,
    private showAlertService:ShowAlertsService
  ) { }

  ngOnInit(): void {
    this.checkCurrentData();
    
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    this.getDeviceList(this.currentFarm);
    this.selectedGateway = this.currentGreenhouse
    this.selectedZone = this.listZones[0].id
  }

  //form add rule
  formScript = this.fb.group({
    id: this.fb.control(0),
    ruleName: this.fb.control("", [Validators.required]),
    active: this.fb.control(false),
    farmId: this.fb.control(""),
    greenhouseId: this.fb.control(""),
    zoneId: this.fb.control(""),
    loop: this.fb.control(0),
    start: this.fb.control(""),
    stop: this.fb.control(""),
    logic: this.fb.control(""),
    type: this.fb.control("script"),
    update: this.fb.control(-1),
    timer: this.fb.array([]),
    listRelay: this.fb.array([]),
    listLed: this.fb.array([]),
    listModbus: this.fb.array([]),
    listSensor: this.fb.array([])
  },)

  checkCurrentData() {
    this.currentUser = this.authService.getCurrentUser();
    this.currentFarm = this.authService.getCurrentFarm();
    this.currentGreenhouse = this.authService.getCurrentGreenhouse();
    // this.selectedGreenhouse = this.currentGreenhouse;
  }
  /**
   * reset listRelayToAdd và listRelay trong form khi thay đổi tủ và zone
   *
   * @return {void} This function does not return anything.
   */
  resetList(): void {
    this.listRelayToAdd = [];
    const listRelay = this.formScript.get('listRelay') as FormArray;
    listRelay.clear();
  }
  getUseRelay(relayControlForm: any) {

    const relayArray = this.fb.array([]);
    this.formScript.setControl('listRelay', relayArray);
    //kiểm tra xem có tồn tại relay này trong listRelay theo pin
    const hasRelay = this.listRelayToAdd.some(relay => relay.pin == relayControlForm.pin);
    if (hasRelay) {
      //nếu tồn tại thì update
      this.listRelayToAdd = this.listRelayToAdd.map(relay => {
        if (relay.pin == relayControlForm.pin) {
          relay.name = relayControlForm.name;
          relay.pin = relayControlForm.pin;
          relay.status = relayControlForm.status;
        }
        return relay
      })
    } else {
      //nếu chưa tồn tại thì add
      this.listRelayToAdd.push(relayControlForm as Relay)
    }
    for (const relay of this.listRelayToAdd) {
      //loop qua từng relay trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listRelay
      const relayGroup = this.fb.control({
        pin: this.fb.control(relay.pin),
        name: this.fb.control(relay.name),
        status: this.fb.control(relay.status)
      });
      relayArray.push(relayGroup);
    }
    //set lại giá trị của form
    this.setFormRuleValue()

  }
  /**
 * hàm bắt sự kiện hủy chọn relay, xóa relay trong list theo pin
 *
 * @param {string} relayPin - The pin of the relay to remove.
 * @return {void} This function does not return anything.
 */
  removeUseRelay(relayPin: string): void {
    const relayArray = this.fb.array([]);
    this.formScript.setControl('listRelay', relayArray);
    this.listRelayToAdd = this.listRelayToAdd.filter(relayToAdd => relayToAdd.pin != relayPin);
    for (const relay of this.listRelayToAdd) {
      //loop qua từng relay trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listRelay
      const relayGroup = this.fb.control({
        pin: this.fb.control(relay.pin),
        name: this.fb.control(relay.name),
        status: this.fb.control(relay.status)
      });
      relayArray.push(relayGroup);
    }
    //set lại giá trị của form
    this.setFormRuleValue();
  }

  setFormRuleValue(): void {
    this.formScript.patchValue({ farmId: this.currentFarm })
    this.formScript.patchValue({ greenhouseId: this.selectedGateway });
    this.formScript.patchValue({ zoneId: this.selectedZone });
    this.formScript.patchValue({ listRelay: this.listRelayToAdd })
  }
  
  getGreenhouseList(currentFarm: string, currentUser: string) {
    if (currentFarm != '' && currentUser != '') {
      this.greenhouseService.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) => {
          this.listGateways = res
          console.log("GREEN LIST")
          console.log(res);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getZoneList(currentFarm: string) {
    if (currentFarm != '') {
      this.zoneService.getZones(currentFarm).subscribe({
        next: (res: any) => {
          this.listZones = this.listZones.concat(res)
          console.log("Zone LIST")
          console.log(res);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeviceList(currentFarm: string) {
    if (currentFarm != '') {
      this.deviceService.getDevices(currentFarm).subscribe({
        next: (res: any) => {
          this.listDevices = res
          console.log("DEVICE LIST")
          console.log(res)
        },
        error: (e) => console.error(e)
      })
    }
  }

  onAddScriptSubmit(){
    console.log(this.formScript.value);
    if(this.formScript.valid){
      this.settingRuleService.addRule(this.formScript.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.showAlertService.showAlerts(titleType.script, "Thêm script thành công", toastType.success);
        },
        error: (e) => {
          console.error(e)
          this.showAlertService.showAlerts(titleType.script, "Thêm script thành công", toastType.success);
        }
      }) 
    } else {
      console.log(this.formScript.errors);
      if (this.formScript.controls['ruleName'].errors?.['required']) {
        this.showAlertService.showAlerts(titleType.script, "Vui lòng nhập tên kịch bản !", toastType.error);
      }
      else {
        this.showAlertService.showAlerts(titleType.script, "Có lỗi xảy ra vui lòng thử lại sau", toastType.error);
      }
    }
  }
}
