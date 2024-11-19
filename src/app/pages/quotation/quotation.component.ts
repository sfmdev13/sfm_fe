import { Component } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AddQuotationComponent } from 'src/app/components/add-quotation/add-quotation.component';
import { DetailQuotationComponent } from 'src/app/components/detail-quotation/detail-quotation.component';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {

  pageSize: number = 5;

  total: number = 0;

  listOfData= [
    {
      id: 'PRJK123',
      name: 'Project Name 1',
      revision: 'R0',
    },
    {
      id: 'PRJK124',
      name: 'Project Name 2',
      revision: 'R0',
    },
    {
      id: 'PRJK127',
      name: 'Project Name 3',
      revision: 'R4',
    },
  ];

  constructor(
    private drawerService: NzDrawerService,
    private modalService: NzModalService
  ){}

  showAddModal(){
    this.drawerService.create({
      nzTitle: 'Add Quotation',
      nzContent: AddQuotationComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
    });
  }

  showDetailModal(){
    this.modalService.create({
      nzTitle: 'Detail Quotation',
      nzContent: DetailQuotationComponent,
      nzCentered: true,
      nzWidth: '900px'
    });
  }
}
