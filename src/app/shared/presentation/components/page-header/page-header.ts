import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div class="title-block">
        @if (eyebrow) { <span class="eyebrow">{{ eyebrow }}</span> }
        <h1 class="title">{{ title }}</h1>
        @if (subtitle) { <p class="subtitle">{{ subtitle }}</p> }
      </div>
      <div class="actions">
        <ng-content></ng-content>
      </div>
    </header>
  `,
  styles: [`
    :host { display: block; }
    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 1rem; flex-wrap: wrap;
      margin-bottom: 1.5rem;
      animation: fadeSlide 280ms ease-out both;
    }
    .title-block { flex: 1; min-width: 240px; }
    .eyebrow {
      display: inline-block;
      font-family: 'Manrope', sans-serif;
      font-size: 12px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #00658b;
      margin-bottom: 0.25rem;
    }
    .title {
      font-family: 'Hanken Grotesk', sans-serif;
      font-size: 30px; line-height: 40px; font-weight: 700;
      color: #001558; letter-spacing: -0.01em;
      margin: 0;
    }
    .subtitle {
      font-family: 'Manrope', sans-serif;
      font-size: 15px; color: #444652;
      margin: 6px 0 0;
      max-width: 760px;
    }
    .actions { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class PageHeader {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() eyebrow = '';
}
