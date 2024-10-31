import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllInventoriesRoutingModule } from './all-inventories-routing.module';
import { AllInventoriesComponent } from './all-inventories.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { AddAssemblyModule } from 'src/app/components/add-assembly/add-assembly.module';
import { FilterAllInventoriesModule } from 'src/app/components/filter-all-inventories/filter-all-inventories.module';


@NgModule({
  declarations: [AllInventoriesComponent],
  imports: [
    CommonModule,
    AllInventoriesRoutingModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzModalModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    NzTagModule,
    NzDrawerModule,
    AddAssemblyModule,
    NzDropDownModule,
    FilterAllInventoriesModule
  ],
  exports: [AllInventoriesComponent]
})
export class AllInventoriesModule { }
