import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss']
})
export class InventoriesComponent implements OnInit {

  inventoryCards = [
    {
      title: 'Inventory List',
      description: 'Add or Edit inventory',
      cover: '/assets/images/inventory-list.png',
      link: '/inventories/inventory-list'
    },
    {
      title: 'Purchase Order',
      description: 'Purchase inventory',
      cover: '/assets/images/purchase-order.png',
      link: '/inventories/purchase-order'
    },
    {
      title: 'Inventory Assembly',
      description: 'Grouping inventory',
      cover: '/assets/images/assembly.png',
      link: '/inventories/assembly'
    },
    {
      title: 'All Inventories',
      description: 'Report of All Type Inventories',
      cover: '/assets/images/all-inventories.png',
      link: '/inventories/all-inventories'
    }
  ];
  
  constructor(
    private spinnerSvc: SpinnerService
  ) { }

  ngOnInit(): void {
    this.spinnerSvc.hide();
    
  }

  cardCoverTemplate(cover: string) {
    return cover;
  }

}
