import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <span class="material-symbols-outlined icon">{{ icon }}</span>
      <h3 class="title">{{ title }}</h3>
      @if (description) { <p class="desc">{{ description }}</p> }
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty {
      display: flex; flex-direction: column; align-items: center;
      gap: 0.5rem; padding: 3rem 1.5rem; text-align: center;
      border: 1px dashed #E7E5E0; border-radius: 16px;
      background: #fbfaff;
      animation: fadeIn 240ms ease-out both;
    }
    .icon {
      font-size: 48px; color: #78716C;
      background: #EAE8E3; padding: 0.75rem;
      border-radius: 999px;
    }
    .title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; color: #1A1918; margin: 0.25rem 0; }
    .desc { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #57534E; max-width: 360px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class EmptyState {
  @Input() icon = 'inventory_2';
  @Input() title = 'No data';
  @Input() description = '';
}
