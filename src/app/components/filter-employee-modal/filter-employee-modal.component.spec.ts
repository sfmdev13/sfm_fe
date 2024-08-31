import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterEmployeeModalComponent } from './filter-employee-modal.component';

describe('FilterEmployeeModalComponent', () => {
  let component: FilterEmployeeModalComponent;
  let fixture: ComponentFixture<FilterEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterEmployeeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
