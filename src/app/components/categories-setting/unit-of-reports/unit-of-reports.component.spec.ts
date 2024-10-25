import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOfReportsComponent } from './unit-of-reports.component';

describe('UnitOfReportsComponent', () => {
  let component: UnitOfReportsComponent;
  let fixture: ComponentFixture<UnitOfReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitOfReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOfReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
