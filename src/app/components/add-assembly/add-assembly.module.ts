import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddAssemblyComponent } from './add-assembly.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSwitchModule } from 'ng-zorro-antd/switch';



@NgModule({
  declarations: [AddAssemblyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzDividerModule,
    NzTableModule,
    NzIconModule,
    NzInputNumberModule,
    NzSpaceModule,
    NzTabsModule,
    NzRadioModule,
    NzSwitchModule
  ],
  exports: [AddAssemblyComponent],
  providers: [DatePipe]
})
export class AddAssemblyModule { }
