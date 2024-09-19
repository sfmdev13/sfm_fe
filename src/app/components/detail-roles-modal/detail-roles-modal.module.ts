import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailRolesModalComponent } from './detail-roles-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DetailRolesModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzTabsModule,
    NzTreeViewModule,
    NzIconModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DetailRolesModalComponent]
})
export class DetailRolesModalModule { }
