import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ble-card',
  templateUrl: './ble-card.component.html',
  styleUrls: ['./ble-card.component.scss']
})
export class BleCardComponent implements OnInit {
  useCheckboxIsChecked: boolean = false;

  @ViewChild('statusCheckbox') statusCheckbox: ElementRef | undefined;
  @ViewChild('optionCheckbox') optionCheckbox: ElementRef | undefined;
  @ViewChild('configCheckbox') configCheckbox: ElementRef | undefined;

  statusCheckboxIsChecked: boolean = false;
  optionCheckboxIsChecked: boolean = false;
  configCheckboxIsChecked: boolean = false;

  constructor(private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit(): void {

  }

  handleOptionCheckbox(optionCheckbox:ElementRef | any){
    if(optionCheckbox.nativeElement.checked){
      this.optionCheckboxIsChecked = true;
    }
    else{
      this.optionCheckboxIsChecked = false;
    }
  }

  handleConfigCheckbox(configCheckbox:ElementRef | any){
    if(configCheckbox.nativeElement.checked){
      this.configCheckboxIsChecked = true;
    }
    else{
      this.configCheckboxIsChecked = false;
    }
  }

  handleStatusCheckbox(statusCheckbox:ElementRef | any){
    if(statusCheckbox.nativeElement.checked){
      this.statusCheckboxIsChecked = true;
    }
    else{      
      this.statusCheckboxIsChecked = false;
    }
  }

  onCheckboxChange(){
    const parentDeviceCardElement = this.el.nativeElement.parentElement
    if (this.useCheckboxIsChecked) {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'rgba(160, 248, 184, 0.4)')
      this.handleStatusCheckbox(this.statusCheckbox)
      this.handleOptionCheckbox(this.optionCheckbox)
      this.handleConfigCheckbox(this.configCheckbox)
    }
    else{
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'transparent')
    }
    // console.log(this.useCheckboxIsChecked, this.statusCheckboxIsChecked, this.optionCheckboxIsChecked, this.configCheckboxIsChecked)
  }
}