import { Component, OnInit, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { emit } from 'process';
@Component({
  selector: 'app-relay-card',
  templateUrl: './relay-card.component.html',
  styleUrls: ['./relay-card.component.scss']
})
export class RelayCardComponent implements OnInit, OnChanges {
  useCheckboxIsChecked: boolean = false;

  @Input() relayName: string = '';
  @Input() relayPin: string = '';
  @Input() relayGreenhouseId: string = '';
  @Input() relayZoneId: string = '';
  @Input() selectedGreenhouse: string = '';
  @Input() selectedZone: string = '';
  @Input() listRelayWhileEditting: any[] = [];

  @Output() useRelay: EventEmitter<object> = new EventEmitter<object>();
  @Output() notUseRelay: EventEmitter<string> = new EventEmitter<string>();

  optionCheckboxIsChecked: boolean = false;

  relayStatus: boolean = false;

  constructor(private el: ElementRef,
    private renderer: Renderer2,
    private formBuilder: FormBuilder) { }

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

  /**
   * Handles the change event of a checkbox.
   * Sets the background color of the parent device card element to a light green color and calls the handleStatusCheckbox() and handleOptionCheckbox() functions if the useCheckboxIsChecked property is true.
   * Otherwise, sets the background color of the parent device card element to transparent.
   *
   */
  onCheckboxChange() {
    const parentDeviceCardElement = this.el.nativeElement.parentElement
    if (this.useCheckboxIsChecked) {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'rgba(160, 248, 184, 0.4)')
      this.useRelay.emit(this.relayControlForm.value)
    }
    else {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'transparent')
      this.notUseRelay.emit(this.relayPin)
    }
  }

  /**
  * reset trang thai cua the
  */
  resetState() {
    this.useCheckboxIsChecked = false
    this.onCheckboxChange()
  }
}