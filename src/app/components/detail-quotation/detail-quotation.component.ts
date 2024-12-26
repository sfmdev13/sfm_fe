import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { Observable, map } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { DetailQuotationStack, IDataQuotation, IDetailDataQuotation, IQuotation, LatestQuotationBom } from 'src/app/interfaces';
import { DetailStackQuotationComponent } from './detail-stack-quotation/detail-stack-quotation.component';

@Component({
  selector: 'app-detail-quotation',
  standalone: true,
  imports: [
    CommonModule, 
    NzTabsModule, 
    NzTableModule,
    NzDividerModule,
    NzSelectModule,
    FormsModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  templateUrl: './detail-quotation.component.html',
  styleUrl: './detail-quotation.component.scss'
})
export class DetailQuotationComponent implements OnInit {

  private nzData = inject(NZ_MODAL_DATA)
  data: IDataQuotation = this.nzData.dataBasic
  dataDetail: IDetailDataQuotation = this.nzData.dataDetail
  revisionSelected: string = this.nzData.revisionSelected

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

  selectedStack: string = '';

  constructor(
    private apiSvc: ApiService,
    private modalSvc: NzModalService
  ){}

  ngOnInit(): void {
    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res
    })

    this.getProvinceCity(this.data.project.province, this.data.project.city).subscribe((location) => {
      this.projectLocation = location;
    });

    this.getProvinceCity(this.data.customer.province, this.data.customer.city).subscribe((location) => {
      this.customerLocation = location;
    })
  }

  openStackDetail(stackLatest: DetailQuotationStack){
    this.modalSvc.create({
      nzTitle: 'Detail Stacks',
      nzContent: DetailStackQuotationComponent,
      nzCentered: true,
      nzData: {
        stackLatest
      },
      nzWidth: '100vw'
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
