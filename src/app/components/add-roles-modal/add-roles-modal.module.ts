import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRolesModalComponent } from './add-roles-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [AddRolesModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzCollapseModule,
    ReactiveFormsModule,
    NzSwitchModule,
    NzTagModule,
    NzTabsModule,
    NzTableModule,
    NzIconModule,
  ],
  exports: [AddRolesModalComponent]
})
export class AddRolesModalModule { }
