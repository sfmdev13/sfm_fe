import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationComparisonComponent } from './quotation-comparison.component';

const routes: Routes = [
  {
    path: '',
    component: QuotationComparisonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationComparisonRoutingModule { }
