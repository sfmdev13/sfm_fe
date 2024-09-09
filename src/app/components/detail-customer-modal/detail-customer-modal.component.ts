import { Component, Input, OnInit } from '@angular/core';
import { IDataCustomer } from 'src/app/interfaces';

@Component({
  selector: 'app-detail-customer-modal',
  templateUrl: './detail-customer-modal.component.html',
  styleUrls: ['./detail-customer-modal.component.scss']
})
export class DetailCustomerModalComponent implements OnInit {

  @Input() data!: IDataCustomer;

  status: boolean = true;
  
  constructor() { }

  ngOnInit(): void {

  }

}
