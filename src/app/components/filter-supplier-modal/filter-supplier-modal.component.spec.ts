import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSupplierModalComponent } from './filter-supplier-modal.component';

describe('FilterSupplierModalComponent', () => {
  let component: FilterSupplierModalComponent;
  let fixture: ComponentFixture<FilterSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
