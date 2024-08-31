import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerModalComponent } from './add-customer-modal.component';



@NgModule({
  declarations: [AddCustomerModalComponent],
  imports: [
    CommonModule
  ],
  exports: [AddCustomerModalComponent]
})
export class AddCustomerModalModule { }
