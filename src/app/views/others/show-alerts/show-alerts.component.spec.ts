import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAlertsComponent } from './show-alerts.component';

describe('ShowAlertsComponent', () => {
  let component: ShowAlertsComponent;
  let fixture: ComponentFixture<ShowAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAlertsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
