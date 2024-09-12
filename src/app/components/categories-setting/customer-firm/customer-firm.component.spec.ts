import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFirmComponent } from './customer-firm.component';

describe('CustomerFirmComponent', () => {
  let component: CustomerFirmComponent;
  let fixture: ComponentFixture<CustomerFirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerFirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
