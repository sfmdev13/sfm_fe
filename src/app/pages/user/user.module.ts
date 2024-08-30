import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio'
import { FormsModule } from '@angular/forms';
import { TableUserModule } from 'src/app/components/table-user/table-user.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NzTabsModule,
    NzRadioModule,
    FormsModule,
    TableUserModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule
  ],
  exports: [UserComponent]
})
export class UserModule { }
