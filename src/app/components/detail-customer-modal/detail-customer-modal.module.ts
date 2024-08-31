import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCustomerModalComponent } from './detail-customer-modal.component';



@NgModule({
  declarations: [DetailCustomerModalComponent],
  imports: [
    CommonModule
  ],
  exports: [DetailCustomerModalComponent]
})
export class DetailCustomerModalModule { }
