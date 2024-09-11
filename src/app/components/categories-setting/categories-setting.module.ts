import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyalCustomerComponent } from './loyal-customer/loyal-customer.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { EditCategoriesModalComponent } from './edit-categories-modal/edit-categories-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DeleteCategoriesModalComponent } from './delete-categories-modal/delete-categories-modal.component';
import { NzResultModule } from 'ng-zorro-antd/result';


@NgModule({
  declarations: [
    LoyalCustomerComponent,
    EditCategoriesModalComponent,
    DeleteCategoriesModalComponent
  ],
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzResultModule
  ],
  exports: [
    LoyalCustomerComponent,
    EditCategoriesModalComponent,
    DeleteCategoriesModalComponent
  ]
})
export class CategoriesSettingTableModule { }
