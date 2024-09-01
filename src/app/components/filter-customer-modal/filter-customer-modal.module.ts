import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterCustomerModalComponent } from './filter-customer-modal.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [FilterCustomerModalComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzRadioModule,
    NzModalModule,
  ],
  exports: [FilterCustomerModalComponent]
})
export class FilterCustomerModalModule { }
