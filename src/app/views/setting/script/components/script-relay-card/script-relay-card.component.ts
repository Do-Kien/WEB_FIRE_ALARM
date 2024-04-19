import { Component, Input, OnInit, ElementRef, Renderer2, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SettingRuleService } from 'src/app/services/api/setting-rule/setting-rule.service';
@Component({
  selector: 'app-script-relay-card',
  templateUrl: './script-relay-card.component.html',
  styleUrls: ['./script-relay-card.component.scss']
})
export class ScriptRelayCardComponent implements OnInit,OnChanges {
  @Input() relayName:string = ''
  @Input() relayPin: string = '';
  @Input() relayId: string = '';
  @Input() relayGreenhouseId: string = '';
  @Input() relayZoneId: string = '';
  @Input() selectedGreenhouse: string = '';
  @Input() selectedZone: string = '';
  @Input() listRelayWhileEditting: any[] = [];

  @Output() useRelay: EventEmitter<object> = new EventEmitter<object>();
  @Output() notUseRelay: EventEmitter<string> = new EventEmitter<string>();
  
  useCheckboxIsChecked:boolean = false
  relayStatus: boolean = false;
  optionCheckboxIsChecked:boolean = false

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    if (this.listRelayWhileEditting.length > 0) {
      for (let i = 0; i < this.listRelayWhileEditting.length; i++) {
        if (this.relayPin == this.listRelayWhileEditting[i].pin) {
          this.useCheckboxIsChecked = true
          this.relayStatus = this.listRelayWhileEditting[i].status
          this.setRelayFormComtrolValue();
          this.onCheckboxChange()
        }
      }
    }
    this.onCheckboxChange()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGreenhouse']) {
      if (changes['selectedGreenhouse'].currentValue == this.relayGreenhouseId) {
        this.resetState()
      }
    }
    if (changes['selectedZone']) {
      this.resetState()
    }
  }
  
  //Form du lieu relay
  relayControlForm = this.formBuilder.group({
    pin: this.formBuilder.control(""),
    name: this.formBuilder.control(""),
    status: this.formBuilder.control(0),
  })

  /**
  * set gia tri cho form
  */
  setRelayFormComtrolValue() {
    this.relayControlForm.patchValue({ name: this.relayName });
    this.relayControlForm.patchValue({ pin: this.relayPin });
    this.relayControlForm.patchValue({ status: this.relayStatus ? 1 : 0 });
  }

  onCheckboxChange() {
    const parentDeviceCardElement = this.el.nativeElement.parentElement
    if (this.useCheckboxIsChecked) {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'rgba(160, 248, 184, 0.4)')
      // this.handleOptionCheckbox(this.optionCheckbox)
      this.useRelay.emit(this.relayControlForm.value)
    }
    else {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'transparent')
      this.notUseRelay.emit(this.relayPin)
    }
  }
  resetState() {
    this.useCheckboxIsChecked = false
    this.optionCheckboxIsChecked = false
    this.relayStatus = false
    this.onCheckboxChange()
  }
}
