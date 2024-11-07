import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FilterPurchaseOrderModule } from 'src/app/components/filter-purchase-order/filter-purchase-order.module';
import { AddProjectsModule } from 'src/app/components/add-projects/add-projects.module';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzModalModule,
    NzIconModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    NzTagModule,
    NzDrawerModule,
    NzDropDownModule,
    FilterPurchaseOrderModule,
    AddProjectsModule,
    NzProgressModule,
    DragDropModule,
    NzCardModule,
    NzSegmentedModule
  ],
  exports: [ProjectsComponent]
})
export class ProjectsModule { }
