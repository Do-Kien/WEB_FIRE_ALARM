import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScriptComponent } from './edit-script.component';

describe('EditScriptComponent', () => {
  let component: EditScriptComponent;
  let fixture: ComponentFixture<EditScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditScriptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
