import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  profileName: string = '';

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
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
    this.apiSvc.getProfile().subscribe(
      (profile) => {
        this.profileName = profile.data.name
        localStorage.setItem('pic_id', profile.data.id)
      }
    )
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
