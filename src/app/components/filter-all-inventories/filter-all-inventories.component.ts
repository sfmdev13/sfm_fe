import { Component, inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-filter-all-inventories',
  templateUrl: './filter-all-inventories.component.html',
  styleUrls: ['./filter-all-inventories.component.scss']
})
export class FilterAllInventoriesComponent implements OnInit {
  nzData = inject(NZ_MODAL_DATA)
  filtered: boolean = this.nzData.filtered

  filterForm = this.fb.group({
    type: ['inventory'],
  })

  roleList: any[] = [];

  supplier$!: Observable<any>;

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    if (this.filtered) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsAllInvent')!);
      
      this.filterForm.patchValue({
        type: filterItem.type
      })
    } 
  }

  destroyModal(): void{
    this.modal.destroy()
  }

  submitForm(): void{
    this.modal.close(this.filterForm.value)
  }

}
