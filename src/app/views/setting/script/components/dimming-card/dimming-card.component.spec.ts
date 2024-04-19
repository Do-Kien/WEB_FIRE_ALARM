import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmingCardComponent } from './dimming-card.component';

describe('DimmingCardComponent', () => {
  let component: DimmingCardComponent;
  let fixture: ComponentFixture<DimmingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimmingCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimmingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
