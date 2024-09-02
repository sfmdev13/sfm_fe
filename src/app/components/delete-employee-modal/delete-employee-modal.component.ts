import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-delete-employee-modal',
  templateUrl: './delete-employee-modal.component.html',
  styleUrls: ['./delete-employee-modal.component.scss']
})
export class DeleteEmployeeModalComponent implements OnInit {

  constructor(private modal: NzModalRef) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
