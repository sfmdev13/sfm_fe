import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCustomerModalComponent } from './filter-customer-modal.component';

describe('FilterCustomerModalComponent', () => {
  let component: FilterCustomerModalComponent;
  let fixture: ComponentFixture<FilterCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
