import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/api/auth/auth.service';
import { ManagerDeviceService } from 'src/app/services/api/manager-device/manager-device.service';
import { ManagerGreenhousesService } from 'src/app/services/api/manager-greenhouses/manager-greenhouses.service';
import { ManagerZonesService } from 'src/app/services/api/manager-zones/manager-zones.service';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { DeviceData } from 'src/app/views/manager/device/devices.component';
import { GreenhouseList } from 'src/app/views/manager/farm/farms.component';
import { ZoneList } from 'src/app/views/manager/zone/zones.component';
import { Relay, Sensor } from 'src/app/models/rule.model'
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
import { ManagerFarmsService } from 'src/app/services/api/manager-farms/manager-farms.service';
import { ManagerSensorsService } from 'src/app/services/api/manager-sensors/manager-sensors.service';
import { SensorData } from 'src/app/views/manager/sensor/sensors.component';
import { type } from 'os';

@Component({
  selector: 'app-add-rule',
  templateUrl: './add-rule.component.html',
  styleUrls: ['./add-rule.component.scss']
})
export class AddRuleComponent implements OnInit {
  // options cho rule chon ngay lap lai
  dropdownListDay: Array<any> = [
    { id: 0, name: "Thứ Hai" },
    { id: 1, name: "Thứ Ba" },
    { id: 2, name: "Thứ Tư" },
    { id: 3, name: "Thứ Năm" },
    { id: 4, name: "Thứ Sáu" },
    { id: 5, name: "Thứ Bảy" },
    { id: 6, name: "Chủ Nhật" }
  ];
  selectedDayItems: Array<any> = [];
  dropdownSettings: any = {};

  //list tu gateway
  optionGreenhouse: GreenhouseList[] = [
    { id: "", name: "" }
  ];
  //list zone
  optionZoneAll: ZoneList[] = [
    { id: "", name: "Tất cả" }
  ];
  //cac thong so hien tai
  currentFarm: string = '';
  currentUser: string = '';
  currentGreenhouse: string = '';
  //list thiet bi
  DeviceList: DeviceData[] = [];

  // devices: DeviceData[] = [];

  //list sensor
  SensorList: SensorData[] = [];

  //nha kinh va zone duoc chon o select
  selectedGreenhouse: any = this.optionGreenhouse[0].id;
  selectedZone: any = this.optionZoneAll[0].id;

  //cac option trong select chon loai thiet bi
  selectedTypeDevice = 'Thiết bị'
  typeDeviceOptions = [
    'Thiết bị',
    'Chiết áp (0 - 10V)',
    'Đèn LED (BLE)',
  ]
  //cac option trong select chon loai dieu kien
  selectedCondition = 'AND'
  conditionOptions = [
    'AND',
    'OR'
  ]
  // time checkbox
  timeCheckboxIsChecked: boolean = false;
  //time start va stop
  timeStart: string = '';
  timeStop: string = '';
  //list relay de add
  listRelayToAdd: Relay[] = [];

  //list sensor de add
  listSensorToAdd: Sensor[] = [];
  // thời gian cập nhật
  timeUpdate: number = 0;
  constructor(private fb: FormBuilder,
    private showAlertsService: ShowAlertsService,
    private greenhouseObj: ManagerGreenhousesService,
    private zoneObj: ManagerZonesService,
    private authObj: AuthService,
    private deviceObj: ManagerDeviceService,
    private settingRuleService: SettingRuleService,
    private sensorService: ManagerSensorsService
  ) { }

  ngOnInit(): void {
    this.checkCurrentData();
    this.getGreenhouseList(this.currentFarm, this.currentUser);
    this.getZoneList(this.currentFarm);
    this.getDeviceList(this.currentFarm);
    this.getSensors(this.currentFarm, this.currentUser);

    this.dropdownSettings = {
      singleSelection: false,
      noDataAvailablePlaceholderText: 'Không có lựa chọn',
      idField: 'id',
      textField: 'name',
      selectAllText: 'Hàng ngày',
      unSelectAllText: ' Bỏ chọn',
      itemsShowLimit: 2,
      allowSearchFilter: false
    };
  }
  //form add rule
  formRule = this.fb.group({
    id: this.fb.control(0),
    active: this.fb.control(false),
    update: this.fb.control(0),
    ruleName: this.fb.control("", [Validators.required]),
    farmId: this.fb.control(""),
    greenhouseId: this.fb.control(""),
    zoneId: this.fb.control(""),
    loop: this.fb.control(0),
    start: this.fb.control(""),
    stop: this.fb.control(""),
    logic: this.fb.control(""),
    type: this.fb.control("rule"),
    timer: this.fb.array([]),
    listRelay: this.fb.array([]),
    listLed: this.fb.array([]),
    listModbus: this.fb.array([]),
    listSensor: this.fb.array([])
  }, { validators: this.timeValidator })

