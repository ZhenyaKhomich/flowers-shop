import { Routes } from '@angular/router';
import {LayoutComponent} from './components/layout/layout/layout.component';


export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/pages/main/main.component').then(m => m.MainComponent)
      },
    ]
  }
];
