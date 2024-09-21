import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { error } from 'console';
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
      path: 'user',
      slug: 'view_users'
    },
    {
      title: 'projects',
      path: 'projects',
      slug: 'view_projects'
    },
    {
      title: 'inventory',
      path: 'inventories',
      slug: 'view_inventory'
    },
    {
      title: 'reports',
      path: 'reports',
      slug: 'view_reports'
    },
    {
      title: 'roles',
      path: 'roles',
      slug: 'view_roles'
    },
    {
      title: 'settings',
      path: 'settings',
      slug: 'view_settings'
    }
  ]

  constructor(
    public authService: AuthService,
    private apiSvc: ApiService
  ) { }

  ngOnInit(): void {
    this.apiSvc.getProfile().subscribe(
      (profile) => {
        this.profileName = profile.data.name

        const userRole =  profile.data.role.actions.map((action: any) => action.slug)
        localStorage.setItem('pic_id', profile.data.id)
        localStorage.setItem('actions', JSON.stringify(userRole))
        this.authService.setUserRoles(userRole);
      },
      (error) => {
        this.logoutHandler();
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
