import { Routes } from '@angular/router';
import {LayoutComponent} from './components/layout/layout/layout.component';
import {authForwardGuard} from './guards/auth-forward.guard';
import {authGuard} from './guards/auth.guard';


export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [authForwardGuard]
      },
      {
        path: 'signup',
        loadComponent: () => import('./components/auth/signup/signup.component').then(m => m.SignupComponent),
        canActivate: [authForwardGuard]
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
      {
        path: 'cart',
        loadComponent: () => import('./components/pages/order/basket/basket.component').then(m => m.BasketComponent)
      },
      {
        path: 'order',
        loadComponent: () => import('./components/pages/order/order/order.component').then(m => m.OrderComponent)
      },
      {
        path: 'favorite',
        loadComponent: () => import('./components/pages/personal/favorite/favorite.component').then(m => m.FavoriteComponent),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./components/pages/personal/info/info.component').then(m => m.InfoComponent),
        canActivate: [authGuard]
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/pages/personal/orders/orders.component').then(m => m.OrdersComponent),
        canActivate: [authGuard]
      },
    ]
  }
];
