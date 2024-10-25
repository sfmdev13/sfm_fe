import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUnitReportComponent } from './add-unit-report.component';

describe('AddUnitReportComponent', () => {
  let component: AddUnitReportComponent;
  let fixture: ComponentFixture<AddUnitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUnitReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUnitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
