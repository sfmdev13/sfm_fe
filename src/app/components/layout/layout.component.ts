import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  navigation = [
    {
      title: 'users',
      path: 'user'
    },
    {
      title: 'projects',
      path: 'projects'
    },
    {
      title: 'inventory',
      path: 'inventories'
    },
    {
      title: 'reports',
      path: 'reports'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
