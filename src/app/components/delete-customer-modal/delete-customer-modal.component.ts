import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-delete-customer-modal',
  templateUrl: './delete-customer-modal.component.html',
  styleUrls: ['./delete-customer-modal.component.scss']
})
export class DeleteCustomerModalComponent implements OnInit {

  @Input() id: string = ''

  constructor(
    private modal: NzModalRef,
    private apiSvc: ApiService
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
        console.log(error)
      },
      complete: () => {
        this.modal.destroy()
      }
    })
  }

}
