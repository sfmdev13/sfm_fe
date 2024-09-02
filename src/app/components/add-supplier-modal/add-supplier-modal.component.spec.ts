import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierModalComponent } from './add-supplier-modal.component';

describe('AddSupplierModalComponent', () => {
  let component: AddSupplierModalComponent;
  let fixture: ComponentFixture<AddSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
