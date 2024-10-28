import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddInventoriesComponent } from './add-inventories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { InventoriesListRoutingModule } from 'src/app/pages/inventories-list/inventories-list-routing.module';
import { CategoriesSettingTableModule } from '../categories-setting/categories-setting.module';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';



@NgModule({
  declarations: [AddInventoriesComponent],
  imports: [
    CommonModule,
    InventoriesListRoutingModule,
    NzTableModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzTagModule,
    NzFormModule,
    NzInputNumberModule,
    NzSpaceModule,
    NzSwitchModule,
    NzDividerModule,
    NzRadioModule,
    NzDropDownModule,
    CategoriesSettingTableModule,
    NzUploadModule,
    NzMessageModule,
    NzTabsModule
  ],
  exports: [AddInventoriesComponent]
})
export class AddInventoriesModule { }
