import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectHomeRoutingModule } from './project-home-routing.module';
import { ProjectHomeComponent } from './project-home.component';
import { ProjectsComponent } from '../projects/projects.component';
import { NzCardModule } from 'ng-zorro-antd/card';


@NgModule({
  declarations: [ProjectHomeComponent],
  imports: [
    CommonModule,
    ProjectHomeRoutingModule,
    NzCardModule
  ],
  exports: [ProjectHomeComponent]
})
export class ProjectHomeModule { }
