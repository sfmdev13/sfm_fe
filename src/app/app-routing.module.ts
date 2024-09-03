import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './auth.guard';

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
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./pages/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'inventories',
        loadChildren: () => import('./pages/inventories/inventories.module').then(m => m.InventoriesModule)
      },
      {
        path: 'roles',
        loadChildren: () => import('./pages/roles/roles.module').then(m => m.RolesModule)
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
