import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dimming-card',
  templateUrl: './dimming-card.component.html',
  styleUrls: ['./dimming-card.component.scss']
})
export class DimmingCardComponent implements OnInit {
  useCheckboxIsChecked:boolean = false;

  @ViewChild('optionCheckbox') optionCheckbox: ElementRef | undefined;
  
  optionCheckboxIsChecked: boolean = false;
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

  onCheckboxChange() {
    const parentDeviceCardElement = this.el.nativeElement.parentElement
    if (this.useCheckboxIsChecked) {
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'rgba(160, 248, 184, 0.4)')
      this.handleOptionCheckbox(this.optionCheckbox)
    }
    else{
      this.renderer.setStyle(parentDeviceCardElement, 'background-color', 'transparent')
    }
    
    // console.log(this.useCheckboxIsChecked, this.statusCheckboxIsChecked, this.optionCheckboxIsChecked)
    
  }
}