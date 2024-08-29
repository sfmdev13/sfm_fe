import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { TableUserComponent } from './table-user.component';

@NgModule({
  declarations: [TableUserComponent],
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule
  ],
  exports: [TableUserComponent]
})
export class TableUserModule { }