  /**
 * Validates thời gian bắt đầu và thời gian kết thúc của formRule
 *
 * @param {FormGroup} control - The FormGroup to validate.
 * @return {null | {timeError: true}} Returns null if validation passes, 
 * or {timeError: true} if validation fails.
 */
  timeValidator(control: FormGroup) {
    const timeStart = control.get('start')?.value
    const timeStop = control.get('stop')?.value
    if (timeStart == '' && timeStop == '') {
      return null
    }
    const now = new Date();

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(timeStart.split(":")[0]), Number(timeStart.split(":")[1])).getTime();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(timeStop.split(":")[0]), Number(timeStop.split(":")[1])).getTime();

    return start && end && start <= end ? null : { timeError: true };
  }

  checkCurrentData() {
    this.currentUser = this.authObj.getCurrentUser();
    this.currentFarm = this.authObj.getCurrentFarm();
    this.currentGreenhouse = this.authObj.getCurrentGreenhouse();
    this.selectedGreenhouse = this.currentGreenhouse;
  }
  /**
 * ham bat su kien emit tu relay-card, thay doi gia tri cua listRelay trong formRule
 *
 * @param {any} relayControlForm - the Relay control form to update.
 */
  getUseRelay(relayControlForm: any) {

    const relayArray = this.fb.array([]);
    this.formRule.setControl('listRelay', relayArray);
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
    this.formRule.setControl('listRelay', relayArray);
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
  /**
   * reset listRelayToAdd và listRelay trong form khi thay đổi tủ và zone
   *
   * @return {void} This function does not return anything.
   */
  resetList(): void {
    this.listRelayToAdd = [];
    const listRelay = this.formRule.get('listRelay') as FormArray;
    listRelay.clear();
    //clear listSensor
    this.listSensorToAdd = [];
    const listSensor = this.formRule.get('listSensor') as FormArray;
    listSensor.clear();
  }

  /**
   * ham bat su kien emit tu sensor-card, thay doi gia tri cua listSensor trong formRule
   *
   * @param {any} sensorControlForm - the Sensor control form to update.
   */
  getUseSensor(sensorControlForm: any) {
    const sensorArray = this.fb.array([]);
    this.formRule.setControl('listSensor', sensorArray);
    //kiểm tra xem có tồn tại sensor này trong listSensor theo mac
    const hasSensor = this.listSensorToAdd.some(sensor => (sensor.mac == sensorControlForm.mac) && (sensor.type == sensorControlForm.type));
    if (hasSensor) {
      //nếu tồn tại thì update
      this.listSensorToAdd = this.listSensorToAdd.map(sensor => {
        if (sensor.mac == sensorControlForm.mac && sensor.type == sensorControlForm.type) {
          sensor.name = sensorControlForm.name;
          sensor.min = sensorControlForm.min
          sensor.max = sensorControlForm.max
        }
        return sensor
      })
    } else {
      //nếu chưa tồn tại thì add
      this.listSensorToAdd.push(sensorControlForm as Sensor)
    }
    this.listSensorToAdd = this.listSensorToAdd.filter(sensor => sensor.min !== 0 || sensor.max !== 0);
    for (const sensor of this.listSensorToAdd) {
      //loop qua từng sensor trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listSensor
      const sensorGroup = this.fb.control({
        mac: sensor.mac,
        name: sensor.name,
        min: sensor.min ? sensor.min : 0,
        max: sensor.max ? sensor.max : 0,
        type: sensor.type
      });
      sensorArray.push(sensorGroup);
    }
    //set lại giá trị của form
    this.setFormRuleValue()
  }

  /**
 * hàm bắt sự kiện hủy chọn sensor, xóa sensor trong list theo id
 *
 * @param {string} sensorId - The id of the sensor to remove.
 * @return {void} This function does not return anything.
 */
  removeUseSensor(sensorMac: string): void {
    const sensorArray = this.fb.array([]);
    this.formRule.setControl('listSensor', sensorArray);
    this.listSensorToAdd = this.listSensorToAdd.filter(sensorToAdd => sensorToAdd.mac != sensorMac);
    for (const sensor of this.listSensorToAdd) {
      //loop qua từng sensor trong listToadd, tạo thành dạng formcontrol rồi push vào formarr listSensor
      const sensorGroup = this.fb.control({
        mac: sensor.mac,
        name: sensor.name,
        min: sensor.min ? sensor.min : 0,
        max: sensor.max ? sensor.max : 0,
        type: sensor.type
      });
      sensorArray.push(sensorGroup);
    }
    //set lại giá trị của form
    this.setFormRuleValue();
  }

  /**
  * set lại giá trị cho formRule khi có thay đổi
  * @return {void} This function does not return anything.
  */
  setFormRuleValue(): void {
    this.formRule.patchValue({ farmId: this.currentFarm })
    this.formRule.patchValue({ update: this.timeUpdate })
    this.formRule.patchValue({ start: this.timeStart })
    this.formRule.patchValue({ stop: this.timeStop })
    this.formRule.patchValue({ loop: this.convertDaytoNumber(this.selectedDayItems) })
    this.formRule.patchValue({ greenhouseId: this.selectedGreenhouse });
    this.formRule.patchValue({ zoneId: this.selectedZone });
    this.formRule.patchValue({ logic: this.selectedCondition.toLowerCase() });
    this.formRule.patchValue({ listRelay: this.listRelayToAdd })
  }
  getGreenhouseList(currentFarm: string, currentUser: string) {
    if (currentFarm != '' && currentUser != '') {
      this.greenhouseObj.getGreenhouses(currentFarm, currentUser).subscribe({
        next: (res: any) => {
          console.log("GREEN LIST")
          this.optionGreenhouse = res;
          console.log(this.optionGreenhouse)
        },
        error: (e) => console.error(e)
      })
    }
  }

  getZoneList(currentFarm: string) {
    if (currentFarm != '') {
      this.zoneObj.getZones(currentFarm).subscribe({
        next: (res: any) => {
          console.log("Zone LIST")
          console.log(res)
          this.optionZoneAll = this.optionZoneAll.concat(res);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getDeviceList(currentFarm: string) {
    if (currentFarm != '') {
      this.deviceObj.getDevices(currentFarm).subscribe({
        next: (res: any) => {
          this.DeviceList = res;
          // this.devices = this.DeviceList;
          console.log("DEVICE LIST")
          console.log(this.DeviceList);
        },
        error: (e) => console.error(e)
      })
    }
  }

  getSensors(currentFarm: string, currentUser: string) {
    console.log(currentFarm, currentUser);

    if (currentFarm != '' && currentUser != '') {
      this.sensorService.getSensorList(currentFarm, currentUser).subscribe({
        next: (res: any) => {
          console.log("SENSORS LIST")
          this.SensorList = res;
          console.log(this.SensorList)
        },
        error: (e) => console.error(e)
      })
    }
  }

  /**
   * Chuyển ngày lặp sang số
   * @param dayArr: mảng các ngày lặp lại
   * @returns sô sau khi convert
   */
  convertDaytoNumber(dayArr: any[]): number {
    let arr = ['0', '0', '0', '0', '0', '0', '0']
    let numberOfBin = ''
    for (let i = 0; i < dayArr.length; i++) {
      arr[dayArr[i].id] = '1';
    }

    for (let i = 0; i < arr.length; i++) {
      numberOfBin = numberOfBin.concat(arr[i])
    }

    return parseInt(numberOfBin, 2);
  }

  /**
 * Handles submission of a new rule. Validates the form and sends an HTTP request to add the rule.
 *
 * @return {void}
 */
  onAddRuleSubmit(): void {
    console.log(this.formRule.value);

    if (this.formRule.valid) {
      this.settingRuleService.addRule(this.formRule.value).subscribe({
        next: (res: any) => {
          this.showAlertsService.showAlerts(titleType.rule, "Thêm rule thành công", toastType.success);
          console.log(res);
        },
        error: (e) => {
          console.error(e)
          this.showAlertsService.showAlerts(titleType.rule, "Thêm rule thành công", toastType.success);
        }
      })
    } else {
      console.log(this.formRule.errors);
      if (this.formRule.controls['ruleName'].errors?.['required']) {
        this.showAlertsService.showAlerts(titleType.rule, "Vui lòng nhập tên luật !", toastType.error);
      }
      else if (this.formRule.errors?.['timeError']) {
        this.showAlertsService.showAlerts(titleType.rule, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc", toastType.error);
      }
      else {
        this.showAlertsService.showAlerts(titleType.rule, "Có lỗi xảy ra vui lòng thử lại sau", toastType.error);
      }
    }
  }
}