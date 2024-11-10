import { Component, Inject, inject, Input, OnInit, Optional } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-add-warehouse-address',
  templateUrl: './add-warehouse-address.component.html',
  styleUrls: ['./add-warehouse-address.component.scss']
})
export class AddWarehouseAddressComponent implements OnInit {

  @Input() form!: UntypedFormGroup;
  @Input() type: string  = ''
  @Input() data: any;

  provinces$!: Observable<any>;

  provinceList: any[] = [];

  city: any[] = [];
  
  constructor(private apiSvc: ApiService, @Optional() @Inject(NZ_MODAL_DATA) public nzData: any) { }

  ngOnInit(): void {

    if (this.nzData) {
      this.form = this.nzData.form;
    }

    this.provinces$ = this.apiSvc.getProvinces().pipe(
      tap(p => {
        this.provinceList = p;
      })
    );

    this.form.get('province')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRegenciesByProvince(value).subscribe((res) => {
        this.city = res;
      })
    })

    if(this.type === 'update'){
      console.log(this.data)
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        province: parseInt(this.data.province),
        city: parseInt(this.data.city),
        address: this.data.address,
        postal_code: this.data.postal_code,
        maps_url: this.data.maps_url
      })
    }
  }

}
