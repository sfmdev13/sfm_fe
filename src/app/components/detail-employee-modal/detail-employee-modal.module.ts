import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailEmployeeModalComponent } from './detail-employee-modal.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';


@NgModule({
  declarations: [DetailEmployeeModalComponent],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzAvatarModule,
    NzTagModule
  ],
  exports: [DetailEmployeeModalComponent]
})
export class DetailEmployeeModalModule { }
