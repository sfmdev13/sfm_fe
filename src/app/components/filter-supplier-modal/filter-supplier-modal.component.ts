import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-filter-supplier-modal',
  templateUrl: './filter-supplier-modal.component.html',
  styleUrls: ['./filter-supplier-modal.component.scss']
})
export class FilterSupplierModalComponent implements OnInit {

  filterSupplierForm = this.fb.group({
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
