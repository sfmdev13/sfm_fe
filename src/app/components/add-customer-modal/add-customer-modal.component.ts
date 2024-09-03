import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  
  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    type: ['',[Validators.required]],
    email: ['',[Validators.required]],
    nik: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    status: [true,[Validators.required]],
    pic: [{value: 'Sales 1', disabled: true},[Validators.required]],
    contactPerson: this.fb.array([])
  })

  optionsCust = ['company', 'individual'];
  optionCustSelected = 'company'

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addContactPerson();
  }

  get contactPerson(): FormArray {
    return this.customerForm.get('contactPerson') as FormArray;
  }

  addContactPerson(): void {
    this.contactPerson.push(this.fb.group({
      contact_name: ['', [Validators.required]],
      contact_type: ['', [Validators.required]],
      contact_phone: ['', [Validators.required]]
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
    console.log('masuk sini')
  }

  optionCustChange($event: number){
    if($event === 0) this.optionCustSelected = 'company';
    if($event === 1) this.optionCustSelected = 'individual';
  }

}
