import {Routes} from '@angular/router';

const dashboardHome = () => import('./views/dashboard-home/dashboard-home').then(m => m.DashboardHome);

export const dashboardRoutes: Routes = [
  {path: '', loadComponent: dashboardHome, title: 'Dashboard - ParkingNow'}
];
