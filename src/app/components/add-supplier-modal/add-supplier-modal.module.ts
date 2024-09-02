import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSupplierModalComponent } from './add-supplier-modal.component';

import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';


@NgModule({
  declarations: [AddSupplierModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule
  ],
  exports: [AddSupplierModalComponent]
})
export class AddSupplierModalModule { }
