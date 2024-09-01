import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  listOfDataRole: any[] = [
    {
      name: 'administrator',
      status: true
    },
    {
      name: 'Cost Control',
      status: true
    },
    {
      name: 'Finance',
      status: true
    },
    {
      name: 'Manager SC & Warehouse',
      status: true
    },
    {
      name: 'Staff SC - Warehouse',
      status: true
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  showAddModal():void{
    
  }

}
