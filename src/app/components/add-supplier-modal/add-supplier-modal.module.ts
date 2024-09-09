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
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


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
    NzSwitchModule,
    NzSegmentedModule,
    NzDividerModule,
    NzCheckboxModule
  ],
  exports: [AddSupplierModalComponent]
})
export class AddSupplierModalModule { }
