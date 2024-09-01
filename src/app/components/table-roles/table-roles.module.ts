import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRolesComponent } from './table-roles.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider'
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';


@NgModule({
  declarations: [TableRolesComponent],
  imports: [
    CommonModule,
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzBadgeModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule
  ],
  exports: [TableRolesComponent]
})
export class TableRolesModule { }
