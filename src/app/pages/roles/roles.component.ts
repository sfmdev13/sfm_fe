import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddRolesModalComponent } from 'src/app/components/add-roles-modal/add-roles-modal.component';
import { DeleteRolesModalComponent } from 'src/app/components/delete-roles-modal/delete-roles-modal.component';
import { DetailRolesModalComponent } from 'src/app/components/detail-roles-modal/detail-roles-modal.component';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  listOfDataRole: any[] = [
    {
      name: 'administrator',
      status: true
    },
    {
      name: 'Cost Control',
      status: true
    },
    {
      name: 'Finance',
      status: true
    },
    {
      name: 'Manager SC & Warehouse',
      status: true
    },
    {
      name: 'Staff SC - Warehouse',
      status: true
    }
  ]

  constructor(
    private modalService: NzModalService
  ) { }

  ngOnInit(): void {
  }

  showAddModal():void{
    this.modalService.create({
      nzTitle: 'Add Roles',
      nzContent: AddRolesModalComponent,
      nzComponentParams: {
        modal_type: 'add'
      },
      nzCentered: true
    })
  }

  showUpdateModal(): void{
    this.modalService.create({
      nzTitle: 'Edit Roles',
      nzContent: AddRolesModalComponent,
      nzComponentParams: {
        modal_type: 'Edit'
      },
      nzCentered: true
    })
  }

  showDetailModal(): void{
    this.modalService.create({
      nzTitle: 'Detail Roles',
      nzContent: DetailRolesModalComponent,
      nzCentered: true
    })
  }

  showDeleteModal(): void{
    this.modalService.create({
      nzTitle: 'Delete Role',
      nzContent: DeleteRolesModalComponent,
      nzCentered: true
    })
  }

}
