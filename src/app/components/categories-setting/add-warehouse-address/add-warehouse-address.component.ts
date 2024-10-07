import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-add-warehouse-address',
  templateUrl: './add-warehouse-address.component.html',
  styleUrls: ['./add-warehouse-address.component.scss']
})
export class AddWarehouseAddressComponent implements OnInit {

  @Input() form!: FormGroup;

  provinces$!: Observable<any>;

  provinceList: any[] = [];

  city: any[] = [];
  
  constructor(private apiSvc: ApiService) { }

  ngOnInit(): void {

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
  }

}
