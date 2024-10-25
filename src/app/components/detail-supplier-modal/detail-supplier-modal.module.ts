import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailSupplierModalComponent } from './detail-supplier-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@NgModule({
  declarations: [DetailSupplierModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzAvatarModule,
    NzTagModule,
    NzDividerModule,
    NzTabsModule
  ],
  exports: [DetailSupplierModalComponent]
})
export class DetailSupplierModalModule { }
