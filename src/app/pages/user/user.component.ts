import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddEmployeeModalComponent } from 'src/app/components/add-employee-modal/add-employee-modal.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user_type: string = 'employee';
  
  listOfDataEmp: any[] = [];
  listofDataCust: any[] = [];
  listofDataSupp: any[] = [];

  constructor(private modalService: NzModalService) { }

  ngOnInit(): void {

    //for the first load
    this.listOfDataEmp = [
      {
        emp_id: '1',
        name: 'John Brown1',
        email: 'JohnBrow@gmail.com',
        nik: '212312312',
        phone: '0121283',
        address: 'Jalan Beruang II',
        status: true,
        role: 'superadmin'
      },
      {
        emp_id: '2',
        name: 'John Brown2',
        email: 'JohnBrow@gmail.com',
        nik: '212312312',
        phone: '0121283',
        address: 'Jalan Beruang II',
        status: false,
        role: 'Sales'
      },
      {
        emp_id: '3',
        name: 'John Brown3',
        email: 'JohnBrow@gmail.com',
        nik: '212312312',
        phone: '0121283',
        address: 'Jalan Beruang II',
        status: false,
        role: 'Sales'
      }
    ];
  }

  tabChange(value: string){

    this.user_type = value;

    if(value === 'employee'){
      this.listOfDataEmp = [
        {
          emp_id: '1',
          name: 'John Brown1',
          email: 'JohnBrow@gmail.com',
          nik: '212312312',
          phone: '0121283',
          address: 'Jalan Beruang II',
          status: true
        },
        {
          emp_id: '2',
          name: 'John Brown2',
          email: 'JohnBrow@gmail.com',
          nik: '212312312',
          phone: '0121283',
          address: 'Jalan Beruang II',
          status: false
        },
        {
          emp_id: '3',
          name: 'John Brown3',
          email: 'JohnBrow@gmail.com',
          nik: '212312312',
          phone: '0121283',
          address: 'Jalan Beruang II',
          status: false
        }
      ];
    }
    if(value === 'customer'){
      this.listofDataCust = [
        {
          cust_id: '12312',
          cust_cat: 'Architect',
          name: 'John Brown 1',
          email: 'johnBrow1@gmail.com',
          nik: '123123',
          phone: '3330192',
          address: 'Jalan Beruang II',
          status: true,
          pic: 'sales1'
        },
        {
          cust_id: '12312',
          cust_cat: 'QS',
          name: 'John Brown 2',
          email: 'johnBrow1@gmail.com',
          nik: '123123',
          phone: '3330192',
          address: 'Jalan Beruang II',
          status: true,
          pic: 'sales2'
        },
        {
          cust_id: '12312',
          cust_cat: 'architect',
          name: 'John Brown 3',
          email: 'johnBrow1@gmail.com',
          nik: '123123',
          phone: '3330192',
          address: 'Jalan Beruang II',
          status: false,
          pic: 'sales3'
        }
        
      ]
    }

    if(value === 'supplier'){
      this.listofDataSupp = [
        {
          supp_id: '123123',
          name: 'John Brown 1',
          email: 'johnbrow1@gmail.com',
          nik: '123123123123',
          phone: '0812371239',
          pic: 'Sales 1',
          address: 'Jalan Beruang II',
          status: true
        },
        {
          supp_id: '123123',
          name: 'John Brown 2',
          email: 'johnbrow1@gmail.com',
          nik: '123123123123',
          phone: '0812371239',
          pic: 'Sales 1',
          address: 'Jalan Beruang II',
          status: true
        },
        {
          supp_id: '123123',
          name: 'John Brown 3',
          email: 'johnbrow1@gmail.com',
          nik: '123123123123',
          phone: '0812371239',
          pic: 'Sales 1',
          address: 'Jalan Beruang II',
          status: true
        }
      ]
    }
    
  }

  showAddModal(){
    this.modalService.create({
      nzTitle: 'Add Employee',
      nzContent: AddEmployeeModalComponent
    });
  }

}
