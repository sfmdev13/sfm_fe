import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-filter-customer-modal',
  templateUrl: './filter-customer-modal.component.html',
  styleUrls: ['./filter-customer-modal.component.scss']
})
export class FilterCustomerModalComponent implements OnInit {

  filterCustForm = this.fb.group({
    type: [''],
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
    console.log('submit')
  }

}
