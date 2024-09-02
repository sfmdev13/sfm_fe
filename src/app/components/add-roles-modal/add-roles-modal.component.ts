import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-add-roles-modal',
  templateUrl: './add-roles-modal.component.html',
  styleUrls: ['./add-roles-modal.component.scss']
})
export class AddRolesModalComponent implements OnInit {

  @Input() modal_type: string = 'add';

  roleName = '';

  disabledState: { [key: string]: boolean } = {};

  listOfDataEmp= [
    {
      name: 'Gifino Thoriq',
      assigned: false,
    },
    {
      name: 'Ramadian',
      assigned: false
    }
  ]

  accessRights = [
    {
      nav_name: 'users',
      selected: false,
      nav_section: [
        {
          section_name: 'employee',
          selected: false,
          section_action: [
            {
              name: 'Add New Employee',
              selected: false
            },
            {
              name: 'Detail Employee',
              selected: false
            },
            {
              name: 'Edit Employee',
              selected: false
            }
          ]
        },
        {
          section_name: 'customer',
          selected: false,
          section_action: [
            {
              name: 'Add New Customer',
              selected: false
            },
            {
              name: 'Detail Customer',
              selected: false
            },
            {
              name: 'Edit Customer',
              selected: false
            }
          ]
        },
        {
          section_name: 'supplier',
          selected: false,
          section_action: [
            {
              name: 'Add New Supplier',
              selected: false
            },
            {
              name: 'Detail Supplier',
              selected: false
            },
            {
              name: 'Edit Supplier',
              selected: false
            }
          ]
        }
      ]
    },
    {
      nav_name: 'projects',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'inventory',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'reports',
      selected: false,
      nav_section: []
    },
    {
      nav_name: 'roles',
      selected: false,
      nav_section: []
    }
  ]

  

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
    console.log(this.accessRights)
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
    data.assigned = !data.assigned
  }
}
