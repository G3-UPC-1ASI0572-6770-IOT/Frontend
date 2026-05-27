import {Routes} from '@angular/router';

const paymentsManagement = () => import('./views/payments-management/payments-management').then(m => m.PaymentsManagement);

export const paymentsRoutes: Routes = [
  {path: '', loadComponent: paymentsManagement, title: 'Payments - ParkingNow'}
];
