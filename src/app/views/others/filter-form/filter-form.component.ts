import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent implements OnInit {
  constructor() { }
  
  ngOnInit(): void {
    // this.filterTextChanged.emit(this.filterText);
  }
  @Input() filterText: string = '';
  @Output() filterTextChanged: EventEmitter<string> = new EventEmitter();

  filterTextOnChanges(){
    this.filterTextChanged.emit(this.filterText);
  }
}
