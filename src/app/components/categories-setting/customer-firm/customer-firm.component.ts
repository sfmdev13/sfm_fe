import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ICategories, IDataCategories } from 'src/app/interfaces';

@Component({
  selector: 'app-customer-firm',
  templateUrl: './customer-firm.component.html',
  styleUrls: ['./customer-firm.component.scss']
})
export class CustomerFirmComponent implements OnInit {

  customerFirm$!: Observable<ICategories>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  total_category: number = 0;

  categoryForm: FormGroup;

  categoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder
  ) { 
    this.categoryForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required]
    })
   }

  ngOnInit(): void {
    this.getCustomerFirm();

    this.apiSvc.refreshGetCategories$.subscribe(() => {
      this.getCustomerFirm();
    })
  }

  getCustomerFirm(): void{
    this.customerFirm$ = this.apiSvc.getCustomerFirm().pipe(
      tap(res => {
        this.total_category = res.data.length
      })
    );
  }

  showModalEdit(data: IDataCategories): void {
    this.modal_type = 'Edit'

    this.categoryFormEdit.patchValue({
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

  handleSubmitEdit(): void {
    
    if(this.categoryFormEdit.valid){
      this.apiSvc.editCustomerFirm(this.categoryFormEdit.value.id,this.categoryFormEdit.value.name, this.categoryFormEdit.value.description).subscribe({
        next: () => {
          this.apiSvc.triggerRefreshCategories()
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          this.isVisibleEdit = false;
        }
      })
    }
  }

  handleSubmitAdd(): void{
    if(this.categoryForm.valid){
      this.apiSvc.createCustomerFirm(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
        next: () => {
          this.apiSvc.triggerRefreshCategories()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          this.categoryForm.reset();
        }
      })
    }
  }

  handleSubmitDelete(): void{
    this.apiSvc.deleteCustomerFirm(this.selectedIdDelete).subscribe({
      next:() => {
        this.apiSvc.triggerRefreshCategories();
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
}
