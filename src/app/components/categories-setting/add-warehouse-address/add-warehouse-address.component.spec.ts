import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWarehouseAddressComponent } from './add-warehouse-address.component';

describe('AddWarehouseAddressComponent', () => {
  let component: AddWarehouseAddressComponent;
  let fixture: ComponentFixture<AddWarehouseAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWarehouseAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWarehouseAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
