import { Component, ElementRef, OnInit, Renderer2, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SensorData } from 'src/app/views/manager/sensor/sensors.component';
import { ShowAlertsService, titleType, toastType } from 'src/app/services/show-alerts/show-alerts.service';
import { emit } from 'process';
@Component({
  selector: 'app-sensor-card',
  templateUrl: './sensor-card.component.html',
  styleUrls: ['./sensor-card.component.scss']
})
export class SensorCardComponent implements OnInit, OnChanges {
  @Input() sensorId: any;
  @Input() sensorMac: any;
  @Input() sensorName: any;
  @Input() sensorType: any;
  @Input() sensorMin: any;
  @Input() sensorMax: any;
  @Input() sensorCurrentValue: any;
  @Input() sensorGreenhouseId: any;
  @Input() sensorZoneId: any;
  @Input() selectedGreenhouse: string = '';
  @Input() selectedZone: string = '';
  @Input() listSensorWhileEditting: any[] = [];

  @Output() useSensor: EventEmitter<object> = new EventEmitter<object>();
  @Output() notUseSensor: EventEmitter<string> = new EventEmitter<string>();
  useCheckboxIsChecked: boolean = false;

  selectedType: string = ''

  //gia tri min max tu input 
  inputMin: number = 0;
  inputMax: number = 0;
  // giá trị hiên tại của cảm biến theo key-value
  sensorCurrentKeys: string[] = [];
  sensorValue: any = [

  ]
  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private alertService: ShowAlertsService) { }

  ngOnInit(): void {
    this.setSensorFormComtrolValue();
    this.onCheckboxChange()
    this.sensorCurrentKeys = Object.keys(this.sensorCurrentValue);
    // đẩy các thuộc tính ra mảng hiển thị ra thẻ
    for (let i = 0; i < this.sensorCurrentKeys.length; i++) {
      this.sensorValue.push({
        type: this.sensorCurrentKeys[i],
        min: 0,
        max: 0
      })
    }
    this.selectedType = this.sensorCurrentKeys[0]
    // nếu có sensor edit
    if (this.listSensorWhileEditting.length > 0) {
      for (let i = 0; i < this.listSensorWhileEditting.length; i++) {
        // kiem tra mac cua sensor
        if (this.sensorMac == this.listSensorWhileEditting[i].mac) {
          this.useCheckboxIsChecked = true
          const typeIndex = this.sensorValue.findIndex((x: any) => x.type == this.listSensorWhileEditting[i].type);
          // set lại min max
          this.sensorValue[typeIndex].min = this.listSensorWhileEditting[i].min;
          this.sensorValue[typeIndex].max = this.listSensorWhileEditting[i].max;
          this.setSensorFormComtrolValue();
          this.onCheckboxChange()
          this.sensorControlForm.patchValue({
            type: this.listSensorWhileEditting[i].type,
            min: this.listSensorWhileEditting[i].min,
            max: this.listSensorWhileEditting[i].max
          })
          this.useSensor.emit(this.sensorControlForm.value)
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGreenhouse']) {
      if (changes['selectedGreenhouse'].currentValue == this.sensorGreenhouseId) {
        this.resetState()
      }
    }
    if (changes['selectedZone']) {
      this.resetState()
    }
  }
  /**
   * reset trang thai cua the cam bien
   */
  resetState() {
    this.useCheckboxIsChecked = false
    this.onCheckboxChange()
  }

  //form sensor for rule
  sensorControlForm = this.formBuilder.group({
    id: this.formBuilder.control(""),
    mac: this.formBuilder.control(""),
    name: this.formBuilder.control(""),
    type: this.formBuilder.control(""),
    min: this.formBuilder.control(0),
    max: this.formBuilder.control(0)
  })
  /**
   * set gia tri cho form du lieu cam bien
   */
  setSensorFormComtrolValue() {
    this.sensorControlForm.patchValue({ id: this.sensorId });
    this.sensorControlForm.patchValue({ mac: this.sensorMac });
    this.sensorControlForm.patchValue({ name: this.sensorName });
  }
  /**
 * Set giá trị min max của cảm biến theo thuộc tính
 *
 * @param {string} selectedType - thuộc tính cần set min max
 * @param {number} inputMin - the minimum sensor value.
 * @param {number} inputMax - the maximum sensor value.
 */
  setValue(selectedType: string, inputMin: number, inputMax: number) {
    const typeIndex = this.sensorValue.findIndex((x: any) => x.type == selectedType);
    if (typeIndex !== -1) {
      if (inputMin > inputMax) {
        this.inputMin = 0
        this.inputMax = 0
        this.alertService.showAlerts(titleType.rule, "Giá trị min max không hợp lệ", toastType.error);
      }
      else {
        this.sensorValue[typeIndex].min = inputMin;
        this.sensorValue[typeIndex].max = inputMax;
        this.sensorControlForm.patchValue({
          type: selectedType,
          min: inputMin,
          max: inputMax
        })

        this.useSensor.emit(this.sensorControlForm.value)
      }
    }

  }
  /**
   * Handles the change event of the checkbox element. Updates the background color of the parent
   * sensor card element based on the value of the checkbox.
   */
  onCheckboxChange() {
    const parentSensorCardElement = this.el.nativeElement.parentElement
    if (this.useCheckboxIsChecked) {
      this.renderer.setStyle(parentSensorCardElement, 'background-color', 'rgba(160, 248, 184, 0.4)')
      for (let i = 0; i < this.sensorValue.length; i++) {
        this.sensorControlForm.patchValue({
          type: this.sensorValue[i].type
        })
        this.useSensor.emit(this.sensorControlForm.value)
      }
      // this.useSensor.emit(this.sensorControlForm.value)
    }
    else {
      this.renderer.setStyle(parentSensorCardElement, 'background-color', 'transparent')
      this.notUseSensor.emit(this.sensorMac)
    }
  }
}