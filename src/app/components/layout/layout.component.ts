import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  navigation = [
    {
      title: 'user'
    },
    {
      title: 'project'
    },
    {
      title: 'inventory'
    },
    {
      title: 'report'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
