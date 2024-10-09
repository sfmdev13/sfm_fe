import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddPurchaseOrderComponent } from './add-purchase-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


@NgModule({
  declarations: [AddPurchaseOrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzDividerModule,
    NzTableModule,
    NzIconModule,
    NzInputNumberModule,
    NzSpaceModule,
    NzTabsModule
  ],
  exports: [AddPurchaseOrderComponent],
  providers: [DatePipe]
})
export class AddPurchaseOrderModule { }
