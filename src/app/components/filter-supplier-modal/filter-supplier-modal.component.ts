import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-filter-supplier-modal',
  templateUrl: './filter-supplier-modal.component.html',
  styleUrls: ['./filter-supplier-modal.component.scss']
})
export class FilterSupplierModalComponent implements OnInit {

  @Input() filteredSupp: boolean = false;
  
  filterSupplierForm = this.fb.group({
    type: [''],
    status: [''],
    sort_by: ['asc']
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    if (this.filteredSupp) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsSupp')!);
      
      this.filterSupplierForm.patchValue({
        type: filterItem.type,
        status: filterItem.status,
        sort_by: filterItem.sort_by
      })
    } 


  }

  destroyModal(): void{
    this.modal.destroy()
  }

  submitForm(): void{

    const paramsUrl = {
      type: this.filterSupplierForm.value.type,
      status: this.filterSupplierForm.value.status,
      sort_by: this.filterSupplierForm.value.sort_by
    }

    this.modal.close(paramsUrl);

  }

}
