import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-metric-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="metric-card" [class]="'tone-' + tone">
      <header class="head">
        <span class="material-symbols-outlined icon">{{ icon }}</span>
        <span class="label">{{ label }}</span>
      </header>
      <p class="value">{{ value }}</p>
      <footer class="foot">
        <span class="delta" [class.up]="trend === 'up'" [class.down]="trend === 'down'">
          @if (trend === 'up') { <span class="material-symbols-outlined">trending_up</span> }
          @else if (trend === 'down') { <span class="material-symbols-outlined">trending_down</span> }
          @else { <span class="material-symbols-outlined">trending_flat</span> }
          {{ delta }}
        </span>
        <span class="hint">{{ hint }}</span>
      </footer>
    </article>
  `,
  styles: [`
    :host { display: block; }
    .metric-card {
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 20px 0 rgba(0,21,88,0.06);
      transition: transform 200ms ease, box-shadow 200ms ease;
      position: relative;
      overflow: hidden;
      animation: rise 320ms ease-out both;
    }
    .metric-card::before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: linear-gradient(135deg, transparent 60%, rgba(0,172,232,0.06));
      opacity: 0;
      transition: opacity 200ms ease;
    }
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px -10px rgba(0,21,88,0.18);
    }
    .metric-card:hover::before { opacity: 1; }
    .head { display: flex; align-items: center; gap: 0.5rem; color: #444652; }
    .head .icon {
      width: 36px; height: 36px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 12px;
      background: rgba(0,38,138,0.08);
      color: #00268a;
      font-size: 20px;
    }
    .label {
      font-family: 'Manrope', sans-serif;
      font-size: 13px; font-weight: 600;
      text-transform: uppercase; letter-spacing: 0.04em;
      color: #444652;
    }
    .value {
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 36px; line-height: 44px;
      font-weight: 700; color: #001558;
      margin: 16px 0 12px;
      letter-spacing: -0.01em;
    }
    .foot { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .delta {
      display: inline-flex; align-items: center; gap: 0.25rem;
      font-size: 12px; font-weight: 600; color: #444652;
    }
    .delta .material-symbols-outlined { font-size: 16px; }
    .delta.up { color: #16a34a; }
    .delta.down { color: #dc2626; }
    .hint { font-size: 12px; color: #757684; }
    .tone-accent .head .icon { background: rgba(0,172,232,0.12); color: #00658b; }
    .tone-success .head .icon { background: rgba(22,163,74,0.12); color: #16a34a; }
    .tone-warning .head .icon { background: rgba(245,158,11,0.14); color: #b45309; }
    .tone-danger .head .icon { background: rgba(220,38,38,0.12); color: #dc2626; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MetricCard {
  @Input() icon = 'analytics';
  @Input() label = 'Metric';
  @Input() value: string | number = '0';
  @Input() delta = '';
  @Input() hint = '';
  @Input() trend: 'up' | 'down' | 'flat' = 'flat';
  @Input() tone: 'default' | 'accent' | 'success' | 'warning' | 'danger' = 'default';
}
