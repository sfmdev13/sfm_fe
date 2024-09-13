import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyalCustomerComponent } from './loyal-customer.component';

describe('LoyalCustomerComponent', () => {
  let component: LoyalCustomerComponent;
  let fixture: ComponentFixture<LoyalCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyalCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyalCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
