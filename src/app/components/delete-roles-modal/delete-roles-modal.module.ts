import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteRolesModalComponent } from './delete-roles-modal.component';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [DeleteRolesModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzResultModule
  ],
  exports: [DeleteRolesModalComponent]
})
export class DeleteRolesModalModule { }
