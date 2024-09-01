import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent implements OnInit {

  @Input() modal_type: string = 'add';

  employeeForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    nik: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    status: [true, [Validators.required]],
    role: ['', [Validators.required]]
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){
    console.log('masuk sini')
  }

  genderChange(value: string): void {
    // this.employeeForm.controls.role.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }
}
