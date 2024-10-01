import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseOrderRoutingModule } from './purchase-order-routing.module';
import { PurchaseOrderComponent } from './purchase-order.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { AddPurchaseOrderModule } from 'src/app/components/add-purchase-order/add-purchase-order.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  declarations: [PurchaseOrderComponent],
  imports: [
    CommonModule,
    PurchaseOrderRoutingModule,
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
    AddPurchaseOrderModule,
    NzDropDownModule
  ],
  exports: [PurchaseOrderComponent]
})
export class PurchaseOrderModule { }
