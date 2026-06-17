import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-metric-card',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="metric-card" [class]="'tone-' + tone">
      <header class="head">
        <span class="label">{{ label }}</span>
        <span class="material-symbols-outlined icon">{{ icon }}</span>
      </header>
      <p class="value">{{ value }}</p>
      <footer class="foot">
        <span class="delta" [class.up]="trend === 'up'" [class.down]="trend === 'down'">
          @if (trend === 'up') { <span class="material-symbols-outlined">arrow_upward</span> }
          @else if (trend === 'down') { <span class="material-symbols-outlined">arrow_downward</span> }
          @else { <span class="material-symbols-outlined">remove</span> }
          {{ delta || '—' }}
        </span>
        <span class="hint">{{ hint }}</span>
      </footer>
    </article>
  `,
  styles: [`
    :host { display: block; }

    .metric-card {
      position: relative;
      background: #FFFFFF;
      border-radius: 18px;
      padding: 20px 20px 16px;
      border: 1px solid rgba(231,229,224,0.8);
      box-shadow:
        0 1px 3px rgba(26,25,24,0.03),
        0 8px 24px rgba(26,25,24,0.06);
      overflow: hidden;
      transition: transform 220ms cubic-bezier(0.23,1,0.32,1), box-shadow 220ms ease;
      animation: rise 300ms ease-out both;
      cursor: default;
    }
    /* Subtle tone tint on card bg */
    .tone-accent  { background: linear-gradient(145deg, #fff 60%, rgba(0,212,170,0.05)); }
    .tone-success { background: linear-gradient(145deg, #fff 60%, rgba(16,185,129,0.05)); }
    .tone-danger  { background: linear-gradient(145deg, #fff 60%, rgba(244,63,94,0.05)); }
    .tone-warning { background: linear-gradient(145deg, #fff 60%, rgba(0,212,170,0.05)); }

    /* Top accent line */
    .metric-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px; border-radius: 18px 18px 0 0;
      background: transparent;
      transition: background 220ms ease;
    }
    .tone-accent::before, .tone-warning::before { background: linear-gradient(90deg, #00d4aa, #5effe6); }
    .tone-success::before { background: linear-gradient(90deg, #10B981, #34D399); }
    .tone-danger::before  { background: linear-gradient(90deg, #F43F5E, #FB7185); }

    .metric-card:hover {
      transform: translateY(-3px);
      box-shadow:
        0 4px 16px rgba(26,25,24,0.07),
        0 16px 40px rgba(26,25,24,0.09);
    }

    .head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 14px;
    }
    .label {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.09em;
      color: #A8A29E;
    }
    .head .icon {
      width: 38px; height: 38px;
      display: inline-flex; align-items: center; justify-content: center;
      border-radius: 12px;
      background: rgba(26,25,24,0.06);
      color: #57534E;
      font-size: 20px; line-height: 1; flex-shrink: 0;
      transition: transform 200ms ease;
    }
    .metric-card:hover .head .icon { transform: scale(1.08); }

    .value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 30px; line-height: 1;
      font-weight: 800; color: #1A1918;
      margin: 0 0 14px;
      letter-spacing: -0.04em;
    }

    .foot {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding-top: 12px;
      border-top: 1px solid rgba(231,229,224,0.7);
    }
    .delta {
      display: inline-flex; align-items: center; gap: 3px;
      font-family: 'DM Sans', sans-serif;
      font-size: 11px; font-weight: 600; color: #A8A29E;
      padding: 3px 8px; border-radius: 999px;
      background: rgba(231,229,224,0.6);
    }
    .delta .material-symbols-outlined { font-size: 13px; line-height: 1; }
    .delta.up   { color: #059669; background: rgba(16,185,129,0.10); }
    .delta.down { color: #E11D48; background: rgba(225,29,72,0.10); }
    .hint { font-size: 11px; color: #C5C2BD; font-family: 'DM Sans', sans-serif; }

    /* Tone icon colors */
    .tone-default .head .icon {
      background: linear-gradient(135deg, rgba(26,25,24,0.08), rgba(26,25,24,0.04));
      color: #78716C;
    }
    .tone-accent .head .icon, .tone-warning .head .icon {
      background: linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.06));
      color: #00a888;
      box-shadow: 0 2px 8px rgba(0,212,170,0.12);
    }
    .tone-success .head .icon {
      background: linear-gradient(135deg, rgba(16,185,129,0.16), rgba(16,185,129,0.06));
      color: #059669;
      box-shadow: 0 2px 8px rgba(16,185,129,0.15);
    }
    .tone-danger .head .icon {
      background: linear-gradient(135deg, rgba(244,63,94,0.16), rgba(244,63,94,0.06));
      color: #E11D48;
      box-shadow: 0 2px 8px rgba(244,63,94,0.15);
    }

    @keyframes rise {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0);   }
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
