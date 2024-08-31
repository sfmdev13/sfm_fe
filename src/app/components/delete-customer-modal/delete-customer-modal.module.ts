import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteCustomerModalComponent } from './delete-customer-modal.component';



@NgModule({
  declarations: [DeleteCustomerModalComponent],
  imports: [
    CommonModule
  ],
  exports: [DeleteCustomerModalComponent]
})
export class DeleteCustomerModalModule { }
