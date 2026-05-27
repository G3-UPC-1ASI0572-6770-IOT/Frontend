export interface IotNode {
  id: string;
  space: string;
  firmware: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
}
