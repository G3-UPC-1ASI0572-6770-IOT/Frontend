import {Routes} from '@angular/router';

const spaceMonitoring = () => import('./views/space-monitoring/space-monitoring').then(m => m.SpaceMonitoring);

export const monitoringRoutes: Routes = [
  {path: '', loadComponent: spaceMonitoring, title: 'Space Monitoring - ParkingNow'}
];
