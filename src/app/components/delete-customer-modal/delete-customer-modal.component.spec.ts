import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCustomerModalComponent } from './delete-customer-modal.component';

describe('DeleteCustomerModalComponent', () => {
  let component: DeleteCustomerModalComponent;
  let fixture: ComponentFixture<DeleteCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
