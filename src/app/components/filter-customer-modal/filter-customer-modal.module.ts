import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCustomerModalComponent } from './filter-customer-modal.component';



@NgModule({
  declarations: [FilterCustomerModalComponent],
  imports: [
    CommonModule
  ],
  exports: [FilterCustomerModalComponent]
})
export class FilterCustomerModalModule { }
