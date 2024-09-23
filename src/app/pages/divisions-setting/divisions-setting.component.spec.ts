import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsSettingComponent } from './divisions-setting.component';

describe('DivisionsSettingComponent', () => {
  let component: DivisionsSettingComponent;
  let fixture: ComponentFixture<DivisionsSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionsSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
