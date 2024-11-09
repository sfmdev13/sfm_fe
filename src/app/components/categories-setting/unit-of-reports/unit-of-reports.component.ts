import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootUnit, IDataUnit, IRootUnitReport, IDataUnitReport } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-unit-of-reports',
  templateUrl: './unit-of-reports.component.html',
  styleUrls: ['./unit-of-reports.component.scss']
})
export class UnitOfReportsComponent implements OnInit {

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  total_category: number = 0;

  categoryForm: UntypedFormGroup;

  categoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    code: ['', Validators.required],
    value: ['', Validators.required],
    unit_of_measurement_id: ['', Validators.required],
    dimension: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  unitReportList$!: Observable<IRootUnitReport>;
  unitList: IDataUnit[] = [];

  constructor(
    private apiSvc: ApiService,
    private fb: UntypedFormBuilder,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
  ) { 
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      value: ['', Validators.required],
      unit_of_measurement_id: ['', Validators.required],
      dimension: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.getUnit();

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getUnit();
      this.getUnitReport();
    })

    this.getUnitReport();
  }

  getUnitReport(): void{
    this.unitReportList$ = this.apiSvc.getUnitReport().pipe(
      tap(res => {
        this.total_category = res.data.length
      })
    )
  }

  getUnit(): void{
    this.apiSvc.getUnitMeasurement().subscribe((res) => {
      this.unitList = res.data
    })
  }

  showModalEdit(data: IDataUnitReport): void {
    this.modal_type = 'Edit'

    this.categoryFormEdit.patchValue({
      id: data.id,
      name: data.name,
      description: data.description,
      code: data.code,
      value: data.value,
      dimension: data.dimension,
      unit_of_measurement_id: data.unit.id
    })

    this.isVisibleEdit = true;
  }

  showModalAdd(): void {
    this.modal_type = 'Add'
    this.isVisibleAdd = true;
  }

  showModalDelete(id: any): void{
    this.selectedIdDelete = id;
    this.isVisibleDelete = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show();
    
    if(this.categoryFormEdit.valid){
      this.apiSvc.updateUnitReport(this.categoryFormEdit.value).subscribe({
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
      this.apiSvc.createUnitReport(this.categoryForm.value).subscribe({
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

    this.spinnerSvc.show();

    this.apiSvc.deleteUnitReport(this.selectedIdDelete).subscribe({
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
