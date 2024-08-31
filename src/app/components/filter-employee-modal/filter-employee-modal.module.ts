import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEmployeeModalComponent } from './filter-employee-modal.component';



@NgModule({
  declarations: [FilterEmployeeModalComponent],
  imports: [
    CommonModule
  ],
  exports: [FilterEmployeeModalComponent]
})
export class FilterEmployeeModalModule { }
