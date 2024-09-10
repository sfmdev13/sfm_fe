import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IRootAllRoles } from 'src/app/interfaces';

@Component({
  selector: 'app-filter-employee-modal',
  templateUrl: './filter-employee-modal.component.html',
  styleUrls: ['./filter-employee-modal.component.scss']
})
export class FilterEmployeeModalComponent implements OnInit {

  @Input() filteredEmp: boolean = false

  filterEmpForm = this.fb.group({
    role_id: [''],
    status: [''],
    sort_by: ['']
  })

  allRoles$!: Observable<IRootAllRoles>;

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
    this.allRoles$ = this.apiSvc.getAllRole();

    if (this.filteredEmp) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsEmp')!);
      
      this.filterEmpForm.patchValue({
        role_id: filterItem.role_id,
        status: filterItem.status,
        sort_by: filterItem.sort_by
      })
    } 
  }

  destroyModal(): void{
    this.modal.destroy()
  }

  submitForm(): void{
    const paramsUrl = {
      role_id: this.filterEmpForm.value.role_id,
      status: this.filterEmpForm.value.status,
      sort_by: this.filterEmpForm.value.sort_by
    }

    this.modal.close(paramsUrl)
  }

}
