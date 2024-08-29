import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { FormsModule } from '@angular/forms';
import { TableUserModule } from 'src/app/components/table-user/table-user.module';


@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzTabsModule,
    NzRadioModule,
    FormsModule,
    TableUserModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
