import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataCustomer, IRootCatContact } from 'src/app/interfaces';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  @Input() customerDetail: IDataCustomer = {} as IDataCustomer
  
  customerForm = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    email: ['',[Validators.required]],
    nik: ['',[Validators.required]],
    type: ['company',[Validators.required]],
    phone: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    status: [1,[Validators.required]],
    pic: [{value: 'Sales 1', disabled: true},[Validators.required]],
    contactPerson: this.fb.array([
      this.fb.group({
        cp_name: ['', [Validators.required]],
        cp_email: ['', [Validators.required]],
        cp_nik: ['', [Validators.required]],
        cp_phone: ['', [Validators.required]],
        cp_category_id: [2, [Validators.required]],
        cp_address: ['', [Validators.required]],
        is_pic_company: [true, [Validators.required]],
        cp_id: [null]
      })
    ])
  })

  optionsCust = ['company', 'person'];
  optionCustSelected = 'company'

  catContact$!:Observable<IRootCatContact>;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {  
    this.catContact$ = this.apiSvc.getCategoryCP();

    this.customerForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.customerForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    if(this.modal_type === 'update'){

      this.optionCustSelected = this.customerDetail.type;

      this.customerForm.patchValue({
        id: this.customerDetail.id,
        name: this.customerDetail.name,
        email: this.customerDetail.email,
        nik: this.customerDetail.nik,
        type: this.customerDetail.type,
        phone: this.customerDetail.phone,
        address: this.customerDetail.address,
        status: this.customerDetail.status,
      })

      const contactPerson = this.customerForm.get('contactPerson') as FormArray;

      //clear existing contact person
      while (contactPerson.length !== 0) {
        contactPerson.removeAt(0);
      }
    
      this.customerDetail.contact_person.forEach((contact) => {
        contactPerson.push(this.fb.group({
          cp_name: [contact.name, Validators.required],
          cp_email: [contact.email, Validators.required],
          cp_nik: [contact.nik, Validators.required],
          cp_phone: [contact.phone, Validators.required],
          cp_category_id: [contact.customer_category.id, Validators.required],
          cp_address: [contact.address, Validators.required],
          is_pic_company: [contact.is_pic_company === 1 ? true : false, Validators.required],
          cp_id: [contact.id]
        }));
      });
    }
  }

  get contactPerson(): FormArray {
    return this.customerForm.get('contactPerson') as FormArray;
  }

  addContactPerson(): void {
    this.contactPerson.push(this.fb.group({
      cp_name: ['', [Validators.required]],
      cp_email: ['', [Validators.required]],
      cp_nik: ['', [Validators.required]],
      cp_phone: ['', [Validators.required]],
      cp_category_id: [0, [Validators.required]],
      cp_address: ['', [Validators.required]],
      is_pic_company: [false, [Validators.required]]
    }));
  }

  removeContactPerson(index: number): void {
    if(index === 0){
      return;
    }
    this.contactPerson.removeAt(index);
  }


  destroyModal(): void {
    this.modal.destroy();
  }
  

  submitForm(){
    if(this.modal_type === 'add'){
      if(this.customerForm.valid){
        this.apiSvc.createCustomer(this.customerForm.value).subscribe({
          next: (response) => {
            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        });
      } else {
        Object.values(this.customerForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

    if(this.modal_type === 'update'){
      if(this.customerForm.valid){
        this.apiSvc.updateCustomer(this.customerForm.value).subscribe({
          next: (response) => {
            this.apiSvc.triggerRefreshCustomers();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        });
      } else {
        Object.values(this.customerForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }

  optionCustChange($event: number){
    const contactPersonArray = this.customerForm.get('contactPerson') as FormArray;

    if($event === 0) {
      this.optionCustSelected = 'company';
      this.customerForm.patchValue({
        type: 'company',
      });
      this.addContactPerson();
    }
    if($event === 1 && this.modal_type === 'add') {
      this.optionCustSelected = 'person'
      this.customerForm.patchValue({
        type: 'person',
      });
      while (contactPersonArray.length !== 0) {
        contactPersonArray.removeAt(0);
      }
    };
  }

  checkButton(i: number){
    const contactPerson = this.customerForm.get('contactPerson') as FormArray;

    for (let index = 0; index < contactPerson.length; index++) {
      if (index !== i) {
        contactPerson.at(index).patchValue({ is_pic_company: false });
      }
    }
  }
}
