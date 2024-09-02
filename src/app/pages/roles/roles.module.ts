import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { TableRolesModule } from 'src/app/components/table-roles/table-roles.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AddRolesModalModule } from 'src/app/components/add-roles-modal/add-roles-modal.module';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DetailRolesModalModule } from 'src/app/components/detail-roles-modal/detail-roles-modal.module';
import { DeleteRolesModalModule } from 'src/app/components/delete-roles-modal/delete-roles-modal.module';

@NgModule({
  declarations: [RolesComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    TableRolesModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    AddRolesModalModule,
    NzTabsModule,
    DetailRolesModalModule,
    DeleteRolesModalModule
  ],
  exports: [RolesComponent]
})
export class RolesModule { }
