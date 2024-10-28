import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoriesListRoutingModule } from './inventories-list-routing.module';
import { InventoriesListComponent } from './inventories-list.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { CategoriesSettingTableModule } from 'src/app/components/categories-setting/categories-setting.module';
import { AddInventoriesModule } from 'src/app/components/add-inventories/add-inventories.module';

@NgModule({
  declarations: [InventoriesListComponent],
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
    AddInventoriesModule
  ],
  exports: [
    InventoriesListComponent
  ]
})
export class InventoriesListModule { }
