import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-filter-customer-modal',
  templateUrl: './filter-customer-modal.component.html',
  styleUrls: ['./filter-customer-modal.component.scss']
})
export class FilterCustomerModalComponent implements OnInit {

  @Input() filteredCust: boolean = false;

  filterCustForm = this.fb.group({
    type: [''],
    status: [''],
    sort_by: ['asc']
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    if (this.filteredCust) {
      const filterItem = JSON.parse(localStorage.getItem('filterItems')!);
      
      this.filterCustForm.patchValue({
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
      type: this.filterCustForm.value.type,
      status: this.filterCustForm.value.status,
      sort_by: this.filterCustForm.value.sort_by
    }

    this.modal.close(paramsUrl);

  }

}
