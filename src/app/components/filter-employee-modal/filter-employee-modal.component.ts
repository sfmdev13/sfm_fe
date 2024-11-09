import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
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
    sort_by: [''],
    division_id: ['']
  })

  allRoles$!: Observable<IRootAllRoles>;
  division$!: Observable<any>;

  roleList: any[] = [];

  constructor(
    private modal: NzModalRef,
    private fb: UntypedFormBuilder,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {

    this.division$ = this.apiSvc.getDivisionList();

    this.allRoles$ = this.apiSvc.getAllRole();

    this.filterEmpForm.get('division_id')?.valueChanges.subscribe((value) => {
      this.apiSvc.getRoleByDivision(value).subscribe((res) => {
        this.roleList = res.data.roles;
      })

    })

    if (this.filteredEmp) {
      const filterItem = JSON.parse(localStorage.getItem('filterItemsEmp')!);
      
      this.filterEmpForm.patchValue({
        role_id: filterItem.role_id,
        status: filterItem.status,
        sort_by: filterItem.sort_by,
        division_id: filterItem.division_id
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
      sort_by: this.filterEmpForm.value.sort_by,
      division_id: this.filterEmpForm.value.division_id
    }

    this.modal.close(paramsUrl)
  }

}
