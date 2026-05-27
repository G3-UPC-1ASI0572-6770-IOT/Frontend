import {Routes} from '@angular/router';

const profileSettings = () => import('./views/profile-settings/profile-settings').then(m => m.ProfileSettings);

export const profileRoutes: Routes = [
  {path: '', loadComponent: profileSettings, title: 'Profile Settings - ParkingNow'},
  {path: 'main', loadComponent: profileSettings, title: 'Admin Profile Main Menu - ParkingNow'},
  {path: 'edit', loadComponent: profileSettings, title: 'Admin Profile Edit - ParkingNow'},
  {path: 'logout', loadComponent: profileSettings, title: 'Admin Logout - ParkingNow'}
];
