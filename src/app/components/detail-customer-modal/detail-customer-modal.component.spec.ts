import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailCustomerModalComponent } from './detail-customer-modal.component';

describe('DetailCustomerModalComponent', () => {
  let component: DetailCustomerModalComponent;
  let fixture: ComponentFixture<DetailCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
