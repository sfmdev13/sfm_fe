import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivisionsSettingComponent } from './divisions-setting.component';

const routes: Routes = [
  {
    path: '',
    component: DivisionsSettingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionsSettingRoutingModule { }
