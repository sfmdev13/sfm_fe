import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddRolesModalComponent } from 'src/app/components/add-roles-modal/add-roles-modal.component';

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
      }
    })
  }

}
