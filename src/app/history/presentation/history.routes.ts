import {Routes} from '@angular/router';

const operationsHistory = () => import('./views/operations-history/operations-history').then(m => m.OperationsHistory);

export const historyRoutes: Routes = [
  {path: '', loadComponent: operationsHistory, title: 'History - ParkingNow'}
];
