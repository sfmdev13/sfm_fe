import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesSettingComponent } from './categories-setting.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesSettingRoutingModule { }
