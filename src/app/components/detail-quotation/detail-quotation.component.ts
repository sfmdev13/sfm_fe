import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataQuotation, IQuotation } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-quotation',
  standalone: true,
  imports: [
    CommonModule, 
    NzTabsModule, 
    NzTableModule,
    NzDividerModule
  ],
  templateUrl: './detail-quotation.component.html',
  styleUrl: './detail-quotation.component.scss'
})
export class DetailQuotationComponent implements OnInit {

  private nzData = inject(NZ_MODAL_DATA)
  data: IDataQuotation = this.nzData.dataBasic
  dataDetail: IQuotation = this.nzData.dataDetail

  date = new Date();

  logMsg = [
    {
      revision: 'R0',
      changes: [
        {
          name: 'Gifino',
          message: 'Change Project location from Jakarta into Batam',
          revision: 'R0'
        },
        {
          name: 'Ramadian',
          message: 'Delete item part number ITM3343',
          revision: 'R0'
        }
      ]
    },
    {
      revision: 'R1',
      changes: [
        {
          name: 'Ramadian',
          message: 'Change quantity item part number ITM33434',
          revision: 'R1'
        }
      ]
    },
  ]

  provinceList: any[] = [];

  projectLocation: string = '';
  customerLocation: string = '';

  constructor(
    private apiSvc: ApiService
  ){}

  ngOnInit(): void {
    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res
    })

    this.getProvinceCity(this.data.province, this.data.city).subscribe((location) => {
      this.projectLocation = location;
    });

    this.getProvinceCity(this.data.quotation.customer.province, this.data.quotation.customer.city).subscribe((location) => {
      this.customerLocation = location;
    })
  }

  getProvinceCity(province_id: string, city_id: string): Observable<string>{
    return this.apiSvc.getRegenciesByProvince(parseInt(province_id)).pipe(
      map((res) => {
        const provinceName = this.provinceList.find((item) => item.id === parseInt(province_id))?.province;
        const cityName = res.find((item: any) => item.id === parseInt(city_id))?.regency;
  
        return `${provinceName}-${cityName}`;
      })
    );
  }
}
