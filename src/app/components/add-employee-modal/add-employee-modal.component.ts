import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataEmployee, IRootAllRoles } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

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
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
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

    this.spinnerSvc.show();

    if(this.employeeForm.valid){

      if(this.modal_type === 'add'){
        this.apiSvc.createEmployee(this.employeeForm.value).subscribe({
          next: () => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Add Employee',
              nzOkText: 'Ok',
              nzCentered: true
            })


            this.apiSvc.triggerRefreshEmployee();
          },
          error: (error) => {
            this.spinnerSvc.hide();

            this.modalSvc.error({
              nzTitle: 'Unable to Add Employee',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            })
          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

      if(this.modal_type === 'update'){
        this.apiSvc.udpateEmployee(this.employeeForm.value).subscribe({
          next: () => {
            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Success',
              nzContent: 'Successfully Update Employee',
              nzOkText: 'Ok',
              nzCentered: true
            })

            this.apiSvc.triggerRefreshEmployee();
          },
          error: (error) => {

            this.spinnerSvc.hide();

            this.modalSvc.success({
              nzTitle: 'Unable to Update Employee',
              nzContent: error.error.meta.message,
              nzOkText: 'Ok',
              nzCentered: true
            })

          },
          complete: () => {
            this.modal.destroy();
          }
        })
      }

    } else {
      this.spinnerSvc.hide();

      this.modalSvc.success({
        nzTitle: 'Unable to Submit',
        nzContent: 'Need to fill all the input',
        nzOkText: 'Ok',
        nzCentered: true
      })

    }
  }
}
