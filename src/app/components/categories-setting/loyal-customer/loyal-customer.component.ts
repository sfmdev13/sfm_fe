import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ICategories, IDataCategories } from 'src/app/interfaces';

@Component({
  selector: 'app-loyal-customer',
  templateUrl: './loyal-customer.component.html',
  styleUrls: ['./loyal-customer.component.scss']
})
export class LoyalCustomerComponent implements OnInit {  

  loyalCustomers$!: Observable<ICategories>

  isVisibleEdit = false;
  isVisibleAdd = false;
  isVisibleDelete = false;

  modal_type = 'Add';

  total_category: number = 0;

  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  categoryFormEdit = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  })

  selectedIdDelete: number = 0;

  constructor(
    private apiSvc: ApiService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getLoyalCustomer();

    this.apiSvc.refreshGetLoyalCustomer$.subscribe(() => {
      this.getLoyalCustomer();
    })
  }

  getLoyalCustomer(): void{
    this.loyalCustomers$ = this.apiSvc.getLoyalCustomer().pipe(
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
      this.apiSvc.editLoyalCustomer(this.categoryFormEdit.value.id,this.categoryFormEdit.value.name, this.categoryFormEdit.value.description).subscribe({
        next: () => {
          this.apiSvc.triggerRefreshLoyalCustomer()
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
      this.apiSvc.createLoyalCustomer(this.categoryForm.value.name, this.categoryForm.value.description).subscribe({
        next: () => {
          this.apiSvc.triggerRefreshLoyalCustomer()
          this.isVisibleAdd = false;
        },
        error: (error) => {
          console.log(error)
        },
      })
    }
  }

  handleSubmitDelete(): void{
    this.apiSvc.deleteLoyalCustomer(this.selectedIdDelete).subscribe({
      next:() => {
        this.apiSvc.triggerRefreshLoyalCustomer();
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
