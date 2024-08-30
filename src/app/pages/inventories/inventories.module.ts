import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoriesRoutingModule } from './inventories-routing.module';
import { InventoriesComponent } from './inventories.component';


@NgModule({
  declarations: [InventoriesComponent],
  imports: [
    CommonModule,
    InventoriesRoutingModule
  ],
  exports: [InventoriesComponent]
})
export class InventoriesModule { }
