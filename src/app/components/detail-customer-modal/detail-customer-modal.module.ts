import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailCustomerModalComponent } from './detail-customer-modal.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';



@NgModule({
  declarations: [DetailCustomerModalComponent],
  imports: [
    CommonModule,
    NzAvatarModule,
    NzTagModule,
    NzDividerModule
  ],
  exports: [DetailCustomerModalComponent]
})
export class DetailCustomerModalModule { }
