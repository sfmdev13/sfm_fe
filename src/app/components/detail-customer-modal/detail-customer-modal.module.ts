import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCustomerModalComponent } from './detail-customer-modal.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';



@NgModule({
  declarations: [DetailCustomerModalComponent],
  imports: [
    CommonModule,
    NzAvatarModule,
    NzTagModule
  ],
  exports: [DetailCustomerModalComponent]
})
export class DetailCustomerModalModule { }
