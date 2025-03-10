import { Component, inject, Inject, Input, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-employee-modal',
  templateUrl: './delete-employee-modal.component.html',
  styleUrls: ['./delete-employee-modal.component.scss']
})
export class DeleteEmployeeModalComponent implements OnInit {

  nzData = inject(NZ_MODAL_DATA);

  id: string = this.nzData.id

  constructor(private modal: NzModalRef, private apiSvc: ApiService, private modalSvc: NzModalService) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  deleteEmp(){
    this.apiSvc.deleteEmployee(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshEmployee();
      },
      error: (error) => {
        this.modalSvc.error({
          nzTitle: 'Failed to Delete Employee',
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
