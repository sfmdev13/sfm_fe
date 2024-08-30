import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteEmployeeModalComponent } from './delete-employee-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';


@NgModule({
  declarations: [DeleteEmployeeModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzResultModule
  ],
  exports: [DeleteEmployeeModalComponent]
})
export class DeleteEmployeeModalModule { }
