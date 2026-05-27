import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCardComponent {
  @Input({ required: true }) titulo!: string;
  @Input({ required: true }) valor!: number | string;
  @Input() icono: string = 'graph-up';
  @Input() claseColor: string = 'primary';
  @Input() sufijo: string = '';

  private sparkData = signal<number[] | null>(null);

  @Input()
  set sparklineData(data: number[] | null | undefined) {
    this.sparkData.set(data && data.length > 0 ? data : null);
  }

  tieneSparkline = computed(() => this.sparkData() !== null);

  sparklineChartType = 'line' as const;

  sparklineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const datos = this.sparkData() ?? [];
    return {
      labels: datos.map((_, i) => String(i)),
      datasets: [
        {
          data: datos,
          borderColor: 'rgba(255, 255, 255, 0.95)',
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.35,
          fill: true,
        },
      ],
    };
  });

  sparklineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: {
      line: { borderJoinStyle: 'round' },
    },
  };
}
