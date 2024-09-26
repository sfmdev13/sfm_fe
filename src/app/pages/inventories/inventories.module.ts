import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoriesRoutingModule } from './inventories-routing.module';
import { InventoriesComponent } from './inventories.component';
import { NzCardModule } from 'ng-zorro-antd/card';


@NgModule({
  declarations: [InventoriesComponent],
  imports: [
    CommonModule,
    InventoriesRoutingModule,
    NzCardModule
  ],
  exports: [InventoriesComponent]
})
export class InventoriesModule { }
