import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSupplierModalComponent } from './delete-supplier-modal.component';

describe('DeleteSupplierModalComponent', () => {
  let component: DeleteSupplierModalComponent;
  let fixture: ComponentFixture<DeleteSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
