import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-roles-modal',
  templateUrl: './delete-roles-modal.component.html',
  styleUrls: ['./delete-roles-modal.component.scss']
})
export class DeleteRolesModalComponent implements OnInit {

  @Input() id: number = 0

  constructor(private modal: NzModalRef, private apiSvc: ApiService, private modalSvc: NzModalService) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  deleteRole(): void{
    this.apiSvc.deleteRole(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshRoles();
      },
      error: (error) => {
        this.modalSvc.error({
          nzTitle: 'Failed to Delete Role',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      },
      complete: () => {
        this.modal.destroy();
      }
    })
  }
}
