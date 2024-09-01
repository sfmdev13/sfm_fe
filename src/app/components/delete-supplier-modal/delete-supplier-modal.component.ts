import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-supplier-modal',
  templateUrl: './delete-supplier-modal.component.html',
  styleUrls: ['./delete-supplier-modal.component.scss']
})
export class DeleteSupplierModalComponent implements OnInit {

  constructor(private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
