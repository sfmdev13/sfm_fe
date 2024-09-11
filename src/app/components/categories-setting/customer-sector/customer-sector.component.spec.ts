import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSectorComponent } from './customer-sector.component';

describe('CustomerSectorComponent', () => {
  let component: CustomerSectorComponent;
  let fixture: ComponentFixture<CustomerSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
