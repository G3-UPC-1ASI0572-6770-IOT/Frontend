export interface Reservation {
  id: string;
  space: string;
  driver: string;
  start: string;
  end: string;
  status: 'active' | 'expiring' | 'finished' | 'cancelled';
}
