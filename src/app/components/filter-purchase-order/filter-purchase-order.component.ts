import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-filter-purchase-order',
  templateUrl: './filter-purchase-order.component.html',
  styleUrls: ['./filter-purchase-order.component.scss']
})
export class FilterPurchaseOrderComponent implements OnInit {

  @Input() filteredPO: boolean = false

  filterPOForm = this.fb.group({
    // supplier: [''],
    status: [''],
    sort_by: [''],
  })

  roleList: any[] = [];

  supplier$!: Observable<any>;

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    this.supplier$ = this.apiSvc.supplierList();

    if (this.filteredPO) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsPO')!);
      
      this.filterPOForm.patchValue({
        supplier: filterItem.supplier,
        status: filterItem.status,
        sort_by: filterItem.sort_by
      })
    } 
  }

  destroyModal(): void{
    this.modal.destroy()
  }

  submitForm(): void{
    this.modal.close(this.filterPOForm.value)
  }
}
