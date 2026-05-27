import {Routes} from '@angular/router';

const eventsHistory = () => import('./views/events-history/events-history').then(m => m.EventsHistory);

export const eventsRoutes: Routes = [
  {path: '', loadComponent: eventsHistory, title: 'IoT Monitor - ParkingNow'}
];
