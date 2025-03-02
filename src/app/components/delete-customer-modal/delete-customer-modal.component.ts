import { Component, inject, Input, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-customer-modal',
  templateUrl: './delete-customer-modal.component.html',
  styleUrls: ['./delete-customer-modal.component.scss']
})
export class DeleteCustomerModalComponent implements OnInit {

  nzData = inject(NZ_MODAL_DATA);
  id: string = this.nzData.id

  constructor(
    private modal: NzModalRef,
    private apiSvc: ApiService,
    private modalSvc: NzModalService
  ) { }

  ngOnInit(): void {
  }

  destroyModal(): void{
    this.modal.destroy()
  }

  deleteCust(): void{
    this.apiSvc.deleteCustomer(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshCustomers();
      },
      error: (error) => {
        this.modalSvc.error({
          nzTitle: 'Failed to Delete Customer',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      },
      complete: () => {
        this.modal.destroy()
      }
    })
  }

}
