import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ActionGuard } from './action.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule),
  },
  { 
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [ActionGuard],
        data:  { action: '' }
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule),
        canActivate: [ActionGuard],
        data: { action: 'view_users' }
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [ActionGuard],
        data: { action: 'view_reports' }
      },
      {
        path: 'projects',
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule),
        canActivate: [ActionGuard],
        data: { action: 'view_projects' }
      },
      {
        path: 'inventories',
        loadChildren: () => import('./pages/inventories/inventories.module').then(m => m.InventoriesModule),
        canActivate: [ActionGuard],
        data: { action: 'view_inventory' }
      },
      {
        path: 'roles',
        loadChildren: () => import('./pages/roles/roles.module').then(m => m.RolesModule),
        canActivate: [ActionGuard],
        data: { action: 'view_roles' }
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [ActionGuard],
        data:  { action: '' }
      },
      {
        path: 'settings/categories-setting',
        loadChildren: () => import('./pages/categories-setting/categories-setting.module').then(m => m.CategoriesSettingModule),
        canActivate: [ActionGuard],
        data:  { action: '' }
      },
      {
        path: 'unauthorized',
        component: UnauthorizedComponent, // Component for unauthorized access
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
