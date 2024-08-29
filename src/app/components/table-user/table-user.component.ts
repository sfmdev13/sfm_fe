import { Component, OnInit } from '@angular/core';

interface Person {
  emp_id: string;
  name: string;
  email: string;
  nik: string;
  phone: string;
  address: string;
  status: boolean;
}

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.scss']
})

export class TableUserComponent implements OnInit {

  listOfData: Person[] = [
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

}
