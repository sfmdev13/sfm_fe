import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPurchaseOrderComponent } from './filter-purchase-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';



@NgModule({
  declarations: [FilterPurchaseOrderComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzRadioModule,
    NzModalModule
  ],
  exports: [FilterPurchaseOrderComponent]
})
export class FilterPurchaseOrderModule { }
