import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IDataCustomer, IDataSupplier } from 'src/app/interfaces';


@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})

export class TableUserComponent implements OnInit {

  @Input() user_type: string = 'employee';
  @Input() listOfDataEmp: any[] = [];
  @Input() listofDataCust: IDataCustomer[] = [];
  @Input() listofDataSupp: IDataSupplier[] = [];

  @Input() totalAllCustomer: number = 0;
  @Input() pageSizeCustomer: number = 0;
  @Input() currentPageCustomer: number = 0;

  @Input() totalAllSupplier: number = 0;
  @Input() pageSizeSupplier: number = 0;
  @Input() currentPageSupplier: number = 0;

  @Output() showUpdateModal = new EventEmitter<void>();
  @Output() showDetailModal = new EventEmitter<void>();
  @Output() showDeleteModal = new EventEmitter<void>();

  @Output() showDetailModalCust: EventEmitter<IDataCustomer> = new EventEmitter<IDataCustomer>();
  @Output() showUpdateModalCust: EventEmitter<IDataCustomer> = new EventEmitter<IDataCustomer>();
  @Output() showDeleteModalCust: EventEmitter<string> = new EventEmitter<string>();

  @Output() showUpdateModalSupp: EventEmitter<IDataSupplier> = new EventEmitter<IDataSupplier>();
  @Output() showDetailModalSupp: EventEmitter<IDataSupplier> = new EventEmitter<IDataSupplier>();
  @Output() showDeleteModalSupp: EventEmitter<string> = new EventEmitter<string>();
  
  @Output() onPageIndexChangeCust: EventEmitter<number> = new EventEmitter<number>();
  @Output() onPageIndexChangeSupp: EventEmitter<number> = new EventEmitter<number>();

  listOfData: any[] = [
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

  constructor() { }

  ngOnInit(): void {
  }

  updateHandler(){
    this.showUpdateModal.emit();
  }

  detailHandler(){
    this.showDetailModal.emit();
  }

  deleteHandler(){
    this.showDeleteModal.emit();
  }

  detailCustHandler(dataCust: IDataCustomer){
    this.showDetailModalCust.emit(dataCust);
  }

  updateCustHandler(dataCust: IDataCustomer){
    this.showUpdateModalCust.emit(dataCust);
  }

  deleteCustHandler(id: string){
    this.showDeleteModalCust.emit(id);
  }

  pageIndexChangeCust(page: number){
    this.onPageIndexChangeCust.emit(page);
  }


  updateSuppHandler(dataSupp: IDataSupplier){
    this.showUpdateModalSupp.emit(dataSupp);
  }

  detailSuppHandler(dataSupp: IDataSupplier){
    this.showDetailModalSupp.emit(dataSupp);
  }

  deleteSuppHandler(id: string){
    this.showDeleteModalSupp.emit(id);
  }

  pageIndexChangeSupp(page: number){
    this.onPageIndexChangeSupp.emit(page);
  }
  
}
