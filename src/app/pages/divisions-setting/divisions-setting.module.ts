import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DivisionsSettingRoutingModule } from './divisions-setting-routing.module';
import { DivisionsSettingComponent } from './divisions-setting.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DivisionSettingModule } from 'src/app/components/division-setting/division-setting.module';


@NgModule({
  declarations: [DivisionsSettingComponent],
  imports: [
    CommonModule,
    DivisionsSettingRoutingModule,
    NzTableModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    DivisionSettingModule
  ],
  exports: [DivisionsSettingComponent]
})
export class DivisionsSettingModule { }
