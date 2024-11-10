import { Component, inject, Input, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { IDataEmployee } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-employee-modal',
  templateUrl: './detail-employee-modal.component.html',
  styleUrls: ['./detail-employee-modal.component.scss']
})
export class DetailEmployeeModalComponent implements OnInit {

  nzData = inject(NZ_MODAL_DATA)
  @Input() data: IDataEmployee = this.nzData.data

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
