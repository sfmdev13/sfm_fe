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
        path: 'projects/project-list',
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule),
        canActivate: [ActionGuard],
        data: { action: 'view_projects' }
      },
      {
        path: 'projects',
        loadChildren: () => import('./pages/project-home/project-home.module').then(m => m.ProjectHomeModule),
        canActivate: [ActionGuard],
        data: { action: 'view_projects' }
      },
      {
        path: 'projects/quotation',
        loadChildren: () => import('./pages/quotation/quotation.module').then( m => m.QuotationModule),
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
        path: 'inventories/inventory-list',
        loadChildren: () => import('./pages/inventories-list/inventories-list.module').then(m => m.InventoriesListModule),
        canActivate: [ActionGuard],
        data: { action: 'view_inventory' }
      },
      {
        path: 'inventories/purchase-order',
        loadChildren: () => import('./pages/purchase-order/purchase-order.module').then(m => m.PurchaseOrderModule),
        canActivate: [ActionGuard],
        data: { action: 'view_inventory' }
      },
      {
        path: 'inventories/assembly',
        loadChildren: () => import('./pages/assembly/assembly.module').then(m => m.AssemblyModule),
        canActivate: [ActionGuard],
        data: { action: 'view_inventory' }
      },
      {
        path: 'inventories/all-inventories',
        loadChildren: () => import('./pages/all-inventories/all-inventories.module').then(m => m.AllInventoriesModule),
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
        data:  { action: 'view_settings' }
      },
      {
        path: 'settings/categories-setting',
        loadChildren: () => import('./pages/categories-setting/categories-setting.module').then(m => m.CategoriesSettingModule),
        canActivate: [ActionGuard],
        data:  { action: 'view_settings' }
      },
      {
        path: 'settings/divisions-setting',
        loadChildren: () => import('./pages/divisions-setting/divisions-setting.module').then(m => m.DivisionsSettingModule),
        canActivate: [ActionGuard],
        data:  { action: 'view_settings' }
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
