import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
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
import { IDataCustomer, IDataSupplier, IRootCustomer, IRootSupplier } from 'src/app/interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user_type: string = 'employee';
  
  listOfDataEmp: any[] = [];
  listofDataSupp: any[] = [];

  customers$!: Observable<IRootCustomer>;

  totalCustomer: number = 0;
  totalAllCustomer: number = 0;
  pageSizeCustomer: number = 5;
  currentPageCustomer: number = 1;

  filterParams = {
    type: '',
    status: '',
    sort_by: 'asc'
  };
  filteredCust: boolean = false;

  suppliers$!: Observable<IRootSupplier>;

  totalSupplier: number = 0;
  totalAllSupplier: number = 0;
  pageSizeSupplier: number = 2;
  currentPageSupplier: number = 1;

  filteredSupp: boolean = false;

  searchSupp: string = '';
  private searchSuppSubject = new Subject<string>();

  listOfPic: any[] = [];

  constructor(
    private modalService: NzModalService,
    private apiSvc: ApiService
  ) { }

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
    
    this.apiSvc.refreshGetCustomer$.subscribe(() => {
      this.getCustomer();
    });

    this.apiSvc.refreshGetSupplier$.subscribe(() => {
      this.getSupplier();
    })

    this.apiSvc.getPic().subscribe(res => {
      this.listOfPic = res;
    }) 

    this.searchSuppSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.suppliers$ = this.apiSvc.searchSupplier(search, this.currentPageSupplier, this.pageSizeSupplier).pipe(
        tap(res => {
          this.totalSupplier = res.data.length;
          this.currentPageSupplier = res.pagination.current_page;
          this.totalAllSupplier = res.pagination.total;
        })
      );
    });
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
      if(this.filteredCust){
        this.getFilteredCustomer();
      } else {
        this.getCustomer();
      }
    }

    if(value === 'supplier'){
      this.getSupplier();
    }
    
  }

  showAddModal(){

    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Add Employee',
        nzContent: AddEmployeeModalComponent,
        nzComponentParams: {
          modal_type: 'add',
        },
        nzCentered: true,

      });
    }

    if(this.user_type === 'customer'){
      this.modalService.create({
        nzTitle: 'Add Customer',
        nzContent: AddCustomerModalComponent,
        nzComponentParams: {
          modal_type: 'add',
          listOfPic: this.listOfPic
        },
        nzCentered: true,
        nzWidth: '900px'
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Add Supplier',
        nzContent: AddSupplierModalComponent,
        nzComponentParams: {
          modal_type: 'add',
          listOfPic: this.listOfPic
        },
        nzCentered: true,
        nzWidth: '900px'
      });
    }


  }

  showUpdateModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Update Employee',
        nzContent: AddEmployeeModalComponent,
        nzComponentParams: {
          modal_type: 'update'
        },
        nzCentered: true
      });
    }
  }

  showDetailModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Detail Employee',
        nzContent: DetailEmployeeModalComponent,
        nzCentered: true
      });
    }
  }

  showDeleteModal(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Delete Employee',
        nzContent: DeleteEmployeeModalComponent,
        nzCentered: true
      });
    }

    if(this.user_type === 'supplier'){
      this.modalService.create({
        nzTitle: 'Delete Supplier',
        nzContent: DeleteSupplierModalComponent,
        nzCentered: true
      })
    }

  }

  showFilter(){
    if(this.user_type === 'employee'){
      this.modalService.create({
        nzTitle: 'Filter Employee',
        nzContent: FilterEmployeeModalComponent,
        nzCentered: true
      })
    }

    if(this.user_type === 'customer'){

       const custModal = this.modalService.create({
        nzTitle: 'Filter Customer',
        nzContent: FilterCustomerModalComponent,
        nzCentered: true,
        nzComponentParams: {
          filteredCust: this.filteredCust
        }
      })

      custModal.afterClose.subscribe(result => {
        if(result){
          this.filterParams = result
          this.getFilteredCustomer();
        }

      })

    }

    if(this.user_type === 'supplier'){
      const suppModal = this.modalService.create({
        nzTitle: 'Filter Supplier',
        nzContent: FilterSupplierModalComponent,
        nzCentered: true,
        nzComponentParams: {
          filteredSupp: this.filteredSupp
        }
      })

      suppModal.afterClose.subscribe(result => {
        if(result) {
          this.filterParams = result;
          this.getFilteredSupplier();
        }
      })
      
    }
  }


  showDetailModalCust(dataCustomer: IDataCustomer){
    this.modalService.create({
      nzTitle: 'Detail Customer',
      nzContent: DetailCustomerModalComponent,
      nzCentered: true,
      nzComponentParams: {
        data: dataCustomer
      },
      nzWidth: '900px'
    });
  }

  showUpdateModalCust(dataCustomer: IDataCustomer){
    this.modalService.create({
      nzTitle: 'Edit Customer',
      nzContent: AddCustomerModalComponent,
      nzComponentParams: {
        modal_type: 'update',
        customerDetail: dataCustomer,
        listOfPic: this.listOfPic
      },
      nzCentered: true,
      nzWidth: '900px'
    });
  }

  showDeleteModalCust(id: string){
    this.modalService.create({
      nzTitle: 'Delete Customer',
      nzContent: DeleteCustomerModalComponent,
      nzCentered: true,
      nzComponentParams: {
        id
      }
    });
  }

  showUpdateModalSupp(dataSupp: IDataSupplier){
    this.modalService.create({
      nzTitle: 'Update Supplier',
      nzContent: AddSupplierModalComponent,
      nzComponentParams: {
        modal_type: 'update',
        supplierDetail: dataSupp,
        listOfPic: this.listOfPic
      },
      nzCentered: true,
      nzWidth: '900px'
    })
  }

  showDetailModalSupp(dataSupp: IDataSupplier){
    this.modalService.create({
      nzTitle: 'Detail Supplier',
      nzContent: DetailSupplierModalComponent,
      nzCentered: true,
      nzComponentParams: {
        data: dataSupp
      },
      nzWidth: '900px'
    });
  }

  getCustomer(){
    this.customers$ = this.apiSvc.getCustomer(this.currentPageCustomer, this.pageSizeCustomer).pipe(
      tap(res =>{
        this.totalCustomer = res.data.length;
        this.currentPageCustomer = res.pagination.current_page;
        this.totalAllCustomer = res.pagination.total
      })
    );
  }

  getSupplier(){
    this.suppliers$ = this.apiSvc.getSupplier(this.currentPageSupplier, this.pageSizeSupplier).pipe(
      tap(res => {
        this.totalSupplier = res.data.length;
        this.currentPageSupplier = res.pagination.current_page;
        this.totalAllSupplier = res.pagination.total
      })
    )
  }

  getFilteredCustomer(){
    this.customers$ = this.apiSvc.filterCustomer(this.filterParams, this.currentPageCustomer, this.pageSizeCustomer).pipe(
      tap(res =>{
        this.totalCustomer = res.data.length;
        this.currentPageCustomer = res.pagination.current_page;
        this.totalAllCustomer = res.pagination.total
        this.filteredCust = true
        localStorage.setItem('filterItems', JSON.stringify(this.filterParams));
      })
    )
  }

  getFilteredSupplier(){
    this.suppliers$ = this.apiSvc.filterSupplier(this.filterParams, this.currentPageSupplier, this.pageSizeSupplier).pipe(
      tap(res =>{
        this.totalSupplier = res.data.length;
        this.currentPageSupplier = res.pagination.current_page;
        this.totalAllSupplier = res.pagination.total
        this.filteredSupp = true
        localStorage.setItem('filterItemsSupp', JSON.stringify(this.filterParams));
      })
    )
  }

  onPageIndexChangeCust(page: number): void {
    this.currentPageCustomer = page;

    if (this.filteredCust) {
      this.getFilteredCustomer();
    } else {
      this.getCustomer();
    }
  }

  onPageindexChangeSupp(page: number): void{
    this.currentPageSupplier = page;

    if(this.filteredSupp){
      this.getFilteredSupplier();
    } else {
      this.getSupplier();
    }
  }

  refreshTableCust(){
    this.filteredCust = false;
    this.pageSizeCustomer = 2;
    this.currentPageCustomer = 1;
    this.getCustomer();
  }

  refreshTableSupp(){
    this.filteredSupp = false;
    this.pageSizeCustomer = 2;
    this.currentPageCustomer = 1;
    this.getSupplier();
  }

  searchSuppHandler(search: string): void{
    this.searchSuppSubject.next(search);
  }
}
