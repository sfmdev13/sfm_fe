import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-supplier-modal',
  templateUrl: './delete-supplier-modal.component.html',
  styleUrls: ['./delete-supplier-modal.component.scss']
})
export class DeleteSupplierModalComponent implements OnInit {

  @Input() id!: string;

  constructor(private modal: NzModalRef, private apiSvc: ApiService) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  deleteSupp(): void{
    this.apiSvc.deleteSupplier(this.id).subscribe({
      next: () => {
        this.apiSvc.triggerRefreshCustomers();
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.modal.destroy()
      }
    })
  }
}
