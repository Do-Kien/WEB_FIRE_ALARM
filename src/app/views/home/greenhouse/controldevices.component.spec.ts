import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControldevicesComponent } from './controldevices.component';

describe('ControldevicesComponent', () => {
  let component: ControldevicesComponent;
  let fixture: ComponentFixture<ControldevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControldevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControldevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
