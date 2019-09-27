import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },{
    path: 'auth',
    component:AuthComponent
  },
  {
    path: 'pages/**',
    redirectTo: 'pages/index'
  }
];

export const routing = RouterModule.forRoot(appRoutes);
