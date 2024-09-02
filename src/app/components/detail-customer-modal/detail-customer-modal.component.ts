import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-customer-modal',
  templateUrl: './detail-customer-modal.component.html',
  styleUrls: ['./detail-customer-modal.component.scss']
})
export class DetailCustomerModalComponent implements OnInit {

  status: boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
