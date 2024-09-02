import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSupplierModalComponent } from './detail-supplier-modal.component';

describe('DetailSupplierModalComponent', () => {
  let component: DetailSupplierModalComponent;
  let fixture: ComponentFixture<DetailSupplierModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailSupplierModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailSupplierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
