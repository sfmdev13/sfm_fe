import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPurchaseOrderComponent } from './filter-purchase-order.component';

describe('FilterPurchaseOrderComponent', () => {
  let component: FilterPurchaseOrderComponent;
  let fixture: ComponentFixture<FilterPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
