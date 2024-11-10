import { Component, inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { filter, Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootCatContact } from 'src/app/interfaces';

@Component({
  selector: 'app-filter-supplier-modal',
  templateUrl: './filter-supplier-modal.component.html',
  styleUrls: ['./filter-supplier-modal.component.scss']
})
export class FilterSupplierModalComponent implements OnInit {
  nzData = inject(NZ_MODAL_DATA)
  filteredSupp: boolean = this.nzData.filteredSupp
  
  suppProduct$!: Observable<IRootCatContact>;
  suppSource$!: Observable<IRootCatContact>;

  filterSupplierForm = this.fb.group({
    type: [''],
    status: [''],
    sort_by: ['asc'],
    supplier_product: [''],
    supplier_source: [''],
    province: [''],
    city: ['']
  })

  province_list: any[] = [];
  city_list: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    this.suppProduct$ = this.apiSvc.getSupplierProduct();

    this.suppSource$ = this.apiSvc.getSupplierSource();

    this.apiSvc.getProvinces().subscribe((prov) => {
      this.province_list = prov
    })

    this.filterSupplierForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city_list = res;
      })
    })

    if (this.filteredSupp) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsSupp')!);
      
      console.log(filterItem);

      this.filterSupplierForm.patchValue({
        type: filterItem.type,
        status: filterItem.status,
        sort_by: filterItem.sort_by,
        province: filterItem.province,
        city: filterItem.city,
        supplier_product: filterItem.supplier_product,
        supplier_source: filterItem.supplier_source
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
      sort_by: this.filterSupplierForm.value.sort_by,
      province: this.filterSupplierForm.value.province,
      city: this.filterSupplierForm.value.city,
      supplier_product: this.filterSupplierForm.value.supplier_product,
      supplier_source: this.filterSupplierForm.value.supplier_source
    }

    this.modal.close(paramsUrl);

  }

}
