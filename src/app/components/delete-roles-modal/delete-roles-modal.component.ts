import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-roles-modal',
  templateUrl: './delete-roles-modal.component.html',
  styleUrls: ['./delete-roles-modal.component.scss']
})
export class DeleteRolesModalComponent implements OnInit {

  constructor(private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

}
