import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailSupplierModalComponent } from './detail-supplier-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';


@NgModule({
  declarations: [DetailSupplierModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzAvatarModule,
    NzTagModule
  ],
  exports: [DetailSupplierModalComponent]
})
export class DetailSupplierModalModule { }
