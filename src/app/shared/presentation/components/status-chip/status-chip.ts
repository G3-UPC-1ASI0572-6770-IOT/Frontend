import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

export type ChipStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'offline'
  | 'maintenance'
  | 'online'
  | 'warning'
  | 'critical'
  | 'info'
  | 'resolved'
  | 'active'
  | 'expiring'
  | 'finished'
  | 'cancelled';

@Component({
  selector: 'app-status-chip',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="status-chip" [class]="'is-' + variant" role="status">
      <span class="dot" aria-hidden="true"></span>
      <span class="label">{{ label || defaultLabel }}</span>
    </span>
  `,
  styles: [`
    :host { display: inline-block; }
    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-family: 'Manrope', sans-serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.02em;
      line-height: 1;
      transition: background 200ms ease, color 200ms ease;
    }
    .dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: currentColor;
      box-shadow: 0 0 0 0 currentColor;
      animation: pulse 1.8s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 currentColor; }
      50% { box-shadow: 0 0 0 4px transparent; }
    }
    .is-available, .is-online, .is-active, .is-resolved {
      background: rgba(22, 163, 74, 0.12); color: #16a34a;
    }
    .is-occupied, .is-critical, .is-cancelled {
      background: rgba(220, 38, 38, 0.12); color: #dc2626;
    }
    .is-reserved, .is-warning, .is-expiring {
      background: rgba(245, 158, 11, 0.14); color: #b45309;
    }
    .is-offline, .is-finished {
      background: rgba(100, 116, 139, 0.14); color: #475569;
    }
    .is-maintenance, .is-info {
      background: rgba(0, 172, 232, 0.14); color: #00658b;
    }
  `]
})
export class StatusChip {
  @Input() variant: ChipStatus = 'available';
  @Input() label?: string;

  get defaultLabel(): string {
    const map: Record<ChipStatus, string> = {
      available: 'Available',
      occupied: 'Occupied',
      reserved: 'Reserved',
      offline: 'Offline',
      maintenance: 'Maintenance',
      online: 'Online',
      warning: 'Warning',
      critical: 'Critical',
      info: 'Info',
      resolved: 'Resolved',
      active: 'Active',
      expiring: 'Expiring',
      finished: 'Finished',
      cancelled: 'Cancelled'
    };
    return map[this.variant];
  }
}
