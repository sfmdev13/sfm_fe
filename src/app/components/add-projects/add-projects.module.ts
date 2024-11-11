import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AddProjectsComponent } from './add-projects.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CategoriesSettingTableModule } from '../categories-setting/categories-setting.module';
import { NzIconModule } from 'ng-zorro-antd/icon';



@NgModule({
  declarations: [AddProjectsComponent],
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
    FormsModule,
    NzSpaceModule,
    NzInputNumberModule,
    NzDividerModule,
    CategoriesSettingTableModule,
    NzIconModule
  ],
  exports: [AddProjectsComponent],
  providers: [DatePipe]
})
export class AddProjectsModule { }
