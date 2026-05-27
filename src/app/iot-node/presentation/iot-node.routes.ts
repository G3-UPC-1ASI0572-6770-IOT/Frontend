import {Routes} from '@angular/router';

const iotNodeAssociation = () => import('./views/iot-node-association/iot-node-association').then(m => m.IotNodeAssociation);

export const iotNodeRoutes: Routes = [
  {path: '', loadComponent: iotNodeAssociation, title: 'IoT Node Association - ParkingNow'}
];
