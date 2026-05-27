export interface ParkingSpace {
  id: string;
  zone: string;
  type: string;
  sensor: string;
  status: 'available' | 'occupied' | 'reserved' | 'offline';
}
