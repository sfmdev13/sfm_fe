import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteSupplierModalComponent } from './delete-supplier-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';


@NgModule({
  declarations: [DeleteSupplierModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzResultModule
  ],
  exports: [DeleteSupplierModalComponent]
})
export class DeleteSupplierModalModule { }
