import {Routes} from '@angular/router';

const spacesManagement = () => import('./views/spaces-management/spaces-management').then(m => m.SpacesManagement);

export const spacesRoutes: Routes = [
  {path: '', loadComponent: spacesManagement, title: 'Parking Spaces - ParkingNow'}
];
