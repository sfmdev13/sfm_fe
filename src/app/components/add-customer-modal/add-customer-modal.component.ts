import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-customer-modal',
  templateUrl: './add-customer-modal.component.html',
  styleUrls: ['./add-customer-modal.component.scss']
})
export class AddCustomerModalComponent implements OnInit {

  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    type: ['',[Validators.required]],
    email: ['',[Validators.required]],
    nik: ['',[Validators.required]],
    phone: ['',[Validators.required]],
    address: ['',[Validators.required, Validators.maxLength(200)]],
    status: [true,[Validators.required]],
    pic: [{value: 'Sales 1', disabled: true},[Validators.required]]
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }
  

  submitForm(){
    console.log('masuk sini')
  }


}
