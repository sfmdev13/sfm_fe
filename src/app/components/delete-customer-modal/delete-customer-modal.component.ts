import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-customer-modal',
  templateUrl: './delete-customer-modal.component.html',
  styleUrls: ['./delete-customer-modal.component.scss']
})
export class DeleteCustomerModalComponent implements OnInit {

  constructor(private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  destroyModal(): void{
    this.modal.destroy()
  }

}
