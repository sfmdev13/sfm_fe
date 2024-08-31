import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-filter-employee-modal',
  templateUrl: './filter-employee-modal.component.html',
  styleUrls: ['./filter-employee-modal.component.scss']
})
export class FilterEmployeeModalComponent implements OnInit {

  constructor(
    private modal: NzModalRef
  ) { }

  ngOnInit(): void {
  }

  destroyModal(): void{
    this.modal.destroy()
  }

}
