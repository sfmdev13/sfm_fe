import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-detail-employee-modal',
  templateUrl: './detail-employee-modal.component.html',
  styleUrls: ['./detail-employee-modal.component.scss']
})
export class DetailEmployeeModalComponent implements OnInit {

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
