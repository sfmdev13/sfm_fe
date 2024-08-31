import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeeModalComponent } from './add-employee-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [AddEmployeeModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule
  ],
  exports: [AddEmployeeModalComponent]
})
export class AddEmployeeModalModule { }
