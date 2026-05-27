import {Routes} from '@angular/router';

const cameraMonitor = () => import('./views/camera-monitor/camera-monitor').then(m => m.CameraMonitor);

export const cameraRoutes: Routes = [
  {path: '', loadComponent: cameraMonitor, title: 'Camera - ParkingNow'}
];
