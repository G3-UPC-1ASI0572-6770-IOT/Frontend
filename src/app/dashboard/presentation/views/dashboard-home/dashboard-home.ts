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
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.donutChart?.destroy();
    this.barChart?.destroy();
  }

  private initCharts(): void {
    this.donutChart = new Chart(this.donutRef.nativeElement, {
      type: 'doughnut',
      data: {labels: ['Occupied', 'Reserved', 'Free'], datasets: [{data: [0, 0, 2], backgroundColor: ['#dc2626', '#f59e0b', '#16a34a'], borderWidth: 0, hoverOffset: 6}]},
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '72%',
        plugins: {legend: {position: 'bottom', labels: {font: {family: 'Manrope', size: 12}, padding: 16}}}
      }
    });

    this.barChart = new Chart(this.barRef.nativeElement, {
      type: 'bar',
      data: {labels: [], datasets: [{label: 'Revenue S/.', data: [], backgroundColor: '#00268a', borderRadius: 6, borderSkipped: false}]},
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {legend: {display: false}},
        scales: {
          x: {grid: {display: false}, ticks: {font: {family: 'Manrope', size: 11}}},
          y: {grid: {color: 'rgba(0,0,0,0.05)'}, ticks: {font: {family: 'Manrope', size: 11}, callback: (v) => `S/. ${v}`}}
        }
      }
    });
  }

  private updateDonut(data: ChartData): void {
    if (!this.donutChart) return;
    this.donutChart.data = data;
    this.donutChart.update('active');
  }

  private updateBar(data: ChartData): void {
    if (!this.barChart) return;
    this.barChart.data = data;
    this.barChart.update('active');
  }
}
