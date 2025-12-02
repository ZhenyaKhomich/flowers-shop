import { Routes } from '@angular/router';
import {LayoutComponent} from './components/layout/layout/layout.component';


export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent)
      },
      {
        path: '',
        loadComponent: () => import('./components/pages/main/main.component').then(m => m.MainComponent)
      },
      {
        path: 'catalog',
        loadComponent: () => import('./components/pages/catalog/catalog/catalog.component').then(m => m.CatalogComponent)
      },
      {
        path: 'product/:url',
        loadComponent: () => import('./components/pages/catalog/detail/detail.component').then(m => m.DetailComponent)
      },
    ]
  }
];
