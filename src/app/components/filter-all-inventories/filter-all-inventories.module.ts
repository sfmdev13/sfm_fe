import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FilterAllInventoriesComponent } from './filter-all-inventories.component';



@NgModule({
  declarations: [FilterAllInventoriesComponent],
  imports: [
    CommonModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzRadioModule,
    NzModalModule
  ],
  exports: [FilterAllInventoriesComponent]
})
export class FilterAllInventoriesModule { }
