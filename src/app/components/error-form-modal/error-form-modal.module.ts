import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorFormModalComponent } from './error-form-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzResultModule } from 'ng-zorro-antd/result';



@NgModule({
  declarations: [ErrorFormModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzResultModule
  ],
  exports: [ErrorFormModalComponent]
})
export class ErrorFormModalModule { }
