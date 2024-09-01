import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteCustomerModalComponent } from './delete-customer-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';


@NgModule({
  declarations: [DeleteCustomerModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzResultModule
  ],
  exports: [DeleteCustomerModalComponent]
})
export class DeleteCustomerModalModule { }
