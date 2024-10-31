import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllInventoriesComponent } from './all-inventories.component';

const routes: Routes = [
  {
    path: '',
    component: AllInventoriesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllInventoriesRoutingModule { }
