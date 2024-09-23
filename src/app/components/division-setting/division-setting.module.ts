import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditDivisionComponent } from './edit-division/edit-division.component';
import { DeleteDivisionComponent } from './delete-division/delete-division.component';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';



@NgModule({
  declarations: [
    EditDivisionComponent,
    DeleteDivisionComponent
  ],
  imports: [
    CommonModule,
    NzModalModule,
    ReactiveFormsModule,
    FormsModule,
    NzResultModule,
    NzFormModule,
    NzInputModule
  ],
  exports: [
    EditDivisionComponent,
    DeleteDivisionComponent
  ]
})
export class DivisionSettingModule { }
