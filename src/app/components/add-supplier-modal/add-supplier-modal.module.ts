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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { CategoriesSettingTableModule } from '../categories-setting/categories-setting.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

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
    NzCheckboxModule,
    NzRadioModule,
    NzUploadModule,
    NzIconModule,
    NzSpinModule,
    NzMessageModule,
    CategoriesSettingTableModule,
    NzTabsModule
  ],
  exports: [AddSupplierModalComponent]
})
export class AddSupplierModalModule { }
