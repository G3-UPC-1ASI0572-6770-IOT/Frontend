import {Routes} from '@angular/router';
import {OwnerLayout} from './shared/presentation/components/owner-layout/owner-layout';
import {authGuard} from './shared/infrastructure/auth.guard';

const iamRoutes = () => import('./iam/presentation/iam.routes').then(m => m.iamRoutes);
const dashboardRoutes = () => import('./dashboard/presentation/dashboard.routes').then(m => m.dashboardRoutes);
const parkingLotRoutes = () => import('./parking-lot/presentation/parking-lot.routes').then(m => m.parkingLotRoutes);
const spacesRoutes = () => import('./spaces/presentation/spaces.routes').then(m => m.spacesRoutes);
const monitoringRoutes = () => import('./monitoring/presentation/monitoring.routes').then(m => m.monitoringRoutes);
const iotNodeRoutes = () => import('./iot-node/presentation/iot-node.routes').then(m => m.iotNodeRoutes);
const reservationsRoutes = () => import('./reservations/presentation/reservations.routes').then(m => m.reservationsRoutes);
const eventsRoutes = () => import('./events/presentation/events.routes').then(m => m.eventsRoutes);
const paymentsRoutes = () => import('./payments/presentation/payments.routes').then(m => m.paymentsRoutes);
const cameraRoutes = () => import('./camera/presentation/camera.routes').then(m => m.cameraRoutes);
const historyRoutes = () => import('./history/presentation/history.routes').then(m => m.historyRoutes);
const profileRoutes = () => import('./profile/presentation/profile.routes').then(m => m.profileRoutes);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

export const routes: Routes = [
  {path: 'iam', loadChildren: iamRoutes},
  {
    path: '',
    component: OwnerLayout,
    canActivate: [authGuard],
    children: [
      {path: 'dashboard', loadChildren: dashboardRoutes},
      {path: 'parking-lot', loadChildren: parkingLotRoutes},
      {path: 'spaces', loadChildren: spacesRoutes},
      {path: 'monitoring', loadChildren: monitoringRoutes},
      {path: 'iot-node', loadChildren: iotNodeRoutes},
      {path: 'reservations', loadChildren: reservationsRoutes},
      {path: 'events', loadChildren: eventsRoutes},
      {path: 'payments', loadChildren: paymentsRoutes},
      {path: 'camera', loadChildren: cameraRoutes},
      {path: 'history', loadChildren: historyRoutes},
      {path: 'profile', loadChildren: profileRoutes},
      {path: '', redirectTo: '/iam/sign-in', pathMatch: 'full'}
    ]
  },
  {path: '', redirectTo: '/iam/sign-in', pathMatch: 'full'},
  {path: '**', loadComponent: pageNotFound}
];
