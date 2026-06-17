import {NavigationItem} from '../domain/model/navigation-item';

export const navigationItems: NavigationItem[] = [
  {label: 'Overview', icon: 'dashboard', route: '/dashboard'},
  {label: 'Parking Lot', icon: 'local_parking', route: '/parking-lot'},
  {label: 'Spaces', icon: 'grid_view', route: '/monitoring'},
  {label: 'Reservations', icon: 'event_available', route: '/reservations'},
  {label: 'Payments', icon: 'payments', route: '/payments'},
  {label: 'IoT Monitor', icon: 'memory', route: '/events'},
  {label: 'Camera', icon: 'videocam', route: '/camera'},
  {label: 'History', icon: 'history', route: '/history'},
  {label: 'Settings', icon: 'tune', route: '/profile/main'},
];
