import { Component, inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootCatContact } from 'src/app/interfaces';

@Component({
  selector: 'app-filter-customer-modal',
  templateUrl: './filter-customer-modal.component.html',
  styleUrls: ['./filter-customer-modal.component.scss']
})
export class FilterCustomerModalComponent implements OnInit {

  nzData = inject(NZ_MODAL_DATA)
  filteredCust: boolean = this.nzData.filteredCust

  loyalCustCat$!: Observable<IRootCatContact>;
  custSector$!: Observable<IRootCatContact>;
  custFirm$!: Observable<IRootCatContact>;

  filterCustForm = this.fb.group({
    type: [''],
    status: [''],
    sort_by: ['asc'],
    loyal_customer: [''],
    customer_sector: [''],
    customer_firm: [''],
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

    this.loyalCustCat$ = this.apiSvc.getLoyalCustomer();
    this.custSector$ = this.apiSvc.getCustomerSector();
    this.custFirm$ = this.apiSvc.getCustomerFirm();

    this.apiSvc.getProvinces().subscribe((prov) => {
      this.province_list = prov
    })

    this.filterCustForm.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city_list = res;
      })
    })


    if (this.filteredCust) {
      const filterItem = JSON.parse(localStorage.getItem('filterItems')!);
      
      this.filterCustForm.patchValue({
        type: filterItem.type,
        status: filterItem.status,
        sort_by: filterItem.sort_by,
        loyal_customer: filterItem.loyal_customer,
        customer_sector: filterItem.customer_sector,
        customer_firm: filterItem.customer_firm,
        province: filterItem.province,
        city: filterItem.city
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
      sort_by: this.filterCustForm.value.sort_by,
      loyal_customer: this.filterCustForm.value.loyal_customer,
      customer_sector: this.filterCustForm.value.customer_sector,
      customer_firm: this.filterCustForm.value.customer_firm,
      province: this.filterCustForm.value.province,
      city: this.filterCustForm.value.city
    }

    this.modal.close(paramsUrl);

  }

}
