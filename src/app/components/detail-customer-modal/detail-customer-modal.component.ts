import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { IDataCustomer } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-customer-modal',
  templateUrl: './detail-customer-modal.component.html',
  styleUrls: ['./detail-customer-modal.component.scss']
})
export class DetailCustomerModalComponent implements OnInit {

  @Input() data!: IDataCustomer;

  status: boolean = true;

  provinceList: any[] = [];
  cityList: any[] = [];

  constructor(
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
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
