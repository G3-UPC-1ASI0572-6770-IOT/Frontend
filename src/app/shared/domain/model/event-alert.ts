export interface EventAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'resolved';
  title: string;
  message: string;
  time: string;
}
