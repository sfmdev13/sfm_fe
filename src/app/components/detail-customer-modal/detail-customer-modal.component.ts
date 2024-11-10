import { Component, inject, Input, OnInit } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';
import { IDataCustomer } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-customer-modal',
  templateUrl: './detail-customer-modal.component.html',
  styleUrls: ['./detail-customer-modal.component.scss']
})
export class DetailCustomerModalComponent implements OnInit {

  readonly nzModalData = inject(NZ_MODAL_DATA);
  data!: IDataCustomer;

  status: boolean = true;

  provinceList: any[] = [];
  cityList: any[] = [];

  constructor(
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    this.data = this.nzModalData.data

    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res
    })

    this.apiSvc.getRegencies().subscribe((res) => {
      this.cityList = res
    })
  }

  getProvinceName(id: string): string{
    const province = this.provinceList.find( p => p.id === parseInt(id));

    return province?.province ?? '-'
  }

  getRegencyName(id: string): string{
    const city = this.cityList.find(c => c.id === parseInt(id));

    return city?.regency ?? '-'
  }
}
