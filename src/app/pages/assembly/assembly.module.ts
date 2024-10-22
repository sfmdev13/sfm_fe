import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyRoutingModule } from './assembly-routing.module';
import { AssemblyComponent } from './assembly.component';
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
import { FilterPurchaseOrderModule } from 'src/app/components/filter-purchase-order/filter-purchase-order.module';
import { AddAssemblyModule } from 'src/app/components/add-assembly/add-assembly.module';


@NgModule({
  declarations: [AssemblyComponent],
  imports: [
    CommonModule,
    AssemblyRoutingModule,
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
    FilterPurchaseOrderModule
  ],
  exports: [AssemblyComponent]
})
export class AssemblyModule { }
