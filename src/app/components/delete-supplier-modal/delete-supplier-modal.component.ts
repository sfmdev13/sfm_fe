import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-supplier-modal',
  templateUrl: './delete-supplier-modal.component.html',
  styleUrls: ['./delete-supplier-modal.component.scss']
})
export class DeleteSupplierModalComponent implements OnInit {

  @Input() id!: string;

  constructor(private modal: NzModalRef, private apiSvc: ApiService, private modalSvc: NzModalService) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  deleteSupp(): void{
    this.apiSvc.deleteSupplier(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshSuppliers();
      },
      error: (error) => {
        this.modalSvc.error({
          nzTitle: 'Failed to Delete Supplier',
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
