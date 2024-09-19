import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { IDataRoles, IRootEmployee, IRootUserByRole } from 'src/app/interfaces';

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

  employee$!: Observable<IRootUserByRole>;

  totalAll: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;

  searchEmp: string = '';
  private searchEmpSubject = new Subject<string>();


  disabledState: { [key: string]: boolean } = {};

  accessRights = [
    {
      nav_name: 'users',
      slug: 'view_users',
      selected: false,
      nav_section: [
        {
          section_name: 'employee',
          slug: 'view_employee',
          selected: false,
          section_action: [
            {
              name: 'Add New Employee',
              slug: 'add_new_employee',
              selected: false
            },
            {
              name: 'Detail Employee',
              slug: 'detail_employee',
              selected: false
            },
            {
              name: 'Edit Employee',
              slug: 'edit_employee',
              selected: false
            }
          ]
        },
        {
          section_name: 'customer',
          slug: 'view_customer',
          selected: false,
          section_action: [
            {
              name: 'Add New Customer',
              slug: 'add_new_customer',
              selected: false
            },
            {
              name: 'Detail Customer',
              slug: 'detail_customer',
              selected: false
            },
            {
              name: 'Edit Customer',
              slug: 'edit_customer',
              selected: false
            }
          ]
        },
        {
          section_name: 'supplier',
          slug: 'view_supplier',
          selected: false,
          section_action: [
            {
              name: 'Add New Supplier',
              slug: 'add_new_supplier',
              selected: false
            },
            {
              name: 'Detail Supplier',
              slug: 'detail_supplier',
              selected: false
            },
            {
              name: 'Edit Supplier',
              slug: 'edit_supplier',
              selected: false
            }
          ]
        }
      ]
    },
    {
      nav_name: 'projects',
      slug: 'view_projects',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'inventory',
      slug: 'view_inventory',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'reports',
      slug: 'view_reports',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'roles',
      slug: 'view_roles',
      selected: false,
      nav_section: [
        {
          section_name: 'Add New Role',
          slug: 'add_new_role',
          selected: false,
          section_action : []
        },
        {
          section_name:'Edit Role',
          slug: 'edit_role',
          selected: false,
          section_action : []
        },
        {
          section_name: 'Delete Role',
          slug: 'delete_role',
          selected: false,
          section_action : []
        }
      ]
    }
  ]

  

  constructor(
    private modal: NzModalRef,
    private apiSvc: ApiService
  ) {}

  ngOnInit(): void {



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

      this.setSelectedBasedOnActions(this.accessRights, this.roleDetail.actions)
    }
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

    const selectedSlugs = this.getSelectedSlugs(this.accessRights);


    if(this.modal_type === 'add'){
      const body = {
        title: this.roleName,
        status: this.status ? 1 : 0,
        action_slug: selectedSlugs
      }
      this.apiSvc.createRole(body).subscribe({
        next: ()=>{
          this.apiSvc.triggerRefreshRoles()
        },
        error: (error)=>{
          console.log(error)
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
        action_slug:  this.roleDetail.actions,
        action_slug_new: selectedSlugs
      }

      this.apiSvc.editRole(body).subscribe({
        next: () => {
          this.apiSvc.triggerRefreshRoles()
        },
        error: (error) => {
          console.log(error)
        },
        complete: () => {
          this.modal.destroy()
        }
      })
    }


  }

  toggleAction(action: any): void {
    action.selected = !action.selected;
    
  }

  toggleAccess(accessIndex: number): void {

    const access = this.accessRights[accessIndex];

    if (!access.selected) {
      access.nav_section.forEach((section: any, sectionIndex: number) => {
        const sectionKey = `section_${accessIndex}_${sectionIndex}`;
        this.disabledState[sectionKey] =  true

        section.selected = false;
        section.section_action.forEach((action: any, actionIndex: number) => {
          const actionKey = `section_${accessIndex}_action_${actionIndex}`
          this.disabledState[actionKey] = true


          action.selected = false;
        });
      });
    }

    if (access.selected) {
      access.nav_section.forEach((section: any, sectionIndex: number) => {
        const sectionKey = `section_${accessIndex}_${sectionIndex}`;
        this.disabledState[sectionKey] =  false
        
        section.selected = true;
        section.section_action.forEach((action: any, actionIndex: number) => {
          const actionKey = `section_${accessIndex}_action_${actionIndex}`
          this.disabledState[actionKey] = false

          action.selected = true;
        });
      });
    }
  }

  toggleSection(accessIndex: number, sectionIndex: number){
    const access_section = this.accessRights[accessIndex].nav_section[sectionIndex];

    if(!access_section.selected){
      access_section.section_action.forEach((action: any, actionIndex: number) => {
        const actionKey = `section_${accessIndex}_action_${actionIndex}`
        this.disabledState[actionKey] = true;

        action.selected = false;
      });
    }

    if(access_section.selected){
      access_section.section_action.forEach((action: any, actionIndex: number) => {
        const actionKey = `section_${accessIndex}_action_${actionIndex}`
        this.disabledState[actionKey] = false;

        action.selected = true;
      });
    }
  }

  isSectionDisabled(sectionIndex: number, accessIndex: number): boolean {
    return this.disabledState[`section_${accessIndex}_${sectionIndex}`] || false;
  }

  isActionDisabled(sectionIndex: number, actionIndex: number): boolean {
    return this.disabledState[`section_${sectionIndex}_action_${actionIndex}`] || false;
  }

  getTagClass(sectionIndex: number, actionIndex: number): string {
    return this.isActionDisabled(sectionIndex, actionIndex) ? 'disabled-tag' : 'active-tag';
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

  getSelectedSlugs(accessRights: any[]): string[] {
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
