import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-setting',
  templateUrl: './categories-setting.component.html',
  styleUrls: ['./categories-setting.component.scss']
})
export class CategoriesSettingComponent implements OnInit {

  navCategory = [
    {
      name: 'Customer Category',
      sub_menu : [
        {
          name: 'Loyal Customer',
          slug: 'loyal_customer'
        },
        {
          name: 'Customer Sector',
          slug: 'customer_sector'
        },
        {
          name: 'Customer Firm',
          slug: 'customer_firm'
        }
      ]
    },
    {
      name: 'Supplier Category',
      sub_menu: [
        {
          name: 'Supplier Source',
          slug: 'supplier_source'
        },
        {
          name: 'Supplier Product',
          slug: 'supplier_product'
        }
      ]
    }
  ]

  navCategoryActive = 'loyal_customer'

  constructor() { }

  ngOnInit(): void {
  }

}
