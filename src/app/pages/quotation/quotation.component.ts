import { Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/api.service';
import { AddQuotationComponent } from 'src/app/components/add-quotation/add-quotation.component';
import { DetailQuotationComponent } from 'src/app/components/detail-quotation/detail-quotation.component';
import { IDataCategories, IDataInventory } from 'src/app/interfaces';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent implements OnInit {

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
  
  inventoryList: IDataInventory[] = []
  productCategory: IDataCategories[] = []

  constructor(
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private apiSvc: ApiService
  ){}

  ngOnInit(): void {
    this.apiSvc.getInventoryList().subscribe((res) => {
      this.inventoryList = res.data;
    })

    this.apiSvc.getInventoryList().subscribe((res) => {
      this.productCategory = res.data
    })

  }

  showAddModal(){
    this.drawerService.create({
      nzTitle: 'Add Quotation',
      nzContent: AddQuotationComponent,
      nzPlacement: 'bottom',
      nzHeight: '100vh',
      nzData: {
        inventoryList: this.inventoryList,
        productCategory: this.productCategory
      }
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
