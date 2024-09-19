import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap, tap } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';
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
import { IDataCustomer, IDataEmployee, IDataSupplier, IRootCustomer, IRootEmployee, IRootSupplier } from 'src/app/interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user_type: string = '';
  
  listOfDataEmp: any[] = [];

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
  pageSizeSupplier: number = 5;
  currentPageSupplier: number = 1;

  filteredSupp: boolean = false;

  searchSupp: string = '';
  private searchSuppSubject = new Subject<string>();

  searchCust: string = '';
  private searchCustSubject = new Subject<string>();

  searchEmp: string = '';
  private searchEmpSubject = new Subject<string>();

  listOfPic: any[] = [];

  employees$!: Observable<IRootEmployee>;

  totalEmployee: number = 0;
  totalAllEmployee: number = 0;
  pageSizeEmployee: number = 5;
  currentPageEmployee: number = 1;

  filteredEmp: boolean = false;

  constructor(
    private modalService: NzModalService,
    private apiSvc: ApiService,
    public authSvc: AuthService
  ) { }

  ngOnInit(): void {

    this.checkTabAction();

    //for the first load
    this.getEmployee();
    
    this.apiSvc.refreshGetCustomer$.subscribe(() => {
      this.getCustomer();
    });

    this.apiSvc.refreshGetSupplier$.subscribe(() => {
      this.getSupplier();
    })

    this.apiSvc.refreshGetEmployee$.subscribe(() => {
      this.getEmployee();
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

    this.searchCustSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.customers$ = this.apiSvc.searchCustomer(search, this.currentPageCustomer, this.pageSizeCustomer).pipe(
        tap(res => {
          this.totalCustomer = res.data.length;
          this.currentPageCustomer = res.pagination.current_page;
          this.totalAllCustomer = res.pagination.total;
        })
      );
    })

    this.searchEmpSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => {
      this.employees$ = this.apiSvc.searchEmployee(search, this.currentPageEmployee, this.pageSizeEmployee).pipe(
        tap(res => {
          this.totalEmployee = res.data.length;
          this.currentPageEmployee = res.pagination.current_page;
          this.totalAllEmployee = res.pagination.total;
        })
      )
    })
  }

  checkTabAction(){
    if(!this.authSvc.hasAction('view_employee')){
      this.user_type = 'customer'
    }

    if(!this.authSvc.hasAction('view_customer')){
      this.user_type = 'supplier'
    }

    if(!this.authSvc.hasAction('view_supplier')){
      this.user_type = 'employee'
    }

    if(!this.authSvc.hasAction('view_employee') && !this.authSvc.hasAction('view_customer')){
      this.user_type = 'supplier'
    }

    if(!this.authSvc.hasAction('view_supplier') && !this.authSvc.hasAction('view_customer')){
      this.user_type = 'employee'
    }

    if(!this.authSvc.hasAction('view_employee') && !this.authSvc.hasAction('view_supplier')){
      this.user_type = 'customer'
    }
  }

  tabChange(value: string){

    this.user_type = value;

    if(value === 'employee'){
      this.getEmployee();
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
        nzClosable: false,
        nzMaskClosable: false,
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

  showUpdateModal(data: IDataEmployee){
    this.modalService.create({
      nzTitle: 'Update Employee',
      nzContent: AddEmployeeModalComponent,
      nzComponentParams: {
        modal_type: 'update',
        data
      },
      nzCentered: true
    });
  }

  showDetailModal(data: IDataEmployee){
    this.modalService.create({
      nzTitle: 'Detail Employee',
      nzContent: DetailEmployeeModalComponent,
      nzCentered: true,
      nzComponentParams: {
        data
      }
    });
  }

  showDeleteModal(id: string){
    this.modalService.create({
      nzTitle: 'Delete Employee',
      nzContent: DeleteEmployeeModalComponent,
      nzCentered: true,
      nzComponentParams: {
        id
      }
    });
  }

  showFilter(){
    if(this.user_type === 'employee'){
      const empModal = this.modalService.create({
        nzTitle: 'Filter Employee',
        nzContent: FilterEmployeeModalComponent,
        nzCentered: true,
        nzComponentParams: {
          filteredEmp: this.filteredEmp
        }
      })

      empModal.afterClose.subscribe(result => {
        if(result){
          this.filterParams = result
          this.getFilteredEmployee()
        }
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
      nzClosable: false,
      nzMaskClosable: false,
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

  showDeleteModalSupp(id: string){
    this.modalService.create({
      nzTitle: 'Delete Supplier',
      nzContent: DeleteSupplierModalComponent,
      nzCentered: true,
      nzComponentParams: {
        id
      }
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

  getEmployee(){
    this.employees$ = this.apiSvc.getEmployee(this.currentPageEmployee, this.pageSizeEmployee).pipe(
      tap(res => {
        this.totalEmployee = res.data.length;
        this.currentPageEmployee = res.pagination.current_page;
        this.totalAllEmployee = res.pagination.total
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

  getFilteredEmployee(){
    this.employees$ = this.apiSvc.filterEmployee(this.filterParams, this.currentPageEmployee, this.pageSizeEmployee).pipe(
      tap(res => {
        this.totalEmployee = res.data.length;
        this.currentPageEmployee = res.pagination.current_page;
        this.totalAllEmployee = res.pagination.total
        this.filteredEmp = true
        localStorage.setItem('filterItemsEmp', JSON.stringify(this.filterParams))
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

  onPageIndexChangeEmp(page: number): void{
    this.currentPageEmployee = page;

    if(this.filteredEmp){
      this.getFilteredEmployee();  
    } else {
      this.getEmployee();
    }
  }

  refreshTableCust(){
    this.filteredCust = false;
    this.pageSizeCustomer = 5;
    this.currentPageCustomer = 1;
    this.getCustomer();
  }

  refreshTableSupp(){
    this.filteredSupp = false;
    this.pageSizeSupplier = 5;
    this.currentPageSupplier = 1;
    this.getSupplier();
  }

  refreshTableEmp(){
    this.filteredEmp = false;
    this.pageSizeEmployee = 5;
    this.currentPageSupplier = 1;
    this.getEmployee();
  }

  searchSuppHandler(search: string): void{
    this.searchSuppSubject.next(search);
  }

  searchCustHandler(search: string): void{
    this.searchCustSubject.next(search);
  }

  searchEmpHandler(search: string): void{
    this.searchEmpSubject.next(search);
  }
}
