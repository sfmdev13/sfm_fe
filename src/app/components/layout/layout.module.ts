import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    NzMenuModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzIconModule,
    RouterModule,
    NzDropDownModule
  ],
  exports: [LayoutComponent]
})
export class LayoutModule { }
