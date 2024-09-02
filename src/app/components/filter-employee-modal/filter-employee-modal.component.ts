import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-filter-employee-modal',
  templateUrl: './filter-employee-modal.component.html',
  styleUrls: ['./filter-employee-modal.component.scss']
})
export class FilterEmployeeModalComponent implements OnInit {

  filterEmpForm = this.fb.group({
    role: [''],
    status: [''],
    sort: ['']
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  destroyModal(): void{
    this.modal.destroy()
  }

  submitForm(): void{
    console.log('aselole')
  }

}
