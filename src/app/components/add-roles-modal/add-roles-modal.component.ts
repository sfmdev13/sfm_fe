import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataRoles, IRootAccessRights, IRootDivision, IRootEmployee, IRootUserByRole } from 'src/app/interfaces';
import { accessRights } from 'src/app/constants/access-rights.contanst';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-add-roles-modal',
  templateUrl: './add-roles-modal.component.html',
  styleUrls: ['./add-roles-modal.component.scss']
})
export class AddRolesModalComponent implements OnInit {

  @Input() modal_type: string = 'add';
  @Input() roleDetail: IDataRoles = {} as IDataRoles;

  roleName = '';
  status = true;
  division_id = 0;

  employee$!: Observable<IRootUserByRole>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;

  searchEmp: string = '';
  private searchEmpSubject = new Subject<string>();

  newAccessRights = accessRights;

  division$!: Observable<IRootDivision>;

  isLoadingDivision: boolean = true;

  constructor(
    private modal: NzModalRef,
    private apiSvc: ApiService,
    private spinnerSvc: SpinnerService,
    private modalSvc: NzModalService
  ) {}

  ngOnInit(): void {

    this.division$ = this.apiSvc.getDivisionList().pipe(
      tap(res => {
        this.isLoadingDivision = false;
      })
    )

    if(this.modal_type === 'edit'){

      this.searchEmpSubject.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(search => {
        this.employee$ = this.apiSvc.searchUserByRole(search, this.roleDetail.id.toString() ,this.currentPage, this.pageSize).pipe(
          tap(res => {
            this.currentPage = res.pagination.current_page;
            this.totalAll = res.pagination.total;
          })
        )
      })

      this.getEmployee();

      this.roleName = this.roleDetail.title

      this.status = this.roleDetail.status === 1 ? true : false;

      this.division_id = this.roleDetail.division.id
      

      this.setSelectedBasedOnActions(this.newAccessRights, this.roleDetail.actions)
    }
  }

  resetChildSelections(access: any) {
    // Loop through each section and reset its selected state
    access.nav_section.forEach((section: any) => {
      section.selected = false;
      
      // Loop through each action and reset its selected state
      section.section_action.forEach((action: any) => {
        action.selected = false;
      });
    });
  }

  resetSectionActions(section: any) {
    section.section_action.forEach((action: any) => {
      action.selected = false;
    });
  }

  searchEmpHandler(search: string): void{
    this.searchEmpSubject.next(search);
  }

  pageIndexChange(page: number){
    this.currentPage = page;

    this.getEmployee();
  }

  getEmployee(){
    this.employee$ = this.apiSvc.getUserByRole(this.roleDetail.id.toString(),this.currentPage, this.pageSize).pipe(
      tap(res => {
        this.currentPage = res.pagination.current_page;
        this.totalAll = res.pagination.total
      })
    )
  }

  destroyModal(): void {
    this.modal.destroy();
  }
  
  submitForm(){

    this.spinnerSvc.show();

    const selectedSlugs = this.getSelectedSlugs(this.newAccessRights);

    if(this.modal_type === 'add'){
      const body = {
        title: this.roleName,
        status: this.status ? 1 : 0,
        action_slug: selectedSlugs,
        division_id: this.division_id
      }

      this.apiSvc.createRole(body).subscribe({
        next: ()=>{
          this.spinnerSvc.hide();

          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Add Role',
            nzOkText: 'Ok',
            nzCentered: true
          })


          this.apiSvc.triggerRefreshRoles()
        },
        error: (error)=>{
          this.spinnerSvc.hide();

          this.modalSvc.error({
            nzTitle: 'Unable to Add Role',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })

        },
        complete: () => {
          this.modal.destroy()
        }
      })
    }

    if(this.modal_type === 'edit'){
      const body = {
        id: this.roleDetail.id,
        title: this.roleName,
        status: this.status ? 1 : 0,
        division_id: this.division_id,
        action_slug:  this.roleDetail.actions.map(role => role.slug),
        action_slug_new: selectedSlugs
      }

      this.apiSvc.editRole(body).subscribe({
        next: () => {

          this.spinnerSvc.hide();

          this.modalSvc.success({
            nzTitle: 'Success',
            nzContent: 'Successfully Update Roles',
            nzOkText: 'Ok',
            nzCentered: true
          })


          this.apiSvc.triggerRefreshRoles()
        },
        error: (error) => {
          this.spinnerSvc.hide();

          this.modalSvc.success({
            nzTitle: 'Unable to Update Role',
            nzContent: error.error.meta.message,
            nzOkText: 'Ok',
            nzCentered: true
          })

        },
        complete: () => {
          this.modal.destroy()
        }
      })
    }

    this.spinnerSvc.show();
  }

  toggleAction(action: any): void {
    action.selected = !action.selected;
  }


  assignEmp(data: any): void{

    const body = {
      user_id: data.user_id,
      role_id: this.roleDetail.id
    }
    
    this.apiSvc.assignRole(body).subscribe({
      next:()=>{
        data.status = 1; 
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getSelectedSlugs(accessRights: IRootAccessRights[]): string[] {
    const selectedSlugs: string[] = [];
  
    accessRights.forEach(nav => {
      // Check if the nav object is selected
      if (nav.selected) {
        selectedSlugs.push(nav.slug);
      }
  
      // Check sections within the nav object
      if (nav.nav_section) {
        nav.nav_section.forEach((section: any)=> {
          if (section.selected) {
            selectedSlugs.push(section.slug);
          }
  
          // Check actions within each section
          if (section.section_action) {
            section.section_action.forEach((action: any) => {
              if (action.selected) {
                selectedSlugs.push(action.slug);
              }
            });
          }
        });
      }
    });
  
    return selectedSlugs;
  }

  setSelectedBasedOnActions(accessRights: any[], actions: any[]): void {
    accessRights.forEach(nav => {
      // Check if the slug from actions matches the nav slug
      actions.forEach(action => {
        if (nav.slug === action.slug) {
          nav.selected = true;
        }
      });
  
      // Check sections within the nav object
      if (nav.nav_section) {
        nav.nav_section.forEach((section: any) => {
          actions.forEach(action => {
            if (section.slug === action.slug) {
              section.selected = true;
            }
          });
  
          // Check actions within each section
          if (section.section_action) {
            section.section_action.forEach((sectionAction: any )=> {
              actions.forEach(action => {
                if (sectionAction.slug === action.slug) {
                  sectionAction.selected = true;
                }
              });
            });
          }
        });
      }
    });
  }
}
