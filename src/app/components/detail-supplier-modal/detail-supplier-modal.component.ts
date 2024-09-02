import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-detail-supplier-modal',
  templateUrl: './detail-supplier-modal.component.html',
  styleUrls: ['./detail-supplier-modal.component.scss']
})
export class DetailSupplierModalComponent implements OnInit {

  status: boolean = true;

  constructor(
    private modal: NzModalRef
  ) { }

  ngOnInit(): void {
  }

  destroyModal(): void{
    this.modal.destroy();
  }

}
