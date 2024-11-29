import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { NzCardModule } from 'ng-zorro-antd/card';


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NzCardModule
  ],
  exports: [ReportsComponent]
})
export class ReportsModule { }
