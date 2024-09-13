import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesSettingComponent } from './categories-setting.component';

describe('CategoriesSettingComponent', () => {
  let component: CategoriesSettingComponent;
  let fixture: ComponentFixture<CategoriesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriesSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
