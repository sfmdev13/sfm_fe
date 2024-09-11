import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyalCustomerComponent } from './loyal-customer/loyal-customer.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';


@NgModule({
  declarations: [
    LoyalCustomerComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule
  ],
  exports: [
    LoyalCustomerComponent
  ]
})
export class CategoriesSettingTableModule { }
