import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-supplier-modal',
  templateUrl: './add-supplier-modal.component.html',
  styleUrls: ['./add-supplier-modal.component.scss']
})
export class AddSupplierModalComponent implements OnInit {

  @Input() modal_type: string = 'add';

  supplierForm = this.fb.group({
    name: ['', [Validators.required]],
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
