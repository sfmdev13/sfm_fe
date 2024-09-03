import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

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
    },
    {
      title: 'roles',
      path: 'roles'
    }
  ]

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  logoutHandler(){
    this.authService.logout().subscribe(
      () => {
        this.authService.clearToken();
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
