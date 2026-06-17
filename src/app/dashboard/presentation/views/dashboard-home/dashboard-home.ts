import {
  AfterViewInit, ChangeDetectionStrategy, Component,
  ElementRef, OnDestroy, OnInit, ViewChild, inject, effect
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Chart, ChartData, registerables} from 'chart.js';
import {DashboardStore} from '../../../application/dashboard.store';
import {IamStore} from '../../../../iam/application/iam.store';
import {PageHeader} from '../../../../shared/presentation/components/page-header/page-header';
import {MetricCard} from '../../../../shared/presentation/components/metric-card/metric-card';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-home',
  imports: [CommonModule, RouterLink, PageHeader, MetricCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit, AfterViewInit, OnDestroy {
  protected readonly store = inject(DashboardStore);
  private readonly iamStore = inject(IamStore);

  @ViewChild('donutCanvas') donutRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas')   barRef!:   ElementRef<HTMLCanvasElement>;

  private donutChart: Chart | null = null;
  private barChart:   Chart | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    effect(() => {
      const donut = this.store.chartDonutData();
      const bar   = this.store.chartBarData();
      if (donut) this.updateDonut(donut as ChartData);
      if (bar)   this.updateBar(bar   as ChartData);
    });
  }

  ngOnInit(): void {
    this.store.load();
    this.intervalId = setInterval(() => this.store.load(), 15000);
  }

  ngAfterViewInit(): void {
    this.initCharts();
    // Mock interceptor resolves synchronously, so effect may have fired before charts were ready.
    // Manually sync charts with whatever data is already in the store.
    const donut = this.store.chartDonutData();
    const bar = this.store.chartBarData();
    if (donut) this.updateDonut(donut as ChartData);
    if (bar) this.updateBar(bar as ChartData);
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.donutChart?.destroy();
    this.barChart?.destroy();
  }

  private initCharts(): void {
    // ── Donut ──────────────────────────────────────────────────
    this.donutChart = new Chart(this.donutRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Occupied', 'Reserved', 'Free'],
        datasets: [{
          data: [0, 0, 2],
          backgroundColor: ['#F43F5E', '#00d4aa', '#10B981'],
          hoverBackgroundColor: ['#FB7185', '#5effe6', '#34D399'],
          borderWidth: 3,
          borderColor: '#F8F6F2',
          hoverBorderColor: '#F8F6F2',
          hoverOffset: 10,
          spacing: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        animation: { animateRotate: true, animateScale: false, duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'DM Sans', size: 12, weight: 'bold' as const },
              color: '#78716C',
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
            }
          },
          tooltip: {
            backgroundColor: '#1A1918',
            titleColor: '#FAFAF9',
            bodyColor: '#A8A29E',
            borderColor: 'rgba(255,255,255,0.08)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            titleFont: { family: 'Space Grotesk', size: 13, weight: 'bold' },
            bodyFont: { family: 'DM Sans', size: 12 },
            callbacks: { label: (ctx: any) => `  ${ctx.label}: ${ctx.parsed} spaces` }
          }
        }
      }
    });

    // ── Bar ────────────────────────────────────────────────────
    const barCtx = this.barRef.nativeElement.getContext('2d')!;
    this.barChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Revenue S/.',
          data: [],
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(0,212,170,0.85)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0,   'rgba(0,212,170,0.95)');
            gradient.addColorStop(0.6, 'rgba(0,212,170,0.70)');
            gradient.addColorStop(1,   'rgba(0,212,170,0.25)');
            return gradient;
          },
          hoverBackgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return '#00d4aa';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0,   'rgba(0,212,170,1)');
            gradient.addColorStop(1,   'rgba(0,212,170,0.50)');
            return gradient;
          },
          borderRadius: 10,
          borderSkipped: false,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1918',
            titleColor: '#FAFAF9',
            bodyColor: '#5effe6',
            borderColor: 'rgba(0,212,170,0.25)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            titleFont: { family: 'Space Grotesk', size: 13, weight: 'bold' },
            bodyFont: { family: 'JetBrains Mono', size: 13 },
            callbacks: { label: (ctx: any) => `  S/. ${Number(ctx.parsed.y).toFixed(2)}` }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'DM Sans', size: 11 }, color: '#A8A29E', padding: 6 },
            border: { display: false }
          },
          y: {
            grid: { color: 'rgba(231,229,224,0.7)', lineWidth: 1 },
            ticks: {
              font: { family: 'DM Sans', size: 11 },
              color: '#A8A29E',
              padding: 8,
              callback: (v: any) => `S/. ${v}`
            },
            border: { display: false },
            beginAtZero: true,
          }
        }
      }
    });
  }

  private updateDonut(data: ChartData): void {
    if (!this.donutChart) return;
    // Preserve styles — only update labels + data values
    this.donutChart.data.labels = data.labels;
    if (data.datasets[0]) {
      (this.donutChart.data.datasets[0] as any).data = (data.datasets[0] as any).data;
    }
    this.donutChart.update('active');
  }

  private updateBar(data: ChartData): void {
    if (!this.barChart) return;
    // Preserve gradient — only update labels + data values
    this.barChart.data.labels = data.labels;
    if (data.datasets[0]) {
      (this.barChart.data.datasets[0] as any).data = (data.datasets[0] as any).data;
    }
    this.barChart.update('active');
  }
}
