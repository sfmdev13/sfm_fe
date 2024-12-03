import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationComponent } from './quotation.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    QuotationRoutingModule,
    NzTableModule,
    NzSelectModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzDropDownModule,
    NzDrawerModule,
    NzModalModule,
    NzDatePickerModule
  ],
  exports: [QuotationComponent]
})
export class QuotationModule { }
