import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootAllRoles } from 'src/app/interfaces';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent implements OnInit {

  @Input() modal_type: string = 'add';

  roles$!: Observable<IRootAllRoles>

  employeeForm = this.fb.group({
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

  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){

    if(this.employeeForm.valid){
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
  }

  genderChange(value: string): void {
    // this.employeeForm.controls.role.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }
}
