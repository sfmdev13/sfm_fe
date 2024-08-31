import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})

export class TableUserComponent implements OnInit {

  @Input() user_type: string = 'employee';
  @Input() listOfDataEmp: any[] = [];
  @Input() listofDataCust: any[] = [];
  @Input() listofDataSupp: any[] = [];

  @Output() showUpdateModal = new EventEmitter<void>();
  @Output() showDetailModal = new EventEmitter<void>();
  @Output() showDeleteModal = new EventEmitter<void>();

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

}