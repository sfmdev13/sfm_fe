import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesSettingRoutingModule } from './categories-setting-routing.module';
import { CategoriesSettingComponent } from './categories-setting.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CategoriesSettingTableModule } from 'src/app/components/categories-setting/categories-setting.module';


@NgModule({
  declarations: [CategoriesSettingComponent],
  imports: [
    CommonModule,
    CategoriesSettingRoutingModule,
    NzLayoutModule,
    NzMenuModule,
    CategoriesSettingTableModule
  ],
  exports: [CategoriesSettingComponent]
})
export class CategoriesSettingModule { }
