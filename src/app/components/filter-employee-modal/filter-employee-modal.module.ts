import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEmployeeModalComponent } from './filter-employee-modal.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [FilterEmployeeModalComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzRadioModule,
    NzModalModule
  ],
  exports: [FilterEmployeeModalComponent]
})
export class FilterEmployeeModalModule { }
