import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { IDataEmployee } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-employee-modal',
  templateUrl: './detail-employee-modal.component.html',
  styleUrls: ['./detail-employee-modal.component.scss']
})
export class DetailEmployeeModalComponent implements OnInit {

  @Input() data: IDataEmployee = {} as IDataEmployee

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
