import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ICategories, IDataEmployee, IRootAllRoles } from 'src/app/interfaces';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent implements OnInit {
  nzData = inject(NZ_MODAL_DATA);
  @Input() modal_type: string = this.nzData.modal_type;
  @Input() data: IDataEmployee = this.nzData.data;

  roles$!: Observable<IRootAllRoles>

  empContract$!: Observable<ICategories>;

  divisionList$!: Observable<any>;

  isLoadingEmpContract: boolean = true;
  isLoadingDivision: boolean = true;

  roleList: any[] = [];

  employeeForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    nik: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.maxLength(200)]],
    status: [1, [Validators.required]],
    role_id: ['', [Validators.required]],
    join_date: ['', [Validators.required]],
    employee_contract_id: ['', [Validators.required]],
    division_id: ['', [Validators.required]]
  })

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {

    this.employeeForm.get('join_date')?.valueChanges.subscribe((value) => {
      const formattedDate = this.datePipe.transform(new Date(value), 'yyyy-MM-dd') || '';

      this.employeeForm.patchValue({join_date: formattedDate})
    })

    this.employeeForm.get('division_id')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRoleByDivision(value).subscribe((res) => {
        this.roleList = res.data.roles;
      })
    })

    this.empContract$ = this.apiSvc.getEmployeeContract().pipe(
      tap(res => {
        this.isLoadingEmpContract = false
      })
    )

    this.divisionList$ = this.apiSvc.getDivisionList().pipe(
      tap(res => {
        this.isLoadingDivision = false
      })
    )

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
        role_id: this.data.user.role_id,
        join_date: this.data.join_date,
        employee_contract_id: this.data.employee_contract_id,
        division_id: this.data.user.role.division.id
      })

      this.employeeForm.controls['email'].disable();
    } 

  }

  destroyModal(): void {
    this.modal.destroy();
  }

  submitForm(){

    this.spinnerSvc.show();

    console.log(this.employeeForm.value);

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

            this.modalSvc.error({
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

      this.modalSvc.error({
        nzTitle: 'Unable to Submit',
        nzContent: 'Need to fill all the input',
        nzOkText: 'Ok',
        nzCentered: true
      })

    }
  }
}
