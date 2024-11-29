import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuotationComparisonRoutingModule } from './quotation-comparison-routing.module';
import { QuotationComparisonComponent } from './quotation-comparison.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [QuotationComparisonComponent],
  imports: [
    CommonModule,
    QuotationComparisonRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzTabsModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzTableModule
  ],
  exports: [QuotationComparisonComponent]
})
export class QuotationComparisonModule { }
