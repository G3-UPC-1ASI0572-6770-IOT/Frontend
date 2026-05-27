import {Routes} from '@angular/router';

const management = () => import('./views/parking-lot-management/parking-lot-management').then(m => m.ParkingLotManagement);
const profile = () => import('./views/parking-lot-profile/parking-lot-profile').then(m => m.ParkingLotProfile);

export const parkingLotRoutes: Routes = [
  {path: '', loadComponent: management, title: 'Parking Lot Management - ParkingNow'},
  {path: 'setup', loadComponent: management, title: 'Parking Lot Setup - ParkingNow'},
  {path: 'profile', loadComponent: profile, title: 'Parking Lot Profile - ParkingNow'}
];
