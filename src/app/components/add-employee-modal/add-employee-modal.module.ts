import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddEmployeeModalComponent } from './add-employee-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';

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
    NzSwitchModule,
    NzDatePickerModule,
    NzSpinModule,
    FormsModule
  ],
  exports: [AddEmployeeModalComponent],
  providers: [DatePipe]
})
export class AddEmployeeModalModule { }
