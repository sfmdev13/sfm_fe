import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { FormsModule } from '@angular/forms';
import { TableUserModule } from 'src/app/components/table-user/table-user.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AddEmployeeModalModule } from 'src/app/components/add-employee-modal/add-employee-modal.module';
import { DetailEmployeeModalModule } from 'src/app/components/detail-employee-modal/detail-employee-modal.module';
import { DeleteEmployeeModalModule } from 'src/app/components/delete-employee-modal/delete-employee-modal.module';
import { FilterEmployeeModalModule } from 'src/app/components/filter-employee-modal/filter-employee-modal.module';
import { AddCustomerModalModule } from 'src/app/components/add-customer-modal/add-customer-modal.module';
import { DetailCustomerModalModule } from 'src/app/components/detail-customer-modal/detail-customer-modal.module';
import { DeleteCustomerModalModule } from 'src/app/components/delete-customer-modal/delete-customer-modal.module';
import { FilterCustomerModalModule } from 'src/app/components/filter-customer-modal/filter-customer-modal.module';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzTabsModule,
    NzRadioModule,
    FormsModule,
    TableUserModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    AddEmployeeModalModule,
    DetailEmployeeModalModule,
    DeleteEmployeeModalModule,
    FilterEmployeeModalModule,
    AddCustomerModalModule,
    DetailCustomerModalModule,
    DeleteCustomerModalModule,
    FilterCustomerModalModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
