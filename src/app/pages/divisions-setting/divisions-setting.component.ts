import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ICategories, IDataCategories, IDataDivision, IRootDivision } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-divisions-setting',
  templateUrl: './divisions-setting.component.html',
  styleUrls: ['./divisions-setting.component.scss']
})
export class DivisionsSettingComponent implements OnInit {

  division$!: Observable<IRootDivision>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;
  isVisibleDetail = false;

  modal_type = 'Add';

  total_category: number = 0;

  divisionForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  divisionFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  totalAll: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  detailData: IDataDivision = {} as IDataDivision

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder,
    private modalSvc: NzModalService,
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.getDivision();

    this.apiSvc.refreshGetDivision$.subscribe(() => {
      this.getDivision();
    })
  }

  pageIndexChange(page: number): void{
    this.currentPage = page;
    
    this.getDivision()
  }

  getDivision(): void{
    this.division$ = this.apiSvc.getDivision(this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.total_category = res.data.length
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    );
  }

  showModalEdit(data: IDataDivision): void {
    this.modal_type = 'Edit'

    this.divisionFormEdit.patchValue({
      id: data.id,
      name: data.name,
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

  showModalDetail(data: IDataDivision): void{
    this.detailData = data;
    this.isVisibleDetail = true;
  }

  handleSubmitEdit(): void {

    this.spinnerSvc.show()

    if(this.divisionFormEdit.valid){
      this.apiSvc.editDivision(this.divisionFormEdit.value.id,this.divisionFormEdit.value.name, this.divisionFormEdit.value.description).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Division',
            nzOkText: 'Ok',
            nzCentered: true
          })
          this.apiSvc.triggerRefreshDivision()
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Update Division',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
          console.log(error)
        },
        complete: () => {
          this.isVisibleEdit = false;
        }
      })
    }

    
    this.spinnerSvc.hide();
  }

  handleSubmitAdd(): void{

    this.spinnerSvc.show();
    
    if(this.divisionForm.valid){
      this.apiSvc.createDivision(this.divisionForm.value.name, this.divisionForm.value.description).subscribe({
        next: () => {
          this.spinnerSvc.hide();
          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Division',
            nzOkText: 'Ok',
            nzCentered: true
          })


          this.apiSvc.triggerRefreshDivision()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          this.spinnerSvc.hide();
          this.modalSvc.error({
            nzTitle: 'Unable to Add Division',
            nzContent: error.error.data.message,
            nzOkText: 'Ok',
            nzCentered: true
          })
        },
        complete: () => {
          this.divisionForm.reset()
        }
      })
    }

    
    this.spinnerSvc.hide();
  }

  handleSubmitDelete(): void{
    this.apiSvc.deleteDivision(this.selectedIdDelete).subscribe({
      next:() => {
        this.apiSvc.triggerRefreshDivision();
        this.isVisibleDelete = false;
      },
      error:(error) => {
        console.log(error)
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

  handleCloseDetail(): void{
    this.isVisibleDetail = false;
  }
}
