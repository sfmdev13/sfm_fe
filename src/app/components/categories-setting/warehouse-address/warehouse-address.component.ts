import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-warehouse-address',
  templateUrl: './warehouse-address.component.html',
  styleUrls: ['./warehouse-address.component.scss']
})
export class WarehouseAddressComponent implements OnInit {

  warehouse$!: Observable<any>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  total_category: number = 0;

  categoryForm: FormGroup;

  categoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    country: ['indonesia'],
    province: ['', Validators.required],
    city: ['', Validators.required],
    postal_code: ['', Validators.required],
    maps_url: ['', Validators.required],
    address: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  dataDetail: any;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
  ) { 
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      country: ['indonesia'],
      province: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      maps_url: ['', Validators.required],
      address: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.getWarehouse();

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getWarehouse();
    })
  }

  getWarehouse(): void{
    this.warehouse$ = this.apiSvc.getWarehouse().pipe(
      tap(res => {
        this.total_category = res.data.length
      })
    );
  }

  showModalEdit(data: any): void {
    this.modal_type = 'update'

    this.dataDetail = data;

    this.isVisibleEdit = true;
  }

  showModalAdd(): void {
    this.modal_type = 'add'
    this.isVisibleAdd = true;
  }

  showModalDelete(id: number): void{
    this.selectedIdDelete = id;
    this.isVisibleDelete = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show();
    
    if(this.categoryFormEdit.valid){

      const body = {
        id: this.categoryFormEdit.get('id')?.value,
        name: this.categoryFormEdit.get('name')?.value,
        description: this.categoryFormEdit.get('description')?.value,
        country: 'indonesia',
        province: this.categoryFormEdit.get('province')?.value.toString(),
        city: this.categoryFormEdit.get('city')?.value.toString(),
        postal_code: this.categoryFormEdit.get('postal_code')?.value,
        maps_url: this.categoryFormEdit.get('maps_url')?.value,
        address: this.categoryFormEdit.get('address')?.value
      }


      this.apiSvc.updateWarehouse(body).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Warehouse',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Update',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.isVisibleEdit = false;
        }
      })
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Update',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true
      })
    }
  }

  handleSubmitAdd(): void{

    this.spinnerSvc.show();

    if(this.categoryForm.valid){

      const body = {
        id: this.categoryForm.get('id')?.value,
        name: this.categoryForm.get('name')?.value,
        description: this.categoryForm.get('description')?.value,
        country: 'indonesia',
        province: this.categoryForm.get('province')?.value.toString(),
        city: this.categoryForm.get('city')?.value.toString(),
        postal_code: this.categoryForm.get('postal_code')?.value,
        maps_url: this.categoryForm.get('maps_url')?.value,
        address: this.categoryForm.get('address')?.value
      }

      this.apiSvc.createWarehouse(body).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Warehouse',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshCategories()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          this.spinnerSvc.hide();
          console.log(error);
          this.modalSvc.error({
            nzTitle: 'Unable to Add Warehouse',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.categoryForm.reset();
        }
      })
    } else {
      this.spinnerSvc.hide();
      this.modalSvc.error({
        nzTitle: 'Unable to Add',
        nzContent: 'Need to fill all input',
        nzOkText: 'Ok',
        nzCentered: true
      })      
    }
  }

  handleSubmitDelete(): void{

    this.spinnerSvc.show();

    this.apiSvc.deleteWarehouse(this.selectedIdDelete).subscribe({
      next:() => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Delete Address',
          nzOkText: 'Ok',
          nzCentered: true
        })


        this.apiSvc.triggerRefreshCategories();
        this.isVisibleDelete = false;
      },
      error:(error) => {
        this.spinnerSvc.hide();

        this.modalSvc.error({
          nzTitle: 'Unable to Delete',
          nzContent: error.error.meta.message,
          nzOkText: 'Ok',
          nzCentered: true
        })
      }
    })
  }

  handleCancelEdit(): void {
    this.isVisibleEdit = false;
  }

  handleCancelAdd(): void{
    this.isVisibleAdd = false;
  }

  handleCancelDelete(): void{
    this.isVisibleDelete = false;
  }
}
