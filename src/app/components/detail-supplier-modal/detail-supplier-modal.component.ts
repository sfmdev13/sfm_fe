import { Component, Input, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';
import { IDataSupplier } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-supplier-modal',
  templateUrl: './detail-supplier-modal.component.html',
  styleUrls: ['./detail-supplier-modal.component.scss']
})
export class DetailSupplierModalComponent implements OnInit {

  @Input() data!: IDataSupplier;

  status: boolean = true;

  provinceList: any[] = [];
  cityList: any[] = [];

  constructor(
    private modal: NzModalRef,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
    this.apiSvc.getProvinces().subscribe((res) => {
      this.provinceList = res
    });

    this.apiSvc.getRegencies().subscribe((res) => {
      this.cityList = res
    });
  }

  destroyModal(): void{
    this.modal.destroy();
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
