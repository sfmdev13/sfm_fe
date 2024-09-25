import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ICategories, IDataCategories, IDataUnit, IRootUnit } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-unit-of-measurement',
  templateUrl: './unit-of-measurement.component.html',
  styleUrls: ['./unit-of-measurement.component.scss']
})
export class UnitOfMeasurementComponent implements OnInit {

  units$!: Observable<IRootUnit>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  total_category: number = 0;

  categoryForm: FormGroup;

  categoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    measurement: ['', Validators.required],
    unit: [''],
    description: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
  ) { 
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      measurement: ['', Validators.required],
      unit: [''],
      description: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.getUnit();

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getUnit();
    })
  }

  getUnit(): void{
    this.units$ = this.apiSvc.getUnitMeasurement().pipe(
      tap(res => {
        this.total_category = res.data.length
      })
    );
  }

  showModalEdit(data: IDataUnit): void {
    this.modal_type = 'Edit'

    this.categoryFormEdit.patchValue({
      id: data.id,
      name: data.name,
      measurement: data.measurement,
      unit: data.unit,
      description: data.description
    })

    this.isVisibleEdit = true;
  }

  showModalAdd(): void {
    this.modal_type = 'Add'
    this.isVisibleAdd = true;
  }

  showModalDelete(id: number): void{
    this.selectedIdDelete = id;
    this.isVisibleDelete = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show();
    
    if(this.categoryFormEdit.valid){
      this.apiSvc.updateUnitMeasurment(this.categoryFormEdit.value).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Unit',
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
      this.apiSvc.createUnitMeasurement(this.categoryForm.value).subscribe({
        next: () => {

          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Unit',
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
            nzTitle: 'Unable to Add Unit',
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

    this.apiSvc.deleteCustomerFirm(this.selectedIdDelete).subscribe({
      next:() => {

        this.spinnerSvc.hide();
        this.modalSvc.success({
          nzTitle: 'Success',
          nzContent: 'Successfully Delete Category',
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
