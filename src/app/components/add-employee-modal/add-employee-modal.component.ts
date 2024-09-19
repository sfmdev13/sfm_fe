import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataEmployee, IRootAllRoles } from 'src/app/interfaces';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  @Input() data: IDataEmployee = {} as IDataEmployee

  roles$!: Observable<IRootAllRoles>

  employeeForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    nik: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    status: [1, [Validators.required]],
    role_id: ['', [Validators.required]]
  })

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) {}

  ngOnInit(): void {

    this.roles$ = this.apiSvc.getAllRole();

    this.employeeForm.get('status')?.valueChanges.subscribe((value: boolean) => {
      this.employeeForm.get('status')?.setValue(value ? 1 : 0, { emitEvent: false });
    });

    if(this.modal_type === 'update'){
      this.employeeForm.patchValue({
        id: this.data.user_id,
        name: this.data.name,
        email: this.data.email,
        nik: this.data.nik,
        phone: this.data.phone,
        address: this.data.address,
        status: this.data.status,
        role_id: this.data.user.role_id
      })

      this.employeeForm.controls['email'].disable();
    } 

  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){

    if(this.employeeForm.valid){

      if(this.modal_type === 'add'){
        this.apiSvc.createEmployee(this.employeeForm.value).subscribe({
          next: () => {
            this.apiSvc.triggerRefreshEmployee();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

      if(this.modal_type === 'update'){
        this.apiSvc.udpateEmployee(this.employeeForm.value).subscribe({
          next: () => {
            this.apiSvc.triggerRefreshEmployee();
          },
          error: (error) => {
            console.log(error)
          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

    }
  }
}
