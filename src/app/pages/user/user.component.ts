import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddCustomerModalComponent } from 'src/app/components/add-customer-modal/add-customer-modal.component';
import { AddEmployeeModalComponent } from 'src/app/components/add-employee-modal/add-employee-modal.component';
import { AddSupplierModalComponent } from 'src/app/components/add-supplier-modal/add-supplier-modal.component';
import { DeleteCustomerModalComponent } from 'src/app/components/delete-customer-modal/delete-customer-modal.component';
import { DeleteEmployeeModalComponent } from 'src/app/components/delete-employee-modal/delete-employee-modal.component';
import { DeleteSupplierModalComponent } from 'src/app/components/delete-supplier-modal/delete-supplier-modal.component';
import { DetailCustomerModalComponent } from 'src/app/components/detail-customer-modal/detail-customer-modal.component';
import { DetailEmployeeModalComponent } from 'src/app/components/detail-employee-modal/detail-employee-modal.component';
import { DetailSupplierModalComponent } from 'src/app/components/detail-supplier-modal/detail-supplier-modal.component';
import { FilterCustomerModalComponent } from 'src/app/components/filter-customer-modal/filter-customer-modal.component';
import { FilterEmployeeModalComponent } from 'src/app/components/filter-employee-modal/filter-employee-modal.component';
import { FilterSupplierModalComponent } from 'src/app/components/filter-supplier-modal/filter-supplier-modal.component';

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

    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Add Employee',
        nzContent: AddEmployeeModalComponent,
        nzComponentParams: {
          modal_type: 'add',
        }
      });
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Add Customer',
        nzContent: AddCustomerModalComponent,
        nzComponentParams: {
          modal_type: 'add',
        }
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Add Supplier',
        nzContent: AddSupplierModalComponent,
        nzComponentParams: {
          modal_type: 'add'
        }
      })
    }

  }

  showUpdateModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Update Employee',
        nzContent: AddEmployeeModalComponent,
        nzComponentParams: {
          modal_type: 'update'
        }
      });
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Update Customer',
        nzContent: AddCustomerModalComponent,
        nzComponentParams: {
          modal_type: 'update'
        }
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Update Supplier',
        nzContent: AddSupplierModalComponent,
        nzComponentParams: {
          modal_type: 'update'
        }
      });
    }

  }

  showDetailModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Detail Employee',
        nzContent: DetailEmployeeModalComponent
      });
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Detail Customer',
        nzContent: DetailCustomerModalComponent
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Detail Supplier',
        nzContent: DetailSupplierModalComponent
      });
    }

  }

  showDeleteModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Delete Employee',
        nzContent: DeleteEmployeeModalComponent
      });
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Delete Customer',
        nzContent: DeleteCustomerModalComponent
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Delete Supplier',
        nzContent: DeleteSupplierModalComponent
      })
    }

  }

  showFilter(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Filter Employee',
        nzContent: FilterEmployeeModalComponent
      })
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Filter Customer',
        nzContent: FilterCustomerModalComponent,

      })
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Filter Supplier',
        nzContent: FilterSupplierModalComponent
      })
    }
  }

}
