import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './auth/guards';


export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNotAuthenticatedGuard],
    loadChildren: () => import('./auth/auth-routing.module').then(m => m.AuthRoutingModule),
  },
  {
    path: 'dashboard',
    canActivate: [ isAuthenticatedGuard ],
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardModule ),
  },
  {
    path: '**',
    redirectTo: 'auth'
  },

];
