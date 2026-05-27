import {Routes} from '@angular/router';

const reservationsManagement = () => import('./views/reservations-management/reservations-management').then(m => m.ReservationsManagement);

export const reservationsRoutes: Routes = [
  {path: '', loadComponent: reservationsManagement, title: 'Reservations Management - ParkingNow'},
  {path: 'active', loadComponent: reservationsManagement, title: 'Active Reservations - ParkingNow'},
  {path: 'history', loadComponent: reservationsManagement, title: 'Reservation History - ParkingNow'}
];
